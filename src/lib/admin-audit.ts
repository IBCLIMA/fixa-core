import { getDb } from "@/db";
import { adminAudit, talleres } from "@/db/schema";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

/**
 * Registro INMUTABLE de una acción de super-admin (impersonar, cambiar plan, cobro…).
 * Llamar desde las server actions del admin. Nunca lanza (no debe romper la acción).
 */
export async function registrarAdminAudit(input: {
  accion: string;
  tallerId?: string;
  tallerNombre?: string;
  detalles?: Record<string, unknown>;
}) {
  try {
    let adminEmail = "desconocido";
    const { userId } = await auth();
    if (userId) {
      try {
        const client = await clerkClient();
        const u = await client.users.getUser(userId);
        adminEmail = u.emailAddresses[0]?.emailAddress ?? userId;
      } catch {
        adminEmail = userId;
      }
    }

    const db = getDb();
    let tallerNombre = input.tallerNombre;
    if (!tallerNombre && input.tallerId) {
      const [t] = await db
        .select({ nombre: talleres.nombre })
        .from(talleres)
        .where(eq(talleres.id, input.tallerId));
      tallerNombre = t?.nombre ?? undefined;
    }

    await db.insert(adminAudit).values({
      adminEmail,
      accion: input.accion,
      tallerId: input.tallerId ?? null,
      tallerNombre: tallerNombre ?? null,
      detalles: input.detalles ?? null,
    });
  } catch (e) {
    // Nunca romper la acción por un fallo de auditoría.
    console.error("admin-audit error", e);
  }
}
