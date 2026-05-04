"use server";

import { getDb } from "@/db";
import { vehiculos, clientes, ordenesTrabajo } from "@/db/schema";
import { eq, and, ilike, desc } from "drizzle-orm";
import { getTallerIdFromAuth } from "@/lib/auth";

export async function buscarPorMatricula(matricula: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();
  const term = matricula.trim().toUpperCase().replace(/\s/g, "");

  const resultados = await db
    .select({
      vehiculoId: vehiculos.id,
      matricula: vehiculos.matricula,
      marca: vehiculos.marca,
      modelo: vehiculos.modelo,
      anio: vehiculos.anio,
      km: vehiculos.km,
      clienteId: clientes.id,
      clienteNombre: clientes.nombre,
      clienteTelefono: clientes.telefono,
    })
    .from(vehiculos)
    .leftJoin(clientes, eq(vehiculos.clienteId, clientes.id))
    .where(and(
      eq(vehiculos.tallerId, tallerId),
      ilike(vehiculos.matricula, `%${term}%`)
    ))
    .limit(5);

  return resultados;
}

export async function crearOrdenRapida(data: {
  vehiculoId: string;
  clienteId: string;
  kmEntrada?: number;
  descripcionCliente?: string;
}) {
  const { tallerId, usuarioId } = await getTallerIdFromAuth();
  const db = getDb();
  const { sql } = await import("drizzle-orm");

  const [result] = await db
    .select({ max: sql<number>`COALESCE(MAX(${ordenesTrabajo.numero}), 0)` })
    .from(ordenesTrabajo)
    .where(eq(ordenesTrabajo.tallerId, tallerId));

  const numero = (result?.max ?? 0) + 1;

  const [orden] = await db
    .insert(ordenesTrabajo)
    .values({
      tallerId,
      vehiculoId: data.vehiculoId,
      clienteId: data.clienteId,
      numero,
      estado: "recibido",
      kmEntrada: data.kmEntrada,
      descripcionCliente: data.descripcionCliente,
    })
    .returning();

  const { historialEstados } = await import("@/db/schema");
  await db.insert(historialEstados).values({
    ordenId: orden.id,
    estadoNuevo: "recibido",
    usuarioId,
  });

  const { revalidatePath } = await import("next/cache");
  revalidatePath("/ordenes");
  revalidatePath("/");

  return orden;
}
