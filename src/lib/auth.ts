import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/db";
import { talleres, usuarios } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getTallerIdFromAuth() {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  const db = getDb();

  // Buscar usuario y su taller
  const usuario = await db.query.usuarios.findFirst({
    where: eq(usuarios.clerkUserId, userId),
  });

  if (usuario) return { tallerId: usuario.tallerId, usuarioId: usuario.id };

  // Si no existe, crear taller y usuario automáticamente
  const [taller] = await db
    .insert(talleres)
    .values({ nombre: "Mi Taller" })
    .returning();

  const [nuevoUsuario] = await db
    .insert(usuarios)
    .values({
      clerkUserId: userId,
      tallerId: taller.id,
      rol: "admin",
      nombre: "Administrador",
    })
    .returning();

  return { tallerId: taller.id, usuarioId: nuevoUsuario.id };
}
