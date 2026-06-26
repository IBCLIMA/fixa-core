"use server";

import { getDb } from "@/db";
import { feedback, talleres, usuarios } from "@/db/schema";
import { getTallerIdFromAuth, getSuperAdmin } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type Tipo = "sugerencia" | "incidencia" | "consulta";

/** Envía feedback/incidencia/consulta del taller al buzón del super-admin (/admin). */
export async function enviarFeedback(input: { tipo: Tipo; mensaje: string; url?: string }) {
  const { tallerId, usuarioId } = await getTallerIdFromAuth();
  const mensaje = (input.mensaje || "").trim();
  if (!mensaje) throw new Error("El mensaje no puede estar vacío");

  const db = getDb();
  const [t] = await db
    .select({ nombre: talleres.nombre, email: talleres.email })
    .from(talleres)
    .where(eq(talleres.id, tallerId));
  const [u] = await db
    .select({ nombre: usuarios.nombre })
    .from(usuarios)
    .where(eq(usuarios.id, usuarioId));

  await db.insert(feedback).values({
    tallerId,
    usuarioId,
    tipo: input.tipo,
    mensaje: mensaje.slice(0, 2000),
    tallerNombre: t?.nombre ?? null,
    usuarioNombre: u?.nombre ?? null,
    contactoEmail: t?.email ?? null,
    url: input.url?.slice(0, 300) ?? null,
  });
}

/** Cambia el estado de un feedback. Solo super-admin (desde /admin). */
export async function marcarFeedback(id: string, estado: "nuevo" | "visto" | "resuelto") {
  if (!(await getSuperAdmin())) throw new Error("No autorizado");
  const db = getDb();
  await db.update(feedback).set({ estado }).where(eq(feedback.id, id));
  revalidatePath("/admin");
}
