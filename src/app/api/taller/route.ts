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

      // Welcome email to the workshop
      if (body.email) {
        resend.emails.send({
          from: "FIXA <onboarding@resend.dev>",
          to: body.email,
          subject: "¡Bienvenido a FIXA! Tu prueba de 14 días empieza hoy",
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 0;">
              <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 32px; text-align: center; border-radius: 16px 16px 0 0;">
                <h1 style="color: white; font-size: 28px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">FIXA</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">La herramienta del taller organizado</p>
              </div>
              <div style="background: white; padding: 32px; border: 1px solid #e7e5e4; border-top: none; border-radius: 0 0 16px 16px;">
                <h2 style="color: #1c1917; font-size: 22px; margin: 0 0 16px;">Hola ${body.nombre || ""},</h2>
                <p style="color: #57534e; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
                  Bienvenido a FIXA. Tu cuenta ya est\u00e1 activa y tienes <strong>14 d\u00edas para probar todas las funciones sin compromiso</strong>.
                </p>
                <p style="color: #57534e; font-size: 15px; line-height: 1.6; margin: 0 0 12px; font-weight: 600;">
                  Esto es lo que puedes hacer desde hoy:
                </p>
                <ul style="color: #57534e; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0 0 24px;">
                  <li>Crear \u00f3rdenes de trabajo en segundos</li>
                  <li>Enviar el estado del coche al cliente por WhatsApp</li>
                  <li>Portal online para que tu cliente vea su coche sin llamar</li>
                  <li>Presupuestos profesionales con un clic</li>
                  <li>Avisos autom\u00e1ticos de ITV y mantenimiento</li>
                  <li>Gesti\u00f3n de citas y agenda del taller</li>
                </ul>
                <div style="text-align: center; margin: 28px 0;">
                  <a href="https://fixa.ibclima.com" style="display: inline-block; background: linear-gradient(135deg, #f97316, #ea580c); color: white; text-decoration: none; padding: 14px 36px; border-radius: 50px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 14px rgba(249,115,22,0.3);">
                    Entrar a FIXA
                  </a>
                </div>
                <p style="color: #a8a29e; font-size: 13px; line-height: 1.6; margin: 24px 0 0; text-align: center;">
                  \u00bfDudas? Escr\u00edbenos por <a href="https://wa.me/34644488029" style="color: #f97316; text-decoration: underline;">WhatsApp</a> y te ayudamos al momento.
                </p>
              </div>
              <p style="color: #a8a29e; font-size: 11px; text-align: center; margin-top: 20px;">
                FIXA by Iba\u00f1ez Clima
              </p>
            </div>
          `,
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
