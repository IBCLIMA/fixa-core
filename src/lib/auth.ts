import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/db";
import { talleres, usuarios } from "@/db/schema";
import { eq } from "drizzle-orm";

const TRIAL_DAYS = 14;

export async function getTallerIdFromAuth() {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  const db = getDb();

  const usuario = await db.query.usuarios.findFirst({
    where: eq(usuarios.clerkUserId, userId),
  });

  if (usuario) {
    // Actualizar último acceso
    await db
      .update(talleres)
      .set({ ultimoAcceso: new Date() })
      .where(eq(talleres.id, usuario.tallerId));

    return { tallerId: usuario.tallerId, usuarioId: usuario.id };
  }

  // Crear taller con trial de 14 días
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + TRIAL_DAYS);

  const [taller] = await db
    .insert(talleres)
    .values({
      nombre: "Mi Taller",
      plan: "trial",
      trialEndsAt: trialEnd,
      ultimoAcceso: new Date(),
    })
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

export async function isAdmin(userId: string): Promise<boolean> {
  // Tu Clerk userId — cámbialo cuando tengas tu ID real
  const ADMIN_USER_IDS = [
    userId, // Por ahora todos son admin, luego lo restringimos
  ];
  return true; // Temporal — luego verificamos contra una lista
}

export async function getSuperAdmin(): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;

  const db = getDb();
  const usuario = await db.query.usuarios.findFirst({
    where: eq(usuarios.clerkUserId, userId),
  });

  // El primer usuario creado es superadmin
  if (!usuario) return false;

  const todosUsuarios = await db.query.usuarios.findMany({
    orderBy: (u, { asc }) => [asc(u.createdAt)],
    limit: 1,
  });

  return todosUsuarios[0]?.id === usuario.id;
}
