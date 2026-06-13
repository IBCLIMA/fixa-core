import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { talleres } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getTallerIdFromAuth } from "@/lib/auth";
import { Resend } from "resend";

export async function PUT(request: Request) {
  try {
    const { tallerId } = await getTallerIdFromAuth();
    const body = await request.json();
    const db = getDb();

    // Check if this is a new workshop (first time setting dpaAceptado)
    let isNewWorkshop = false;
    if (body.dpaAceptado) {
      const [existing] = await db
        .select({ dpaAcceptedAt: talleres.dpaAcceptedAt })
        .from(talleres)
        .where(eq(talleres.id, tallerId));
      if (existing && !existing.dpaAcceptedAt) {
        isNewWorkshop = true;
      }
    }

    const updateData: Record<string, any> = {
      nombre: body.nombre,
      cif: body.cif || null,
      direccion: body.direccion || null,
      telefono: body.telefono || null,
      email: body.email || null,
      codigoPostal: body.codigoPostal || null,
      ciudad: body.ciudad || null,
      provincia: body.provincia || null,
      googleReviewLink: body.googleReviewLink || null,
      registroIndustrial: body.registroIndustrial || null,
      ramaActividad: body.ramaActividad || null,
      precioHora: body.precioHora || null,
      ...(body.mensajesWhatsapp !== undefined ? { mensajesWhatsapp: body.mensajesWhatsapp } : {}),
      horarioApertura: body.horarioApertura || "08:00",
      horarioCierre: body.horarioCierre || "18:00",
      trabajaSabados: body.trabajaSabados ?? false,
      horarioSabadoApertura: body.horarioSabadoApertura || "09:00",
      horarioSabadoCierre: body.horarioSabadoCierre || "13:00",
      capacidadDiaria: body.capacidadDiaria ? Number(body.capacidadDiaria) : 4,
      ...(body.recordatorioCitas !== undefined ? { recordatorioCitas: body.recordatorioCitas === true } : {}),
    };

    if (body.dpaAceptado) {
      updateData.dpaAcceptedAt = new Date();
    }

    if (body.newsletterConsent) {
      updateData.newsletterConsent = true;
      updateData.newsletterConsentAt = new Date();
    }

    await db
      .update(talleres)
      .set(updateData)
      .where(eq(talleres.id, tallerId));

    // Fire-and-forget: welcome email + admin notification for new workshops
    if (isNewWorkshop && process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      // Welcome email — estilo Isra Bravo: corto, directo, sin florituras
      if (body.email) {
        const { emailBienvenida } = await import("@/lib/email-templates");
        const tpl = emailBienvenida(body.nombre || "");
        resend.emails.send({
          from: "FIXA <onboarding@resend.dev>",
          to: body.email,
          subject: tpl.subject,
          html: tpl.html,
        }).catch(() => {});
      }

      // Admin notification with workshop details
      resend.emails.send({
        from: "FIXA <onboarding@resend.dev>",
        to: process.env.ADMIN_NOTIFICATION_EMAIL || "sergi@ibclima.com",
        subject: "\uD83D\uDD14 Nuevo taller registrado en FIXA",
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #f97316;">\uD83D\uDD14 Nuevo taller ha completado el onboarding</h2>
            <p>Un taller ha configurado sus datos y est\u00e1 listo para usar FIXA.</p>
            <div style="background: #f5f5f4; border-radius: 12px; padding: 16px; margin: 16px 0;">
              <p style="margin: 0; font-size: 14px; color: #57534e;">
                <strong>Nombre:</strong> ${body.nombre || "—"}<br/>
                <strong>Email:</strong> ${body.email || "—"}<br/>
                <strong>Tel\u00e9fono:</strong> ${body.telefono || "—"}<br/>
                <strong>Ciudad:</strong> ${body.ciudad || "—"}<br/>
                <strong>Provincia:</strong> ${body.provincia || "—"}<br/>
                <strong>ID Taller:</strong> ${tallerId}<br/>
                <strong>Fecha:</strong> ${new Date().toLocaleString("es-ES")}
              </p>
            </div>
            <p>Entra al <a href="${process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")}/admin" style="color: #f97316; font-weight: bold;">Panel de Admin</a> para revisar y aprobar.</p>
            <p style="color: #a8a29e; font-size: 12px; margin-top: 24px;">FIXA by Iba\u00f1ez Clima</p>
          </div>
        `,
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
