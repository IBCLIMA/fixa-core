import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { talleres, ordenesTrabajo } from "@/db/schema";
import { eq, and, sql, count } from "drizzle-orm";
import { Resend } from "resend";
import { EMAIL_FROM } from "@/lib/constants";

// Los crons pueden tardar (BD + emails/notificaciones en bucle); ampliamos el limite de Vercel.
export const maxDuration = 60;

/**
 * Cron diario: detecta talleres en el día 5 de trial y notifica a Sergi
 * con un resumen + enlace de WhatsApp para cada uno.
 *
 * NO es un email automático al taller — es Sergi quien escribe personalmente.
 * Eso es lo que convierte.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const db = getDb();

  // Talleres creados hace exactamente 5 días
  const talleresDia5 = await db
    .select({
      id: talleres.id,
      nombre: talleres.nombre,
      email: talleres.email,
      telefono: talleres.telefono,
    })
    .from(talleres)
    .where(and(
      eq(talleres.plan, "trial"),
      sql`${talleres.createdAt}::date = (now() - interval '5 days')::date`
    ));

  if (talleresDia5.length === 0) {
    return NextResponse.json({ ok: true, checkins: 0 });
  }

  // Para cada taller, contar cuántas órdenes ha creado
  const resumen = await Promise.all(
    talleresDia5.map(async (t) => {
      const [{ total }] = await db
        .select({ total: count() })
        .from(ordenesTrabajo)
        .where(eq(ordenesTrabajo.tallerId, t.id));
      return { ...t, ordenes: Number(total) };
    })
  );

  // Email a Sergi con el resumen
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "sergi@ibclima.com";

    const talleresHtml = resumen.map((t) => {
      const whatsappUrl = t.telefono
        ? `https://wa.me/34${t.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${t.nombre?.split(" ")[0] || ""}, soy Sergi de FIXA. ¿Qué tal te va? ¿Necesitas ayuda con algo?`)}`
        : null;
      const estado = t.ordenes === 0 ? "⚠️ SIN ACTIVIDAD" : `✅ ${t.ordenes} órdenes`;

      return `
        <div style="border:1px solid #e7e5e4; border-radius:12px; padding:12px; margin-bottom:8px;">
          <strong>${t.nombre || "Sin nombre"}</strong> — ${estado}<br/>
          <span style="color:#78716c; font-size:13px;">${t.email || ""} · ${t.telefono || "sin teléfono"}</span><br/>
          ${whatsappUrl ? `<a href="${whatsappUrl}" style="color:#25D366; font-weight:bold; font-size:13px;">📲 Escribir por WhatsApp</a>` : '<span style="color:#a8a29e; font-size:12px;">Sin teléfono para WhatsApp</span>'}
        </div>`;
    }).join("");

    await resend.emails.send({
      from: EMAIL_FROM,
      to: adminEmail,
      subject: `📋 Check-in día 5: ${resumen.length} taller${resumen.length > 1 ? "es" : ""} para contactar`,
      html: `
        <div style="font-family:-apple-system,sans-serif; max-width:500px; margin:0 auto; padding:20px;">
          <h2 style="color:#f97316;">Check-in de trial — día 5</h2>
          <p style="color:#57534e;">Estos talleres llevan 5 días con FIXA. Es el momento de escribirles un WhatsApp personal preguntando qué tal les va.</p>
          ${talleresHtml}
          <p style="color:#a8a29e; font-size:12px; margin-top:16px;">Los que tienen ⚠️ no han creado ninguna orden — son los que más necesitan tu mensaje.</p>
        </div>`,
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true, checkins: resumen.length });
}
