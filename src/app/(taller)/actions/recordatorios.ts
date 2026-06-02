"use server";

import { getDb } from "@/db";
import { recordatoriosMantenimiento, vehiculos, clientes } from "@/db/schema";
import { eq, and, or, lte, sql } from "drizzle-orm";
import { getTallerIdFromAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function crearRecordatorio(data: {
  vehiculoId: string;
  tipo: string;
  kmIntervalo?: number;
  mesesIntervalo?: number;
  ultimoKm?: number;
  ultimaFecha?: string;
}) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  // Calculate next due date/km
  let proximoKm: number | undefined;
  let proximaFecha: string | undefined;

  if (data.kmIntervalo && data.ultimoKm) {
    proximoKm = data.ultimoKm + data.kmIntervalo;
  }

  if (data.mesesIntervalo) {
    const base = data.ultimaFecha ? new Date(data.ultimaFecha) : new Date();
    base.setMonth(base.getMonth() + data.mesesIntervalo);
    proximaFecha = base.toISOString().split("T")[0];
  }

  const [recordatorio] = await db
    .insert(recordatoriosMantenimiento)
    .values({
      tallerId,
      vehiculoId: data.vehiculoId,
      tipo: data.tipo,
      kmIntervalo: data.kmIntervalo,
      mesesIntervalo: data.mesesIntervalo,
      ultimoKm: data.ultimoKm,
      ultimaFecha: data.ultimaFecha,
      proximoKm,
      proximaFecha,
    })
    .returning();

  revalidatePath("/clientes");
  revalidatePath("/avisos");
  return recordatorio;
}

export async function getRecordatoriosVehiculo(vehiculoId: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  return db
    .select()
    .from(recordatoriosMantenimiento)
    .where(
      and(
        eq(recordatoriosMantenimiento.tallerId, tallerId),
        eq(recordatoriosMantenimiento.vehiculoId, vehiculoId),
        eq(recordatoriosMantenimiento.activo, true)
      )
    );
}

export async function getRecordatoriosPendientes() {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();
  const hoy = new Date().toISOString().split("T")[0];

  return db
    .select({
      id: recordatoriosMantenimiento.id,
      tipo: recordatoriosMantenimiento.tipo,
      proximoKm: recordatoriosMantenimiento.proximoKm,
      proximaFecha: recordatoriosMantenimiento.proximaFecha,
      vehiculoId: recordatoriosMantenimiento.vehiculoId,
      matricula: vehiculos.matricula,
      marca: vehiculos.marca,
      modelo: vehiculos.modelo,
      kmActual: vehiculos.km,
      clienteNombre: clientes.nombre,
      clienteTelefono: clientes.telefono,
      clienteId: clientes.id,
    })
    .from(recordatoriosMantenimiento)
    .leftJoin(vehiculos, eq(recordatoriosMantenimiento.vehiculoId, vehiculos.id))
    .leftJoin(clientes, eq(vehiculos.clienteId, clientes.id))
    .where(
      and(
        eq(recordatoriosMantenimiento.tallerId, tallerId),
        eq(recordatoriosMantenimiento.activo, true),
        or(
          lte(recordatoriosMantenimiento.proximaFecha, hoy),
          sql`${vehiculos.km} >= ${recordatoriosMantenimiento.proximoKm}`
        )
      )
    );
}

export async function completarRecordatorio(id: string, kmActual?: number) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const [rec] = await db
    .select()
    .from(recordatoriosMantenimiento)
    .where(
      and(
        eq(recordatoriosMantenimiento.id, id),
        eq(recordatoriosMantenimiento.tallerId, tallerId)
      )
    )
    .limit(1);

  if (!rec) throw new Error("Recordatorio no encontrado");

  const hoy = new Date().toISOString().split("T")[0];
  let proximoKm: number | undefined;
  let proximaFecha: string | undefined;

  if (rec.kmIntervalo && kmActual) {
    proximoKm = kmActual + rec.kmIntervalo;
  }

  if (rec.mesesIntervalo) {
    const next = new Date();
    next.setMonth(next.getMonth() + rec.mesesIntervalo);
    proximaFecha = next.toISOString().split("T")[0];
  }

  // Update vehicle km if provided
  if (kmActual) {
    await db
      .update(vehiculos)
      .set({ km: kmActual })
      .where(eq(vehiculos.id, rec.vehiculoId));
  }

  const [updated] = await db
    .update(recordatoriosMantenimiento)
    .set({
      ultimoKm: kmActual || rec.ultimoKm,
      ultimaFecha: hoy,
      proximoKm,
      proximaFecha,
    })
    .where(
      and(
        eq(recordatoriosMantenimiento.id, id),
        eq(recordatoriosMantenimiento.tallerId, tallerId)
      )
    )
    .returning();

  revalidatePath("/clientes");
  revalidatePath("/avisos");
  return updated;
}

export async function eliminarRecordatorio(id: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  await db
    .update(recordatoriosMantenimiento)
    .set({ activo: false })
    .where(
      and(
        eq(recordatoriosMantenimiento.id, id),
        eq(recordatoriosMantenimiento.tallerId, tallerId)
      )
    );

  revalidatePath("/clientes");
  revalidatePath("/avisos");
}
