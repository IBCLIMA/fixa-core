"use server";

import { getDb } from "@/db";
import { ordenesTrabajo, vehiculos, clientes } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getTallerIdFromAuth } from "@/lib/auth";
import { explicarAlCliente } from "@/lib/ia";

/**
 * Genera un mensaje claro para el cliente a partir del diagnóstico técnico
 * guardado en la orden. Gateado al taller del usuario: solo puede explicar
 * órdenes que pertenecen a su taller.
 *
 * Lee el diagnóstico desde la BD (no se fía del cliente) para que siempre use
 * el último texto guardado por el mecánico.
 */
export async function explicarOrdenAlCliente(ordenId: string): Promise<string> {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const [orden] = await db
    .select()
    .from(ordenesTrabajo)
    .where(and(eq(ordenesTrabajo.id, ordenId), eq(ordenesTrabajo.tallerId, tallerId)));

  if (!orden) {
    throw new Error("Orden no encontrada.");
  }

  // El diagnóstico del mecánico es la fuente principal; si está vacío, usamos
  // lo que dijo el cliente como respaldo.
  const textoTecnico = (orden.diagnostico || orden.descripcionCliente || "").trim();
  if (!textoTecnico) {
    throw new Error(
      "Escribe primero el diagnóstico del mecánico para poder explicárselo al cliente."
    );
  }

  const [vehiculo] = await db.select().from(vehiculos).where(eq(vehiculos.id, orden.vehiculoId));
  const [cliente] = await db.select().from(clientes).where(eq(clientes.id, orden.clienteId));

  const vehiculoStr = vehiculo
    ? [vehiculo.marca, vehiculo.modelo].filter(Boolean).join(" ").trim() || undefined
    : undefined;
  const clienteStr = cliente?.nombre?.split(" ")[0] || undefined;

  return explicarAlCliente(textoTecnico, {
    vehiculo: vehiculoStr,
    cliente: clienteStr,
  });
}
