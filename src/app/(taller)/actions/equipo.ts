"use server";

import { getDb } from "@/db";
import { usuarios, inviteTokens } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";
import { randomBytes } from "crypto";

export async function actualizarComision(usuarioId: string, comisionPct: number) {
  const { tallerId, clerkUserId } = await requireRole(["admin"]);
  const db = getDb();

  // Verify the user belongs to this workshop
  const [usuario] = await db.select().from(usuarios).where(and(eq(usuarios.id, usuarioId), eq(usuarios.tallerId, tallerId)));

  if (!usuario) throw new Error("Usuario no encontrado en este taller");

  if (comisionPct < 0 || comisionPct > 100) {
    throw new Error("El porcentaje de comisión debe estar entre 0 y 100");
  }

  await db
    .update(usuarios)
    .set({ comisionPct: String(comisionPct) })
    .where(eq(usuarios.id, usuarioId));

  logAudit({
    tallerId,
    userId: clerkUserId,
    action: "update",
    entityType: "usuario",
    entityId: usuarioId,
    details: { action: "actualizar_comision", comisionPct },
  });

  revalidatePath("/equipo");
  revalidatePath("/facturacion");
}

export async function crearInvitacion(rol: "admin" | "mecanico" | "recepcion") {
  const { tallerId, clerkUserId } = await requireRole(["admin"]);
  const db = getDb();

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await db.insert(inviteTokens).values({
    tallerId,
    rol,
    token,
    expiresAt,
  });

  logAudit({
    tallerId,
    userId: clerkUserId,
    action: "create",
    entityType: "invite_token",
    entityId: token,
    details: { rol },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return `${baseUrl}/sign-up?invite=${token}`;
}
