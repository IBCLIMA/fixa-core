"use server";

import { getDb } from "@/db";
import { clientes, vehiculos, ordenesTrabajo } from "@/db/schema";
import { eq, and, ilike, or, sql } from "drizzle-orm";
import { getTallerIdFromAuth } from "@/lib/auth";

export interface ResultadoBusqueda {
  tipo: "cliente" | "vehiculo" | "orden";
  id: string;
  titulo: string;
  subtitulo: string;
  href: string;
}

export async function busquedaGlobal(termino: string): Promise<ResultadoBusqueda[]> {
  if (!termino || termino.trim().length < 2) return [];

  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();
  const term = `%${termino.trim()}%`;
  const resultados: ResultadoBusqueda[] = [];

  // Buscar clientes
  const clientesRes = await db
    .select({ id: clientes.id, nombre: clientes.nombre, telefono: clientes.telefono })
    .from(clientes)
    .where(and(
      eq(clientes.tallerId, tallerId),
      or(ilike(clientes.nombre, term), ilike(clientes.telefono, term), ilike(clientes.email, term))
    ))
    .limit(5);

  for (const c of clientesRes) {
    resultados.push({
      tipo: "cliente",
      id: c.id,
      titulo: c.nombre,
      subtitulo: c.telefono || "Sin teléfono",
      href: `/clientes/${c.id}`,
    });
  }

  // Buscar vehículos por matrícula
  const vehiculosRes = await db
    .select({
      id: vehiculos.id,
      matricula: vehiculos.matricula,
      marca: vehiculos.marca,
      modelo: vehiculos.modelo,
      clienteId: vehiculos.clienteId,
      clienteNombre: clientes.nombre,
    })
    .from(vehiculos)
    .leftJoin(clientes, eq(vehiculos.clienteId, clientes.id))
    .where(and(
      eq(vehiculos.tallerId, tallerId),
      or(ilike(vehiculos.matricula, term), ilike(vehiculos.marca, term), ilike(vehiculos.modelo, term))
    ))
    .limit(5);

  for (const v of vehiculosRes) {
    resultados.push({
      tipo: "vehiculo",
      id: v.id,
      titulo: v.matricula,
      subtitulo: `${v.marca || ""} ${v.modelo || ""} · ${v.clienteNombre || ""}`.trim(),
      href: `/clientes/${v.clienteId}`,
    });
  }

  // Buscar órdenes por número — support "OR-123", "or-123", or plain "123"
  const orderNumMatch = termino.trim().match(/^(?:OR-?)?(\d+)$/i);
  if (orderNumMatch) {
    const num = parseInt(orderNumMatch[1]);
    const ordenesRes = await db
      .select({
        id: ordenesTrabajo.id,
        numero: ordenesTrabajo.numero,
        estado: ordenesTrabajo.estado,
        matricula: vehiculos.matricula,
        clienteNombre: clientes.nombre,
      })
      .from(ordenesTrabajo)
      .leftJoin(vehiculos, eq(ordenesTrabajo.vehiculoId, vehiculos.id))
      .leftJoin(clientes, eq(ordenesTrabajo.clienteId, clientes.id))
      .where(and(
        eq(ordenesTrabajo.tallerId, tallerId),
        eq(ordenesTrabajo.numero, num)
      ))
      .limit(5);

    for (const o of ordenesRes) {
      resultados.push({
        tipo: "orden",
        id: o.id,
        titulo: `OR-${o.numero}`,
        subtitulo: `${o.matricula || ""} · ${o.clienteNombre || ""}`,
        href: `/ordenes/${o.id}`,
      });
    }
  }

  // Also search orders by description if not a number-only search
  if (!orderNumMatch) {
    const ordenesDescRes = await db
      .select({
        id: ordenesTrabajo.id,
        numero: ordenesTrabajo.numero,
        estado: ordenesTrabajo.estado,
        matricula: vehiculos.matricula,
        clienteNombre: clientes.nombre,
      })
      .from(ordenesTrabajo)
      .leftJoin(vehiculos, eq(ordenesTrabajo.vehiculoId, vehiculos.id))
      .leftJoin(clientes, eq(ordenesTrabajo.clienteId, clientes.id))
      .where(and(
        eq(ordenesTrabajo.tallerId, tallerId),
        or(
          ilike(ordenesTrabajo.descripcionCliente, term),
          ilike(vehiculos.matricula, term),
          ilike(clientes.nombre, term),
          ilike(clientes.telefono, term)
        )
      ))
      .limit(5);

    for (const o of ordenesDescRes) {
      // Avoid duplicates if already found via client/vehicle search
      if (!resultados.some((r) => r.tipo === "orden" && r.id === o.id)) {
        resultados.push({
          tipo: "orden",
          id: o.id,
          titulo: `OR-${o.numero}`,
          subtitulo: `${o.matricula || ""} · ${o.clienteNombre || ""}`,
          href: `/ordenes/${o.id}`,
        });
      }
    }
  }

  return resultados;
}
