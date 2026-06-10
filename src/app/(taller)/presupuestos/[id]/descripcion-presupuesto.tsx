"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";

export function DescripcionPresupuesto({
  presupuestoId,
  notasActuales,
}: {
  presupuestoId: string;
  notasActuales: string | null;
}) {
  const [notas, setNotas] = useState(notasActuales || "");
  const prevRef = useRef(notasActuales || "");

  async function guardar() {
    if (notas === prevRef.current) return;
    prevRef.current = notas;
    try {
      const res = await fetch(`/api/presupuestos/${presupuestoId}/notas`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notas }),
      });
      if (!res.ok) throw new Error();
      toast.success("Guardado", { duration: 1500 });
    } catch {
      toast.error("Error al guardar");
    }
  }

  return (
    <textarea
      value={notas}
      onChange={(e) => setNotas(e.target.value)}
      onBlur={guardar}
      placeholder="Describe aquí el trabajo que se le va a hacer al vehículo. Esta descripción la verá el cliente en el presupuesto..."
      rows={4}
      className="w-full text-sm leading-relaxed bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/40 placeholder:italic"
    />
  );
}
