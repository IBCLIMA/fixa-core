"use server";

import { getDb } from "@/db";
import {
  ordenesTrabajo,
  lineasOrden,
  historialEstados,
  presupuestos,
  vehiculos,
  clientes,
  talleres,
  usuarios,
  fotosOrden,
  averiasOcultas,
} from "@/db/schema";
import { eq, and, desc, count, sql } from "drizzle-orm";
import { getTallerIdFromAuth, requireRole } from "@/lib/auth";
import { checkMaintenanceAlerts, type MaintenanceAlert } from "@/lib/maintenance-check";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";
import { createNotification } from "@/lib/notify";
import { formatWhatsAppUrl } from "@/lib/utils";

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

export async function getOrden(id: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  // Main order with vehicle and client
  const [orden] = await db
    .select()
    .from(ordenesTrabajo)
    .where(and(eq(ordenesTrabajo.id, id), eq(ordenesTrabajo.tallerId, tallerId)));

  if (!orden) return null;

  // Fetch relations separately to avoid Drizzle ORM nested relation issues
  const [vehiculo] = await db.select().from(vehiculos).where(eq(vehiculos.id, orden.vehiculoId));
  const [cliente] = await db.select().from(clientes).where(eq(clientes.id, orden.clienteId));
  const lineas = await db.select().from(lineasOrden).where(eq(lineasOrden.ordenId, id));
  const fotos = await db.select().from(fotosOrden).where(eq(fotosOrden.ordenId, id));
  const historial = await db.select().from(historialEstados).where(eq(historialEstados.ordenId, id)).orderBy(desc(historialEstados.createdAt));
  const asignado = orden.asignadoA
    ? (await db.select().from(usuarios).where(eq(usuarios.id, orden.asignadoA)))[0]
    : null;
  const averias = await db.select().from(averiasOcultas).where(eq(averiasOcultas.ordenId, id)).orderBy(desc(averiasOcultas.createdAt));

  return {
    ...orden,
    vehiculo: vehiculo || null,
    cliente: cliente || null,
    lineas,
    fotos,
    historial,
    asignado,
    averias,
  };
}

export async function crearOrden(data: {
  vehiculoId: string;
  clienteId: string;
  kmEntrada?: number;
  descripcionCliente?: string;
  fechaEstimada?: string;
  motivoDeposito?: string;
  tipoIntervencion?: string[];
  observacionesEntrada?: string;
}) {
  const { tallerId, usuarioId, clerkUserId } = await getTallerIdFromAuth();
  const db = getDb();

  const { randomBytes } = await import("crypto");
  const tokenPublico = randomBytes(16).toString("hex");

  const [orden] = await db
    .insert(ordenesTrabajo)
    .values({
      tallerId,
      vehiculoId: data.vehiculoId,
      clienteId: data.clienteId,
      // Atomic: next number computed inside the INSERT (no SELECT MAX race window)
      numero: sql<number>`(SELECT COALESCE(MAX(${ordenesTrabajo.numero}), 0) + 1 FROM ${ordenesTrabajo} WHERE ${ordenesTrabajo.tallerId} = ${tallerId})`,
      estado: "recibido",
      kmEntrada: data.kmEntrada,
      descripcionCliente: data.descripcionCliente,
      fechaEstimada: data.fechaEstimada
        ? new Date(data.fechaEstimada)
        : undefined,
      motivoDeposito: data.motivoDeposito || "reparacion",
      tipoIntervencion: data.tipoIntervencion || undefined,
      observacionesEntrada: data.observacionesEntrada || undefined,
      tokenPublico,
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

  const [orden] = await db
    .select()
    .from(ordenesTrabajo)
    .where(and(eq(ordenesTrabajo.id, id), eq(ordenesTrabajo.tallerId, tallerId)));

  if (!orden) throw new Error("Orden no encontrada");

  // Validate target state against the workshop's active workflow (cancelado always allowed)
  if (nuevoEstado !== "cancelado") {
    const { getActivePhases } = await import("@/lib/workflow");
    const [tallerConfig] = await db
      .select({ flujoTaller: talleres.flujoTaller })
      .from(talleres)
      .where(eq(talleres.id, tallerId));
    const activePhases = getActivePhases(tallerConfig?.flujoTaller);
    if (!activePhases.includes(nuevoEstado)) {
      throw new Error(`El estado "${nuevoEstado}" no existe en el flujo de trabajo de tu taller`);
    }
  }

  await db
    .update(ordenesTrabajo)
    .set({
      estado: nuevoEstado,
      updatedAt: new Date(),
      fechaEntrega: nuevoEstado === "entregado" ? new Date() : orden.fechaEntrega,
    })
    .where(and(eq(ordenesTrabajo.id, id), eq(ordenesTrabajo.tallerId, tallerId)));

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

  // Notification when order is ready — include plate + client + vehicle for the mechanic
  if (nuevoEstado === "listo") {
    const [veh] = await db.select({ matricula: vehiculos.matricula, marca: vehiculos.marca, modelo: vehiculos.modelo }).from(vehiculos).where(eq(vehiculos.id, orden.vehiculoId));
    const [cli] = await db.select({ nombre: clientes.nombre }).from(clientes).where(eq(clientes.id, orden.clienteId));
    const plate = veh?.matricula || "";
    const vehicle = [veh?.marca, veh?.modelo].filter(Boolean).join(" ");
    const client = cli?.nombre || "";

    createNotification({
      tallerId,
      tipo: "orden_lista",
      titulo: `${plate} finalizado`,
      mensaje: `${vehicle} de ${client} está listo para entregar.`,
      enlace: `/ordenes/${id}`,
    });
  }

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
  tipoPieza?: "nueva" | "reconstruida" | "usada";
  referencia?: string;
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
      tipoPieza: data.tipoPieza || "nueva",
      referencia: data.referencia || null,
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

export async function editarLineaOrden(data: {
  id: string;
  ordenId: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  descuentoPct?: number;
  ivaPct?: number;
}) {
  const { tallerId, clerkUserId } = await getTallerIdFromAuth();
  const db = getDb();

  const [orden] = await db
    .select({ id: ordenesTrabajo.id })
    .from(ordenesTrabajo)
    .where(and(eq(ordenesTrabajo.id, data.ordenId), eq(ordenesTrabajo.tallerId, tallerId)));
  if (!orden) throw new Error("Orden no encontrada");

  await db
    .update(lineasOrden)
    .set({
      descripcion: data.descripcion,
      cantidad: String(data.cantidad),
      precioUnitario: String(data.precioUnitario),
      descuentoPct: data.descuentoPct ? String(data.descuentoPct) : "0",
      ivaPct: data.ivaPct ? String(data.ivaPct) : "21",
    })
    .where(and(
      eq(lineasOrden.id, data.id),
      eq(lineasOrden.ordenId, data.ordenId)
    ));

  revalidatePath(`/ordenes/${data.ordenId}`);
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

  await db.delete(lineasOrden).where(and(
    eq(lineasOrden.id, id),
    eq(lineasOrden.ordenId, ordenId)
  ));

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

export async function eliminarOrden(id: string) {
  const { tallerId, clerkUserId } = await requireRole(["admin"]);
  const db = getDb();

  // Verify order belongs to this workshop
  const [orden] = await db
    .select()
    .from(ordenesTrabajo)
    .where(and(eq(ordenesTrabajo.id, id), eq(ordenesTrabajo.tallerId, tallerId)));

  if (!orden) throw new Error("Orden no encontrada");

  // Delete related presupuestos (their lineas cascade automatically)
  await db
    .delete(presupuestos)
    .where(eq(presupuestos.ordenId, id));

  // Delete the order (lineasOrden, fotosOrden, historialEstados cascade automatically)
  await db
    .delete(ordenesTrabajo)
    .where(and(eq(ordenesTrabajo.id, id), eq(ordenesTrabajo.tallerId, tallerId)));

  logAudit({
    tallerId,
    userId: clerkUserId,
    action: "delete",
    entityType: "orden",
    entityId: id,
    details: { numero: orden.numero },
  });

  revalidatePath("/ordenes");
  revalidatePath("/");
}

export async function registrarPago(data: {
  ordenId: string;
  metodoPago: "efectivo" | "tarjeta" | "transferencia" | "bizum" | "domiciliacion" | "otro";
  importeTotal?: number;
  notasPago?: string;
}) {
  const { tallerId, clerkUserId } = await getTallerIdFromAuth();
  const db = getDb();

  const [orden] = await db
    .select({ id: ordenesTrabajo.id })
    .from(ordenesTrabajo)
    .where(and(eq(ordenesTrabajo.id, data.ordenId), eq(ordenesTrabajo.tallerId, tallerId)));

  if (!orden) throw new Error("Orden no encontrada");

  await db
    .update(ordenesTrabajo)
    .set({
      pagado: true,
      metodoPago: data.metodoPago,
      fechaPago: new Date(),
      importeTotal: data.importeTotal ? String(data.importeTotal) : null,
      notasPago: data.notasPago || null,
      updatedAt: new Date(),
    })
    .where(and(eq(ordenesTrabajo.id, data.ordenId), eq(ordenesTrabajo.tallerId, tallerId)));

  logAudit({
    tallerId,
    userId: clerkUserId,
    action: "update",
    entityType: "orden",
    entityId: data.ordenId,
    details: { action: "pago", metodoPago: data.metodoPago, importe: data.importeTotal },
  });

  revalidatePath(`/ordenes/${data.ordenId}`);
  revalidatePath("/ordenes");
  revalidatePath("/facturacion");
}

export async function anularPago(ordenId: string) {
  const { tallerId, clerkUserId } = await getTallerIdFromAuth();
  const db = getDb();

  const [orden] = await db
    .select({ id: ordenesTrabajo.id })
    .from(ordenesTrabajo)
    .where(and(eq(ordenesTrabajo.id, ordenId), eq(ordenesTrabajo.tallerId, tallerId)));

  if (!orden) throw new Error("Orden no encontrada");

  await db
    .update(ordenesTrabajo)
    .set({
      pagado: false,
      metodoPago: null,
      fechaPago: null,
      importeTotal: null,
      notasPago: null,
      updatedAt: new Date(),
    })
    .where(and(eq(ordenesTrabajo.id, ordenId), eq(ordenesTrabajo.tallerId, tallerId)));

  logAudit({
    tallerId,
    userId: clerkUserId,
    action: "update",
    entityType: "orden",
    entityId: ordenId,
    details: { action: "anular_pago" },
  });

  revalidatePath(`/ordenes/${ordenId}`);
  revalidatePath("/ordenes");
  revalidatePath("/facturacion");
}

/**
 * Flujo de entrega unificado: marca la orden como entregada, registra el cobro
 * (opcional, generando documento) y devuelve el WhatsApp con informe + petición de reseña.
 */
export async function entregarOrden(
  ordenId: string,
  metodoPago?: "efectivo" | "tarjeta" | "transferencia" | "bizum" | "domiciliacion" | "otro"
) {
  const { tallerId, usuarioId, clerkUserId } = await getTallerIdFromAuth();
  const db = getDb();

  const [orden] = await db
    .select()
    .from(ordenesTrabajo)
    .where(and(eq(ordenesTrabajo.id, ordenId), eq(ordenesTrabajo.tallerId, tallerId)));
  if (!orden) throw new Error("Orden no encontrada");
  if (orden.estado === "entregado") throw new Error("Esta orden ya está entregada");

  // 1. Cobro + documento (antes de entregar, para que un fallo de cobro no deje estados a medias)
  let documentoId: string | null = null;
  if (metodoPago) {
    const { generarDocumentoCobro } = await import("./documentos");
    const doc = await generarDocumentoCobro(ordenId, metodoPago);
    documentoId = doc.id;
  }

  // 2. Marcar entregada
  await db
    .update(ordenesTrabajo)
    .set({ estado: "entregado", fechaEntrega: new Date(), updatedAt: new Date() })
    .where(and(eq(ordenesTrabajo.id, ordenId), eq(ordenesTrabajo.tallerId, tallerId)));

  await db.insert(historialEstados).values({
    ordenId,
    estadoAnterior: orden.estado,
    estadoNuevo: "entregado",
    usuarioId,
  });

  logAudit({
    tallerId,
    userId: clerkUserId,
    action: "update",
    entityType: "orden",
    entityId: ordenId,
    details: { action: "entrega_unificada", estadoAnterior: orden.estado, cobrado: !!metodoPago, metodoPago },
  });

  // 3. WhatsApp: informe + petición de reseña en un solo mensaje
  let whatsappUrl: string | null = null;
  const [cliente] = await db.select().from(clientes).where(eq(clientes.id, orden.clienteId));
  if (cliente?.telefono) {
    const [vehiculo] = await db.select().from(vehiculos).where(eq(vehiculos.id, orden.vehiculoId));
    const [taller] = await db.select().from(talleres).where(eq(talleres.id, tallerId));
    const informeUrl = await getInformeUrl(ordenId);
    const nombreCliente = cliente.nombre?.split(" ")[0] || "";
    const vehiculoDesc = [vehiculo?.marca, vehiculo?.modelo].filter(Boolean).join(" ");

    const mensaje = [
      `Hola ${nombreCliente} 👋`,
      ``,
      `Ya está todo listo con tu ${vehiculoDesc} (${vehiculo?.matricula || ""}). Aquí tienes el informe de lo que le hemos hecho, con fotos y detalle. Sin letra pequeña:`,
      `👉 ${informeUrl}`,
      ``,
      ...(taller.googleReviewLink
        ? [`Y si te has quedado a gusto, ¿nos echas un cable con una reseña? Te cuesta un minuto y a nosotros nos cambia el día:`, `👉 ${taller.googleReviewLink}`, ``]
        : []),
      `Cualquier cosa, aquí nos tienes. Gracias por confiar en *${taller.nombre}*.`,
    ].join("\n");

    whatsappUrl = formatWhatsAppUrl(cliente.telefono, mensaje);
  }

  revalidatePath(`/ordenes/${ordenId}`);
  revalidatePath("/ordenes");
  revalidatePath("/facturacion");
  revalidatePath("/");

  return { whatsappUrl, documentoId };
}

export async function enviarSolicitudResena(ordenId: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const [orden] = await db.select().from(ordenesTrabajo)
    .where(and(eq(ordenesTrabajo.id, ordenId), eq(ordenesTrabajo.tallerId, tallerId)));
  if (!orden) throw new Error("Orden no encontrada");

  const [cliente] = await db.select().from(clientes).where(eq(clientes.id, orden.clienteId));
  if (!cliente?.telefono) throw new Error("El cliente no tiene teléfono");

  const [taller] = await db.select().from(talleres).where(eq(talleres.id, tallerId));
  if (!taller) throw new Error("Taller no encontrado");

  const nombreCliente = cliente.nombre?.split(" ")[0] || "";
  const tallerNombre = taller.nombre;
  const googleReviewLink = taller.googleReviewLink;

  let mensaje = `Hola ${nombreCliente} 👋\n\nHa sido un placer cuidar de tu coche. Si te has quedado a gusto, ¿nos echas un cable con una reseña? A ti te cuesta un minuto y a nosotros nos cambia el día.`;
  if (googleReviewLink) {
    mensaje += `\n\n👉 ${googleReviewLink}`;
  }

  mensaje += `\n\n¡Gracias de parte de todo el equipo de *${tallerNombre}*!`;

  return formatWhatsAppUrl(cliente.telefono, mensaje);
}

export async function getInformeUrl(ordenId: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();
  const [orden] = await db
    .select({ tokenPublico: ordenesTrabajo.tokenPublico })
    .from(ordenesTrabajo)
    .where(and(eq(ordenesTrabajo.id, ordenId), eq(ordenesTrabajo.tallerId, tallerId)));

  const token = orden?.tokenPublico || ordenId;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return `${baseUrl}/informe/${token}`;
}

export async function getEstadoUrl(ordenId: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();
  const [orden] = await db
    .select({ tokenPublico: ordenesTrabajo.tokenPublico })
    .from(ordenesTrabajo)
    .where(and(eq(ordenesTrabajo.id, ordenId), eq(ordenesTrabajo.tallerId, tallerId)));

  const token = orden?.tokenPublico || ordenId;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return `${baseUrl}/estado/${token}`;
}

export async function getMecanicos() {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  return db
    .select({ id: usuarios.id, nombre: usuarios.nombre, rol: usuarios.rol })
    .from(usuarios)
    .where(eq(usuarios.tallerId, tallerId));
}

export async function asignarMecanico(ordenId: string, usuarioId: string | null) {
  const { tallerId, clerkUserId } = await requireRole(["admin", "recepcion"]);
  const db = getDb();

  const [orden] = await db
    .select({ id: ordenesTrabajo.id })
    .from(ordenesTrabajo)
    .where(and(eq(ordenesTrabajo.id, ordenId), eq(ordenesTrabajo.tallerId, tallerId)));

  if (!orden) throw new Error("Orden no encontrada");

  // If assigning, verify the user belongs to this workshop
  if (usuarioId) {
    const [usuario] = await db
      .select({ id: usuarios.id })
      .from(usuarios)
      .where(and(eq(usuarios.id, usuarioId), eq(usuarios.tallerId, tallerId)));
    if (!usuario) throw new Error("Usuario no encontrado en este taller");
  }

  await db
    .update(ordenesTrabajo)
    .set({
      asignadoA: usuarioId,
      updatedAt: new Date(),
    })
    .where(and(eq(ordenesTrabajo.id, ordenId), eq(ordenesTrabajo.tallerId, tallerId)));

  logAudit({
    tallerId,
    userId: clerkUserId,
    action: "update",
    entityType: "orden",
    entityId: ordenId,
    details: { action: "asignar_mecanico", usuarioId },
  });

  revalidatePath(`/ordenes/${ordenId}`);
  revalidatePath("/ordenes");
}

export async function getMaintenanceAlerts(
  vehiculoId: string,
  kmActual: number | null
): Promise<MaintenanceAlert[]> {
  if (!kmActual) return [];

  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  // Get previous orders for this vehicle, sorted by date desc
  const previousOrdersRaw = await db.select().from(ordenesTrabajo)
    .where(and(
      eq(ordenesTrabajo.tallerId, tallerId),
      eq(ordenesTrabajo.vehiculoId, vehiculoId)
    ))
    .orderBy(desc(ordenesTrabajo.fechaEntrada));

  const previousOrders = await Promise.all(previousOrdersRaw.map(async (o) => {
    const lineas = await db.select().from(lineasOrden).where(eq(lineasOrden.ordenId, o.id));
    return { ...o, lineas };
  }));

  return checkMaintenanceAlerts(kmActual, previousOrders);
}

export async function getPrecioHora(): Promise<number> {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const [taller] = await db
    .select({ precioHora: talleres.precioHora })
    .from(talleres)
    .where(eq(talleres.id, tallerId));

  return taller ? Number(taller.precioHora || 0) : 0;
}

export async function enviarInformeCliente(ordenId: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const [orden] = await db.select().from(ordenesTrabajo)
    .where(and(eq(ordenesTrabajo.id, ordenId), eq(ordenesTrabajo.tallerId, tallerId)));
  if (!orden) throw new Error("Orden no encontrada");

  const [cliente] = await db.select().from(clientes).where(eq(clientes.id, orden.clienteId));
  const [vehiculo] = await db.select().from(vehiculos).where(eq(vehiculos.id, orden.vehiculoId));
  const [taller] = await db.select().from(talleres).where(eq(talleres.id, tallerId));

  if (!cliente?.telefono) throw new Error("El cliente no tiene teléfono");

  const reportUrl = await getInformeUrl(ordenId);
  const nombreCliente = cliente.nombre?.split(" ")[0] || "";
  const vehiculoDesc = [vehiculo?.marca, vehiculo?.modelo].filter(Boolean).join(" ");
  const matricula = vehiculo?.matricula || "";

  const mensaje = [
    `Hola ${nombreCliente} 👋`,
    ``,
    `Ya está listo el informe de tu ${vehiculoDesc} (${matricula}): todo lo que le hemos hecho, con fotos y detalle. Sin letra pequeña.`,
    ``,
    `👉 Échale un vistazo aquí:`,
    reportUrl,
    ``,
    taller.telefono ? `Cualquier duda, llámanos: ${taller.telefono}` : `Cualquier duda, nos dices.`,
    `Gracias por confiar en *${taller.nombre}*.`,
  ].filter(Boolean).join("\n");

  return formatWhatsAppUrl(cliente.telefono, mensaje);
}
