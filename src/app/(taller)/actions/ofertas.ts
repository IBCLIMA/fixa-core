"use server";

import { getDb } from "@/db";
import { clientes } from "@/db/schema";
import { eq, and, isNotNull } from "drizzle-orm";
import { requireRole } from "@/lib/auth";

export async function getClientesConTelefono() {
  const { tallerId } = await requireRole(["admin", "recepcion"]);
  const db = getDb();

  return db
    .select({
      id: clientes.id,
      nombre: clientes.nombre,
      telefono: clientes.telefono,
    })
    .from(clientes)
    .where(and(
      eq(clientes.tallerId, tallerId),
      isNotNull(clientes.telefono)
    ));
}

export async function generarLinksOferta(mensaje: string) {
  await requireRole(["admin", "recepcion"]);
  const clientesList = await getClientesConTelefono();

  return clientesList.map((c) => ({
    id: c.id,
    nombre: c.nombre,
    telefono: c.telefono!,
    url: `https://wa.me/34${c.telefono!.replace(/\s/g, "")}?text=${encodeURIComponent(
      mensaje.replace(/\{\{nombre\}\}/g, c.nombre.split(" ")[0])
    )}`,
  }));
}
