import { ClipboardList, FileText, Bell, TrendingUp } from "lucide-react";
import { StatCard, type StatAccent } from "@/components/stat-card";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { ordenesTrabajo, presupuestos, avisos } from "@/db/schema";
import { eq, and, count, sql, gte } from "drizzle-orm";

export const metadata = { title: "Tu taller en números" };

export default async function MetricasPage() {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const ahora = new Date();
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString();

  const [
    [ordenesTotal],
    [ordenesMes],
    [presupuestosEnviados],
    [presupuestosAceptados],
    [itvAvisadas],
  ] = await Promise.all([
    db.select({ total: count() }).from(ordenesTrabajo).where(eq(ordenesTrabajo.tallerId, tallerId)),
    db.select({ total: count() }).from(ordenesTrabajo).where(and(eq(ordenesTrabajo.tallerId, tallerId), gte(ordenesTrabajo.createdAt, new Date(inicioMes)))),
    db.select({ total: count() }).from(presupuestos).where(and(eq(presupuestos.tallerId, tallerId), sql`${presupuestos.estado} IN ('enviado','aceptado','rechazado')`)),
    db.select({ total: count() }).from(presupuestos).where(and(eq(presupuestos.tallerId, tallerId), eq(presupuestos.estado, "aceptado"))),
    db.select({ total: count() }).from(avisos).where(and(eq(avisos.tallerId, tallerId), eq(avisos.tipo, "itv"))),
  ]);

  const totalOrdenes = Number(ordenesTotal?.total ?? 0);
  const mesTotalOrdenes = Number(ordenesMes?.total ?? 0);
  const totalPresEnviados = Number(presupuestosEnviados?.total ?? 0);
  const totalPresAceptados = Number(presupuestosAceptados?.total ?? 0);
  const totalItv = Number(itvAvisadas?.total ?? 0);

  const tasaAceptacion = totalPresEnviados > 0 ? Math.round((totalPresAceptados / totalPresEnviados) * 100) : 0;

  // Solo números reales, calculados desde la BD. Nada estimado ni inventado.
  const kpis: {
    icon: typeof ClipboardList;
    valor: React.ReactNode;
    label: string;
    sub: string;
    accent: StatAccent;
  }[] = [
    {
      icon: ClipboardList,
      valor: mesTotalOrdenes,
      label: "Órdenes este mes",
      sub: `${totalOrdenes} en total`,
      accent: "blue",
    },
    {
      icon: FileText,
      valor: totalPresEnviados,
      label: "Presupuestos enviados",
      sub: `${totalPresAceptados} aceptados`,
      accent: "emerald",
    },
    {
      icon: TrendingUp,
      valor: `${tasaAceptacion}%`,
      label: "Tasa de aceptación",
      sub: "de los presupuestos que envías",
      accent: "violet",
    },
    {
      icon: Bell,
      valor: totalItv,
      label: "ITVs avisadas",
      sub: "Trabajo que antes se escapaba",
      accent: "amber",
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Tu taller en números</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Lo que ha pasado en tu taller desde que empezaste con FIXA.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {kpis.map((kpi) => (
          <StatCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.valor}
            sub={kpi.sub}
            icon={kpi.icon}
            accent={kpi.accent}
          />
        ))}
      </div>

      {totalOrdenes === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center">
          <ClipboardList className="h-10 w-10 text-muted-foreground/20 mb-3" />
          <h3 className="text-sm font-bold">Aún no hay datos</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Crea tu primera orden y los números empezarán a aparecer aquí.
          </p>
        </div>
      )}
    </div>
  );
}
