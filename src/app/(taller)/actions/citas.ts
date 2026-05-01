"use server";

import { getDb } from "@/db";
import { citas } from "@/db/schema";
import { eq, and, desc, gte, lte, count } from "drizzle-orm";
import { getTallerIdFromAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type EstadoCita = "programada" | "confirmada" | "completada" | "cancelada" | "no_presentado";

export async function getCitasDelDia(fecha?: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();
  const hoy = fecha || new Date().toISOString().split("T")[0];

  return db.query.citas.findMany({
    where: and(eq(citas.tallerId, tallerId), eq(citas.fecha, hoy)),
    with: { cliente: true, vehiculo: true },
    orderBy: [citas.horaInicio],
  });
}

export async function getCitasSemana(fechaInicio: string, fechaFin: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  return db.query.citas.findMany({
    where: and(
      eq(citas.tallerId, tallerId),
      gte(citas.fecha, fechaInicio),
      lte(citas.fecha, fechaFin)
    ),
    with: { cliente: true, vehiculo: true },
    orderBy: [citas.fecha, citas.horaInicio],
  });
}

export async function contarCitasHoy() {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();
  const hoy = new Date().toISOString().split("T")[0];

  const result = await db
    .select({ count: count() })
    .from(citas)
    .where(and(eq(citas.tallerId, tallerId), eq(citas.fecha, hoy)));

  return result[0]?.count ?? 0;
}

export async function crearCita(data: {
  clienteId?: string;
  vehiculoId?: string;
  nombreCliente: string;
  telefonoCliente?: string;
  fecha: string;
  horaInicio?: string;
  horaFin?: string;
  motivo?: string;
  notas?: string;
}) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const [cita] = await db
    .insert(citas)
    .values({ ...data, tallerId })
    .returning();

  revalidatePath("/calendario");
  revalidatePath("/");
  return cita;
}

export async function actualizarCita(
  id: string,
  data: {
    nombreCliente?: string;
    telefonoCliente?: string;
    fecha?: string;
    horaInicio?: string;
    horaFin?: string;
    motivo?: string;
    estado?: EstadoCita;
    notas?: string;
  }
) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const [cita] = await db
    .update(citas)
    .set(data)
    .where(and(eq(citas.id, id), eq(citas.tallerId, tallerId)))
    .returning();

  revalidatePath("/calendario");
  revalidatePath("/");
  return cita;
}

export async function eliminarCita(id: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  await db
    .delete(citas)
    .where(and(eq(citas.id, id), eq(citas.tallerId, tallerId)));

  revalidatePath("/calendario");
  revalidatePath("/");
}
