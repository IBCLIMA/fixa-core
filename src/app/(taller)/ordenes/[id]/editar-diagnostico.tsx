"use client";

import { useState } from "react";
import { Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function EditarDiagnostico({
  ordenId,
  diagnosticoActual,
  descripcionActual,
}: {
  ordenId: string;
  diagnosticoActual: string | null;
  descripcionActual: string | null;
}) {
  const [editando, setEditando] = useState(false);
  const [diagnostico, setDiagnostico] = useState(diagnosticoActual || "");
  const [loading, setLoading] = useState(false);

  async function guardar() {
    setLoading(true);
    try {
      const res = await fetch(`/api/ordenes/${ordenId}/diagnostico`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diagnostico }),
      });
      if (!res.ok) throw new Error();
      toast.success("Diagnóstico guardado");
      setEditando(false);
    } catch {
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl bg-muted/50 p-4 space-y-3">
      {descripcionActual && (
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Descripción del cliente</p>
          <p className="text-sm">{descripcionActual}</p>
        </div>
      )}
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Diagnóstico del mecánico</p>
          {!editando && (
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs rounded-full" onClick={() => setEditando(true)}>
              <Pencil className="h-3 w-3 mr-1" />{diagnosticoActual ? "Editar" : "Añadir"}
            </Button>
          )}
        </div>
        {editando ? (
          <div className="space-y-2">
            <Textarea
              value={diagnostico}
              onChange={(e) => setDiagnostico(e.target.value)}
              placeholder="Describe lo que has encontrado..."
              rows={3}
              className="rounded-lg text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={guardar} disabled={loading} className="rounded-full">
                <Check className="h-3 w-3 mr-1" />{loading ? "Guardando..." : "Guardar"}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setEditando(false); setDiagnostico(diagnosticoActual || ""); }} className="rounded-full">
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm">{diagnosticoActual || <span className="text-muted-foreground italic">Sin diagnóstico todavía</span>}</p>
        )}
      </div>
    </div>
  );
}
