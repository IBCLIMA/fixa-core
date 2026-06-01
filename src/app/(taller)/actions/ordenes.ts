"use server";

import { getDb } from "@/db";
import {
  ordenesTrabajo,
  lineasOrden,
  historialEstados,
  vehiculos,
  clientes,
} from "@/db/schema";
import { eq, and, desc, count, sql } from "drizzle-orm";
import { getTallerIdFromAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

type EstadoOrden =
  | "recibido"
  | "diagnostico"
  | "presupuestado"
  | "aprobado"
  | "en_reparacion"
  | "esperando_recambio"
  | "listo"
  | "entregado"
  | "cancelado";

export async function getOrdenes(filtroEstado?: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const conditions = [eq(ordenesTrabajo.tallerId, tallerId)];
  if (filtroEstado && filtroEstado !== "todas") {
    conditions.push(
      eq(ordenesTrabajo.estado, filtroEstado as EstadoOrden)
    );
  }

  return db.query.ordenesTrabajo.findMany({
    where: and(...conditions),
    with: {
      vehiculo: true,
      cliente: true,
      lineas: true,
      asignado: true,
    },
    orderBy: desc(ordenesTrabajo.createdAt),
  });
}

export async function getOrden(id: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  return db.query.ordenesTrabajo.findFirst({
    where: and(eq(ordenesTrabajo.id, id), eq(ordenesTrabajo.tallerId, tallerId)),
    with: {
      vehiculo: { with: { cliente: true } },
      cliente: true,
      lineas: true,
      fotos: true,
      historial: { orderBy: desc(historialEstados.createdAt) },
      asignado: true,
    },
  });
}

export async function crearOrden(data: {
  vehiculoId: string;
  clienteId: string;
  kmEntrada?: number;
  descripcionCliente?: string;
  fechaEstimada?: string;
}) {
  const { tallerId, usuarioId, clerkUserId } = await getTallerIdFromAuth();
  const db = getDb();

  // Get next order number (unique index on taller_id+numero prevents duplicates)
  const [maxResult] = await db
    .select({ max: sql<number>`COALESCE(MAX(${ordenesTrabajo.numero}), 0)` })
    .from(ordenesTrabajo)
    .where(eq(ordenesTrabajo.tallerId, tallerId));

  const numero = (maxResult?.max ?? 0) + 1;

  const [orden] = await db
    .insert(ordenesTrabajo)
    .values({
      tallerId,
      vehiculoId: data.vehiculoId,
      clienteId: data.clienteId,
      numero,
      estado: "recibido",
      kmEntrada: data.kmEntrada,
      descripcionCliente: data.descripcionCliente,
      fechaEstimada: data.fechaEstimada
        ? new Date(data.fechaEstimada)
        : undefined,
    })
    .returning();

  // Registrar en historial
  await db.insert(historialEstados).values({
    ordenId: orden.id,
    estadoNuevo: "recibido",
    usuarioId,
  });

  logAudit({
    tallerId,
    userId: clerkUserId,
    action: "create",
    entityType: "orden",
    entityId: orden.id,
    details: { numero: orden.numero, vehiculoId: data.vehiculoId, clienteId: data.clienteId },
  });

  revalidatePath("/ordenes");
  revalidatePath("/");
  return orden;
}

export async function cambiarEstadoOrden(id: string, nuevoEstado: EstadoOrden) {
  const { tallerId, usuarioId, clerkUserId } = await getTallerIdFromAuth();
  const db = getDb();

  const orden = await db.query.ordenesTrabajo.findFirst({
    where: and(eq(ordenesTrabajo.id, id), eq(ordenesTrabajo.tallerId, tallerId)),
  });

  if (!orden) throw new Error("Orden no encontrada");

  await db
    .update(ordenesTrabajo)
    .set({
      estado: nuevoEstado,
      updatedAt: new Date(),
      fechaEntrega: nuevoEstado === "entregado" ? new Date() : orden.fechaEntrega,
    })
    .where(eq(ordenesTrabajo.id, id));

  await db.insert(historialEstados).values({
    ordenId: id,
    estadoAnterior: orden.estado,
    estadoNuevo: nuevoEstado,
    usuarioId,
  });

  logAudit({
    tallerId,
    userId: clerkUserId,
    action: "update",
    entityType: "orden",
    entityId: id,
    details: { estadoAnterior: orden.estado, estadoNuevo: nuevoEstado },
  });

  revalidatePath("/ordenes");
  revalidatePath(`/ordenes/${id}`);
  revalidatePath("/");
}

export async function agregarLineaOrden(data: {
  ordenId: string;
  tipo: "mano_obra" | "recambio" | "otros";
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  descuentoPct?: number;
  ivaPct?: number;
}) {
  const { tallerId, clerkUserId } = await getTallerIdFromAuth();
  const db = getDb();

  // Verify order belongs to authenticated workshop
  const [orden] = await db
    .select({ id: ordenesTrabajo.id })
    .from(ordenesTrabajo)
    .where(and(eq(ordenesTrabajo.id, data.ordenId), eq(ordenesTrabajo.tallerId, tallerId)));

  if (!orden) throw new Error("Orden no encontrada");

  const [linea] = await db
    .insert(lineasOrden)
    .values({
      ordenId: data.ordenId,
      tipo: data.tipo,
      descripcion: data.descripcion,
      cantidad: String(data.cantidad),
      precioUnitario: String(data.precioUnitario),
      descuentoPct: data.descuentoPct ? String(data.descuentoPct) : "0",
      ivaPct: data.ivaPct ? String(data.ivaPct) : "21",
    })
    .returning();

  logAudit({
    tallerId,
    userId: clerkUserId,
    action: "create",
    entityType: "orden",
    entityId: data.ordenId,
    details: { lineaId: linea.id, tipo: data.tipo, descripcion: data.descripcion },
  });

  revalidatePath(`/ordenes/${data.ordenId}`);
  return linea;
}

export async function eliminarLineaOrden(id: string, ordenId: string) {
  const { tallerId, clerkUserId } = await getTallerIdFromAuth();
  const db = getDb();

  // Verify order belongs to authenticated workshop before deleting line
  const [orden] = await db
    .select({ id: ordenesTrabajo.id })
    .from(ordenesTrabajo)
    .where(and(eq(ordenesTrabajo.id, ordenId), eq(ordenesTrabajo.tallerId, tallerId)));

  if (!orden) throw new Error("Orden no encontrada");

  await db.delete(lineasOrden).where(eq(lineasOrden.id, id));

  logAudit({
    tallerId,
    userId: clerkUserId,
    action: "delete",
    entityType: "orden",
    entityId: ordenId,
    details: { lineaId: id },
  });

  revalidatePath(`/ordenes/${ordenId}`);
}

export async function getEstadisticasTaller() {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const cochesEnTaller = await db
    .select({ count: count() })
    .from(ordenesTrabajo)
    .where(
      and(
        eq(ordenesTrabajo.tallerId, tallerId),
        sql`${ordenesTrabajo.estado} NOT IN ('entregado', 'cancelado')`
      )
    );

  const totalClientes = await db
    .select({ count: count() })
    .from(clientes)
    .where(eq(clientes.tallerId, tallerId));

  return {
    cochesEnTaller: cochesEnTaller[0]?.count ?? 0,
    totalClientes: totalClientes[0]?.count ?? 0,
  };
}
