import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/db";
import { talleres, usuarios, inviteTokens } from "@/db/schema";
import { eq, and, isNotNull } from "drizzle-orm";
import { cookies } from "next/headers";

const TRIAL_DAYS = 14;

export async function getTallerIdFromAuth() {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  const db = getDb();

  const [usuario] = await db.select().from(usuarios).where(eq(usuarios.clerkUserId, userId));

  if (usuario) {
    // Super-admin: puede operar otro taller de su mismo grupo si fijó la cookie
    // `taller_activo` (switcher). Para usuarios normales NO hay cookie → este bloque
    // se salta entero y el comportamiento es idéntico al de siempre. Solo se consulta
    // a Clerk (getSuperAdmin) cuando la cookie está presente.
    const overrideId = (await cookies()).get("taller_activo")?.value;
    if (overrideId && overrideId !== usuario.tallerId && (await getSuperAdmin())) {
      const [target] = await db
        .select()
        .from(talleres)
        .where(and(eq(talleres.id, overrideId), isNotNull(talleres.grupoAdmin)));
      if (target) {
        const [adminU] = await db
          .select()
          .from(usuarios)
          .where(and(eq(usuarios.tallerId, target.id), eq(usuarios.rol, "admin")));
        return { tallerId: target.id, usuarioId: adminU?.id ?? usuario.id, clerkUserId: userId, rol: "admin" as const };
      }
    }
    return { tallerId: usuario.tallerId, usuarioId: usuario.id, clerkUserId: userId, rol: usuario.rol };
  }

  // Check for invite token (set by middleware from sign-up URL)
  const cookieStore = await cookies();
  const inviteToken = cookieStore.get("invite_token")?.value;

  if (inviteToken) {
    // Look up valid, unused, non-expired invite token
    const [invite] = await db.select().from(inviteTokens).where(and(
      eq(inviteTokens.token, inviteToken),
      eq(inviteTokens.usado, false),
    ));

    if (invite && new Date(invite.expiresAt) > new Date()) {
      // Mark token as used
      await db
        .update(inviteTokens)
        .set({ usado: true })
        .where(eq(inviteTokens.id, invite.id));

      // Add user to the inviting workshop with the specified role
      const [nuevoUsuario] = await db
        .insert(usuarios)
        .values({
          clerkUserId: userId,
          tallerId: invite.tallerId,
          rol: invite.rol,
          nombre: "Nuevo usuario",
        })
        .returning();

      // Clear the invite cookie
      cookieStore.delete("invite_token");

      return { tallerId: invite.tallerId, usuarioId: nuevoUsuario.id, clerkUserId: userId, rol: nuevoUsuario.rol };
    }
  }

  // No valid invite — crear taller como PENDIENTE, necesita aprobación del admin
  const [taller] = await db
    .insert(talleres)
    .values({
      nombre: "Mi Taller",
      plan: "pendiente",
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

  // Notificar al admin del nuevo registro
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    fetch(`${baseUrl}/api/notificar-registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tallerId: taller.id, userId }),
    }).catch(() => {});
  } catch {}

  return { tallerId: taller.id, usuarioId: nuevoUsuario.id, clerkUserId: userId, rol: nuevoUsuario.rol };
}

export type RolUsuario = "admin" | "mecanico" | "recepcion";

export async function requireRole(allowedRoles: RolUsuario[]) {
  const auth = await getTallerIdFromAuth();
  if (!allowedRoles.includes(auth.rol)) {
    throw new Error("No tienes permisos para esta acción");
  }
  return auth;
}

export async function getUserRole(): Promise<RolUsuario> {
  const { rol } = await getTallerIdFromAuth();
  return rol;
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

  const [usuario] = await db.select().from(usuarios).where(eq(usuarios.clerkUserId, userId));
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

  // Si está pendiente de aprobación, bloquear
  if (taller.plan === "pendiente") {
    return { activo: false, plan: "pendiente", daysLeft: 0, bloqueado: true };
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

  // Check against allowed super admin emails from env
  const allowedEmails = (process.env.SUPER_ADMIN_EMAILS || "sergi@ibclima.com").split(",").map(e => e.trim());

  // Get user email from Clerk
  const { clerkClient } = await import("@clerk/nextjs/server");
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const userEmail = user.emailAddresses[0]?.emailAddress;

  if (!userEmail || !allowedEmails.includes(userEmail)) {
    return false;
  }

  return true;
}

/**
 * Datos para el switcher de talleres (SOLO super-admin). Devuelve la lista de
 * talleres del grupo (los que tienen `grupoAdmin`) y cuál está activo ahora.
 * Para cualquier usuario normal devuelve null → el switcher no se renderiza.
 */
export async function getSwitcherData(): Promise<{ talleres: { id: string; nombre: string }[]; activoId: string } | null> {
  if (!(await getSuperAdmin())) return null;

  const db = getDb();
  const lista = await db
    .select({ id: talleres.id, nombre: talleres.nombre })
    .from(talleres)
    .where(isNotNull(talleres.grupoAdmin));

  if (lista.length < 2) return null;

  const { tallerId } = await getTallerIdFromAuth();
  return { talleres: lista, activoId: tallerId };
}
