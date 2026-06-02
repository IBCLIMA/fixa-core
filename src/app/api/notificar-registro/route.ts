import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { auth } from "@clerk/nextjs/server";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const { success } = rateLimit(ip, 3, 60 * 60 * 1000);
    if (!success) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes" },
        { status: 429 }
      );
    }

    // Auth check - only authenticated users can trigger notifications
    const { userId: authUserId } = await auth();
    if (!authUserId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { tallerId, userId } = await request.json();

    // Enviar email a Sergi
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "FIXA <onboarding@resend.dev>",
        to: process.env.ADMIN_NOTIFICATION_EMAIL || "sergi@ibclima.com",
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
            <p>Entra al <a href="${process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")}/admin" style="color: #f97316; font-weight: bold;">Panel de Admin</a> para revisar y aprobar.</p>
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
