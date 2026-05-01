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

export function CambiarEstadoButtons({
  ordenId,
  estadoActual,
}: {
  ordenId: string;
  estadoActual: string;
}) {
  async function handleCambio(nuevoEstado: Estado) {
    try {
      await cambiarEstadoOrden(ordenId, nuevoEstado);
      toast.success(`Estado cambiado a: ${flujo.find((f) => f.estado === nuevoEstado)?.label}`);
    } catch {
      toast.error("Error al cambiar estado");
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {flujo.map((f) => (
        <button
          key={f.estado}
          onClick={() => handleCambio(f.estado)}
          disabled={f.estado === estadoActual}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            f.estado === estadoActual
              ? `${f.color} ring-2 ring-offset-1 ring-foreground/20 opacity-100`
              : `${f.color} opacity-60 hover:opacity-100`
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
