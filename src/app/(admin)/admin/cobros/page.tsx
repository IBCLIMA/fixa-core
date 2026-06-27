import { Euro, AlertTriangle, TrendingDown, Inbox } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/stat-card";
import { getDb } from "@/db";
import { talleres } from "@/db/schema";
import { inArray, desc } from "drizzle-orm";
import { CobroActions } from "./cobro-actions";
import type { EstadoCobro } from "./acciones";
import { formatMoneyShort } from "@/lib/format";

// MRR por plan (cobro SEPA manual desde Ibañez Clima).
const MRR_PLAN: Record<string, number> = { basico: 29, taller: 49, pro: 79 };
const PLAN_LABEL: Record<string, string> = {
  basico: "Básico",
  taller: "Taller",
  pro: "Pro",
};

const ESTADO_META: Record<EstadoCobro, { label: string; dot: string; badge: string; orden: number }> = {
  impagado: { label: "🔴 Impagado", dot: "bg-red-500", badge: "bg-red-100 text-red-700 border-red-200", orden: 0 },
  pendiente: { label: "🟡 Pendiente", dot: "bg-amber-400", badge: "bg-amber-100 text-amber-700 border-amber-200", orden: 1 },
  al_corriente: { label: "🟢 Al corriente", dot: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700 border-emerald-200", orden: 2 },
};

function normEstado(e: string | null): EstadoCobro {
  return e === "impagado" || e === "pendiente" || e === "al_corriente" ? e : "al_corriente";
}

export default async function AdminCobrosPage() {
  const db = getDb();

  // Solo talleres de pago: son los que generan recibo SEPA mensual.
  const lista = await db
    .select({
      id: talleres.id,
      nombre: talleres.nombre,
      email: talleres.email,
      telefono: talleres.telefono,
      plan: talleres.plan,
      estadoCobro: talleres.estadoCobro,
      notaCobro: talleres.notaCobro,
    })
    .from(talleres)
    .where(inArray(talleres.plan, ["basico", "taller", "pro"]))
    .orderBy(desc(talleres.createdAt));

  const filas = lista
    .map((t) => ({ ...t, estado: normEstado(t.estadoCobro), mrr: MRR_PLAN[t.plan] ?? 0 }))
    .sort((a, b) => ESTADO_META[a.estado].orden - ESTADO_META[b.estado].orden);

  const impagados = filas.filter((t) => t.estado === "impagado");
  const pendientes = filas.filter((t) => t.estado === "pendiente");
  const mrrTotal = filas.reduce((s, t) => s + t.mrr, 0);
  const mrrRiesgo = impagados.reduce((s, t) => s + t.mrr, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md">
          <Euro className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Cobros</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Recibo SEPA mensual domiciliado desde Ibañez Clima. Marca el estado a mano.
          </p>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          label="Impagados"
          value={impagados.length}
          sub={`de ${filas.length} taller${filas.length === 1 ? "" : "es"} de pago`}
          icon={AlertTriangle}
          accent="stone"
          alert={impagados.length > 0}
        />
        <StatCard
          label="MRR en riesgo"
          value={formatMoneyShort(mrrRiesgo)}
          sub={`${impagados.length} impagado${impagados.length === 1 ? "" : "s"}`}
          icon={TrendingDown}
          accent="amber"
          alert={mrrRiesgo > 0}
        />
        <StatCard
          label="MRR total"
          value={formatMoneyShort(mrrTotal)}
          sub={`ARR ≈ ${formatMoneyShort(mrrTotal * 12)}`}
          icon={Euro}
          accent="emerald"
        />
      </div>

      {(impagados.length > 0 || pendientes.length > 0) && (
        <p className="text-xs text-muted-foreground -mt-2">
          {impagados.length > 0 && <span className="text-red-600 font-semibold">{impagados.length} impagado(s)</span>}
          {impagados.length > 0 && pendientes.length > 0 && " · "}
          {pendientes.length > 0 && <span className="text-amber-600 font-semibold">{pendientes.length} pendiente(s)</span>}
          {" "}requieren atención.
        </p>
      )}

      {/* Listado */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Talleres de pago ({filas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filas.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100">
                <Inbox className="h-6 w-6 text-stone-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-700">Aún no hay talleres de pago</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Cuando un taller pase a un plan de pago aparecerá aquí su recibo SEPA mensual.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filas.map((t) => {
                const meta = ESTADO_META[t.estado];
                const destacado = t.estado === "impagado";
                return (
                  <div
                    key={t.id}
                    className={`rounded-xl border p-4 ${destacado ? "border-red-300 bg-red-50/40" : t.estado === "pendiente" ? "border-amber-200 bg-amber-50/30" : "border-stone-200"}`}
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${meta.dot}`} />
                          <p className="font-bold">{t.nombre}</p>
                          <Badge variant="outline" className={`text-[10px] ${meta.badge}`}>{meta.label}</Badge>
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">
                            {PLAN_LABEL[t.plan]} · {formatMoneyShort(t.mrr)}/mes
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                          {t.email && <span>{t.email}</span>}
                          {t.telefono && <span>{t.telefono}</span>}
                        </div>
                        {t.notaCobro && (
                          <p className="mt-2 rounded-md bg-stone-100 px-2.5 py-1.5 text-xs text-stone-600">
                            📝 {t.notaCobro}
                          </p>
                        )}
                      </div>

                      <div className="lg:max-w-md lg:shrink-0">
                        <CobroActions
                          tallerId={t.id}
                          estadoActual={t.estado}
                          notaActual={t.notaCobro}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
