import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { vehiculos, avisos } from "@/db/schema";
import { and, lte, gte, isNotNull, inArray, eq } from "drizzle-orm";
import { createNotification } from "@/lib/notify";

// Cron diario: genera avisos de ITV (próxima en 30 días o caducada hace <60 días)
// para TODOS los talleres y notifica a cada taller los nuevos.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const db = getDb();
  const hoy = new Date();
  const en30dias = new Date(hoy);
  en30dias.setDate(en30dias.getDate() + 30);
  const hace60dias = new Date(hoy);
  hace60dias.setDate(hace60dias.getDate() - 60);

  const candidatos = await db
    .select({
      id: vehiculos.id,
      tallerId: vehiculos.tallerId,
      matricula: vehiculos.matricula,
      fechaItv: vehiculos.fechaItv,
    })
    .from(vehiculos)
    .where(and(
      isNotNull(vehiculos.fechaItv),
      lte(vehiculos.fechaItv, en30dias.toISOString().split("T")[0]),
      gte(vehiculos.fechaItv, hace60dias.toISOString().split("T")[0])
    ));

  if (candidatos.length === 0) {
    return NextResponse.json({ ok: true, creados: 0 });
  }

  // Vehículos que ya tienen un aviso ITV pendiente (no duplicar)
  const existentes = await db
    .select({ vehiculoId: avisos.vehiculoId })
    .from(avisos)
    .where(and(
      eq(avisos.tipo, "itv"),
      eq(avisos.enviado, false),
      inArray(avisos.vehiculoId, candidatos.map((c) => c.id))
    ));
  const yaAvisados = new Set(existentes.map((e) => e.vehiculoId));

  const nuevos = candidatos.filter((c) => !yaAvisados.has(c.id));
  const creadosPorTaller = new Map<string, number>();

  if (nuevos.length > 0) {
    await db.insert(avisos).values(
      nuevos.map((v) => {
        const caducada = v.fechaItv! < hoy.toISOString().split("T")[0];
        creadosPorTaller.set(v.tallerId, (creadosPorTaller.get(v.tallerId) || 0) + 1);
        return {
          tallerId: v.tallerId,
          vehiculoId: v.id,
          tipo: "itv" as const,
          descripcion: caducada
            ? `ITV CADUCADA desde el ${new Date(v.fechaItv!).toLocaleDateString("es-ES")}`
            : `ITV caduca el ${new Date(v.fechaItv!).toLocaleDateString("es-ES")}`,
          fechaAviso: v.fechaItv!,
        };
      })
    );

    // Una notificación por taller con el total
    for (const [tallerId, n] of creadosPorTaller) {
      createNotification({
        tallerId,
        tipo: "itv_proxima",
        titulo: `${n} ${n === 1 ? "cliente con ITV próxima" : "clientes con ITV próxima"}`,
        mensaje: `Tienes ${n} ${n === 1 ? "vehículo" : "vehículos"} con la ITV a punto de caducar. Avisa a los clientes y gana esas pre-ITV.`,
        enlace: "/avisos",
      });
    }
  }

  return NextResponse.json({ ok: true, creados: nuevos.length, talleres: creadosPorTaller.size });
}
