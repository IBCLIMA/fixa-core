"use server";

import { getDb } from "@/db";
import { averiasOcultas, ordenesTrabajo, clientes, vehiculos, talleres } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getTallerIdFromAuth } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { createNotification } from "@/lib/notify";
import { revalidatePath } from "next/cache";
import { formatWhatsAppUrl } from "@/lib/utils";
import { formatMoney } from "@/lib/format";

export async function getAveriasOcultas(ordenId: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  return db
    .select()
    .from(averiasOcultas)
    .where(and(eq(averiasOcultas.ordenId, ordenId), eq(averiasOcultas.tallerId, tallerId)))
    .orderBy(desc(averiasOcultas.createdAt));
}

export async function registrarAveriaOculta(data: {
  ordenId: string;
  descripcion: string;
  importeEstimado?: number;
  fotoUrl?: string;
}) {
  const { tallerId, usuarioId, clerkUserId } = await getTallerIdFromAuth();
  const db = getDb();

  // Verify the order belongs to this workshop
  const [orden] = await db
    .select()
    .from(ordenesTrabajo)
    .where(and(eq(ordenesTrabajo.id, data.ordenId), eq(ordenesTrabajo.tallerId, tallerId)));

  if (!orden) throw new Error("Orden no encontrada");

  // Generate approval token
  const { randomBytes } = await import("crypto");
  const tokenAprobacion = randomBytes(16).toString("hex");

  const [averia] = await db
    .insert(averiasOcultas)
    .values({
      ordenId: data.ordenId,
      tallerId,
      descripcion: data.descripcion,
      importeEstimado: data.importeEstimado ? String(data.importeEstimado) : null,
      fotoUrl: data.fotoUrl || null,
      tokenAprobacion,
      registradoPor: usuarioId,
    })
    .returning();

  await logAudit({
    tallerId,
    userId: clerkUserId,
    action: "create",
    entityType: "averia_oculta",
    entityId: averia.id,
    details: { ordenId: data.ordenId, descripcion: data.descripcion, importeEstimado: data.importeEstimado },
  });

  // Create internal notification
  await createNotification({
    tallerId,
    tipo: "averia_oculta",
    titulo: `Avería oculta en OR-${orden.numero}`,
    mensaje: `${data.descripcion}${data.importeEstimado ? ` — ~${formatMoney(Number(data.importeEstimado))}` : ""}`,
    enlace: `/ordenes/${data.ordenId}`,
  });

  revalidatePath(`/ordenes/${data.ordenId}`);

  return averia;
}

export async function getAveriaWhatsAppUrl(averiaId: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const [averia] = await db
    .select()
    .from(averiasOcultas)
    .where(and(eq(averiasOcultas.id, averiaId), eq(averiasOcultas.tallerId, tallerId)));

  if (!averia) throw new Error("Avería no encontrada");

  // Get order, client, vehicle, and taller data
  const [orden] = await db.select().from(ordenesTrabajo).where(eq(ordenesTrabajo.id, averia.ordenId));
  const [cliente] = await db.select().from(clientes).where(eq(clientes.id, orden.clienteId));
  const [vehiculo] = await db.select().from(vehiculos).where(eq(vehiculos.id, orden.vehiculoId));
  const [taller] = await db.select().from(talleres).where(eq(talleres.id, tallerId));

  if (!cliente?.telefono) throw new Error("El cliente no tiene teléfono");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://fixataller.es";
  const approvalUrl = `${appUrl}/aprobar/${averia.tokenAprobacion}`;

  const mensaje = [
    `Hola ${cliente.nombre?.split(" ")[0] || ""},`,
    ``,
    `Te escribimos de ${taller.nombre}. Mientras revisamos tu ${vehiculo?.marca || "vehículo"} ${vehiculo?.modelo || ""} (${vehiculo?.matricula || ""}), hemos encontrado algo que necesita tu atención:`,
    ``,
    `*${averia.descripcion}*`,
    averia.importeEstimado ? `Coste estimado: ${formatMoney(Number(averia.importeEstimado))}` : "",
    ``,
    `Puedes aprobar o rechazar esta reparación adicional aquí:`,
    approvalUrl,
    ``,
    `Si tienes dudas, llámanos al ${taller.telefono || "taller"}.`,
  ]
    .filter(Boolean)
    .join("\n");

  // Mark as notified (filter by tallerId for multi-tenant safety)
  await db
    .update(averiasOcultas)
    .set({ notificadoAt: new Date(), metodoNotificacion: "whatsapp" })
    .where(and(eq(averiasOcultas.id, averiaId), eq(averiasOcultas.tallerId, tallerId)));

  revalidatePath(`/ordenes/${averia.ordenId}`);

  return formatWhatsAppUrl(cliente.telefono, mensaje);
}

// Public function — no auth required (uses token)
export async function getAveriaByToken(token: string) {
  const db = getDb();

  const [averia] = await db
    .select()
    .from(averiasOcultas)
    .where(eq(averiasOcultas.tokenAprobacion, token));

  if (!averia) return null;

  const [orden] = await db.select().from(ordenesTrabajo).where(eq(ordenesTrabajo.id, averia.ordenId));
  const [vehiculo] = await db.select().from(vehiculos).where(eq(vehiculos.id, orden.vehiculoId));
  const [taller] = await db.select().from(talleres).where(eq(talleres.id, averia.tallerId));

  return {
    averia,
    orden: { numero: orden.numero },
    vehiculo: { matricula: vehiculo?.matricula, marca: vehiculo?.marca, modelo: vehiculo?.modelo },
    taller: { nombre: taller.nombre, telefono: taller.telefono, logoUrl: taller.logoUrl },
  };
}

export async function responderAveria(token: string, decision: "aprobada" | "rechazada") {
  const db = getDb();

  const [averia] = await db
    .select()
    .from(averiasOcultas)
    .where(eq(averiasOcultas.tokenAprobacion, token));

  if (!averia) throw new Error("Avería no encontrada");
  if (averia.estado !== "pendiente") throw new Error("Ya se ha respondido a esta solicitud");

  // Atomic conditional update: prevents double-respond race
  const updated = await db
    .update(averiasOcultas)
    .set({ estado: decision, respondidoAt: new Date() })
    .where(and(eq(averiasOcultas.id, averia.id), eq(averiasOcultas.estado, "pendiente")))
    .returning({ id: averiasOcultas.id });

  if (updated.length === 0) throw new Error("Ya se ha respondido a esta solicitud");

  // Notify the workshop
  await createNotification({
    tallerId: averia.tallerId,
    tipo: "averia_respuesta",
    titulo: `Cliente ${decision === "aprobada" ? "APROBÓ" : "RECHAZÓ"} avería oculta`,
    mensaje: averia.descripcion,
    enlace: `/ordenes/${averia.ordenId}`,
  });

  return { success: true, decision };
}
