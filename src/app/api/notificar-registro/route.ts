import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const { tallerId, userId } = await request.json();

    // Enviar email a Sergi
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "FIXA <onboarding@resend.dev>",
        to: "sergi@ibclima.com",
        subject: "🔔 Nuevo registro en FIXA",
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #f97316;">🔔 Nuevo registro en FIXA</h2>
            <p>Un nuevo taller se ha registrado y está pendiente de aprobación.</p>
            <div style="background: #f5f5f4; border-radius: 12px; padding: 16px; margin: 16px 0;">
              <p style="margin: 0; font-size: 14px; color: #57534e;">
                <strong>ID Taller:</strong> ${tallerId}<br/>
                <strong>User ID:</strong> ${userId}<br/>
                <strong>Fecha:</strong> ${new Date().toLocaleString("es-ES")}
              </p>
            </div>
            <p>Entra al <a href="https://solcraft-rho.vercel.app/admin" style="color: #f97316; font-weight: bold;">Panel de Admin</a> para revisar y aprobar.</p>
            <p style="color: #a8a29e; font-size: 12px; margin-top: 24px;">FIXA by Ibañez Clima</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    // No fallar si el email no se envía — no es crítico
    console.error("Error notificación:", e.message);
    return NextResponse.json({ ok: true });
  }
}
