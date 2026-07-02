import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { lineasOrden, ordenesTrabajo, vehiculos } from "@/db/schema";
import { eq, and, sql, isNotNull } from "drizzle-orm";
import { createNotification } from "@/lib/notify";

// Los crons pueden tardar (BD + emails/notificaciones en bucle); ampliamos el limite de Vercel.
export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const db = getDb();
  const pendientes = await db
    .select({
      descripcion: lineasOrden.descripcion,
      tallerId: ordenesTrabajo.tallerId,
      matricula: vehiculos.matricula,
      ordenId: ordenesTrabajo.id,
    })
    .from(lineasOrden)
    .innerJoin(ordenesTrabajo, eq(lineasOrden.ordenId, ordenesTrabajo.id))
    .leftJoin(vehiculos, eq(ordenesTrabajo.vehiculoId, vehiculos.id))
    .where(and(
      eq(lineasOrden.estadoRecambio, "consultado"),
      isNotNull(lineasOrden.consultadoAt),
      sql`${lineasOrden.consultadoAt} < now() - interval '1 day'`
    ));

  const porTaller = new Map<string, string[]>();
  for (const p of pendientes) {
    const arr = porTaller.get(p.tallerId) || [];
    arr.push(`${p.matricula || "?"}: ${p.descripcion}`);
    porTaller.set(p.tallerId, arr);
  }

  for (const [tallerId, items] of porTaller) {
    createNotification({
      tallerId,
      tipo: "recambio_pendiente",
      titulo: `${items.length} recambio${items.length > 1 ? "s" : ""} consultado${items.length > 1 ? "s" : ""} sin pedir`,
      mensaje: `Llevan más de 1 día: ${items.slice(0, 5).join(" · ")}${items.length > 5 ? ` y ${items.length - 5} más` : ""}. ¿El proveedor ha contestado?`,
      enlace: "/ordenes",
    });
  }

  return NextResponse.json({ ok: true, notificados: porTaller.size });
}
