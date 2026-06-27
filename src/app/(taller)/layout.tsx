import { getUserRole, getSwitcherData, getSuperAdmin, getTallerIdFromAuth } from "@/lib/auth";
import { TallerNav } from "./taller-nav";
import { ImpersonacionBanner } from "./impersonacion-banner";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { getDb } from "@/db";
import { talleres, usuarios } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function TallerLayout({ children }: { children: React.ReactNode }) {
  let rol: "admin" | "mecanico" | "recepcion";
  try {
    rol = await getUserRole();
  } catch {
    redirect("/sign-in");
  }

  // Solo devuelve datos para super-admin; null para cualquier usuario normal.
  const switcher = await getSwitcherData();
  const esSuperAdmin = await getSuperAdmin();

  // ── Detección de impersonación ─────────────────────────────────────────────
  // Está "operando como" otro taller cuando:
  //   1) es super-admin,
  //   2) la cookie `taller_activo` está presente, y
  //   3) el taller activo (cookie) NO es su taller "de casa" (usuario.tallerId).
  // Resolvemos el nombre del taller activo para el banner.
  let impersonandoNombre: string | null = null;
  const tallerActivoId = (await cookies()).get("taller_activo")?.value;

  if (esSuperAdmin && tallerActivoId) {
    const { userId } = await auth();
    if (userId) {
      const db = getDb();
      const [usuario] = await db
        .select({ tallerId: usuarios.tallerId })
        .from(usuarios)
        .where(eq(usuarios.clerkUserId, userId));

      // Solo es impersonación si el taller activo difiere del taller "de casa".
      if (usuario && tallerActivoId !== usuario.tallerId) {
        const [activo] = await db
          .select({ nombre: talleres.nombre })
          .from(talleres)
          .where(eq(talleres.id, tallerActivoId));
        if (activo) impersonandoNombre = activo.nombre;
      }
    }
  }

  // ── ultimoAcceso real (DAU/WAU) ────────────────────────────────────────────
  // Marca actividad del taller ACTIVO en cada carga (fire-and-forget, barato).
  // IMPORTANTE: NO contar la visita del admin cuando está IMPERSONANDO — esa
  // actividad no es del taller. Solo se actualiza si NO hay impersonación.
  if (!impersonandoNombre) {
    try {
      const { tallerId } = await getTallerIdFromAuth();
      const db = getDb();
      // Sin await: no debe bloquear el render del layout.
      void db
        .update(talleres)
        .set({ ultimoAcceso: new Date() })
        .where(eq(talleres.id, tallerId))
        .catch(() => {});
    } catch {}
  }

  return (
    <>
      {impersonandoNombre && <ImpersonacionBanner tallerNombre={impersonandoNombre} />}
      <TallerNav rol={rol} switcher={switcher} esSuperAdmin={esSuperAdmin}>{children}</TallerNav>
    </>
  );
}
