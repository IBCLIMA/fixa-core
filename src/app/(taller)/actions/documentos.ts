"use server";

import { getDb } from "@/db";
import {
  documentosCobro,
  ordenesTrabajo,
  lineasOrden,
  clientes,
  vehiculos,
  talleres,
} from "@/db/schema";
import { eq, and, desc, sql, count, or, ilike } from "drizzle-orm";
import { getTallerIdFromAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

type MetodoPago = "efectivo" | "tarjeta" | "transferencia" | "bizum" | "domiciliacion" | "otro";

export async function generarDocumentoCobro(
  ordenId: string,
  metodoPago: MetodoPago,
  notas?: string
) {
  const { tallerId, clerkUserId } = await getTallerIdFromAuth();
  const db = getDb();

  // Get order with all related data
  const orden = await db.query.ordenesTrabajo.findFirst({
    where: and(eq(ordenesTrabajo.id, ordenId), eq(ordenesTrabajo.tallerId, tallerId)),
    with: {
      cliente: true,
      vehiculo: true,
      lineas: true,
    },
  });

  if (!orden) throw new Error("Orden no encontrada");
  if (!orden.cliente) throw new Error("Cliente no encontrado");
  if (!orden.vehiculo) throw new Error("Vehiculo no encontrado");

  // Check if document already exists for this order
  const existing = await db
    .select({ id: documentosCobro.id })
    .from(documentosCobro)
    .where(and(eq(documentosCobro.ordenId, ordenId), eq(documentosCobro.tallerId, tallerId)))
    .limit(1);

  if (existing.length > 0) {
    throw new Error("Ya existe un documento de cobro para esta orden");
  }

  // Get workshop data
  const [taller] = await db
    .select()
    .from(talleres)
    .where(eq(talleres.id, tallerId));

  if (!taller) throw new Error("Taller no encontrado");

  // Calculate totals
  const lineas = orden.lineas || [];
  let baseImponible = 0;
  let totalIva = 0;

  const lineasSnapshot = lineas.map((l) => {
    const qty = Number(l.cantidad);
    const price = Number(l.precioUnitario);
    const disc = Number(l.descuentoPct || 0);
    const iva = Number(l.ivaPct || 21);
    const base = qty * price * (1 - disc / 100);
    const ivaAmount = base * (iva / 100);
    baseImponible += base;
    totalIva += ivaAmount;
    return {
      tipo: l.tipo,
      descripcion: l.descripcion,
      cantidad: qty,
      precioUnitario: price,
      descuentoPct: disc,
      ivaPct: iva,
      subtotal: base,
    };
  });

  const totalFinal = baseImponible + totalIva;

  // Get next sequential number for this workshop
  const [maxResult] = await db
    .select({ max: sql<number>`COALESCE(MAX(${documentosCobro.numero}), 0)` })
    .from(documentosCobro)
    .where(eq(documentosCobro.tallerId, tallerId));

  const numero = (maxResult?.max ?? 0) + 1;

  // Generate public token
  const { randomBytes } = await import("crypto");
  const tokenPublico = randomBytes(16).toString("hex");

  const fechaPago = new Date();

  // Create the document
  const [documento] = await db
    .insert(documentosCobro)
    .values({
      tallerId,
      ordenId,
      clienteId: orden.clienteId,
      vehiculoId: orden.vehiculoId,
      numero,
      tallerNombre: taller.nombre,
      tallerCif: taller.cif || null,
      tallerDireccion: taller.direccion || null,
      tallerTelefono: taller.telefono || null,
      tallerEmail: taller.email || null,
      clienteNombre: orden.cliente.nombre,
      clienteNif: orden.cliente.nif || null,
      clienteDireccion: orden.cliente.direccion || null,
      clienteTelefono: orden.cliente.telefono || null,
      matricula: orden.vehiculo.matricula,
      marca: orden.vehiculo.marca || null,
      modelo: orden.vehiculo.modelo || null,
      km: orden.kmEntrada || orden.vehiculo.km || null,
      baseImponible: baseImponible.toFixed(2),
      totalIva: totalIva.toFixed(2),
      totalFinal: totalFinal.toFixed(2),
      lineas: lineasSnapshot,
      metodoPago,
      fechaPago,
      notas: notas || null,
      tokenPublico,
    })
    .returning();

  // Mark the order as paid (filter by tallerId for multi-tenant safety)
  await db
    .update(ordenesTrabajo)
    .set({
      pagado: true,
      metodoPago,
      fechaPago,
      importeTotal: totalFinal.toFixed(2),
      notasPago: notas || null,
      updatedAt: new Date(),
    })
    .where(and(eq(ordenesTrabajo.id, ordenId), eq(ordenesTrabajo.tallerId, tallerId)));

  logAudit({
    tallerId,
    userId: clerkUserId,
    action: "create",
    entityType: "documento_cobro",
    entityId: documento.id,
    details: { numero, ordenId, total: totalFinal.toFixed(2), metodoPago },
  });

  revalidatePath(`/ordenes/${ordenId}`);
  revalidatePath("/ordenes");
  revalidatePath("/facturacion");
  revalidatePath("/documentos");

  return documento;
}

export async function getDocumentoCobro(id: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  return db.query.documentosCobro.findFirst({
    where: and(eq(documentosCobro.id, id), eq(documentosCobro.tallerId, tallerId)),
  });
}

export async function getDocumentoByOrden(ordenId: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  return db.query.documentosCobro.findFirst({
    where: and(
      eq(documentosCobro.ordenId, ordenId),
      eq(documentosCobro.tallerId, tallerId)
    ),
  });
}

export async function getDocumentos(page: number = 1, search?: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();
  const limit = 20;
  const offset = (page - 1) * limit;

  const conditions = [eq(documentosCobro.tallerId, tallerId)];

  if (search && search.trim()) {
    const searchTerm = `%${search.trim()}%`;
    conditions.push(
      or(
        ilike(documentosCobro.clienteNombre, searchTerm),
        ilike(documentosCobro.matricula, searchTerm)
      )!
    );
  }

  const whereClause = and(...conditions);

  const [totalResult] = await db
    .select({ count: count() })
    .from(documentosCobro)
    .where(whereClause);

  const docs = await db.query.documentosCobro.findMany({
    where: whereClause,
    orderBy: desc(documentosCobro.createdAt),
    limit,
    offset,
  });

  return {
    documentos: docs,
    total: totalResult?.count ?? 0,
    totalPages: Math.ceil((totalResult?.count ?? 0) / limit),
    page,
  };
}

export async function actualizarDatosFacturacion(
  docId: string,
  datos: {
    clienteNombre?: string;
    clienteNif?: string;
    clienteDireccion?: string;
    clienteTelefono?: string;
  }
) {
  const { tallerId, clerkUserId } = await getTallerIdFromAuth();
  const db = getDb();

  const doc = await db.query.documentosCobro.findFirst({
    where: and(eq(documentosCobro.id, docId), eq(documentosCobro.tallerId, tallerId)),
  });

  if (!doc) throw new Error("Documento no encontrado");
  if (doc.estado === "finalizado") throw new Error("Este documento ya está finalizado y no se puede editar");

  await db
    .update(documentosCobro)
    .set({
      ...(datos.clienteNombre !== undefined && { clienteNombre: datos.clienteNombre }),
      ...(datos.clienteNif !== undefined && { clienteNif: datos.clienteNif }),
      ...(datos.clienteDireccion !== undefined && { clienteDireccion: datos.clienteDireccion }),
      ...(datos.clienteTelefono !== undefined && { clienteTelefono: datos.clienteTelefono }),
    })
    .where(and(eq(documentosCobro.id, docId), eq(documentosCobro.tallerId, tallerId)));

  logAudit({
    tallerId,
    userId: clerkUserId,
    action: "update",
    entityType: "documento_cobro",
    entityId: docId,
    details: { action: "editar_datos_facturacion", cambios: datos },
  });

  revalidatePath(`/documentos/${docId}`);
}

export async function finalizarDocumento(docId: string) {
  const { tallerId, clerkUserId } = await getTallerIdFromAuth();
  const db = getDb();

  const doc = await db.query.documentosCobro.findFirst({
    where: and(eq(documentosCobro.id, docId), eq(documentosCobro.tallerId, tallerId)),
  });

  if (!doc) throw new Error("Documento no encontrado");
  if (doc.estado === "finalizado") throw new Error("Este documento ya está finalizado");

  await db
    .update(documentosCobro)
    .set({ estado: "finalizado" })
    .where(and(eq(documentosCobro.id, docId), eq(documentosCobro.tallerId, tallerId)));

  logAudit({
    tallerId,
    userId: clerkUserId,
    action: "update",
    entityType: "documento_cobro",
    entityId: docId,
    details: { action: "finalizar_documento", numero: doc.numero },
  });

  revalidatePath(`/documentos/${docId}`);
  revalidatePath("/documentos");
}

export async function getDocumentosRecientes(limit: number = 10) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  return db.query.documentosCobro.findMany({
    where: eq(documentosCobro.tallerId, tallerId),
    orderBy: desc(documentosCobro.createdAt),
    limit,
  });
}
