import { ClipboardList, FileText, Bell, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard, type StatAccent } from "@/components/stat-card";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { ordenesTrabajo, presupuestos, lineasOrden, avisos } from "@/db/schema";
import { eq, and, count, sql, gte } from "drizzle-orm";
import { formatMoneyShort } from "@/lib/format";

export const metadata = { title: "Tu taller en números" };

export default async function MetricasPage() {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const ahora = new Date();
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString();
  const hace30Dias = new Date(ahora.getTime() - 30 * 86400000).toISOString();

  const [
    [ordenesTotal],
    [ordenesMes],
    [presupuestosEnviados],
    [presupuestosAceptados],
    [itvAvisadas],
    [lineasMes],
  ] = await Promise.all([
    db.select({ total: count() }).from(ordenesTrabajo).where(eq(ordenesTrabajo.tallerId, tallerId)),
    db.select({ total: count() }).from(ordenesTrabajo).where(and(eq(ordenesTrabajo.tallerId, tallerId), gte(ordenesTrabajo.createdAt, new Date(inicioMes)))),
    db.select({ total: count() }).from(presupuestos).where(and(eq(presupuestos.tallerId, tallerId), sql`${presupuestos.estado} IN ('enviado','aceptado','rechazado')`)),
    db.select({ total: count() }).from(presupuestos).where(and(eq(presupuestos.tallerId, tallerId), eq(presupuestos.estado, "aceptado"))),
    db.select({ total: count() }).from(avisos).where(and(eq(avisos.tallerId, tallerId), eq(avisos.tipo, "itv"))),
    db.select({ total: count() }).from(lineasOrden)
      .innerJoin(ordenesTrabajo, eq(lineasOrden.ordenId, ordenesTrabajo.id))
      .where(and(eq(ordenesTrabajo.tallerId, tallerId), gte(ordenesTrabajo.createdAt, new Date(inicioMes)))),
  ]);

  const totalOrdenes = Number(ordenesTotal?.total ?? 0);
  const mesTotalOrdenes = Number(ordenesMes?.total ?? 0);
  const totalPresEnviados = Number(presupuestosEnviados?.total ?? 0);
  const totalPresAceptados = Number(presupuestosAceptados?.total ?? 0);
  const totalItv = Number(itvAvisadas?.total ?? 0);
  const totalLineas = Number(lineasMes?.total ?? 0);

  // Estimación de horas ahorradas: 3 min por orden + 10 min por presupuesto + 2 min por ITV avisada
  const minutosAhorrados = (totalOrdenes * 3) + (totalPresEnviados * 10) + (totalItv * 2);
  const horasAhorradas = Math.round(minutosAhorrados / 60);

  const tasaAceptacion = totalPresEnviados > 0 ? Math.round((totalPresAceptados / totalPresEnviados) * 100) : 0;

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
      sub: `${totalPresAceptados} aceptados (${tasaAceptacion}%)`,
      accent: "emerald",
    },
    {
      icon: Bell,
      valor: totalItv,
      label: "ITVs avisadas",
      sub: "Trabajo que antes se escapaba",
      accent: "amber",
    },
    {
      icon: Clock,
      valor: `${horasAhorradas}h`,
      label: "Horas ahorradas (estimado)",
      sub: `${minutosAhorrados} min en tareas que antes hacías a mano`,
      accent: "violet",
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Tu taller en números</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Lo que FIXA ha hecho por ti desde que empezaste. Si estos números te ahorran más de 29€/mes, ya se paga solo.
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

      {/* Valor económico estimado */}
      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50/50">
        <CardContent className="p-6 text-center">
          <TrendingUp className="h-8 w-8 text-orange-500 mx-auto mb-3" />
          <p className="text-sm font-bold text-orange-900">Valor estimado de lo que FIXA te ha ahorrado</p>
          <p className="text-4xl font-extrabold text-orange-600 mt-2">
            {formatMoneyShort(horasAhorradas * 35)}
          </p>
          <p className="text-xs text-orange-700 mt-2">
            Basado en {horasAhorradas}h × 35€/hora de mano de obra.
            FIXA cuesta {mesTotalOrdenes > 0 ? "29€/mes" : "nada (estás en prueba gratuita)"}.
          </p>
        </CardContent>
      </Card>

      {totalOrdenes === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">Aún no hay datos — crea tu primera orden y los números empezarán a aparecer.</p>
        </div>
      )}
    </div>
  );
}
