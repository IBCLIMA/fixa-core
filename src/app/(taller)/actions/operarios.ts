"use server";

import { getDb } from "@/db";
import { usuarios } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getTallerIdFromAuth, requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

/**
 * Create a "simple operario" — just a name, no Clerk account needed.
 * Uses a local placeholder for clerkUserId so the person appears in
 * assignment dropdowns without needing to create a real account.
 */
export async function crearOperarioSimple(nombre: string) {
  const { tallerId } = await requireRole(["admin"]);
  const db = getDb();

  if (!nombre.trim()) throw new Error("El nombre es obligatorio");

  const [operario] = await db
    .insert(usuarios)
    .values({
      tallerId,
      nombre: nombre.trim(),
      clerkUserId: `local_${randomUUID()}`,
      rol: "mecanico",
    })
    .returning();

  revalidatePath("/equipo");
  revalidatePath("/ordenes");
  return operario;
}

export async function crearOperariosEnLote(nombres: string[]) {
  const { tallerId } = await requireRole(["admin"]);
  const db = getDb();

  const nombresValidos = nombres.map((n) => n.trim()).filter(Boolean);
  if (nombresValidos.length === 0) return [];

  const operarios = await db
    .insert(usuarios)
    .values(
      nombresValidos.map((nombre) => ({
        tallerId,
        nombre,
        clerkUserId: `local_${randomUUID()}`,
        rol: "mecanico" as const,
      }))
    )
    .returning();

  revalidatePath("/equipo");
  revalidatePath("/ordenes");
  return operarios;
}
