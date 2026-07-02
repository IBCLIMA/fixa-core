import { Rocket, Eye, FileCheck, ClipboardList, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getDb } from "@/db";
import { talleres, ordenesTrabajo, portalViews, presupuestos } from "@/db/schema";
import { eq, and, gte, count, min, max, isNotNull, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pilotos" };

/**
 * Seguimiento semanal de los pilotos — las 3 métricas que definen el éxito
 * (ver docs/PILOTOS.md): ¿lo usan (órdenes)?, ¿los clientes abren el portal?,
 * ¿aceptan presupuestos online? Todo sale de datos que ya se capturan
 * (ordenes_trabajo, portal_views, presupuestos.aceptado_at) — este panel solo
 * los junta para no tener que hacer SQL a mano cada semana.
 */
export default async function PilotosPage() {
  const db = getDb();
  const hace7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const lista = await db
    .select({
      id: talleres.id,
      nombre: talleres.nombre,
      plan: talleres.plan,
      esPiloto: talleres.esPiloto,
      ultimoAcceso: talleres.ultimoAcceso,
      createdAt: talleres.createdAt,
    })
    .from(talleres)
    .orderBy(sql`${talleres.esPiloto} DESC, ${talleres.createdAt} DESC`);

  // Métricas por taller en 4 pasadas agregadas (no por-taller: son pocas filas).
  const [ordenesAgg, ordenes7Agg, vistasAgg, vistas7Agg, presAgg, pres7Agg, primeraOrAgg] = await Promise.all([
    db.select({ tallerId: ordenesTrabajo.tallerId, n: count() }).from(ordenesTrabajo).groupBy(ordenesTrabajo.tallerId),
    db.select({ tallerId: ordenesTrabajo.tallerId, n: count() }).from(ordenesTrabajo).where(gte(ordenesTrabajo.createdAt, hace7)).groupBy(ordenesTrabajo.tallerId),
    db.select({ tallerId: portalViews.tallerId, n: count() }).from(portalViews).groupBy(portalViews.tallerId),
    db.select({ tallerId: portalViews.tallerId, n: count() }).from(portalViews).where(gte(portalViews.createdAt, hace7)).groupBy(portalViews.tallerId),
    db.select({ tallerId: presupuestos.tallerId, n: count() }).from(presupuestos).where(and(eq(presupuestos.estado, "aceptado"), isNotNull(presupuestos.aceptadoIp))).groupBy(presupuestos.tallerId),
    db.select({ tallerId: presupuestos.tallerId, n: count() }).from(presupuestos).where(and(eq(presupuestos.estado, "aceptado"), isNotNull(presupuestos.aceptadoIp), gte(presupuestos.aceptadoAt, hace7))).groupBy(presupuestos.tallerId),
    db.select({ tallerId: ordenesTrabajo.tallerId, primera: min(ordenesTrabajo.createdAt), ultima: max(ordenesTrabajo.createdAt) }).from(ordenesTrabajo).groupBy(ordenesTrabajo.tallerId),
  ]);

  const porTaller = (rows: { tallerId: string; n: number }[]) =>
    Object.fromEntries(rows.map((r) => [r.tallerId, Number(r.n)]));
  const ordenesTotal = porTaller(ordenesAgg);
  const ordenes7 = porTaller(ordenes7Agg);
  const vistasTotal = porTaller(vistasAgg);
  const vistas7 = porTaller(vistas7Agg);
  const presTotal = porTaller(presAgg);
  const pres7 = porTaller(pres7Agg);
  const actividad = Object.fromEntries(primeraOrAgg.map((r) => [r.tallerId, r]));

  const fmt = (d: Date | null | undefined) =>
    d ? new Date(d).toLocaleDateString("es-ES", { day: "numeric", month: "short" }) : "—";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <Rocket className="h-6 w-6 text-violet-600" /> Pilotos
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Lo que importa cada semana: ¿lo usan?, ¿sus clientes abren el portal?, ¿aceptan presupuestos online?
        </p>
      </div>

      <div className="space-y-3">
        {lista.map((t) => {
          const act = actividad[t.id];
          return (
            <Link key={t.id} href={`/admin/talleres/${t.id}`} className="block">
              <Card className={`transition-colors hover:border-stone-300 ${t.esPiloto ? "border-violet-200 bg-violet-50/30" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="min-w-[180px] flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold">{t.nombre}</p>
                        {t.esPiloto ? (
                          <Badge className="bg-violet-100 text-violet-700 text-[10px]">PILOTO</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px]">{t.plan}</Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Alta {fmt(t.createdAt)} · 1ª OR {fmt(act?.primera)} · última OR {fmt(act?.ultima)}
                      </p>
                    </div>

                    <Metric icon={ClipboardList} label="Órdenes" semana={ordenes7[t.id] ?? 0} total={ordenesTotal[t.id] ?? 0} />
                    <Metric icon={Eye} label="Portal abierto" semana={vistas7[t.id] ?? 0} total={vistasTotal[t.id] ?? 0} accent="text-emerald-600" />
                    <Metric icon={FileCheck} label="Presu. online" semana={pres7[t.id] ?? 0} total={presTotal[t.id] ?? 0} accent="text-brand-600" />

                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground min-w-[110px]">
                      <Clock className="h-3.5 w-3.5" />
                      Último acceso: {fmt(t.ultimoAcceso)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
        {lista.length === 0 && (
          <p className="text-sm text-muted-foreground py-8 text-center">Aún no hay talleres.</p>
        )}
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, semana, total, accent = "text-foreground" }: {
  icon: typeof Eye; label: string; semana: number; total: number; accent?: string;
}) {
  return (
    <div className="min-w-[110px]">
      <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
        <Icon className="h-3 w-3" /> {label}
      </p>
      <p className="text-sm font-extrabold mt-0.5">
        <span className={accent}>{semana}</span>
        <span className="text-[11px] font-medium text-muted-foreground"> esta semana · {total} total</span>
      </p>
    </div>
  );
}
