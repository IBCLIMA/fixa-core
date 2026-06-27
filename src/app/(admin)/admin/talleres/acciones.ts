"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSuperAdmin } from "@/lib/auth";
import { registrarAdminAudit } from "@/lib/admin-audit";
import { getDb } from "@/db";
import { talleres } from "@/db/schema";
// Reutilizamos la acción existente que fija la cookie `taller_activo` que el
// sistema (getTallerIdFromAuth) ya respeta para super-admin.
import { setTallerActivo } from "@/app/(taller)/actions/taller-activo";

const PLANES = ["pendiente", "trial", "basico", "taller", "pro", "cancelado"] as const;
export type Plan = (typeof PLANES)[number];

async function requireSuperAdmin() {
  if (!(await getSuperAdmin())) throw new Error("No autorizado");
}

function revalidarTaller(tallerId: string) {
  revalidatePath(`/admin/talleres/${tallerId}`);
  revalidatePath("/admin/talleres");
  revalidatePath("/admin");
}

/** Cambia el plan del taller. Ajusta `suscripcionActiva` en consecuencia. */
export async function cambiarPlan(tallerId: string, plan: Plan) {
  await requireSuperAdmin();
  if (!PLANES.includes(plan)) throw new Error("Plan no válido");

  const db = getDb();

  // Plan anterior para dejar constancia en auditoría.
  const [antes] = await db
    .select({ plan: talleres.plan })
    .from(talleres)
    .where(eq(talleres.id, tallerId));

  const updateData: Record<string, unknown> = { plan };
  if (["basico", "taller", "pro"].includes(plan)) updateData.suscripcionActiva = true;
  if (plan === "cancelado") updateData.suscripcionActiva = false;

  await db.update(talleres).set(updateData).where(eq(talleres.id, tallerId));

  await registrarAdminAudit({
    accion: "cambiar_plan",
    tallerId,
    detalles: { planAntes: antes?.plan ?? null, planDespues: plan },
  });

  revalidarTaller(tallerId);
}

/** Activa o desactiva el taller (campo talleres.activo). */
export async function setActivo(tallerId: string, activo: boolean) {
  await requireSuperAdmin();
  const db = getDb();

  const [antes] = await db
    .select({ activo: talleres.activo })
    .from(talleres)
    .where(eq(talleres.id, tallerId));

  await db.update(talleres).set({ activo }).where(eq(talleres.id, tallerId));

  await registrarAdminAudit({
    accion: activo ? "activar" : "desactivar",
    tallerId,
    detalles: { activoAntes: antes?.activo ?? null, activoDespues: activo },
  });

  revalidarTaller(tallerId);
}

/**
 * Aprueba un registro pendiente: plan 'pendiente' → 'trial' con 14 días.
 * Deja constancia activando el taller también.
 */
export async function aprobarRegistro(tallerId: string) {
  await requireSuperAdmin();
  const db = getDb();

  const [t] = await db
    .select({ plan: talleres.plan })
    .from(talleres)
    .where(eq(talleres.id, tallerId));
  if (!t) throw new Error("Taller no encontrado");
  if (t.plan !== "pendiente") throw new Error("El taller no está pendiente de aprobación");

  const trialEnds = new Date();
  trialEnds.setDate(trialEnds.getDate() + 14);

  await db
    .update(talleres)
    .set({ plan: "trial", trialEndsAt: trialEnds, activo: true })
    .where(eq(talleres.id, tallerId));

  await registrarAdminAudit({
    accion: "aprobar",
    tallerId,
    detalles: { planAntes: "pendiente", planDespues: "trial", trialEndsAt: trialEnds.toISOString() },
  });

  revalidarTaller(tallerId);
}

/**
 * "Entrar como taller" (impersonar). Fija la cookie `taller_activo` vía la acción
 * existente y redirige a la app del taller.
 *
 * El sistema sólo respeta el override para talleres con `grupoAdmin` no nulo
 * (tanto getTallerIdFromAuth como setTallerActivo lo exigen), así que marcamos el
 * taller como impersonable si aún no lo está. Esto NO afecta a la app del taller
 * normal: el switcher (getSwitcherData) sólo se renderiza para super-admin.
 */
export async function entrarComoTaller(tallerId: string) {
  await requireSuperAdmin();
  const db = getDb();

  const [t] = await db
    .select({ grupoAdmin: talleres.grupoAdmin })
    .from(talleres)
    .where(eq(talleres.id, tallerId));
  if (!t) throw new Error("Taller no encontrado");

  if (!t.grupoAdmin) {
    await db.update(talleres).set({ grupoAdmin: "impersonado" }).where(eq(talleres.id, tallerId));
  }

  await setTallerActivo(tallerId);

  // IMPORTANTE: auditar ANTES del redirect (redirect lanza una excepción de control).
  await registrarAdminAudit({
    accion: "entrar_como",
    tallerId,
  });

  redirect("/");
}
