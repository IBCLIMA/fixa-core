import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { estadoLabels, estadoColors } from "@/lib/constants";
import { formatMoney } from "@/lib/format";

type TimelineOrder = {
  id: string;
  numero: number;
  estado: string;
  descripcionCliente: string | null;
  fechaEntrada: Date;
  kmEntrada: number | null;
  importeTotal: string | null;
};

export function VehicleTimeline({ ordenes }: { ordenes: TimelineOrder[] }) {
  if (ordenes.length === 0) return null;

  return (
    <div className="relative pl-6 mt-3">
      {/* Vertical line */}
      <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-stone-200" />

      <div className="space-y-3">
        {ordenes.map((orden, i) => (
          <div key={orden.id} className="relative">
            {/* Dot */}
            <div
              className={`absolute -left-6 top-2.5 h-[10px] w-[10px] rounded-full border-2 border-white ${
                i === 0 && !["entregado", "cancelado"].includes(orden.estado)
                  ? "bg-brand"
                  : "bg-stone-300"
              }`}
            />

            <Link
              href={`/ordenes/${orden.id}`}
              className="block rounded-xl border border-stone-200 bg-white p-3 hover:border-stone-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-muted-foreground">
                      OR-{orden.numero}
                    </span>
                    <Badge className={`text-[10px] ${estadoColors[orden.estado]}`}>
                      {estadoLabels[orden.estado]}
                    </Badge>
                  </div>
                  {orden.descripcionCliente && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {orden.descripcionCliente}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-1.5">
                    {orden.kmEntrada && (
                      <span className="text-[10px] text-muted-foreground">
                        {orden.kmEntrada.toLocaleString("es-ES")} km
                      </span>
                    )}
                    {orden.importeTotal && Number(orden.importeTotal) > 0 && (
                      <span className="text-[10px] font-bold text-muted-foreground">
                        {formatMoney(Number(orden.importeTotal))}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {new Date(orden.fechaEntrada).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                    year: "2-digit",
                  })}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
