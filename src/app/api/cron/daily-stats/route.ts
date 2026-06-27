import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { talleres, ordenesTrabajo, citas, dailyStats } from "@/db/schema";
import { sql } from "drizzle-orm";

/**
 * Cron diario (00:05) — snapshot de métricas a la tabla `daily_stats`.
 *
 * Por qué: admin/metricas y admin/actividad calculan todo al vuelo y eso no
 * escala ni da HISTÓRICO. Sin histórico no se puede ver una TENDENCIA ni
 * detectar churn ("este taller dejó de usar FIXA el día X"). Este cron deja
 * cada noche una foto fija del día.
 *
 * Escribe dos cosas (UPSERT idempotente: si ya existe la fila de hoy, la pisa):
 *   1) Una fila por taller operativo (timeline de uso → churn por taller).
 *   2) Una fila agregada de plataforma (taller_id NULL) con MRR, registros,
 *      talleres activos/pagando… → tendencias para el fundador.
 *
 * "Hoy" se calcula en horario de España (Europe/Madrid) para que el corte del
 * día cuadre con cuándo trabajan los talleres, no con UTC.
 */

// Precio mensual por plan (€/mes). Misma fuente que admin/metricas.
const PRECIO_PLAN: Record<string, number> = { basico: 29, taller: 49, pro: 79 };
const PLANES_PAGO = ["basico", "taller", "pro"];

// Igualdad de fecha en zona horaria de España (evita desfase por UTC).
const MISMO_DIA_MADRID = (col: string) =>
  sql.raw(
    `(${col} AT TIME ZONE 'Europe/Madrid')::date = (now() AT TIME ZONE 'Europe/Madrid')::date`
  );

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const db = getDb();

    // Fecha del snapshot: el día de hoy en España (YYYY-MM-DD). en-CA da ese formato.
    // El cron corre a las 00:05, así que la fecha es estable y cuadra con los
    // filtros SQL `now() AT TIME ZONE 'Europe/Madrid'` de abajo.
    const hoy = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());

    // 1) Talleres (base de cálculo). Pocas filas: una sola pasada.
    const filasTalleres = await db
      .select({
        id: talleres.id,
        plan: talleres.plan,
        ultimoAcceso: talleres.ultimoAcceso,
        creadoHoy: sql<boolean>`${MISMO_DIA_MADRID("created_at")}`,
        accesoHoy: sql<boolean>`(${talleres.ultimoAcceso} IS NOT NULL AND ${MISMO_DIA_MADRID("ultimo_acceso")})`,
      })
      .from(talleres);

    // 2) Órdenes creadas HOY, agrupadas por taller.
    const ordenesHoy = await db
      .select({
        tallerId: ordenesTrabajo.tallerId,
        n: sql<number>`count(*)::int`,
      })
      .from(ordenesTrabajo)
      .where(MISMO_DIA_MADRID("created_at"))
      .groupBy(ordenesTrabajo.tallerId);

    // 3) Citas creadas HOY, agrupadas por taller.
    const citasHoy = await db
      .select({
        tallerId: citas.tallerId,
        n: sql<number>`count(*)::int`,
      })
      .from(citas)
      .where(MISMO_DIA_MADRID("created_at"))
      .groupBy(citas.tallerId);

    // 4) Acumulado de órdenes por taller (para ordenes_total).
    const ordenesTotal = await db
      .select({
        tallerId: ordenesTrabajo.tallerId,
        n: sql<number>`count(*)::int`,
      })
      .from(ordenesTrabajo)
      .groupBy(ordenesTrabajo.tallerId);

    const mapOrdenesHoy = new Map(ordenesHoy.map((r) => [r.tallerId, Number(r.n)]));
    const mapCitasHoy = new Map(citasHoy.map((r) => [r.tallerId, Number(r.n)]));
    const mapOrdenesTotal = new Map(ordenesTotal.map((r) => [r.tallerId, Number(r.n)]));

    // ── Filas por taller (solo operativos: los "pendiente" aún no usan la app) ──
    const operativos = filasTalleres.filter((t) => t.plan !== "pendiente");

    const filasTallerSnapshot = operativos.map((t) => {
      const oHoy = mapOrdenesHoy.get(t.id) ?? 0;
      const cHoy = mapCitasHoy.get(t.id) ?? 0;
      const activo = oHoy + cHoy > 0 || t.accesoHoy === true;
      return {
        fecha: hoy,
        tallerId: t.id,
        ordenesCreadas: oHoy,
        citasCreadas: cHoy,
        ordenesTotal: mapOrdenesTotal.get(t.id) ?? 0,
        activo,
        // Campos de plataforma: 0 en filas de taller.
        registros: 0,
        talleresTotal: 0,
        talleresTrial: 0,
        talleresPagando: 0,
        talleresActivos: 0,
        mrr: "0",
      };
    });

    // ── Fila agregada de plataforma (taller_id NULL) ───────────────────────────
    const registros = filasTalleres.filter((t) => t.creadoHoy === true).length;
    const trial = operativos.filter((t) => t.plan === "trial").length;
    const pagando = operativos.filter((t) => PLANES_PAGO.includes(t.plan));
    const mrr = pagando.reduce((s, t) => s + (PRECIO_PLAN[t.plan] ?? 0), 0);
    const talleresActivos = filasTallerSnapshot.filter((f) => f.activo).length;
    const ordenesPlataforma = ordenesHoy.reduce((s, r) => s + Number(r.n), 0);
    const citasPlataforma = citasHoy.reduce((s, r) => s + Number(r.n), 0);

    const filaPlataforma = {
      fecha: hoy,
      tallerId: null,
      ordenesCreadas: ordenesPlataforma,
      citasCreadas: citasPlataforma,
      ordenesTotal: 0,
      activo: false,
      registros,
      talleresTotal: operativos.length,
      talleresTrial: trial,
      talleresPagando: pagando.length,
      talleresActivos,
      mrr: mrr.toFixed(2),
    };

    // ── UPSERT plataforma (índice único parcial: fecha WHERE taller_id IS NULL) ──
    await db
      .insert(dailyStats)
      .values(filaPlataforma)
      .onConflictDoUpdate({
        target: dailyStats.fecha,
        targetWhere: sql`taller_id IS NULL`,
        set: {
          ordenesCreadas: sql`excluded.ordenes_creadas`,
          citasCreadas: sql`excluded.citas_creadas`,
          registros: sql`excluded.registros`,
          talleresTotal: sql`excluded.talleres_total`,
          talleresTrial: sql`excluded.talleres_trial`,
          talleresPagando: sql`excluded.talleres_pagando`,
          talleresActivos: sql`excluded.talleres_activos`,
          mrr: sql`excluded.mrr`,
        },
      });

    // ── UPSERT por taller (índice único parcial: (fecha,taller_id) WHERE NOT NULL) ──
    if (filasTallerSnapshot.length > 0) {
      await db
        .insert(dailyStats)
        .values(filasTallerSnapshot)
        .onConflictDoUpdate({
          target: [dailyStats.fecha, dailyStats.tallerId],
          targetWhere: sql`taller_id IS NOT NULL`,
          set: {
            ordenesCreadas: sql`excluded.ordenes_creadas`,
            citasCreadas: sql`excluded.citas_creadas`,
            ordenesTotal: sql`excluded.ordenes_total`,
            activo: sql`excluded.activo`,
          },
        });
    }

    return NextResponse.json({
      ok: true,
      fecha: hoy,
      talleres: filasTallerSnapshot.length,
      registros,
      pagando: pagando.length,
      mrr,
      talleresActivos,
    });
  } catch (e) {
    // No reventar el scheduler: log y 500 controlado (Vercel reintenta mañana).
    console.error("[cron/daily-stats]", e);
    return NextResponse.json({ ok: false, error: "fallo en snapshot" }, { status: 500 });
  }
}
