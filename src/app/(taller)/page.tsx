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

export default function PanelDelDia() {
  // TODO: Fetch real data from DB
  const cochesEnTaller = 0;
  const citasHoy = 0;
  const presupuestosPendientes = 0;
  const facturacionPendiente = 0;

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
        <div className="flex gap-2">
          <Link href="/ordenes/nueva">
            <Button size="sm" className="rounded-full">
              <Plus className="mr-1.5 h-4 w-4" />
              Nueva orden
            </Button>
          </Link>
        </div>
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
                  {cochesEnTaller}
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
                  {citasHoy}
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
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-extrabold leading-none">
                  {presupuestosPendientes}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Ptos. pendientes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <Receipt className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-extrabold leading-none">
                  {facturacionPendiente}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Por facturar
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
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Car className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                No hay coches en taller
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Crea una orden de trabajo para empezar
              </p>
              <Link href="/ordenes/nueva" className="mt-3">
                <Button size="sm" variant="outline" className="rounded-full">
                  <Plus className="mr-1 h-3 w-3" />
                  Nueva orden
                </Button>
              </Link>
            </div>
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
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CalendarDays className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                No hay citas para hoy
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Agenda citas desde el calendario
              </p>
              <Link href="/calendario" className="mt-3">
                <Button size="sm" variant="outline" className="rounded-full">
                  <Plus className="mr-1 h-3 w-3" />
                  Nueva cita
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Alertas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              Alertas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-4">
              Sin alertas por ahora
            </p>
          </CardContent>
        </Card>

        {/* Actividad reciente */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Actividad reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-4">
              Sin actividad registrada
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
