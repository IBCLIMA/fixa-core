"use server";

import { getDb } from "@/db";
import { plantillasServicio } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getTallerIdFromAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type LineaPlantilla = {
  tipo: "mano_obra" | "recambio" | "otros";
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
};

export async function getPlantillas() {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  return db
    .select()
    .from(plantillasServicio)
    .where(eq(plantillasServicio.tallerId, tallerId));
}

export async function crearPlantilla(data: { nombre: string; lineas: LineaPlantilla[] }) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const [plantilla] = await db
    .insert(plantillasServicio)
    .values({
      tallerId,
      nombre: data.nombre,
      lineas: data.lineas,
    })
    .returning();

  revalidatePath("/configuracion");
  return plantilla;
}

export async function actualizarPlantilla(id: string, data: { nombre: string; lineas: LineaPlantilla[] }) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  await db
    .update(plantillasServicio)
    .set({ nombre: data.nombre, lineas: data.lineas })
    .where(and(eq(plantillasServicio.id, id), eq(plantillasServicio.tallerId, tallerId)));

  revalidatePath("/configuracion");
}

export async function eliminarPlantilla(id: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  await db
    .delete(plantillasServicio)
    .where(and(eq(plantillasServicio.id, id), eq(plantillasServicio.tallerId, tallerId)));

  revalidatePath("/configuracion");
}
