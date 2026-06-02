"use client";

import { cambiarEstadoPresupuesto } from "../../actions/presupuestos";
import { toast } from "sonner";

type EstadoPresupuesto = "borrador" | "enviado" | "aceptado" | "rechazado" | "expirado";

const flujo: { estado: EstadoPresupuesto; label: string; color: string }[] = [
  { estado: "borrador", label: "Borrador", color: "bg-zinc-200 text-zinc-700 hover:bg-zinc-300" },
  { estado: "enviado", label: "Enviado", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
  { estado: "aceptado", label: "Aceptado", color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" },
  { estado: "rechazado", label: "Rechazado", color: "bg-red-100 text-red-700 hover:bg-red-200" },
  { estado: "expirado", label: "Expirado", color: "bg-zinc-100 text-zinc-400 hover:bg-zinc-200" },
];

const validTransitions: Record<string, string[]> = {
  borrador: ["enviado"],
  enviado: ["aceptado", "rechazado"],
  aceptado: [],
  rechazado: [],
  expirado: [],
};

export function CambiarEstadoPresupuesto({
  presupuestoId,
  estadoActual,
}: {
  presupuestoId: string;
  estadoActual: string;
}) {
  const estadoActualInfo = flujo.find((f) => f.estado === estadoActual);
  const nextStates = validTransitions[estadoActual] || [];
  const availableButtons = flujo.filter((f) => nextStates.includes(f.estado));

  async function handleCambio(nuevoEstado: EstadoPresupuesto) {
    const info = flujo.find((f) => f.estado === nuevoEstado);
    if (nuevoEstado === "aceptado" || nuevoEstado === "rechazado") {
      if (!window.confirm(`Cambiar estado a "${info?.label}"?`)) return;
    }
    try {
      await cambiarEstadoPresupuesto(presupuestoId, nuevoEstado);
      toast.success(`Estado cambiado a: ${info?.label}`);
    } catch {
      toast.error("Error al cambiar estado");
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <span className="text-xs font-medium text-muted-foreground mr-2">Estado actual:</span>
        <span
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${estadoActualInfo?.color || ""} ring-2 ring-offset-1 ring-foreground/20`}
        >
          {estadoActualInfo?.label || estadoActual}
        </span>
      </div>

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
