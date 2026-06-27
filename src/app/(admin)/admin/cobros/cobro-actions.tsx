"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, AlertCircle, Clock, Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { setEstadoCobro, type EstadoCobro } from "./acciones";

interface Props {
  tallerId: string;
  estadoActual: EstadoCobro;
  notaActual: string | null;
}

const BOTONES: { estado: EstadoCobro; label: string; icon: typeof CheckCircle2; cls: string }[] = [
  { estado: "al_corriente", label: "Al corriente", icon: CheckCircle2, cls: "text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 data-[on=true]:bg-emerald-600 data-[on=true]:text-white data-[on=true]:border-emerald-600" },
  { estado: "pendiente", label: "Pendiente", icon: Clock, cls: "text-amber-700 hover:bg-amber-50 hover:text-amber-800 data-[on=true]:bg-amber-500 data-[on=true]:text-white data-[on=true]:border-amber-500" },
  { estado: "impagado", label: "Impagado", icon: AlertCircle, cls: "text-red-700 hover:bg-red-50 hover:text-red-800 data-[on=true]:bg-red-600 data-[on=true]:text-white data-[on=true]:border-red-600" },
];

export function CobroActions({ tallerId, estadoActual, notaActual }: Props) {
  const [isPending, startTransition] = useTransition();
  const [pendingEstado, setPendingEstado] = useState<EstadoCobro | null>(null);
  const [editandoNota, setEditandoNota] = useState(false);
  const [nota, setNota] = useState(notaActual ?? "");

  function cambiarEstado(estado: EstadoCobro, conNota?: string) {
    if (estado === estadoActual && conNota === undefined) return;
    setPendingEstado(estado);
    startTransition(async () => {
      const res = await setEstadoCobro(tallerId, estado, conNota);
      setPendingEstado(null);
      if (res.ok) {
        toast.success("Estado de cobro actualizado");
        setEditandoNota(false);
      } else {
        toast.error(res.error ?? "Error al actualizar");
      }
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {BOTONES.map(({ estado, label, icon: Icon, cls }) => {
          const on = estado === estadoActual;
          const cargando = isPending && pendingEstado === estado;
          return (
            <Button
              key={estado}
              type="button"
              variant="outline"
              size="sm"
              data-on={on}
              disabled={isPending}
              onClick={() => cambiarEstado(estado)}
              className={`h-8 rounded-full border text-xs font-semibold ${cls}`}
            >
              {cargando ? (
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : (
                <Icon className="h-3.5 w-3.5 mr-1.5" />
              )}
              {label}
            </Button>
          );
        })}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={() => setEditandoNota((v) => !v)}
          className="h-8 rounded-full text-xs text-muted-foreground"
        >
          <Pencil className="h-3.5 w-3.5 mr-1.5" />
          {notaActual ? "Editar nota" : "Añadir nota"}
        </Button>
      </div>

      {editandoNota && (
        <div className="space-y-2 rounded-lg border border-stone-200 bg-stone-50 p-2">
          <Textarea
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Nota de cobro (ej: avisado por WhatsApp el 12/06, promete pagar día 20)"
            rows={2}
            className="text-sm bg-white"
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={() => {
                setNota(notaActual ?? "");
                setEditandoNota(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isPending}
              onClick={() => cambiarEstado(estadoActual, nota)}
            >
              {isPending ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : null}
              Guardar nota
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
