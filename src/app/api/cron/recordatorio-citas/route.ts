import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { citas, talleres } from "@/db/schema";
import { and, eq, inArray, count } from "drizzle-orm";
import { createNotification } from "@/lib/notify";

// Los crons pueden tardar (BD + emails/notificaciones en bucle); ampliamos el limite de Vercel.
export const maxDuration = 60;

// Cron de la tarde: a los talleres con recordatorios activados se les avisa
// de las citas de mañana para que envíen el recordatorio por WhatsApp.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const db = getDb();
  const manana = new Date();
  manana.setDate(manana.getDate() + 1);
  const mananaStr = manana.toISOString().split("T")[0];

  const citasManana = await db
    .select({ tallerId: citas.tallerId, total: count() })
    .from(citas)
    .innerJoin(talleres, eq(citas.tallerId, talleres.id))
    .where(and(
      eq(citas.fecha, mananaStr),
      inArray(citas.estado, ["programada", "confirmada"]),
      eq(talleres.recordatorioCitas, true)
    ))
    .groupBy(citas.tallerId);

  for (const t of citasManana) {
    createNotification({
      tallerId: t.tallerId,
      tipo: "recordatorio_citas",
      titulo: `Mañana tienes ${t.total} ${Number(t.total) === 1 ? "cita" : "citas"}`,
      mensaje: `Envía un recordatorio por WhatsApp a tus clientes desde el panel — con un toque, mensaje ya preparado. Menos plantones.`,
      enlace: "/",
    });
  }

  return NextResponse.json({ ok: true, talleres: citasManana.length });
}
