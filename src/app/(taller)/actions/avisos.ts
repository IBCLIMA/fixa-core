"use server";

import { getDb } from "@/db";
import { avisos, vehiculos, clientes } from "@/db/schema";
import { eq, and, desc, lte, sql } from "drizzle-orm";
import { getTallerIdFromAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type TipoAviso = "itv" | "revision_km" | "aceite" | "neumaticos" | "frenos" | "personalizado";

export async function getAvisos() {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  return db
    .select({
      id: avisos.id,
      tipo: avisos.tipo,
      descripcion: avisos.descripcion,
      fechaAviso: avisos.fechaAviso,
      kmAviso: avisos.kmAviso,
      enviado: avisos.enviado,
      fechaEnvio: avisos.fechaEnvio,
      vehiculoId: avisos.vehiculoId,
      matricula: vehiculos.matricula,
      marca: vehiculos.marca,
      modelo: vehiculos.modelo,
      clienteNombre: clientes.nombre,
      clienteTelefono: clientes.telefono,
      clienteId: clientes.id,
    })
    .from(avisos)
    .leftJoin(vehiculos, eq(avisos.vehiculoId, vehiculos.id))
    .leftJoin(clientes, eq(vehiculos.clienteId, clientes.id))
    .where(eq(avisos.tallerId, tallerId))
    .orderBy(desc(avisos.createdAt));
}

export async function getAvisosPendientes() {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();
  const hoy = new Date().toISOString().split("T")[0];

  return db
    .select({
      id: avisos.id,
      tipo: avisos.tipo,
      descripcion: avisos.descripcion,
      fechaAviso: avisos.fechaAviso,
      matricula: vehiculos.matricula,
      clienteNombre: clientes.nombre,
      clienteTelefono: clientes.telefono,
    })
    .from(avisos)
    .leftJoin(vehiculos, eq(avisos.vehiculoId, vehiculos.id))
    .leftJoin(clientes, eq(vehiculos.clienteId, clientes.id))
    .where(and(
      eq(avisos.tallerId, tallerId),
      eq(avisos.enviado, false),
      lte(avisos.fechaAviso, hoy)
    ))
    .orderBy(avisos.fechaAviso);
}

export async function crearAviso(data: {
  vehiculoId: string;
  tipo: TipoAviso;
  descripcion?: string;
  fechaAviso?: string;
  kmAviso?: number;
}) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const [aviso] = await db
    .insert(avisos)
    .values({ ...data, tallerId })
    .returning();

  revalidatePath("/avisos");
  revalidatePath("/");
  return aviso;
}

export async function marcarEnviado(id: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  await db
    .update(avisos)
    .set({ enviado: true, fechaEnvio: new Date() })
    .where(and(eq(avisos.id, id), eq(avisos.tallerId, tallerId)));

  revalidatePath("/avisos");
  revalidatePath("/");
}

export async function eliminarAviso(id: string) {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  await db
    .delete(avisos)
    .where(and(eq(avisos.id, id), eq(avisos.tallerId, tallerId)));

  revalidatePath("/avisos");
}

export async function generarAvisosITV() {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  // Buscar vehículos con ITV en los próximos 30 días que no tengan aviso
  const hoy = new Date();
  const en30dias = new Date(hoy);
  en30dias.setDate(en30dias.getDate() + 30);

  const vehiculosConItv = await db
    .select({
      id: vehiculos.id,
      matricula: vehiculos.matricula,
      fechaItv: vehiculos.fechaItv,
    })
    .from(vehiculos)
    .where(and(
      eq(vehiculos.tallerId, tallerId),
      lte(vehiculos.fechaItv, en30dias.toISOString().split("T")[0]),
      sql`${vehiculos.fechaItv} >= ${hoy.toISOString().split("T")[0]}`
    ));

  let creados = 0;
  for (const v of vehiculosConItv) {
    // Verificar que no existe ya un aviso de ITV pendiente para este vehículo
    const existente = await db
      .select({ id: avisos.id })
      .from(avisos)
      .where(and(
        eq(avisos.vehiculoId, v.id),
        eq(avisos.tipo, "itv"),
        eq(avisos.enviado, false)
      ))
      .limit(1);

    if (existente.length === 0) {
      await db.insert(avisos).values({
        tallerId,
        vehiculoId: v.id,
        tipo: "itv",
        descripcion: `ITV caduca el ${new Date(v.fechaItv!).toLocaleDateString("es-ES")}`,
        fechaAviso: v.fechaItv!,
      });
      creados++;
    }
  }

  revalidatePath("/avisos");
  return creados;
}
