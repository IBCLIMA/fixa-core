"use server";

import { getDb } from "@/db";
import { recambistas } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getTallerIdFromAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getRecambistas() {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();
  return db
    .select()
    .from(recambistas)
    .where(eq(recambistas.tallerId, tallerId))
    .orderBy(recambistas.nombre);
}

export async function crearRecambista(data: { nombre: string; telefono: string; notas?: string }) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  if (!data.nombre?.trim() || !data.telefono?.trim()) {
    throw new Error("Nombre y teléfono son obligatorios");
  }

  const [r] = await db
    .insert(recambistas)
    .values({
      tallerId,
      nombre: data.nombre.trim(),
      telefono: data.telefono.trim(),
      notas: data.notas?.trim() || null,
    })
    .returning();

  revalidatePath("/configuracion");
  return r;
}

export async function editarRecambista(id: string, data: { nombre: string; telefono: string; notas?: string }) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  await db
    .update(recambistas)
    .set({
      nombre: data.nombre.trim(),
      telefono: data.telefono.trim(),
      notas: data.notas?.trim() || null,
    })
    .where(and(eq(recambistas.id, id), eq(recambistas.tallerId, tallerId)));

  revalidatePath("/configuracion");
}

export async function eliminarRecambista(id: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  await db
    .delete(recambistas)
    .where(and(eq(recambistas.id, id), eq(recambistas.tallerId, tallerId)));

  revalidatePath("/configuracion");
}
