"use server";

import { getDb } from "@/db";
import { ordenesTrabajo } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getTallerIdFromAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function verificarOrden(ordenId: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();
  const [orden] = await db
    .select({ id: ordenesTrabajo.id })
    .from(ordenesTrabajo)
    .where(and(eq(ordenesTrabajo.id, ordenId), eq(ordenesTrabajo.tallerId, tallerId)));
  if (!orden) throw new Error("Orden no encontrada");
  return { db, tallerId };
}

export async function actualizarDatosLegales(
  ordenId: string,
  data: {
    tipoIntervencion?: string[];
    motivoDeposito?: string;
    fechaEstimada?: string | null;
    observacionesEntrada?: string;
    renunciaPresupuesto?: boolean;
    renunciaPiezas?: boolean;
  }
) {
  const { db } = await verificarOrden(ordenId);

  await db
    .update(ordenesTrabajo)
    .set({
      tipoIntervencion: data.tipoIntervencion,
      motivoDeposito: data.motivoDeposito,
      fechaEstimada: data.fechaEstimada ? new Date(data.fechaEstimada) : null,
      observacionesEntrada: data.observacionesEntrada,
      renunciaPresupuesto: data.renunciaPresupuesto,
      renunciaPiezas: data.renunciaPiezas,
    })
    .where(eq(ordenesTrabajo.id, ordenId));

  revalidatePath(`/ordenes/${ordenId}`);
}

export async function actualizarDatosSeguro(
  ordenId: string,
  data: {
    aseguradora?: string;
    numPoliza?: string;
    numSiniestro?: string;
    numPeritaje?: string;
    nombrePerito?: string;
  }
) {
  const { db } = await verificarOrden(ordenId);

  await db
    .update(ordenesTrabajo)
    .set({
      aseguradora: data.aseguradora,
      numPoliza: data.numPoliza,
      numSiniestro: data.numSiniestro,
      numPeritaje: data.numPeritaje,
      nombrePerito: data.nombrePerito,
    })
    .where(eq(ordenesTrabajo.id, ordenId));

  revalidatePath(`/ordenes/${ordenId}`);
}
