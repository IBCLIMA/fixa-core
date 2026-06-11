"use server";

import { getDb } from "@/db";
import { clientes, vehiculos, ordenesTrabajo } from "@/db/schema";
import { eq, and, ilike, or, desc, sql } from "drizzle-orm";
import { getTallerIdFromAuth, requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { sanitize } from "@/lib/validation";
import { logAudit } from "@/lib/audit";

export async function getClientes(busqueda?: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const conditions = [eq(clientes.tallerId, tallerId)];
  if (busqueda && busqueda.trim()) {
    const term = `%${busqueda.trim()}%`;
    conditions.push(
      or(
        ilike(clientes.nombre, term),
        ilike(clientes.telefono, term),
        ilike(clientes.email, term)
      )!
    );
  }

  const clientesList = await db.select().from(clientes)
    .where(and(...conditions))
    .orderBy(desc(clientes.createdAt));

  // Batch-fetch vehicles for all clients (1 query, not 1 per client)
  if (clientesList.length === 0) return [];
  const { inArray } = await import("drizzle-orm");
  const vehiculosList = await db.select().from(vehiculos)
    .where(inArray(vehiculos.clienteId, clientesList.map((c) => c.id)));

  const vehiculosPorCliente = new Map<string, (typeof vehiculosList)[number][]>();
  for (const v of vehiculosList) {
    if (!v.clienteId) continue;
    const arr = vehiculosPorCliente.get(v.clienteId) ?? [];
    arr.push(v);
    vehiculosPorCliente.set(v.clienteId, arr);
  }

  return clientesList.map((c) => ({ ...c, vehiculos: vehiculosPorCliente.get(c.id) ?? [] }));
}

export async function getCliente(id: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const [cliente] = await db.select().from(clientes).where(and(eq(clientes.id, id), eq(clientes.tallerId, tallerId)));
  if (!cliente) return undefined;

  const vehs = await db.select().from(vehiculos).where(eq(vehiculos.clienteId, cliente.id));

  const vehiculosConOrdenes = await Promise.all(vehs.map(async (v) => {
    const ordenes = await db.select().from(ordenesTrabajo)
      .where(eq(ordenesTrabajo.vehiculoId, v.id))
      .orderBy(desc(ordenesTrabajo.createdAt))
      .limit(10);
    return { ...v, ordenes };
  }));

  return { ...cliente, vehiculos: vehiculosConOrdenes };
}

/** Guarda la fecha de caducidad de la ITV (capturada de la pegatina/tarjeta ITV). */
export async function actualizarFechaItv(vehiculoId: string, fechaItv: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaItv)) throw new Error("Fecha no válida");

  await db
    .update(vehiculos)
    .set({ fechaItv })
    .where(and(eq(vehiculos.id, vehiculoId), eq(vehiculos.tallerId, tallerId)));

  revalidatePath("/avisos");
  revalidatePath("/ordenes");
}

export async function crearCliente(data: {
  nombre: string;
  telefono?: string;
  email?: string;
  nif?: string;
  direccion?: string;
  notas?: string;
}) {
  const { tallerId, clerkUserId } = await requireRole(["admin", "recepcion"]);
  const db = getDb();

  // Sanitizar inputs
  const cleanData = {
    nombre: sanitize(data.nombre),
    telefono: data.telefono ? sanitize(data.telefono) : undefined,
    email: data.email ? sanitize(data.email) : undefined,
    nif: data.nif ? sanitize(data.nif) : undefined,
    direccion: data.direccion ? sanitize(data.direccion) : undefined,
    notas: data.notas ? sanitize(data.notas) : undefined,
  };

  if (!cleanData.nombre) throw new Error("El nombre es obligatorio");

  const [cliente] = await db
    .insert(clientes)
    .values({ ...cleanData, tallerId })
    .returning();

  logAudit({
    tallerId,
    userId: clerkUserId,
    action: "create",
    entityType: "cliente",
    entityId: cliente.id,
    details: { nombre: cleanData.nombre },
  });

  revalidatePath("/clientes");
  revalidatePath("/");
  return cliente;
}

export async function actualizarCliente(
  id: string,
  data: {
    nombre?: string;
    telefono?: string;
    email?: string;
    nif?: string;
    direccion?: string;
    notas?: string;
  }
) {
  const { tallerId, clerkUserId } = await requireRole(["admin", "recepcion"]);
  const db = getDb();

  // Sanitizar inputs
  const cleanData: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(data)) {
    cleanData[key] = value ? sanitize(value) : undefined;
  }

  const [cliente] = await db
    .update(clientes)
    .set(cleanData)
    .where(and(eq(clientes.id, id), eq(clientes.tallerId, tallerId)))
    .returning();

  logAudit({
    tallerId,
    userId: clerkUserId,
    action: "update",
    entityType: "cliente",
    entityId: id,
    details: { camposModificados: Object.keys(cleanData) },
  });

  revalidatePath("/clientes");
  revalidatePath(`/clientes/${id}`);
  return cliente;
}

export async function eliminarCliente(id: string) {
  const { tallerId, clerkUserId } = await requireRole(["admin"]);
  const db = getDb();

  // Check if client has orders - if so, block deletion
  const [ordenesCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(ordenesTrabajo)
    .where(and(eq(ordenesTrabajo.clienteId, id), eq(ordenesTrabajo.tallerId, tallerId)));

  if (Number(ordenesCount.count) > 0) {
    throw new Error("No se puede eliminar un cliente con órdenes de trabajo");
  }

  // Delete vehicles first (safe since no orders reference them)
  await db
    .delete(vehiculos)
    .where(and(eq(vehiculos.clienteId, id), eq(vehiculos.tallerId, tallerId)));

  await db
    .delete(clientes)
    .where(and(eq(clientes.id, id), eq(clientes.tallerId, tallerId)));

  logAudit({
    tallerId,
    userId: clerkUserId,
    action: "delete",
    entityType: "cliente",
    entityId: id,
  });

  revalidatePath("/clientes");
  revalidatePath("/");
}

// ─── Vehículos ───

export async function crearVehiculo(data: {
  clienteId: string;
  matricula: string;
  marca?: string;
  modelo?: string;
  anio?: number;
  km?: number;
  vin?: string;
  combustible?: "gasolina" | "diesel" | "electrico" | "hibrido" | "glp";
  color?: string;
  fechaItv?: string;
  notas?: string;
}) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const [vehiculo] = await db
    .insert(vehiculos)
    .values({ ...data, tallerId })
    .returning();

  revalidatePath("/clientes");
  revalidatePath(`/clientes/${data.clienteId}`);
  return vehiculo;
}

export async function actualizarVehiculo(
  id: string,
  data: {
    matricula?: string;
    marca?: string;
    modelo?: string;
    anio?: number;
    km?: number;
    vin?: string;
    combustible?: "gasolina" | "diesel" | "electrico" | "hibrido" | "glp";
    color?: string;
    fechaItv?: string;
    notas?: string;
  }
) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const [vehiculo] = await db
    .update(vehiculos)
    .set(data)
    .where(and(eq(vehiculos.id, id), eq(vehiculos.tallerId, tallerId)))
    .returning();

  revalidatePath("/clientes");
  return vehiculo;
}

export async function eliminarVehiculo(id: string) {
  const { tallerId } = await requireRole(["admin"]);
  const db = getDb();

  // Check if vehicle has orders - if so, block deletion
  const [ordenesCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(ordenesTrabajo)
    .where(and(eq(ordenesTrabajo.vehiculoId, id), eq(ordenesTrabajo.tallerId, tallerId)));

  if (Number(ordenesCount.count) > 0) {
    throw new Error("No se puede eliminar un vehículo con órdenes de trabajo");
  }

  await db
    .delete(vehiculos)
    .where(and(eq(vehiculos.id, id), eq(vehiculos.tallerId, tallerId)));

  revalidatePath("/clientes");
}
