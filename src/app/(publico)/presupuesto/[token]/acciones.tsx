"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export function AccionesPresupuestoPublico({
  presupuestoId,
  token,
}: {
  presupuestoId: string;
  token: string;
}) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<"aceptado" | "rechazado" | null>(null);

  async function handleAction(estado: "aceptado" | "rechazado") {
    const label = estado === "aceptado" ? "aceptar" : "rechazar";
    if (!window.confirm(`Confirmar ${label} este presupuesto?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/presupuesto-publico/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });
      if (!res.ok) throw new Error();
      setDone(estado);
    } catch {
      alert("Error al procesar la respuesta. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (done === "aceptado") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 text-center">
        <p className="text-sm font-bold text-emerald-800">
          Presupuesto aceptado correctamente
        </p>
        <p className="text-xs text-emerald-700 mt-1">
          El taller procedera con la reparacion.
        </p>
      </div>
    );
  }

  if (done === "rechazado") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50/30 p-4 text-center">
        <p className="text-sm font-bold text-red-800">Presupuesto rechazado</p>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <Button
        className="flex-1 h-12 rounded-xl text-base font-bold bg-emerald-600 hover:bg-emerald-500"
        onClick={() => handleAction("aceptado")}
        disabled={loading}
      >
        <Check className="mr-2 h-5 w-5" />
        {loading ? "Procesando..." : "Aceptar presupuesto"}
      </Button>
      <Button
        variant="outline"
        className="flex-1 h-12 rounded-xl text-base font-bold"
        onClick={() => handleAction("rechazado")}
        disabled={loading}
      >
        <X className="mr-2 h-5 w-5" />
        Rechazar
      </Button>
    </div>
  );
}
