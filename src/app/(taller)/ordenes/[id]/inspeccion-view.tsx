"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { iniciarInspeccion, actualizarInspeccion } from "../../actions/inspecciones";

type EstadoInspeccion = "bien" | "atencion" | "urgente" | "no_aplica";

type InspeccionItem = {
  id: string;
  ordenId: string;
  categoria: string;
  item: string;
  estado: EstadoInspeccion;
  notas: string | null;
  createdAt: Date;
};

const estadoConfig: Record<EstadoInspeccion, { label: string; icon: string; className: string; activeClassName: string }> = {
  bien: {
    label: "Bien",
    icon: "\u2713",
    className: "border-emerald-200 text-emerald-600 hover:bg-emerald-50",
    activeClassName: "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600",
  },
  atencion: {
    label: "Atención",
    icon: "\u26A0",
    className: "border-amber-200 text-amber-600 hover:bg-amber-50",
    activeClassName: "bg-amber-500 text-white border-amber-500 hover:bg-amber-600",
  },
  urgente: {
    label: "Urgente",
    icon: "\u2717",
    className: "border-red-200 text-red-600 hover:bg-red-50",
    activeClassName: "bg-red-500 text-white border-red-500 hover:bg-red-600",
  },
  no_aplica: {
    label: "N/A",
    icon: "\u2014",
    className: "border-stone-200 text-stone-400 hover:bg-stone-50",
    activeClassName: "bg-stone-400 text-white border-stone-400 hover:bg-stone-500",
  },
};

export function InspeccionView({
  ordenId,
  inspecciones: initialInspecciones,
}: {
  ordenId: string;
  inspecciones: InspeccionItem[];
}) {
  const [inspecciones, setInspecciones] = useState(initialInspecciones);
  const [isPending, startTransition] = useTransition();
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [collapsedCats, setCollapsedCats] = useState<Set<string>>(new Set());

  const hasInspection = inspecciones.length > 0;

  // Group by category
  const grouped = inspecciones.reduce<Record<string, InspeccionItem[]>>((acc, item) => {
    if (!acc[item.categoria]) acc[item.categoria] = [];
    acc[item.categoria].push(item);
    return acc;
  }, {});

  // Summary
  const checked = inspecciones.filter((i) => i.estado !== "no_aplica").length;
  const attention = inspecciones.filter((i) => i.estado === "atencion").length;
  const urgent = inspecciones.filter((i) => i.estado === "urgente").length;

  function handleIniciar() {
    startTransition(async () => {
      try {
        await iniciarInspeccion(ordenId);
        toast.success("Inspección iniciada");
      } catch {
        toast.error("Error al iniciar la inspección");
      }
    });
  }

  function handleEstado(id: string, estado: EstadoInspeccion) {
    // Optimistic update
    setInspecciones((prev) =>
      prev.map((item) => (item.id === id ? { ...item, estado } : item))
    );

    startTransition(async () => {
      try {
        await actualizarInspeccion(id, estado);
      } catch {
        toast.error("Error al actualizar");
      }
    });
  }

  function handleNotas(id: string, notas: string) {
    setInspecciones((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notas } : item))
    );
  }

  function guardarNotas(id: string, notas: string) {
    startTransition(async () => {
      try {
        const item = inspecciones.find((i) => i.id === id);
        if (!item) return;
        await actualizarInspeccion(id, item.estado, notas);
        toast.success("Nota guardada");
      } catch {
        toast.error("Error al guardar nota");
      }
    });
  }

  function toggleNotes(id: string) {
    setExpandedNotes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleCategory(cat: string) {
    setCollapsedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          Inspección del vehículo
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasInspection ? (
          <div className="text-center py-6">
            <ClipboardCheck className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              No se ha realizado ninguna inspección para esta orden.
            </p>
            <Button
              onClick={handleIniciar}
              disabled={isPending}
              className="rounded-full"
            >
              {isPending ? "Iniciando..." : "Iniciar inspección"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="rounded-full text-xs">
                {checked}/{inspecciones.length} revisados
              </Badge>
              {attention > 0 && (
                <Badge className="rounded-full text-xs bg-amber-100 text-amber-700">
                  {attention} atención
                </Badge>
              )}
              {urgent > 0 && (
                <Badge className="rounded-full text-xs bg-red-100 text-red-700">
                  {urgent} urgente{urgent !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>

            {/* Categories */}
            {Object.entries(grouped).map(([categoria, items]) => (
              <div key={categoria} className="rounded-xl border border-stone-200 overflow-hidden">
                <button
                  onClick={() => toggleCategory(categoria)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-stone-50 hover:bg-stone-100 transition-colors text-left"
                >
                  <span className="text-sm font-bold">{categoria}</span>
                  <div className="flex items-center gap-2">
                    <CategoriaResumen items={items} />
                    {collapsedCats.has(categoria) ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {!collapsedCats.has(categoria) && (
                  <div className="divide-y divide-stone-100">
                    {items.map((item) => (
                      <div key={item.id} className="px-4 py-3">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                          <span className="text-sm font-medium flex-1">{item.item}</span>
                          <div className="flex gap-1.5 w-full sm:w-auto">
                            {(["bien", "atencion", "urgente", "no_aplica"] as const).map((estado) => {
                              const config = estadoConfig[estado];
                              const isActive = item.estado === estado;
                              return (
                                <button
                                  key={estado}
                                  onClick={() => handleEstado(item.id, estado)}
                                  className={`h-11 min-w-[3.5rem] flex-1 sm:flex-none px-2 rounded-lg border text-sm font-bold transition-all ${
                                    isActive ? config.activeClassName : config.className
                                  }`}
                                  title={config.label}
                                >
                                  {config.icon}
                                </button>
                              );
                            })}
                            <button
                              onClick={() => toggleNotes(item.id)}
                              className={`h-11 w-11 shrink-0 rounded-lg border flex items-center justify-center transition-colors ${
                                item.notas
                                  ? "border-blue-200 text-blue-500 bg-blue-50"
                                  : "border-stone-200 text-stone-300 hover:text-stone-500 hover:bg-stone-50"
                              }`}
                              title="Notas"
                            >
                              <MessageSquare className="h-5 w-5" />
                            </button>
                          </div>
                        </div>

                        {expandedNotes.has(item.id) && (
                          <div className="mt-2">
                            <Textarea
                              placeholder="Notas sobre este elemento..."
                              value={item.notas || ""}
                              onChange={(e) => handleNotas(item.id, e.target.value)}
                              onBlur={(e) => guardarNotas(item.id, e.target.value)}
                              className="text-xs min-h-[60px] resize-none"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CategoriaResumen({ items }: { items: InspeccionItem[] }) {
  const bien = items.filter((i) => i.estado === "bien").length;
  const atencion = items.filter((i) => i.estado === "atencion").length;
  const urgente = items.filter((i) => i.estado === "urgente").length;

  return (
    <div className="flex gap-1">
      {bien > 0 && (
        <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1">
          {bien}
        </span>
      )}
      {atencion > 0 && (
        <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold px-1">
          {atencion}
        </span>
      )}
      {urgente > 0 && (
        <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-100 text-red-700 text-[10px] font-bold px-1">
          {urgente}
        </span>
      )}
    </div>
  );
}
