"use server";

import { getDb } from "@/db";
import { presupuestos, lineasPresupuesto, ordenesTrabajo, lineasOrden, clientes, vehiculos, talleres } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getTallerIdFromAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";

export async function crearPresupuestoDesdeOrden(ordenId: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  // Obtener orden
  const orden = await db.query.ordenesTrabajo.findFirst({
    where: and(eq(ordenesTrabajo.id, ordenId), eq(ordenesTrabajo.tallerId, tallerId)),
  });
  if (!orden) throw new Error("Orden no encontrada");

  // Obtener líneas de la orden
  const lineas = await db
    .select()
    .from(lineasOrden)
    .where(eq(lineasOrden.ordenId, ordenId));

  // Get next quote number (unique index prevents duplicates)
  const [maxResult] = await db
    .select({ max: sql<number>`COALESCE(MAX(${presupuestos.numero}), 0)` })
    .from(presupuestos)
    .where(eq(presupuestos.tallerId, tallerId));

  const numero = (maxResult?.max ?? 0) + 1;
  const token = randomBytes(16).toString("hex");

  // Crear presupuesto
  const [presupuesto] = await db
    .insert(presupuestos)
    .values({
      ordenId,
      tallerId,
      vehiculoId: orden.vehiculoId,
      clienteId: orden.clienteId,
      numero,
      estado: "borrador",
      tokenPublico: token,
    })
    .returning();

  // Copiar líneas
  if (lineas.length > 0) {
    await db.insert(lineasPresupuesto).values(
      lineas.map((l) => ({
        presupuestoId: presupuesto.id,
        tipo: l.tipo,
        descripcion: l.descripcion,
        cantidad: l.cantidad,
        precioUnitario: l.precioUnitario,
        descuentoPct: l.descuentoPct,
        ivaPct: l.ivaPct,
      }))
    );
  }

  // Actualizar estado de la orden
  await db
    .update(ordenesTrabajo)
    .set({ estado: "presupuestado", updatedAt: new Date() })
    .where(eq(ordenesTrabajo.id, ordenId));

  revalidatePath(`/ordenes/${ordenId}`);
  revalidatePath("/presupuestos");
  revalidatePath("/");

  return presupuesto;
}

export async function getPresupuesto(id: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const presupuesto = await db.query.presupuestos.findFirst({
    where: and(eq(presupuestos.id, id), eq(presupuestos.tallerId, tallerId)),
  });
  if (!presupuesto) return null;

  const lineas = await db
    .select()
    .from(lineasPresupuesto)
    .where(eq(lineasPresupuesto.presupuestoId, id));

  const [cliente] = await db
    .select()
    .from(clientes)
    .where(eq(clientes.id, presupuesto.clienteId));

  const [vehiculo] = await db
    .select()
    .from(vehiculos)
    .where(eq(vehiculos.id, presupuesto.vehiculoId));

  const [taller] = await db
    .select()
    .from(talleres)
    .where(eq(talleres.id, presupuesto.tallerId));

  return {
    ...presupuesto,
    lineas,
    cliente: cliente || null,
    vehiculo: vehiculo || null,
    taller: taller || null,
  };
}

export async function agregarLineaPresupuesto(data: {
  presupuestoId: string;
  tipo: "mano_obra" | "recambio" | "otros";
  descripcion: string;
  cantidad: string;
  precioUnitario: string;
  descuentoPct?: string;
  ivaPct?: string;
}) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  // Verify ownership
  const presupuesto = await db.query.presupuestos.findFirst({
    where: and(eq(presupuestos.id, data.presupuestoId), eq(presupuestos.tallerId, tallerId)),
  });
  if (!presupuesto) throw new Error("Presupuesto no encontrado");

  await db.insert(lineasPresupuesto).values({
    presupuestoId: data.presupuestoId,
    tipo: data.tipo,
    descripcion: data.descripcion,
    cantidad: data.cantidad,
    precioUnitario: data.precioUnitario,
    descuentoPct: data.descuentoPct || "0",
    ivaPct: data.ivaPct || "21",
  });

  revalidatePath(`/presupuestos/${data.presupuestoId}`);
  revalidatePath("/presupuestos");
}

export async function eliminarLineaPresupuesto(lineaId: string, presupuestoId: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  // Verify ownership
  const presupuesto = await db.query.presupuestos.findFirst({
    where: and(eq(presupuestos.id, presupuestoId), eq(presupuestos.tallerId, tallerId)),
  });
  if (!presupuesto) throw new Error("Presupuesto no encontrado");

  await db.delete(lineasPresupuesto).where(eq(lineasPresupuesto.id, lineaId));

  revalidatePath(`/presupuestos/${presupuestoId}`);
  revalidatePath("/presupuestos");
}

export async function cambiarEstadoPresupuesto(id: string, estado: "borrador" | "enviado" | "aceptado" | "rechazado" | "expirado") {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const presupuesto = await db.query.presupuestos.findFirst({
    where: and(eq(presupuestos.id, id), eq(presupuestos.tallerId, tallerId)),
  });
  if (!presupuesto) throw new Error("Presupuesto no encontrado");

  await db
    .update(presupuestos)
    .set({ estado })
    .where(eq(presupuestos.id, id));

  // If accepted, update order status to "aprobado"
  if (estado === "aceptado" && presupuesto.ordenId) {
    await db
      .update(ordenesTrabajo)
      .set({ estado: "aprobado", updatedAt: new Date() })
      .where(eq(ordenesTrabajo.id, presupuesto.ordenId));
  }

  revalidatePath(`/presupuestos/${id}`);
  revalidatePath("/presupuestos");
  if (presupuesto.ordenId) {
    revalidatePath(`/ordenes/${presupuesto.ordenId}`);
  }
}
