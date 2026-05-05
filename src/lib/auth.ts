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

  // Crear taller con trial
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

export async function checkTrialStatus(): Promise<{
  activo: boolean;
  plan: string;
  daysLeft: number;
  bloqueado: boolean;
}> {
  const { userId } = await auth();
  if (!userId) return { activo: false, plan: "none", daysLeft: 0, bloqueado: true };

  const db = getDb();

  const usuario = await db.query.usuarios.findFirst({
    where: eq(usuarios.clerkUserId, userId),
  });
  if (!usuario) return { activo: false, plan: "none", daysLeft: 0, bloqueado: false };

  const [taller] = await db
    .select()
    .from(talleres)
    .where(eq(talleres.id, usuario.tallerId));

  if (!taller) return { activo: false, plan: "none", daysLeft: 0, bloqueado: true };

  // Si tiene plan activo, no bloquear
  if (["basico", "taller", "pro"].includes(taller.plan)) {
    return { activo: true, plan: taller.plan, daysLeft: 999, bloqueado: false };
  }

  // Si está cancelado, bloquear
  if (taller.plan === "cancelado") {
    return { activo: false, plan: "cancelado", daysLeft: 0, bloqueado: true };
  }

  // Si está desactivado manualmente, bloquear
  if (!taller.activo) {
    return { activo: false, plan: taller.plan, daysLeft: 0, bloqueado: true };
  }

  // Trial — comprobar fecha
  if (taller.plan === "trial") {
    if (!taller.trialEndsAt) {
      return { activo: true, plan: "trial", daysLeft: TRIAL_DAYS, bloqueado: false };
    }

    const daysLeft = Math.max(0, Math.ceil(
      (new Date(taller.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    ));

    return {
      activo: daysLeft > 0,
      plan: "trial",
      daysLeft,
      bloqueado: daysLeft <= 0,
    };
  }

  return { activo: true, plan: taller.plan, daysLeft: 999, bloqueado: false };
}

export async function getSuperAdmin(): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;

  const db = getDb();
  const usuario = await db.query.usuarios.findFirst({
    where: eq(usuarios.clerkUserId, userId),
  });
  if (!usuario) return false;

  const todosUsuarios = await db.query.usuarios.findMany({
    orderBy: (u, { asc }) => [asc(u.createdAt)],
    limit: 1,
  });

  return todosUsuarios[0]?.id === usuario.id;
}
