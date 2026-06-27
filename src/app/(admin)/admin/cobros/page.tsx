import { Euro, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <div className="grid grid-cols-3 gap-3">
        <Card className={impagados.length > 0 ? "border-red-300 bg-red-50/40" : "border-emerald-200 bg-emerald-50/30"}>
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5">
              {impagados.length > 0 && <AlertTriangle className="h-3.5 w-3.5 text-red-600" />}
              <p className={`text-xs font-bold uppercase tracking-wider ${impagados.length > 0 ? "text-red-600" : "text-emerald-600"}`}>Impagados</p>
            </div>
            <p className={`text-2xl font-extrabold mt-1 ${impagados.length > 0 ? "text-red-700" : "text-emerald-800"}`}>{impagados.length}</p>
          </CardContent>
        </Card>
        <Card className={mrrRiesgo > 0 ? "border-red-300 bg-red-50/40" : undefined}>
          <CardContent className="p-4">
            <p className={`text-xs font-bold uppercase tracking-wider ${mrrRiesgo > 0 ? "text-red-600" : "text-muted-foreground"}`}>MRR en riesgo</p>
            <p className={`text-2xl font-extrabold mt-1 ${mrrRiesgo > 0 ? "text-red-700" : ""}`}>{formatMoneyShort(mrrRiesgo)}</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">MRR total</p>
            <p className="text-2xl font-extrabold text-emerald-800 mt-1">{formatMoneyShort(mrrTotal)}</p>
          </CardContent>
        </Card>
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
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aún no hay talleres con plan de pago.
            </p>
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
