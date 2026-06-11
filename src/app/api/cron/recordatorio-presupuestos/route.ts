import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { presupuestos, vehiculos, clientes } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { createNotification } from "@/lib/notify";

// Cron diario: presupuestos enviados hace exactamente 3 días sin respuesta
// → notificación al taller para reenviarlo por WhatsApp (cada presupuesto se notifica una sola vez).
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const db = getDb();

  const sinRespuesta = await db
    .select({
      id: presupuestos.id,
      numero: presupuestos.numero,
      tallerId: presupuestos.tallerId,
      matricula: vehiculos.matricula,
      clienteNombre: clientes.nombre,
    })
    .from(presupuestos)
    .leftJoin(vehiculos, eq(presupuestos.vehiculoId, vehiculos.id))
    .leftJoin(clientes, eq(presupuestos.clienteId, clientes.id))
    .where(and(
      eq(presupuestos.estado, "enviado"),
      // Ventana de un día: solo los que cumplen exactamente 3 días hoy → una notificación por presupuesto
      sql`${presupuestos.createdAt}::date = (now() - interval '3 days')::date`
    ));

  for (const p of sinRespuesta) {
    createNotification({
      tallerId: p.tallerId,
      tipo: "presupuesto_sin_respuesta",
      titulo: `${p.matricula || `PT-${p.numero}`} — presupuesto sin respuesta`,
      mensaje: `${p.clienteNombre || "El cliente"} lleva 3 días sin contestar al presupuesto PT-${p.numero}. Un recordatorio por WhatsApp suele cerrar la venta.`,
      enlace: `/presupuestos/${p.id}`,
    });
  }

  return NextResponse.json({ ok: true, notificados: sinRespuesta.length });
}
