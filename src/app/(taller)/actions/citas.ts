"use server";

import { getDb } from "@/db";
import { citas, talleres, ordenesTrabajo, diasBloqueados, clientes, vehiculos } from "@/db/schema";
import { eq, and, desc, gte, lte, count, sql, or, ilike, notInArray } from "drizzle-orm";
import { getTallerIdFromAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type EstadoCita = "programada" | "confirmada" | "completada" | "cancelada" | "no_presentado";

export async function getCitasDelDia(fecha?: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();
  const hoy = fecha || new Date().toISOString().split("T")[0];

  const citasList = await db.select().from(citas)
    .where(and(eq(citas.tallerId, tallerId), eq(citas.fecha, hoy)))
    .orderBy(citas.horaInicio);

  // Fetch related clients and vehicles
  const results = await Promise.all(citasList.map(async (c) => {
    const [cliente] = c.clienteId ? await db.select().from(clientes).where(eq(clientes.id, c.clienteId)) : [null];
    const [vehiculo] = c.vehiculoId ? await db.select().from(vehiculos).where(eq(vehiculos.id, c.vehiculoId)) : [null];
    return { ...c, cliente: cliente ?? null, vehiculo: vehiculo ?? null };
  }));

  return results;
}

export async function getCitasSemana(fechaInicio: string, fechaFin: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const citasList = await db.select().from(citas)
    .where(and(
      eq(citas.tallerId, tallerId),
      gte(citas.fecha, fechaInicio),
      lte(citas.fecha, fechaFin)
    ))
    .orderBy(citas.fecha, citas.horaInicio);

  // Fetch related clients and vehicles
  const results = await Promise.all(citasList.map(async (c) => {
    const [cliente] = c.clienteId ? await db.select().from(clientes).where(eq(clientes.id, c.clienteId)) : [null];
    const [vehiculo] = c.vehiculoId ? await db.select().from(vehiculos).where(eq(vehiculos.id, c.vehiculoId)) : [null];
    return { ...c, cliente: cliente ?? null, vehiculo: vehiculo ?? null };
  }));

  return results;
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

// ── Feature 1: Capacity data ──────────────────────────────────────────────

export async function getCapacidadTaller() {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const [taller] = await db
    .select({ capacidadDiaria: talleres.capacidadDiaria })
    .from(talleres)
    .where(eq(talleres.id, tallerId));

  return taller?.capacidadDiaria ?? 4;
}

export async function getOrdenesPorDiaSemana(fechaInicio: string, fechaFin: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const ordenes = await db
    .select({
      fechaEntrada: ordenesTrabajo.fechaEntrada,
      estado: ordenesTrabajo.estado,
    })
    .from(ordenesTrabajo)
    .where(
      and(
        eq(ordenesTrabajo.tallerId, tallerId),
        gte(ordenesTrabajo.fechaEntrada, new Date(fechaInicio + "T00:00:00")),
        lte(ordenesTrabajo.fechaEntrada, new Date(fechaFin + "T23:59:59")),
        notInArray(ordenesTrabajo.estado, ["entregado", "cancelado"])
      )
    );

  // Count per date
  const counts: Record<string, number> = {};
  for (const o of ordenes) {
    const dateStr = o.fechaEntrada.toISOString().split("T")[0];
    counts[dateStr] = (counts[dateStr] || 0) + 1;
  }
  return counts;
}

// ── Feature 2: "Ha llegado" → Create OR from appointment ──────────────────

export async function crearOrdenDesdeCita(citaId: string) {
  const { tallerId, usuarioId, clerkUserId } = await getTallerIdFromAuth();
  const db = getDb();

  // 1. Get cita data
  const [cita] = await db
    .select()
    .from(citas)
    .where(and(eq(citas.id, citaId), eq(citas.tallerId, tallerId)));

  if (!cita) throw new Error("Cita no encontrada");

  // 2. Search for existing client by phone or name
  let clienteId = cita.clienteId;
  let vehiculoId = cita.vehiculoId;

  if (!clienteId) {
    // Try to find by phone first, then by name
    const conditions = [];
    if (cita.telefonoCliente) {
      conditions.push(eq(clientes.telefono, cita.telefonoCliente));
    }
    conditions.push(ilike(clientes.nombre, cita.nombreCliente));

    const existingClients = await db
      .select({ id: clientes.id })
      .from(clientes)
      .where(
        and(
          eq(clientes.tallerId, tallerId),
          or(...conditions)
        )
      )
      .limit(1);

    if (existingClients.length > 0) {
      clienteId = existingClients[0].id;
    } else {
      // Create new client
      const [newCliente] = await db
        .insert(clientes)
        .values({
          tallerId,
          nombre: cita.nombreCliente,
          telefono: cita.telefonoCliente || null,
        })
        .returning();
      clienteId = newCliente.id;
    }
  }

  // 3. Find or create vehicle
  if (!vehiculoId && clienteId) {
    const existingVehicles = await db
      .select({ id: vehiculos.id })
      .from(vehiculos)
      .where(
        and(
          eq(vehiculos.tallerId, tallerId),
          eq(vehiculos.clienteId, clienteId)
        )
      )
      .limit(1);

    if (existingVehicles.length > 0) {
      vehiculoId = existingVehicles[0].id;
    } else {
      // Create placeholder vehicle
      const [newVehiculo] = await db
        .insert(vehiculos)
        .values({
          tallerId,
          clienteId: clienteId!,
          matricula: "PENDIENTE",
        })
        .returning();
      vehiculoId = newVehiculo.id;
    }
  }

  // 4. Create order
  const [maxResult] = await db
    .select({ max: sql<number>`COALESCE(MAX(${ordenesTrabajo.numero}), 0)` })
    .from(ordenesTrabajo)
    .where(eq(ordenesTrabajo.tallerId, tallerId));

  const numero = (maxResult?.max ?? 0) + 1;

  const [orden] = await db
    .insert(ordenesTrabajo)
    .values({
      tallerId,
      vehiculoId: vehiculoId!,
      clienteId: clienteId!,
      numero,
      estado: "recibido",
      descripcionCliente: cita.motivo || null,
      motivoDeposito: "reparacion",
      tokenPublico: require("crypto").randomBytes(16).toString("hex"),
    })
    .returning();

  // 5. Record state history
  const { historialEstados } = await import("@/db/schema");
  await db.insert(historialEstados).values({
    ordenId: orden.id,
    estadoNuevo: "recibido",
    usuarioId,
  });

  // 6. Mark cita as completed
  await db
    .update(citas)
    .set({ estado: "completada" })
    .where(and(eq(citas.id, citaId), eq(citas.tallerId, tallerId)));

  // 7. Audit log
  const { logAudit } = await import("@/lib/audit");
  logAudit({
    tallerId,
    userId: clerkUserId,
    action: "create",
    entityType: "orden",
    entityId: orden.id,
    details: { numero: orden.numero, desdeCita: citaId, vehiculoId: vehiculoId, clienteId: clienteId },
  });

  const { revalidatePath } = await import("next/cache");
  revalidatePath("/ordenes");
  revalidatePath("/calendario");
  revalidatePath("/");

  return orden;
}

// ── Feature 3: Delivery promises ──────────────────────────────────────────

export async function getEntregasSemana(fechaInicio: string, fechaFin: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const entregas = await db
    .select({
      id: ordenesTrabajo.id,
      numero: ordenesTrabajo.numero,
      estado: ordenesTrabajo.estado,
      fechaEstimada: ordenesTrabajo.fechaEstimada,
      descripcionCliente: ordenesTrabajo.descripcionCliente,
      clienteNombre: clientes.nombre,
      vehiculoMatricula: vehiculos.matricula,
    })
    .from(ordenesTrabajo)
    .leftJoin(clientes, eq(ordenesTrabajo.clienteId, clientes.id))
    .leftJoin(vehiculos, eq(ordenesTrabajo.vehiculoId, vehiculos.id))
    .where(
      and(
        eq(ordenesTrabajo.tallerId, tallerId),
        gte(ordenesTrabajo.fechaEstimada, new Date(fechaInicio + "T00:00:00")),
        lte(ordenesTrabajo.fechaEstimada, new Date(fechaFin + "T23:59:59")),
        notInArray(ordenesTrabajo.estado, ["entregado", "cancelado"])
      )
    );

  return entregas.map((e) => ({
    ...e,
    fechaEstimadaStr: e.fechaEstimada ? e.fechaEstimada.toISOString().split("T")[0] : null,
  }));
}

// ── Feature 4: Block days ─────────────────────────────────────────────────

export async function bloquearDia(fecha: string, motivo?: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const [dia] = await db
    .insert(diasBloqueados)
    .values({ tallerId, fecha, motivo: motivo || null })
    .returning();

  revalidatePath("/calendario");
  return dia;
}

export async function desbloquearDia(diaId: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  await db
    .delete(diasBloqueados)
    .where(and(eq(diasBloqueados.id, diaId), eq(diasBloqueados.tallerId, tallerId)));

  revalidatePath("/calendario");
}

export async function getDiasBloqueadosSemana(fechaInicio: string, fechaFin: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  return db
    .select()
    .from(diasBloqueados)
    .where(
      and(
        eq(diasBloqueados.tallerId, tallerId),
        gte(diasBloqueados.fecha, fechaInicio),
        lte(diasBloqueados.fecha, fechaFin)
      )
    );
}
