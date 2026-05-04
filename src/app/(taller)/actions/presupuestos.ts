"use server";

import { getDb } from "@/db";
import { presupuestos, lineasPresupuesto, ordenesTrabajo, lineasOrden } from "@/db/schema";
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

  // Siguiente número de presupuesto
  const [result] = await db
    .select({ max: sql<number>`COALESCE(MAX(${presupuestos.numero}), 0)` })
    .from(presupuestos)
    .where(eq(presupuestos.tallerId, tallerId));

  const numero = (result?.max ?? 0) + 1;
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
