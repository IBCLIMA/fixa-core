"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSuperAdmin } from "@/lib/auth";
import { registrarAdminAudit } from "@/lib/admin-audit";
import { getDb } from "@/db";
import { talleres } from "@/db/schema";
import { eq, and, isNotNull } from "drizzle-orm";

/**
 * Fija el taller activo para el super-admin (switcher de talleres).
 * Solo lo puede usar un super-admin, y solo a talleres de su grupo (grupoAdmin).
 * Para cualquier otro usuario lanza error: la feature no existe en la app general.
 */
export async function setTallerActivo(tallerId: string) {
  if (!(await getSuperAdmin())) throw new Error("No autorizado");

  const db = getDb();
  const [t] = await db
    .select({ id: talleres.id })
    .from(talleres)
    .where(and(eq(talleres.id, tallerId), isNotNull(talleres.grupoAdmin)));
  if (!t) throw new Error("Taller no válido");

  const cookieStore = await cookies();
  cookieStore.set("taller_activo", tallerId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

/**
 * Sale de la impersonación: borra la cookie `taller_activo` y vuelve al panel de
 * admin. Solo tiene sentido para super-admin, pero borrar la cookie es inocuo para
 * cualquier usuario (en la app general la cookie nunca está presente).
 */
export async function salirImpersonacion() {
  const esSuperAdmin = await getSuperAdmin();
  const cookieStore = await cookies();
  const tallerId = cookieStore.get("taller_activo")?.value;

  cookieStore.delete("taller_activo");

  if (esSuperAdmin && tallerId) {
    await registrarAdminAudit({ accion: "salir_como", tallerId });
  }

  redirect("/admin/talleres");
}
