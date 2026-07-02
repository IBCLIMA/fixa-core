import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { ordenesTrabajo, vehiculos, clientes } from "@/db/schema";
import { eq, and, lt, sql } from "drizzle-orm";
import { createNotification } from "@/lib/notify";

// Los crons pueden tardar (BD + emails/notificaciones en bucle); ampliamos el limite de Vercel.
export const maxDuration = 60;

// Runs daily via Vercel Cron - creates notifications for overdue payments
// (delivered > 7 days ago, still unpaid)

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Find delivered orders older than 7 days that are still unpaid
  const overdue = await db
    .select({
      id: ordenesTrabajo.id,
      numero: ordenesTrabajo.numero,
      tallerId: ordenesTrabajo.tallerId,
      fechaEntrega: ordenesTrabajo.fechaEntrega,
      matricula: vehiculos.matricula,
      clienteNombre: clientes.nombre,
    })
    .from(ordenesTrabajo)
    .leftJoin(vehiculos, eq(ordenesTrabajo.vehiculoId, vehiculos.id))
    .leftJoin(clientes, eq(ordenesTrabajo.clienteId, clientes.id))
    .where(
      and(
        eq(ordenesTrabajo.estado, "entregado"),
        eq(ordenesTrabajo.pagado, false),
        lt(ordenesTrabajo.fechaEntrega, sevenDaysAgo)
      )
    );

  let notified = 0;
  for (const o of overdue) {
    createNotification({
      tallerId: o.tallerId,
      tipo: "pago_pendiente",
      titulo: `Pago pendiente: OR-${o.numero}`,
      mensaje: `La orden OR-${o.numero} (${o.matricula || "sin matrícula"}, ${o.clienteNombre || "cliente"}) lleva más de 7 días entregada sin cobrar.`,
      enlace: `/ordenes/${o.id}`,
    });
    notified++;
  }

  console.log(`[CRON] Created ${notified} overdue payment notifications`);

  return NextResponse.json({ notified, total_overdue: overdue.length });
}
