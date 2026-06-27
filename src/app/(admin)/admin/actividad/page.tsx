import { Activity, PhoneCall, Skull, CircleDot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDb } from "@/db";
import { talleres } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

export const metadata = { title: "Actividad · FIXA Admin" };
export const dynamic = "force-dynamic";

const DIA = 86_400_000;
const PLANES_PAGO = ["basico", "taller", "pro"];

// Umbrales del semáforo (días). Ajustables sin tocar la lógica.
const ACTIVO_DIAS = 3; // acceso/acción en los últimos N días ⇒ verde
const ENFRIANDOSE_MAX = 21; // entre ACTIVO_DIAS y este valor ⇒ amarillo (llamar)
const MUERTO_ANTIGUEDAD = 7; // registrado hace >= N días sin actividad real ⇒ rojo

type Estado = "activo" | "enfriandose" | "muerto";

function diasDesde(fecha: Date | null, ahora: number): number | null {
  if (!fecha) return null;
  return Math.floor((ahora - new Date(fecha).getTime()) / DIA);
}

export default async function ActividadPage() {
  const db = getDb();

  // Por taller: última conexión + nº de acciones (órdenes + citas) en 7d / 30d.
  // Las subconsultas correlacionadas son baratas con pocos talleres.
  //
  // NOTA escala: a partir de cientos de talleres conviene un cron que precalcule
  // estas cuentas a una tabla `daily_stats(taller_id, fecha, ordenes, citas, ...)`
  // y aquí solo agregar. Calcularlo al vuelo deja de ser viable con muchas filas.
  const filas = await db
    .select({
      id: talleres.id,
      nombre: talleres.nombre,
      plan: talleres.plan,
      activo: talleres.activo,
      ultimoAcceso: talleres.ultimoAcceso,
      createdAt: talleres.createdAt,
      ordenes7d: sql<number>`(SELECT COUNT(*) FROM ordenes_trabajo o WHERE o.taller_id = ${talleres.id} AND o.created_at > NOW() - INTERVAL '7 days')`,
      ordenes30d: sql<number>`(SELECT COUNT(*) FROM ordenes_trabajo o WHERE o.taller_id = ${talleres.id} AND o.created_at > NOW() - INTERVAL '30 days')`,
      ordenesTotal: sql<number>`(SELECT COUNT(*) FROM ordenes_trabajo o WHERE o.taller_id = ${talleres.id})`,
      citas7d: sql<number>`(SELECT COUNT(*) FROM citas c WHERE c.taller_id = ${talleres.id} AND c.created_at > NOW() - INTERVAL '7 days')`,
      citas30d: sql<number>`(SELECT COUNT(*) FROM citas c WHERE c.taller_id = ${talleres.id} AND c.created_at > NOW() - INTERVAL '30 days')`,
    })
    .from(talleres)
    .orderBy(desc(talleres.createdAt));

  const ahora = Date.now();

  // Excluimos los pendientes de aprobación: aún no son "usuarios" de la app.
  const operativos = filas.filter((t) => t.plan !== "pendiente");

  const enriquecidos = operativos.map((t) => {
    const o7 = Number(t.ordenes7d), o30 = Number(t.ordenes30d), oT = Number(t.ordenesTotal);
    const c7 = Number(t.citas7d), c30 = Number(t.citas30d);
    const acciones7d = o7 + c7;
    const acciones30d = o30 + c30;
    const tieneHistorial = oT > 0; // alguna vez creó una orden

    const diasAcceso = diasDesde(t.ultimoAcceso, ahora);
    const diasRegistro = diasDesde(t.createdAt, ahora) ?? 0;

    // "Días en silencio": el menor entre días-desde-último-acceso y
    // días-desde-última-acción reciente. Como solo tenemos contadores de
    // ventana (no la fecha exacta de la última acción), aproximamos:
    //  - si hubo acción en 7d ⇒ silencio <= 7
    //  - si hubo acción en 30d ⇒ silencio <= 30
    let diasSilencio: number;
    if (acciones7d > 0) diasSilencio = Math.min(diasAcceso ?? 7, 7);
    else if (acciones30d > 0) diasSilencio = Math.min(diasAcceso ?? 30, 30);
    else diasSilencio = diasAcceso ?? diasRegistro;

    // ── Semáforo ──────────────────────────────────────────────────
    let estado: Estado;
    if (acciones7d > 0 || (diasAcceso !== null && diasAcceso <= ACTIVO_DIAS)) {
      estado = "activo";
    } else if (!tieneHistorial && acciones30d === 0 && diasRegistro >= MUERTO_ANTIGUEDAD) {
      // Se registró y nunca hizo nada real ⇒ muerto.
      estado = "muerto";
    } else if (diasSilencio <= ENFRIANDOSE_MAX) {
      // Antes activo, ahora callado dentro de la ventana de rescate ⇒ llamar.
      estado = "enfriandose";
    } else {
      // Silencio prolongado: lo tratamos como muerto.
      estado = "muerto";
    }

    return { ...t, acciones7d, acciones30d, oT, diasAcceso, diasRegistro, diasSilencio, estado, tieneHistorial };
  });

  // Orden por riesgo: enfriándose (rescatable, máxima prioridad) → muerto → activo.
  // Dentro de cada grupo, más días en silencio arriba.
  const prioridad: Record<Estado, number> = { enfriandose: 0, muerto: 1, activo: 2 };
  enriquecidos.sort((a, b) => {
    if (prioridad[a.estado] !== prioridad[b.estado]) return prioridad[a.estado] - prioridad[b.estado];
    return b.diasSilencio - a.diasSilencio;
  });

  // ── Resumen global (DAU / WAU / MAU aprox por último acceso) ──────
  const activosHoy = operativos.filter((t) => {
    const d = diasDesde(t.ultimoAcceso, ahora);
    return d !== null && d < 1;
  }).length;
  const activos7d = operativos.filter((t) => {
    const d = diasDesde(t.ultimoAcceso, ahora);
    return (d !== null && d <= 7) || Number(t.ordenes7d) + Number(t.citas7d) > 0;
  }).length;
  const activos30d = operativos.filter((t) => {
    const d = diasDesde(t.ultimoAcceso, ahora);
    return (d !== null && d <= 30) || Number(t.ordenes30d) + Number(t.citas30d) > 0;
  }).length;

  // % de trials que ACTIVAN de verdad (crearon ≥1 orden).
  const trials = operativos.filter((t) => t.plan === "trial");
  const trialsActivados = trials.filter((t) => Number(t.ordenesTotal) > 0).length;
  const pctActivacion = trials.length > 0 ? (trialsActivados / trials.length) * 100 : 0;

  const conteo = {
    activo: enriquecidos.filter((t) => t.estado === "activo").length,
    enfriandose: enriquecidos.filter((t) => t.estado === "enfriandose").length,
    muerto: enriquecidos.filter((t) => t.estado === "muerto").length,
  };

  const estiloEstado: Record<Estado, { dot: string; badge: string; label: string; icon: typeof CircleDot; row: string }> = {
    activo: { dot: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700", label: "Activo", icon: CircleDot, row: "border-stone-200" },
    enfriandose: { dot: "bg-amber-500", badge: "bg-amber-100 text-amber-700", label: "Enfriándose · llamar ya", icon: PhoneCall, row: "border-amber-300 bg-amber-50/50" },
    muerto: { dot: "bg-red-500", badge: "bg-red-100 text-red-700", label: "Muerto", icon: Skull, row: "border-red-200 bg-red-50/40" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-md">
          <Activity className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Actividad y uso</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Quién usa FIXA y a quién hay que rescatar antes de perderlo
          </p>
        </div>
      </div>

      {/* Resumen global */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Activos hoy</p>
            <p className="text-2xl font-extrabold mt-1">{activosHoy}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">≈ DAU</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Activos 7d</p>
            <p className="text-2xl font-extrabold mt-1">{activos7d}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">≈ WAU</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Activos 30d</p>
            <p className="text-2xl font-extrabold mt-1">{activos30d}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">≈ MAU</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50/40">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Trials activados</p>
            <p className="text-2xl font-extrabold text-blue-800 mt-1">{pctActivacion.toFixed(0)}%</p>
            <p className="text-[11px] text-blue-600/80 mt-0.5">{trialsActivados}/{trials.length} crearon ≥1 orden</p>
          </CardContent>
        </Card>
      </div>

      {/* Semáforo resumen */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
          <p className="text-xl font-extrabold text-emerald-700">🟢 {conteo.activo}</p>
          <p className="text-xs text-emerald-600 font-medium">Activos</p>
        </div>
        <div className={`rounded-xl border p-3 text-center ${conteo.enfriandose > 0 ? "border-amber-300 bg-amber-50 animate-pulse" : "border-amber-200 bg-amber-50/50"}`}>
          <p className="text-xl font-extrabold text-amber-700">🟡 {conteo.enfriandose}</p>
          <p className="text-xs text-amber-600 font-medium">Enfriándose</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center">
          <p className="text-xl font-extrabold text-red-700">🔴 {conteo.muerto}</p>
          <p className="text-xs text-red-600 font-medium">Muertos</p>
        </div>
      </div>

      {/* Lista por taller ordenada por riesgo */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Talleres por riesgo ({enriquecidos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {enriquecidos.map((t) => {
              const s = estiloEstado[t.estado];
              const Icono = s.icon;
              return (
                <div key={t.id} className={`rounded-xl border p-3.5 ${s.row}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${s.dot}`} />
                        <p className="font-bold truncate">{t.nombre}</p>
                        <Badge className={`text-[10px] gap-1 ${s.badge}`}>
                          <Icono className="h-3 w-3" />
                          {s.label}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {PLANES_PAGO.includes(t.plan) ? `${t.plan} ·pago` : t.plan}
                        </Badge>
                        {!t.activo && <Badge variant="outline" className="text-[10px] text-red-500 border-red-200">Desactivado</Badge>}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 flex-wrap">
                        <span><b className="text-foreground">{t.acciones7d}</b> acciones 7d</span>
                        <span><b className="text-foreground">{t.acciones30d}</b> acciones 30d</span>
                        <span><b className="text-foreground">{t.oT}</b> órdenes total</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1.5 flex-wrap">
                        <span>
                          Última conexión:{" "}
                          {t.ultimoAcceso ? (
                            <b className="text-foreground">
                              {t.diasAcceso === 0 ? "hoy" : `hace ${t.diasAcceso}d`}
                            </b>
                          ) : (
                            <span className="text-red-500">nunca registrada</span>
                          )}
                        </span>
                        <span>·</span>
                        <span>
                          {t.estado === "activo"
                            ? "Sin riesgo"
                            : `${t.diasSilencio}d en silencio`}
                        </span>
                        <span>·</span>
                        <span>Registrado hace {t.diasRegistro}d</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {enriquecidos.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100">
                  <Activity className="h-6 w-6 text-stone-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-700">Sin talleres operativos</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    En cuanto un taller aprobado empiece a trabajar, verás aquí su nivel de uso y riesgo.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <p className="text-[11px] text-muted-foreground">
        Aviso: <code>ultimoAcceso</code> hoy solo se escribe al registrarse, no en cada login,
        así que la última conexión puede estar desactualizada. El semáforo se apoya sobre todo
        en órdenes y citas creadas (señal de uso fiable). Para precisión real, actualizar
        <code> ultimoAcceso</code> en el login del usuario.
      </p>
    </div>
  );
}
