import { Plus, ClipboardList, Search, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getOrdenes } from "../actions/ordenes";

const estadoLabels: Record<string, string> = {
  recibido: "Recibido",
  diagnostico: "En diagnóstico",
  presupuestado: "Presupuestado",
  aprobado: "Aprobado",
  en_reparacion: "En reparación",
  esperando_recambio: "Esperando recambio",
  listo: "Listo",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const estadoColors: Record<string, string> = {
  recibido: "bg-zinc-100 text-zinc-700",
  diagnostico: "bg-blue-100 text-blue-700",
  presupuestado: "bg-amber-100 text-amber-700",
  aprobado: "bg-emerald-100 text-emerald-700",
  en_reparacion: "bg-brand/10 text-brand",
  esperando_recambio: "bg-red-100 text-red-700",
  listo: "bg-emerald-100 text-emerald-800",
  entregado: "bg-zinc-100 text-zinc-500",
  cancelado: "bg-zinc-100 text-zinc-400",
};

export default async function OrdenesPage() {
  const ordenes = await getOrdenes();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Órdenes de trabajo
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {ordenes.length} orden{ordenes.length !== 1 ? "es" : ""}
          </p>
        </div>
        <Link href="/ordenes/nueva">
          <Button className="rounded-full">
            <Plus className="mr-1.5 h-4 w-4" />
            Nueva orden
          </Button>
        </Link>
      </div>

      {ordenes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <ClipboardList className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-bold">Sin órdenes de trabajo</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Crea tu primera orden cuando un vehículo entre al taller
          </p>
          <Link href="/ordenes/nueva" className="mt-4">
            <Button className="rounded-full">
              <Plus className="mr-1.5 h-4 w-4" />
              Crear primera orden
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {ordenes.map((orden) => (
            <Link
              key={orden.id}
              href={`/ordenes/${orden.id}`}
              className="block"
            >
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:bg-accent/50 hover:border-brand/20 transition-all duration-200">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <span className="text-xs font-extrabold text-muted-foreground">
                    {orden.numero}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold truncate">
                      {orden.vehiculo?.matricula}
                    </p>
                    <Badge
                      className={`text-[10px] font-bold ${estadoColors[orden.estado] || ""}`}
                    >
                      {estadoLabels[orden.estado]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>{orden.cliente?.nombre}</span>
                    {orden.vehiculo && (
                      <span className="flex items-center gap-1">
                        <Car className="h-3 w-3" />
                        {[orden.vehiculo.marca, orden.vehiculo.modelo]
                          .filter(Boolean)
                          .join(" ")}
                      </span>
                    )}
                  </div>
                  {orden.descripcionCliente && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {orden.descripcionCliente}
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(orden.fechaEntrada).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
