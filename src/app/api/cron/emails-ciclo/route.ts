import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { talleres, ordenesTrabajo, usuarios } from "@/db/schema";
import { eq, and, sql, count } from "drizzle-orm";
import { Resend } from "resend";
import { emailRescateDia2, emailDia7 } from "@/lib/email-templates";
import { EMAIL_FROM } from "@/lib/constants";

// Los crons pueden tardar (BD + emails/notificaciones en bucle); ampliamos el limite de Vercel.
export const maxDuration = 60;

/**
 * Cron diario 10:00 — emails de ciclo de vida del trial:
 * 1) Día 2 sin actividad: email de rescate ("¿el coche sigue en la puerta?")
 * 2) Día 7: email pre-fin de trial (persuasivo, con urgencia real)
 *
 * Se basa en createdAt del taller y en si ha creado órdenes.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const db = getDb();
  const resend = new Resend(process.env.RESEND_API_KEY);
  let rescates = 0;
  let dia7 = 0;

  // 1. Talleres creados hace exactamente 2 días SIN ninguna orden (rescate)
  const talleresInactivos = await db
    .select({
      id: talleres.id,
      nombre: talleres.nombre,
      email: talleres.email,
    })
    .from(talleres)
    .where(and(
      eq(talleres.plan, "trial"),
      sql`${talleres.createdAt}::date = (now() - interval '2 days')::date`
    ));

  for (const t of talleresInactivos) {
    if (!t.email) continue;
    const [{ total }] = await db
      .select({ total: count() })
      .from(ordenesTrabajo)
      .where(eq(ordenesTrabajo.tallerId, t.id));
    if (Number(total) > 0) continue; // ya tiene órdenes, no es inactivo

    const tpl = emailRescateDia2(t.nombre || "");
    await resend.emails.send({
      from: EMAIL_FROM,
      to: t.email,
      subject: tpl.subject,
      html: tpl.html,
    }).catch((e) => console.error("[email-rescate]", e));
    rescates++;
  }

  // 2. Talleres creados hace exactamente 7 días (pre-fin de trial)
  const talleresDia7 = await db
    .select({
      id: talleres.id,
      nombre: talleres.nombre,
      email: talleres.email,
    })
    .from(talleres)
    .where(and(
      eq(talleres.plan, "trial"),
      sql`${talleres.createdAt}::date = (now() - interval '7 days')::date`
    ));

  for (const t of talleresDia7) {
    if (!t.email) continue;
    const tpl = emailDia7(t.nombre || "");
    await resend.emails.send({
      from: EMAIL_FROM,
      to: t.email,
      subject: tpl.subject,
      html: tpl.html,
    }).catch((e) => console.error("[email-dia7]", e));
    dia7++;
  }

  return NextResponse.json({ ok: true, rescates, dia7 });
}
