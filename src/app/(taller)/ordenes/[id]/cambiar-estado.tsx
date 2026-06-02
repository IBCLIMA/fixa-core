"use client";

import { cambiarEstadoOrden } from "../../actions/ordenes";
import { toast } from "sonner";

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

const flujo: { estado: Estado; label: string; color: string }[] = [
  { estado: "recibido", label: "Recibido", color: "bg-zinc-200 text-zinc-700 hover:bg-zinc-300" },
  { estado: "diagnostico", label: "Diagnóstico", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
  { estado: "presupuestado", label: "Presupuestado", color: "bg-amber-100 text-amber-700 hover:bg-amber-200" },
  { estado: "aprobado", label: "Aprobado", color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" },
  { estado: "en_reparacion", label: "En reparación", color: "bg-orange-100 text-orange-700 hover:bg-orange-200" },
  { estado: "esperando_recambio", label: "Esp. recambio", color: "bg-red-100 text-red-700 hover:bg-red-200" },
  { estado: "listo", label: "Listo", color: "bg-emerald-200 text-emerald-800 hover:bg-emerald-300" },
  { estado: "entregado", label: "Entregado", color: "bg-zinc-200 text-zinc-600 hover:bg-zinc-300" },
  { estado: "cancelado", label: "Cancelado", color: "bg-zinc-100 text-zinc-400 hover:bg-zinc-200" },
];

const validTransitions: Record<string, string[]> = {
  recibido: ["diagnostico", "cancelado"],
  diagnostico: ["presupuestado", "en_reparacion", "cancelado"],
  presupuestado: ["aprobado", "cancelado"],
  aprobado: ["en_reparacion", "esperando_recambio"],
  en_reparacion: ["esperando_recambio", "listo"],
  esperando_recambio: ["en_reparacion", "listo"],
  listo: ["entregado"],
  entregado: [],
  cancelado: [],
};

export function CambiarEstadoButtons({
  ordenId,
  estadoActual,
}: {
  ordenId: string;
  estadoActual: string;
}) {
  const estadoActualInfo = flujo.find((f) => f.estado === estadoActual);
  const nextStates = validTransitions[estadoActual] || [];
  const availableButtons = flujo.filter((f) => nextStates.includes(f.estado));

  async function handleCambio(nuevoEstado: Estado) {
    const info = flujo.find((f) => f.estado === nuevoEstado);
    if (nuevoEstado === "entregado" || nuevoEstado === "cancelado") {
      if (!window.confirm(`¿Seguro que quieres marcar como "${info?.label}"?`)) return;
    }
    try {
      await cambiarEstadoOrden(ordenId, nuevoEstado);
      toast.success(`Estado cambiado a: ${info?.label}`);
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
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${estadoActualInfo?.color || ""} ring-2 ring-offset-1 ring-foreground/20`}
        >
          {estadoActualInfo?.label || estadoActual}
        </span>
      </div>

      {/* Valid next state buttons */}
      {availableButtons.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {availableButtons.map((f) => (
            <button
              key={f.estado}
              onClick={() => handleCambio(f.estado)}
              className={`px-4 py-3 rounded-full text-sm font-bold min-h-[44px] transition-all ${f.color} hover:opacity-100 opacity-80`}
            >
              {f.label}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Estado final alcanzado. No hay cambios disponibles.
        </p>
      )}
    </div>
  );
}
