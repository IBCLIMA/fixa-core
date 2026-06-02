"use client";

import { useState } from "react";
import { actualizarComision } from "../actions/equipo";
import { toast } from "sonner";

export function ComisionInput({
  usuarioId,
  comisionActual,
}: {
  usuarioId: string;
  comisionActual: number;
}) {
  const [value, setValue] = useState(String(comisionActual));
  const [loading, setLoading] = useState(false);

  async function handleBlur() {
    const num = parseFloat(value);
    if (isNaN(num) || num === comisionActual) return;
    if (num < 0 || num > 100) {
      toast.error("El porcentaje debe estar entre 0 y 100");
      setValue(String(comisionActual));
      return;
    }
    setLoading(true);
    try {
      await actualizarComision(usuarioId, num);
      toast.success("Comisión actualizada");
    } catch {
      toast.error("Error al actualizar comisión");
      setValue(String(comisionActual));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        min="0"
        max="100"
        step="0.5"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
        disabled={loading}
        className="w-16 h-7 rounded-lg border border-border bg-background px-2 text-xs text-right font-bold focus:outline-none focus:ring-2 focus:ring-brand/30"
      />
      <span className="text-xs text-muted-foreground font-bold">%</span>
    </div>
  );
}
