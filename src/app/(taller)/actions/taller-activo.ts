"use server";

import { cookies } from "next/headers";
import { getSuperAdmin } from "@/lib/auth";
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
