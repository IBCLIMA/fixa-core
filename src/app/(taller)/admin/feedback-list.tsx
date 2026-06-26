"use client";

import { useTransition } from "react";
import { CheckCircle2, Loader2, Eye } from "lucide-react";
import { marcarFeedback } from "../actions/feedback";
import { toast } from "sonner";

type Item = {
  id: string;
  tipo: "sugerencia" | "incidencia" | "consulta";
  mensaje: string;
  estado: string;
  tallerNombre: string | null;
  usuarioNombre: string | null;
  contactoEmail: string | null;
  url: string | null;
  createdAt: Date | string;
};

const tipoMeta: Record<string, { label: string; cls: string }> = {
  sugerencia: { label: "💡 Sugerencia", cls: "bg-amber-100 text-amber-700" },
  incidencia: { label: "🐞 Incidencia", cls: "bg-red-100 text-red-700" },
  consulta: { label: "❓ Consulta", cls: "bg-blue-100 text-blue-700" },
};

export function FeedbackList({ items }: { items: Item[] }) {
  const [isPending, startTransition] = useTransition();

  function set(id: string, estado: "visto" | "resuelto") {
    startTransition(async () => {
      try {
        await marcarFeedback(id, estado);
        toast.success(estado === "resuelto" ? "Marcado como resuelto" : "Marcado como visto");
      } catch {
        toast.error("No se pudo actualizar");
      }
    });
  }

  if (!items.length) {
    return <p className="text-sm text-muted-foreground">Aún no hay mensajes. Cuando un taller envíe una sugerencia o incidencia, aparecerá aquí.</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((f) => {
        const t = tipoMeta[f.tipo] ?? tipoMeta.consulta;
        const resuelto = f.estado === "resuelto";
        return (
          <div key={f.id} className={`rounded-xl border p-4 ${resuelto ? "border-stone-200 bg-stone-50/50 opacity-60" : f.estado === "nuevo" ? "border-orange-200 bg-orange-50/30" : "border-stone-200"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${t.cls}`}>{t.label}</span>
                  {f.estado === "nuevo" && <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">NUEVO</span>}
                  {resuelto && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Resuelto</span>}
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-stone-800">{f.mensaje}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="font-medium text-stone-600">{f.tallerNombre ?? "—"}</span>
                  {f.usuarioNombre && <span>· {f.usuarioNombre}</span>}
                  {f.contactoEmail && <span>· {f.contactoEmail}</span>}
                  {f.url && <span>· {f.url}</span>}
                  <span>· {new Date(f.createdAt).toLocaleString("es-ES")}</span>
                </div>
              </div>
              {!resuelto && (
                <div className="flex shrink-0 gap-1.5">
                  {f.estado === "nuevo" && (
                    <button onClick={() => set(f.id, "visto")} disabled={isPending} title="Marcar como visto" className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50">
                      <Eye className="h-4 w-4" />
                    </button>
                  )}
                  <button onClick={() => set(f.id, "resuelto")} disabled={isPending} title="Marcar como resuelto" className="flex h-8 items-center gap-1 rounded-lg bg-emerald-600 px-2.5 text-xs font-medium text-white hover:bg-emerald-700">
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    Resuelto
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
