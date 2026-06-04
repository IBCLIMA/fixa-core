"use client";

import { cambiarEstadoOrden } from "../../actions/ordenes";
import { toast } from "sonner";
import { estadoLabels, estadoColors } from "@/lib/constants";

type Estado =
  | "recibido"
  | "diagnostico"
  | "presupuestado"
  | "aprobado"
  | "en_reparacion"
  | "esperando_recambio"
  | "listo"
  | "entregado"
  | "cancelado";

const allEstados: Estado[] = [
  "recibido", "diagnostico", "presupuestado", "aprobado",
  "en_reparacion", "esperando_recambio", "listo", "entregado", "cancelado",
];

// Add hover variant for interactive buttons
const estadoHoverColors: Record<string, string> = {
  recibido: "hover:bg-zinc-300",
  diagnostico: "hover:bg-blue-200",
  presupuestado: "hover:bg-amber-200",
  aprobado: "hover:bg-emerald-200",
  en_reparacion: "hover:bg-orange-200",
  esperando_recambio: "hover:bg-red-200",
  listo: "hover:bg-emerald-300",
  entregado: "hover:bg-zinc-300",
  cancelado: "hover:bg-zinc-200",
};

// Forward transitions (primary actions)
const forwardTransitions: Record<string, string[]> = {
  recibido: ["diagnostico", "en_reparacion", "cancelado"],
  diagnostico: ["presupuestado", "en_reparacion", "cancelado"],
  presupuestado: ["aprobado", "cancelado"],
  aprobado: ["en_reparacion", "esperando_recambio"],
  en_reparacion: ["esperando_recambio", "listo"],
  esperando_recambio: ["en_reparacion", "listo"],
  listo: ["entregado"],
  entregado: [],
  cancelado: [],
};

// Backward transitions (corrections / undo)
const backwardTransitions: Record<string, string[]> = {
  recibido: [],
  diagnostico: ["recibido"],
  presupuestado: ["diagnostico"],
  aprobado: ["presupuestado", "diagnostico"],
  en_reparacion: ["diagnostico", "aprobado"],
  esperando_recambio: ["en_reparacion"],
  listo: ["en_reparacion"],
  entregado: ["listo"],
  cancelado: ["recibido"],
};

export function CambiarEstadoButtons({
  ordenId,
  estadoActual,
}: {
  ordenId: string;
  estadoActual: string;
}) {
  const forward = forwardTransitions[estadoActual] || [];
  const backward = backwardTransitions[estadoActual] || [];

  async function handleCambio(nuevoEstado: Estado) {
    const label = estadoLabels[nuevoEstado] || nuevoEstado;
    if (nuevoEstado === "entregado" || nuevoEstado === "cancelado") {
      if (!window.confirm(`Seguro que quieres marcar como "${label}"?`)) return;
    }
    if (backward.includes(nuevoEstado)) {
      if (!window.confirm(`¿Volver al estado "${label}"?`)) return;
    }
    try {
      await cambiarEstadoOrden(ordenId, nuevoEstado);
      toast.success(`Estado cambiado a: ${label}`);
    } catch {
      toast.error("Error al cambiar estado");
    }
  }

  return (
    <div className="space-y-3">
      {/* Current status badge */}
      <div>
        <span className="text-xs font-medium text-muted-foreground mr-2">Estado actual:</span>
        <span
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${estadoColors[estadoActual] || ""} ring-2 ring-offset-1 ring-foreground/20`}
        >
          {estadoLabels[estadoActual] || estadoActual}
        </span>
      </div>

      {/* Forward transitions (primary) */}
      {forward.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {forward.map((estado) => (
            <button
              key={estado}
              onClick={() => handleCambio(estado as Estado)}
              className={`px-4 py-3 rounded-full text-sm font-bold min-h-[44px] transition-all ${estadoColors[estado] || ""} ${estadoHoverColors[estado] || ""} hover:opacity-100 opacity-80`}
            >
              {estadoLabels[estado]}
            </button>
          ))}
        </div>
      )}

      {/* Backward transitions (corrections) */}
      {backward.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
          <span className="text-[10px] text-muted-foreground">Volver a:</span>
          {backward.map((estado) => (
            <button
              key={estado}
              onClick={() => handleCambio(estado as Estado)}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground border border-border hover:bg-muted transition-colors"
            >
              ← {estadoLabels[estado]}
            </button>
          ))}
        </div>
      )}

      {forward.length === 0 && backward.length === 0 && (
        <p className="text-xs text-muted-foreground">
          Estado final alcanzado.
        </p>
      )}
    </div>
  );
}
