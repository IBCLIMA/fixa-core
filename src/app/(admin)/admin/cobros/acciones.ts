"use server";

import { getDb } from "@/db";
import { talleres } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSuperAdmin } from "@/lib/auth";
import { registrarAdminAudit } from "@/lib/admin-audit";

export type EstadoCobro = "al_corriente" | "impagado" | "pendiente";

const ESTADOS_VALIDOS: EstadoCobro[] = ["al_corriente", "impagado", "pendiente"];

/**
 * Marca a mano el estado de cobro de un taller (cobro SEPA manual desde Ibañez
 * Clima, sin pasarela). Solo super-admin. Registra auditoría inmutable.
 */
export async function setEstadoCobro(
  tallerId: string,
  estado: EstadoCobro,
  nota?: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await getSuperAdmin())) {
    return { ok: false, error: "No autorizado" };
  }

  if (!tallerId || !ESTADOS_VALIDOS.includes(estado)) {
    return { ok: false, error: "Datos inválidos" };
  }

  const db = getDb();

  const notaLimpia = typeof nota === "string" ? nota.trim() : undefined;

  await db
    .update(talleres)
    .set({
      estadoCobro: estado,
      // Solo tocamos la nota si llega definida (string). undefined la deja igual.
      ...(notaLimpia !== undefined ? { notaCobro: notaLimpia || null } : {}),
    })
    .where(eq(talleres.id, tallerId));

  await registrarAdminAudit({
    accion: "estado_cobro",
    tallerId,
    detalles: { estado, nota: notaLimpia },
  });

  revalidatePath("/admin/cobros");

  return { ok: true };
}
