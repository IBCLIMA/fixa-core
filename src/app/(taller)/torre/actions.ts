"use server";

import { getDb } from "@/db";
import { alertasGestion } from "@/db/schema";
import { getTallerIdFromAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Gestiona una alerta de la Torre de Control: la marca como hecha (gestionada)
 * o la pospone hasta una fecha (por defecto, mañana). Solo guarda la GESTIÓN —
 * la alerta en sí se vuelve a derivar de los datos en cada carga. Gateada al
 * taller del usuario autenticado.
 */
export async function gestionarAlerta(input: {
  alertaKey: string;
  estado: "gestionada" | "pospuesta";
  pospuestaHasta?: string; // ISO; si falta y estado='pospuesta' → mañana 8:00
  accion?: string;
}) {
  const { tallerId, usuarioId } = await getTallerIdFromAuth();
  const db = getDb();

  if (!input.alertaKey || !["gestionada", "pospuesta"].includes(input.estado)) {
    throw new Error("Datos de gestión inválidos");
  }

  let pospuestaHasta: Date | null = null;
  if (input.estado === "pospuesta") {
    if (input.pospuestaHasta) {
      pospuestaHasta = new Date(input.pospuestaHasta);
    } else {
      const manana = new Date();
      manana.setDate(manana.getDate() + 1);
      manana.setHours(8, 0, 0, 0);
      pospuestaHasta = manana;
    }
  }

  await db.insert(alertasGestion).values({
    tallerId,
    alertaKey: input.alertaKey,
    estado: input.estado,
    pospuestaHasta,
    accion: input.accion ?? null,
    gestionadaPor: usuarioId ?? null,
  });

  revalidatePath("/");
}
