"use server";

import { getDb } from "@/db";
import { feedback } from "@/db/schema";
import { getSuperAdmin } from "@/lib/auth";
import { enviar } from "@/lib/correo";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Responde a un feedback DESDE Soporte: envía un correo nuevo al taller
 * (vía el buzón hola@fixataller.es) y, si el feedback seguía "nuevo", lo
 * pasa a "visto" para reflejar que ya se atendió.
 *
 * Solo super-admin. El envío reutiliza `enviar` de lib/correo (mismo
 * transporte que la sección Correo). No se modifica lib/correo ni sus APIs.
 */
export async function responderFeedback(input: {
  feedbackId: string;
  to: string;
  subject: string;
  text: string;
}): Promise<{ ok: true }> {
  if (!(await getSuperAdmin())) throw new Error("No autorizado");

  const to = (input.to || "").trim();
  if (!EMAIL_RE.test(to)) throw new Error("El destinatario no es un email válido.");

  const subject = (input.subject || "").trim();
  if (!subject) throw new Error("Falta el asunto.");
  if (!input.text?.trim()) throw new Error("Falta el cuerpo del mensaje.");

  await enviar({ to, subject, text: input.text });

  // El feedback llega por el formulario in-app, no por email: no hay un
  // estado "respondido" en la tabla (solo nuevo | visto | resuelto). Como
  // mínimo lo marcamos "visto" si seguía "nuevo" — no inventamos estados.
  const db = getDb();
  await db
    .update(feedback)
    .set({ estado: "visto" })
    .where(and(eq(feedback.id, input.feedbackId), eq(feedback.estado, "nuevo")));

  revalidatePath("/admin/soporte");
  return { ok: true };
}
