"use server";

import { getDb } from "@/db";
import { clientes, vehiculos, ordenesTrabajo } from "@/db/schema";
import { eq, and, ilike, or, desc } from "drizzle-orm";
import { getTallerIdFromAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { sanitize } from "@/lib/validation";

export async function getClientes(busqueda?: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  if (busqueda && busqueda.trim()) {
    const term = `%${busqueda.trim()}%`;
    return db.query.clientes.findMany({
      where: and(
        eq(clientes.tallerId, tallerId),
        or(
          ilike(clientes.nombre, term),
          ilike(clientes.telefono, term),
          ilike(clientes.email, term)
        )
      ),
      with: { vehiculos: true },
      orderBy: desc(clientes.createdAt),
    });
  }

  return db.query.clientes.findMany({
    where: eq(clientes.tallerId, tallerId),
    with: { vehiculos: true },
    orderBy: desc(clientes.createdAt),
  });
}

export async function getCliente(id: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  return db.query.clientes.findFirst({
    where: and(eq(clientes.id, id), eq(clientes.tallerId, tallerId)),
    with: {
      vehiculos: {
        with: {
          ordenes: {
            orderBy: desc(ordenesTrabajo.createdAt),
            limit: 10,
          },
        },
      },
    },
  });
}

export async function crearCliente(data: {
  nombre: string;
  telefono?: string;
  email?: string;
  nif?: string;
  direccion?: string;
  notas?: string;
}) {
  const { tallerId } = await getTallerIdFromAuth();
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
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const [cliente] = await db
    .update(clientes)
    .set(data)
    .where(and(eq(clientes.id, id), eq(clientes.tallerId, tallerId)))
    .returning();

  revalidatePath("/clientes");
  revalidatePath(`/clientes/${id}`);
  return cliente;
}

export async function eliminarCliente(id: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  await db
    .delete(clientes)
    .where(and(eq(clientes.id, id), eq(clientes.tallerId, tallerId)));

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
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  await db
    .delete(vehiculos)
    .where(and(eq(vehiculos.id, id), eq(vehiculos.tallerId, tallerId)));

  revalidatePath("/clientes");
}
