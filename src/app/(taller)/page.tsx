import {
  Car,
  ClipboardList,
  CalendarDays,
  AlertTriangle,
  Receipt,
  Clock,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getOrdenes, getEstadisticasTaller } from "./actions/ordenes";
import { getCitasDelDia, contarCitasHoy } from "./actions/citas";

const estadoLabels: Record<string, string> = {
  recibido: "Recibido",
  diagnostico: "Diagnóstico",
  presupuestado: "Presupuestado",
  aprobado: "Aprobado",
  en_reparacion: "En reparación",
  esperando_recambio: "Esp. recambio",
  listo: "Listo",
};

const estadoDots: Record<string, string> = {
  recibido: "bg-zinc-400",
  diagnostico: "bg-blue-500",
  presupuestado: "bg-amber-500",
  aprobado: "bg-emerald-500",
  en_reparacion: "bg-brand",
  esperando_recambio: "bg-red-500",
  listo: "bg-emerald-600",
};

export default async function PanelDelDia() {
  const [stats, citasHoy, ordenes] = await Promise.all([
    getEstadisticasTaller(),
    getCitasDelDia(),
    getOrdenes(),
  ]);

  const citasHoyCount = citasHoy.length;
  const cochesEnTaller = ordenes.filter(
    (o) => !["entregado", "cancelado"].includes(o.estado)
  );
  const cochesListos = ordenes.filter((o) => o.estado === "listo");

  const hoy = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground capitalize">
            {hoy}
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight mt-0.5">
            Panel del día
          </h1>
        </div>
        <Link href="/ordenes/nueva">
          <Button size="sm" className="rounded-full">
            <Plus className="mr-1.5 h-4 w-4" />
            Nueva orden
          </Button>
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Car className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-extrabold leading-none">
                  {cochesEnTaller.length}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  En taller
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
                <CalendarDays className="h-5 w-5 text-brand" />
              </div>
              <div>
                <p className="text-2xl font-extrabold leading-none">
                  {citasHoyCount}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Citas hoy
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <ClipboardList className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-extrabold leading-none">
                  {cochesListos.length}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Listos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
                <Receipt className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-extrabold leading-none">
                  {stats.totalClientes}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Clientes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Coches en taller */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
                Coches en taller
              </CardTitle>
              <Link href="/ordenes">
                <Button variant="ghost" size="sm" className="text-xs">
                  Ver todos
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {cochesEnTaller.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Car className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">
                  No hay coches en taller
                </p>
                <Link href="/ordenes/nueva" className="mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Nueva orden
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {cochesEnTaller.slice(0, 5).map((orden) => (
                  <Link
                    key={orden.id}
                    href={`/ordenes/${orden.id}`}
                    className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${estadoDots[orden.estado] || "bg-zinc-400"}`}
                      />
                      <div>
                        <p className="text-sm font-bold">
                          {orden.vehiculo?.matricula}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {orden.cliente?.nombre}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {estadoLabels[orden.estado]}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Citas de hoy */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                Citas de hoy
              </CardTitle>
              <Link href="/calendario">
                <Button variant="ghost" size="sm" className="text-xs">
                  Calendario
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {citasHoy.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CalendarDays className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">
                  No hay citas para hoy
                </p>
                <Link href="/calendario" className="mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Nueva cita
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {citasHoy.map((cita) => (
                  <div
                    key={cita.id}
                    className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      {cita.horaInicio && (
                        <span className="text-xs font-mono text-muted-foreground bg-background px-1.5 py-0.5 rounded">
                          {cita.horaInicio.slice(0, 5)}
                        </span>
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {cita.nombreCliente}
                        </p>
                        {cita.motivo && (
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {cita.motivo}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Coches listos */}
        {cochesListos.length > 0 && (
          <Card className="border-emerald-200 bg-emerald-50/30 lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-emerald-700">
                <AlertTriangle className="h-4 w-4" />
                Listos para entregar ({cochesListos.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2">
                {cochesListos.map((orden) => (
                  <Link
                    key={orden.id}
                    href={`/ordenes/${orden.id}`}
                    className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 border border-emerald-200 hover:border-emerald-300 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-bold">
                        {orden.vehiculo?.matricula}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {orden.cliente?.nombre}
                      </p>
                    </div>
                    <Badge className="bg-emerald-500 text-white text-[10px]">
                      Listo
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
