import {
  Car,
  Users,
  ClipboardList,
  Receipt,
  TrendingUp,
  Clock,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    name: "Vehículos en taller",
    value: "0",
    icon: Car,
    color: "text-blue-500",
  },
  {
    name: "Clientes activos",
    value: "0",
    icon: Users,
    color: "text-green-500",
  },
  {
    name: "Órdenes abiertas",
    value: "0",
    icon: ClipboardList,
    color: "text-orange-500",
  },
  {
    name: "Facturación mes",
    value: "0 €",
    icon: Receipt,
    color: "text-emerald-500",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen de tu taller
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Órdenes recientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4" />
              Órdenes recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No hay órdenes todavía. Crea tu primera orden de reparación.
            </p>
          </CardContent>
        </Card>

        {/* Citas del día */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-4 w-4" />
              Citas de hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No hay citas programadas para hoy.
            </p>
          </CardContent>
        </Card>

        {/* Avisos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4" />
              Avisos de mantenimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No hay avisos pendientes.
            </p>
          </CardContent>
        </Card>

        {/* Rendimiento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Órdenes completadas</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tiempo medio reparación</span>
                <span className="font-medium">—</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ticket medio</span>
                <span className="font-medium">0 €</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
