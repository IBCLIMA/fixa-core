import { BarChart3, TrendingUp, Repeat, Euro, Users, Percent, LineChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { getDb } from "@/db";
import { talleres, dailyStats } from "@/db/schema";
import { isNull, desc } from "drizzle-orm";
import { formatMoneyShort } from "@/lib/format";

// ── Histórico de plataforma (snapshot diario del cron daily-stats) ──────────
// Devuelve la serie ascendente por fecha. Si la tabla aún no existe (el fundador
// no ha aplicado el SQL) o no hay filas, devuelve [] y la UI muestra el estado
// "recopilando datos" sin romper.
type PlataformaDia = {
  fecha: string;
  mrr: number;
  registros: number;
  talleresActivos: number;
  talleresPagando: number;
};

async function getTendencia(): Promise<PlataformaDia[]> {
  const db = getDb();
  try {
    const filas = await db
      .select({
        fecha: dailyStats.fecha,
        mrr: dailyStats.mrr,
        registros: dailyStats.registros,
        talleresActivos: dailyStats.talleresActivos,
        talleresPagando: dailyStats.talleresPagando,
      })
      .from(dailyStats)
      .where(isNull(dailyStats.tallerId))
      .orderBy(desc(dailyStats.fecha))
      .limit(30);
    return filas
      .map((f) => ({
        fecha: f.fecha,
        mrr: Number(f.mrr),
        registros: f.registros,
        talleresActivos: f.talleresActivos,
        talleresPagando: f.talleresPagando,
      }))
      .reverse();
  } catch {
    // Tabla aún no creada → tratamos como "sin datos todavía".
    return [];
  }
}

export const metadata = { title: "Métricas · FIXA Admin" };
export const dynamic = "force-dynamic";

// Precio mensual por plan (€/mes). Fuente única de verdad para MRR/ARPU.
const PRECIO_PLAN: Record<string, number> = { basico: 29, taller: 49, pro: 79 };
const PLANES_PAGO = ["basico", "taller", "pro"];

const DIA = 86_400_000;

export default async function MetricasPage() {
  const db = getDb();

  // Histórico real (snapshot diario). Tendencia de MRR y activos para ver churn.
  const tendencia = await getTendencia();
  const hayTendencia = tendencia.length >= 2;
  const maxMrrTend = Math.max(1, ...tendencia.map((d) => d.mrr));
  const maxActivos = Math.max(1, ...tendencia.map((d) => d.talleresActivos));
  const primero = tendencia[0];
  const ultimo = tendencia[tendencia.length - 1];
  const deltaMrr = hayTendencia ? ultimo.mrr - primero.mrr : 0;
  const deltaActivos = hayTendencia ? ultimo.talleresActivos - primero.talleresActivos : 0;

  // ── Datos crudos (pocos talleres ⇒ calculamos al vuelo en JS).
  // NOTA escala: cuando haya cientos/miles de talleres, esto debe precalcularse
  // con un cron nocturno a una tabla `daily_stats` (registros/día, MRR, churn…)
  // y aquí solo leeríamos la última fila. De momento un SELECT entero vale.
  const filas = await db
    .select({
      plan: talleres.plan,
      trialEndsAt: talleres.trialEndsAt,
      createdAt: talleres.createdAt,
      activo: talleres.activo,
    })
    .from(talleres);

  const ahora = Date.now();

  // ── Embudo trial → pago ───────────────────────────────────────────
  // "Aprobados" = todo el que ha pasado del estado pendiente (ya es trial o más).
  const aprobados = filas.filter((t) => t.plan !== "pendiente");
  const pendientes = filas.filter((t) => t.plan === "pendiente");
  const enTrial = filas.filter((t) => t.plan === "trial");
  const pagando = filas.filter((t) => PLANES_PAGO.includes(t.plan));
  const cancelados = filas.filter((t) => t.plan === "cancelado");

  const baseEmbudo = aprobados.length; // denominador del embudo (han tenido oportunidad de pagar)
  const conversion = baseEmbudo > 0 ? (pagando.length / baseEmbudo) * 100 : 0;

  // ── Churn aproximado ──────────────────────────────────────────────
  // cancelados / (cancelados + pagando). Aproximado: sin histórico temporal
  // es churn acumulado, no mensual. A escala se calcula mes a mes con daily_stats.
  const baseChurn = cancelados.length + pagando.length;
  const churn = baseChurn > 0 ? (cancelados.length / baseChurn) * 100 : 0;

  // ── MRR y ARPU ────────────────────────────────────────────────────
  const mrr = pagando.reduce((s, t) => s + (PRECIO_PLAN[t.plan] ?? 0), 0);
  const arpu = pagando.length > 0 ? mrr / pagando.length : 0;
  const arr = mrr * 12;

  // Desglose de MRR por plan
  const mrrPorPlan = PLANES_PAGO.map((plan) => {
    const n = pagando.filter((t) => t.plan === plan).length;
    return { plan, n, total: n * (PRECIO_PLAN[plan] ?? 0) };
  });

  // ── Registros por mes (últimos 6) ─────────────────────────────────
  const meses: { label: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i, 1);
    meses.push({
      label: d.toLocaleDateString("es-ES", { month: "short", year: "2-digit" }),
      count: 0,
    });
  }
  filas.forEach((t) => {
    const c = new Date(t.createdAt);
    const idx = meses.findIndex((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i), 1);
      return c.getFullYear() === d.getFullYear() && c.getMonth() === d.getMonth();
    });
    if (idx >= 0) meses[idx].count++;
  });
  const maxMes = Math.max(1, ...meses.map((m) => m.count));

  // ── Registros por semana (últimas 8) ──────────────────────────────
  const semanas: { label: string; count: number }[] = [];
  for (let i = 7; i >= 0; i--) {
    const d = new Date(ahora - i * 7 * DIA);
    semanas.push({
      label: d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" }),
      count: 0,
    });
  }
  filas.forEach((t) => {
    const semanasAtras = Math.floor((ahora - new Date(t.createdAt).getTime()) / (7 * DIA));
    if (semanasAtras >= 0 && semanasAtras <= 7) semanas[7 - semanasAtras].count++;
  });
  const maxSem = Math.max(1, ...semanas.map((s) => s.count));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-md">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Métricas de negocio</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Crecimiento, embudo, MRR y retención de FIXA
          </p>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="MRR"
          value={formatMoneyShort(mrr)}
          sub={`ARR ≈ ${formatMoneyShort(arr)}`}
          icon={Euro}
          accent="emerald"
        />
        <StatCard
          label="ARPU"
          value={formatMoneyShort(arpu)}
          sub={`${pagando.length} pagando`}
          icon={Users}
          accent="violet"
        />
        <StatCard
          label="Conversión"
          value={`${conversion.toFixed(0)}%`}
          sub="trial → pago"
          icon={Percent}
          accent="blue"
        />
        <StatCard
          label="Churn"
          value={`${churn.toFixed(0)}%`}
          sub={`${cancelados.length} cancelados`}
          icon={Repeat}
          accent="stone"
          alert={churn > 0}
        />
      </div>

      {/* Tendencia histórica (snapshot diario) — detección de churn */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <LineChart className="h-4 w-4 text-muted-foreground" />
            Tendencia · últimos {tendencia.length || 30} días
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hayTendencia ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100">
                <LineChart className="h-6 w-6 text-stone-400" />
              </div>
              <p className="text-sm font-bold text-stone-700">Recopilando datos</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                El snapshot diario empieza a guardar histórico esta noche. Vuelve mañana
                para ver la evolución de MRR y de talleres activos (y detectar churn).
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* MRR */}
              <div>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="text-xs font-medium text-muted-foreground">MRR</span>
                  <span className="text-xs font-semibold tabular-nums">
                    {formatMoneyShort(ultimo.mrr)}
                    <span className={deltaMrr >= 0 ? "ml-1.5 text-emerald-600" : "ml-1.5 text-red-600"}>
                      {deltaMrr >= 0 ? "▲" : "▼"} {formatMoneyShort(Math.abs(deltaMrr))}
                    </span>
                  </span>
                </div>
                <div className="flex h-16 items-end gap-px">
                  {tendencia.map((d) => (
                    <div
                      key={`mrr-${d.fecha}`}
                      title={`${d.fecha} · ${formatMoneyShort(d.mrr)}`}
                      className="flex-1 rounded-t bg-emerald-500/80"
                      style={{ height: `${(d.mrr / maxMrrTend) * 100}%`, minHeight: d.mrr > 0 ? 3 : 0 }}
                    />
                  ))}
                </div>
              </div>

              {/* Talleres activos por día (caída sostenida = churn) */}
              <div>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Talleres activos/día</span>
                  <span className="text-xs font-semibold tabular-nums">
                    {ultimo.talleresActivos}
                    <span className={deltaActivos >= 0 ? "ml-1.5 text-emerald-600" : "ml-1.5 text-red-600"}>
                      {deltaActivos >= 0 ? "▲" : "▼"} {Math.abs(deltaActivos)}
                    </span>
                  </span>
                </div>
                <div className="flex h-16 items-end gap-px">
                  {tendencia.map((d) => (
                    <div
                      key={`act-${d.fecha}`}
                      title={`${d.fecha} · ${d.talleresActivos} activos`}
                      className="flex-1 rounded-t bg-blue-500/80"
                      style={{ height: `${(d.talleresActivos / maxActivos) * 100}%`, minHeight: d.talleresActivos > 0 ? 3 : 0 }}
                    />
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground">
                Histórico real desde <code>daily_stats</code> (snapshot nocturno). Una caída
                sostenida de activos con MRR plano es la señal temprana de churn.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Embudo trial → pago */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            Embudo de conversión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {[
              { label: "Registros totales", n: filas.length, color: "bg-stone-400" },
              { label: "Aprobados (trial+)", n: aprobados.length, color: "bg-blue-400" },
              { label: "En trial ahora", n: enTrial.length, color: "bg-amber-400" },
              { label: "Pagando", n: pagando.length, color: "bg-emerald-500" },
            ].map((step) => {
              const pct = filas.length > 0 ? (step.n / filas.length) * 100 : 0;
              return (
                <div key={step.label} className="flex items-center gap-3">
                  <div className="w-36 shrink-0 text-xs font-medium text-muted-foreground">{step.label}</div>
                  <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-stone-100">
                    <div
                      className={`flex h-full items-center rounded-md ${step.color} px-2 transition-all`}
                      style={{ width: `${Math.max(pct, step.n > 0 ? 6 : 0)}%` }}
                    >
                      <span className="text-xs font-bold text-white">{step.n}</span>
                    </div>
                  </div>
                  <div className="w-12 shrink-0 text-right text-xs font-semibold tabular-nums">
                    {pct.toFixed(0)}%
                  </div>
                </div>
              );
            })}
          </div>
          {pendientes.length > 0 && (
            <p className="mt-3 text-[11px] text-brand-600">
              + {pendientes.length} registro{pendientes.length > 1 ? "s" : ""} pendiente
              {pendientes.length > 1 ? "s" : ""} de aprobación (fuera del embudo).
            </p>
          )}
        </CardContent>
      </Card>

      {/* Tendencia de registros */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Registros por mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-end justify-between gap-2">
              {meses.map((m) => (
                <div key={m.label} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-xs font-bold tabular-nums">{m.count}</span>
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-blue-500 to-blue-400"
                    style={{ height: `${(m.count / maxMes) * 100}%`, minHeight: m.count > 0 ? 4 : 0 }}
                  />
                  <span className="text-[10px] text-muted-foreground">{m.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Registros por semana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-end justify-between gap-1.5">
              {semanas.map((s, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-xs font-bold tabular-nums">{s.count}</span>
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-violet-500 to-violet-400"
                    style={{ height: `${(s.count / maxSem) * 100}%`, minHeight: s.count > 0 ? 4 : 0 }}
                  />
                  <span className="text-[9px] text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desglose MRR por plan */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Desglose de MRR por plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {mrrPorPlan.map((p) => {
              const pct = mrr > 0 ? (p.total / mrr) * 100 : 0;
              return (
                <div key={p.plan} className="flex items-center gap-3">
                  <div className="w-28 shrink-0 text-xs font-medium capitalize">
                    {p.plan} <span className="text-muted-foreground">({formatMoneyShort(PRECIO_PLAN[p.plan])})</span>
                  </div>
                  <div className="relative h-6 flex-1 overflow-hidden rounded-md bg-stone-100">
                    <div
                      className="h-full rounded-md bg-emerald-500"
                      style={{ width: `${Math.max(pct, p.total > 0 ? 4 : 0)}%` }}
                    />
                  </div>
                  <div className="w-32 shrink-0 text-right text-xs">
                    <span className="font-bold tabular-nums">{formatMoneyShort(p.total)}</span>
                    <span className="text-muted-foreground"> · {p.n} taller{p.n !== 1 ? "es" : ""}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
