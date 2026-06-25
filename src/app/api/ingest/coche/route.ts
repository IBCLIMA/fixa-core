import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { clientes, vehiculos, ordenesTrabajo, lineasOrden } from "@/db/schema";
import { and, eq } from "drizzle-orm";

/**
 * INGESTA TIEMPO REAL — Ibañez Clima (integración de testeo).
 *
 * El Taller Manager llama a este endpoint cuando se crea/actualiza un coche en
 * el departamento "Coches/Aire", para que aparezca en FIXA sin teclear dos veces.
 *
 * Auth: cabecera `Authorization: Bearer <IBCLIMA_INGEST_SECRET>`.
 * Idempotente: identifica por origen_externo='ibclima' + origen_externo_id=<id de la entrada>.
 *
 * NOTA: integración específica de un cliente (testeo del dogfooding), no producto core.
 */

const ORIG = "ibclima";
const ESTADO: Record<string, string> = {
  recibida: "recibido",
  presupuestado: "presupuestado",
  en_produccion: "en_reparacion",
  finalizado: "entregado",
  recogida_pendiente: "listo",
};

const norm = (s?: string | null) => (s || "").replace(/\s+/g, " ").trim().toLowerCase();
const title = (s?: string | null) =>
  (s || "").replace(/\s+/g, " ").trim().replace(/\b\w/g, (c) => c.toUpperCase());
function splitVeh(v?: string | null): [string | null, string | null] {
  const t = (v || "").trim();
  if (!t) return [null, null];
  const p = t.split(" ");
  return [title(p[0]), p.slice(1).join(" ") || null];
}

export async function POST(request: Request) {
  const auth = request.headers.get("authorization");
  if (!process.env.IBCLIMA_INGEST_SECRET || auth !== `Bearer ${process.env.IBCLIMA_INGEST_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const tallerId = process.env.IBCLIMA_COCHES_TALLER_ID || "b66c384d-cac0-4266-b3fe-80a77d0d8be4";

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const e = body as {
    id?: number | string;
    cliente?: string; telefono?: string;
    matricula?: string; vehiculo?: string; kms?: number;
    fallo_declarado?: string; descripcion_trabajo?: string; observaciones?: string;
    pipeline_estado?: string; fecha_entrada?: string; fecha_salida?: string;
    trabajos?: { codigo_trabajo?: string; horas_reales?: number; precio?: number }[];
    recambios?: { referencia?: string; descripcion?: string; unidades?: number; precio_unitario?: number; descuento_pct?: number }[];
  };

  if (e.id == null) return NextResponse.json({ error: "falta id" }, { status: 400 });
  const mat = (e.matricula || "").toUpperCase().replace(/\s/g, "");
  if (!mat) return NextResponse.json({ error: "falta matricula (FIXA requiere vehículo)" }, { status: 422 });

  const db = getDb();
  const origenId = String(e.id);
  const cliKey = norm(e.cliente) || `veh:${mat}`;

  // 1) Cliente (upsert por origen)
  let [cli] = await db.select({ id: clientes.id }).from(clientes)
    .where(and(eq(clientes.tallerId, tallerId), eq(clientes.origenExterno, ORIG), eq(clientes.origenExternoId, cliKey)));
  if (!cli) {
    [cli] = await db.insert(clientes).values({
      tallerId, nombre: title(e.cliente) || `Cliente ${mat}`, telefono: e.telefono || null,
      origenExterno: ORIG, origenExternoId: cliKey,
    }).returning({ id: clientes.id });
  }

  // 2) Vehículo (upsert por matrícula/origen)
  const [marca, modelo] = splitVeh(e.vehiculo);
  let [veh] = await db.select({ id: vehiculos.id }).from(vehiculos)
    .where(and(eq(vehiculos.tallerId, tallerId), eq(vehiculos.origenExterno, ORIG), eq(vehiculos.origenExternoId, mat)));
  if (!veh) {
    [veh] = await db.insert(vehiculos).values({
      tallerId, clienteId: cli.id, matricula: mat, marca, modelo, km: e.kms ?? null,
      origenExterno: ORIG, origenExternoId: mat,
    }).returning({ id: vehiculos.id });
  } else if (e.kms != null) {
    await db.update(vehiculos).set({ km: e.kms }).where(eq(vehiculos.id, veh.id));
  }

  // 3) Orden (upsert por origen)
  const estado = (ESTADO[e.pipeline_estado || ""] || "recibido") as typeof ordenesTrabajo.$inferInsert.estado;
  const descripcionCliente = e.fallo_declarado || e.descripcion_trabajo || e.observaciones || null;
  const [existente] = await db.select({ id: ordenesTrabajo.id }).from(ordenesTrabajo)
    .where(and(eq(ordenesTrabajo.tallerId, tallerId), eq(ordenesTrabajo.origenExterno, ORIG), eq(ordenesTrabajo.origenExternoId, origenId)));

  let ordenId: string;
  if (existente) {
    ordenId = existente.id;
    await db.update(ordenesTrabajo).set({
      estado, descripcionCliente, kmEntrada: e.kms ?? null,
      fechaEntrega: e.fecha_salida ? new Date(e.fecha_salida) : null, updatedAt: new Date(),
    }).where(eq(ordenesTrabajo.id, ordenId));
    await db.delete(lineasOrden).where(eq(lineasOrden.ordenId, ordenId));
  } else {
    [{ id: ordenId }] = await db.insert(ordenesTrabajo).values({
      tallerId, vehiculoId: veh.id, clienteId: cli.id, numero: Number(e.id) || Math.floor(Date.now() / 1000),
      estado, descripcionCliente, kmEntrada: e.kms ?? null,
      fechaEntrada: e.fecha_entrada ? new Date(e.fecha_entrada) : new Date(),
      fechaEntrega: e.fecha_salida ? new Date(e.fecha_salida) : null,
      origenExterno: ORIG, origenExternoId: origenId,
    }).returning({ id: ordenesTrabajo.id });
  }

  // 4) Líneas (mano de obra + recambios)
  const lineas: (typeof lineasOrden.$inferInsert)[] = [];
  for (const t of e.trabajos || [])
    lineas.push({ ordenId, tipo: "mano_obra", descripcion: t.codigo_trabajo || "Mano de obra", cantidad: String(t.horas_reales ?? 1), precioUnitario: String(t.precio ?? 0) });
  for (const r of e.recambios || [])
    lineas.push({ ordenId, tipo: "recambio", descripcion: r.descripcion || "Recambio", referencia: r.referencia || null, cantidad: String(r.unidades ?? 1), precioUnitario: String(r.precio_unitario ?? 0), descuentoPct: String(r.descuento_pct ?? 0) });
  if (lineas.length) await db.insert(lineasOrden).values(lineas);

  return NextResponse.json({ ok: true, ordenId, accion: existente ? "actualizado" : "creado" });
}
