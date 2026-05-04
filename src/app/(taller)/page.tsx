import {
  Car,
  ClipboardList,
  CalendarDays,
  AlertTriangle,
  Receipt,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { ordenesTrabajo, clientes, citas } from "@/db/schema";
import { eq, and, count, sql } from "drizzle-orm";

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
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();
  const hoy = new Date().toISOString().split("T")[0];

  // Queries simples y directas
  const [cochesResult] = await db
    .select({ count: count() })
    .from(ordenesTrabajo)
    .where(
      and(
        eq(ordenesTrabajo.tallerId, tallerId),
        sql`${ordenesTrabajo.estado} NOT IN ('entregado', 'cancelado')`
      )
    );

  const [clientesResult] = await db
    .select({ count: count() })
    .from(clientes)
    .where(eq(clientes.tallerId, tallerId));

  const [citasResult] = await db
    .select({ count: count() })
    .from(citas)
    .where(and(eq(citas.tallerId, tallerId), eq(citas.fecha, hoy)));

  const cochesEnTaller = cochesResult?.count ?? 0;
  const totalClientes = clientesResult?.count ?? 0;
  const citasHoy = citasResult?.count ?? 0;

  const fechaHoy = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground capitalize">{fechaHoy}</p>
          <h1 className="text-2xl font-extrabold tracking-tight mt-0.5">Panel del día</h1>
        </div>
        <Link href="/ordenes/nueva">
          <Button size="sm" className="rounded-full">
            <Plus className="mr-1.5 h-4 w-4" />Nueva orden
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
                <p className="text-2xl font-extrabold leading-none">{cochesEnTaller}</p>
                <p className="text-xs text-muted-foreground mt-0.5">En taller</p>
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
                <p className="text-2xl font-extrabold leading-none">{citasHoy}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Citas hoy</p>
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
                <p className="text-2xl font-extrabold leading-none">{totalClientes}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Clientes</p>
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
                <p className="text-2xl font-extrabold leading-none">0</p>
                <p className="text-xs text-muted-foreground mt-0.5">Listos</p>
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
                  Ver todos<ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {cochesEnTaller === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Car className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No hay coches en taller</p>
                <Link href="/ordenes/nueva" className="mt-3">
                  <Button size="sm" variant="outline" className="rounded-full">
                    <Plus className="mr-1 h-3 w-3" />Nueva orden
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {cochesEnTaller} vehículo{cochesEnTaller !== 1 ? "s" : ""} en reparación.{" "}
                <Link href="/ordenes" className="text-brand font-semibold hover:underline">Ver órdenes</Link>
              </p>
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
                  Calendario<ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {citasHoy === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CalendarDays className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No hay citas para hoy</p>
                <Link href="/calendario" className="mt-3">
                  <Button size="sm" variant="outline" className="rounded-full">
                    <Plus className="mr-1 h-3 w-3" />Nueva cita
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {citasHoy} cita{citasHoy !== 1 ? "s" : ""} programada{citasHoy !== 1 ? "s" : ""}.{" "}
                <Link href="/calendario" className="text-brand font-semibold hover:underline">Ver calendario</Link>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
