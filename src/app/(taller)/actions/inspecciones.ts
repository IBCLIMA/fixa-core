"use server";

import { getDb } from "@/db";
import { inspeccionesOrden, ordenesTrabajo } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getTallerIdFromAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { inspectionTemplate } from "@/lib/inspection-template";

export async function iniciarInspeccion(ordenId: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  // Verify order belongs to this workshop
  const orden = await db.query.ordenesTrabajo.findFirst({
    where: and(eq(ordenesTrabajo.id, ordenId), eq(ordenesTrabajo.tallerId, tallerId)),
  });
  if (!orden) throw new Error("Orden no encontrada");

  // Check if inspection already exists
  const existing = await db
    .select({ id: inspeccionesOrden.id })
    .from(inspeccionesOrden)
    .where(eq(inspeccionesOrden.ordenId, ordenId))
    .limit(1);

  if (existing.length > 0) throw new Error("La inspección ya existe para esta orden");

  // Create all inspection items from template
  const values = inspectionTemplate.flatMap((cat) =>
    cat.items.map((item) => ({
      ordenId,
      categoria: cat.categoria,
      item,
      estado: "no_aplica" as const,
    }))
  );

  await db.insert(inspeccionesOrden).values(values);

  revalidatePath(`/ordenes/${ordenId}`);
}

export async function actualizarInspeccion(
  id: string,
  estado: "bien" | "atencion" | "urgente" | "no_aplica",
  notas?: string
) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  // Get the inspection item and verify ownership through the order
  const items = await db
    .select({
      inspeccionId: inspeccionesOrden.id,
      ordenId: inspeccionesOrden.ordenId,
      tallerId: ordenesTrabajo.tallerId,
    })
    .from(inspeccionesOrden)
    .innerJoin(ordenesTrabajo, eq(inspeccionesOrden.ordenId, ordenesTrabajo.id))
    .where(and(eq(inspeccionesOrden.id, id), eq(ordenesTrabajo.tallerId, tallerId)));

  if (items.length === 0) throw new Error("Inspección no encontrada");

  await db
    .update(inspeccionesOrden)
    .set({
      estado,
      notas: notas !== undefined ? notas : undefined,
    })
    .where(eq(inspeccionesOrden.id, id));

  revalidatePath(`/ordenes/${items[0].ordenId}`);
}

export async function getInspeccion(ordenId: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  // Verify order belongs to this workshop
  const orden = await db.query.ordenesTrabajo.findFirst({
    where: and(eq(ordenesTrabajo.id, ordenId), eq(ordenesTrabajo.tallerId, tallerId)),
  });
  if (!orden) throw new Error("Orden no encontrada");

  return db
    .select()
    .from(inspeccionesOrden)
    .where(eq(inspeccionesOrden.ordenId, ordenId));
}
