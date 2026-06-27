"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors,
  type DragStartEvent, type DragEndEvent,
} from "@dnd-kit/core";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { ArrowRight } from "lucide-react";
import { cambiarEstadoOrden } from "../actions/ordenes";
import { cambiarFlujoTaller } from "../actions/workflow";
import { getKanbanColumns, getColumnForState, workflowPresets } from "@/lib/workflow";
import { toast } from "sonner";

type OrdenCard = {
  id: string; numero: number; estado: string; descripcionCliente: string | null;
  fechaEntrada: string; kmEntrada: number | null; asignadoA: string | null;
  asignadoNombre: string | null; matricula: string | null; marca: string | null;
  modelo: string | null; color: string | null; clienteNombre: string | null;
  clienteTelefono: string | null;
};

function timeAgo(d: string): string {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  return days === 0 ? "Hoy" : days === 1 ? "Ayer" : `${days}d`;
}

// ═══ Draggable Card ═══
function DraggableCard({ orden, nextLabel, nextState, onMove }: {
  orden: OrdenCard; nextLabel: string; nextState: string;
  onMove: (id: string, state: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: orden.id });
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 50 } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}
      className={`group relative rounded-2xl border bg-white p-3.5 shadow-sm transition-shadow cursor-grab active:cursor-grabbing touch-none ${isDragging ? "opacity-40 shadow-lg" : "hover:shadow-md"}`}
    >
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Link href={`/ordenes/${orden.id}`} className="flex items-center gap-2">
            <span className="text-base font-extrabold tracking-wider">{orden.matricula}</span>
            <span className="text-[10px] text-stone-400">OR-{orden.numero}</span>
          </Link>
          <span className="text-[10px] text-stone-400">{timeAgo(orden.fechaEntrada)}</span>
        </div>
        <p className="text-sm font-semibold text-stone-600 mb-1">{[orden.marca, orden.modelo].filter(Boolean).join(" ") || "—"}</p>
        {orden.descripcionCliente && (
          <p className="text-xs text-stone-700 line-clamp-2 mb-2">{orden.descripcionCliente}</p>
        )}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[11px] text-stone-500 truncate">{orden.clienteNombre?.split(" ")[0] || "—"}</span>
            {orden.asignadoNombre && (
              <span className="text-[10px] font-medium text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-full truncate">
                {orden.asignadoNombre.split(" ")[0]}
              </span>
            )}
          </div>
          {nextState && (
            <button
              onClick={(e) => { e.stopPropagation(); onMove(orden.id, nextState); }}
              className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[10px] font-bold text-white bg-stone-800 hover:bg-stone-700 px-2.5 py-1 rounded-full transition-all shrink-0"
            >
              {nextLabel}<ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══ Droppable Column ═══
function DroppableColumn({ id, label, icon: Icon, color, bg, border, count, children }: {
  id: string; label: string; icon: any; color: string; bg: string; border: string;
  count: number; children: React.ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div className="space-y-3 min-w-[220px]">
      <div className="flex items-center gap-2 px-1">
        <div className={`flex h-6 w-6 items-center justify-center rounded-md ${color} text-white`}>
          <Icon className="h-3 w-3" />
        </div>
        <span className="text-xs font-bold text-stone-700">{label}</span>
        <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-stone-100 px-1.5 text-[10px] font-bold text-stone-500">{count}</span>
      </div>
      <div ref={setNodeRef}
        className={`space-y-2 min-h-[100px] rounded-2xl p-2 border border-dashed transition-colors ${isOver ? "bg-brand-50 border-brand-300" : `${bg} ${border}`}`}
      >
        {children}
      </div>
    </div>
  );
}

// ═══ MAIN BOARD ═══
export function TallerBoard({ ordenes, activePhases, flujoActual, tallerId }: {
  ordenes: OrdenCard[]; activePhases: string[]; flujoActual: string; tallerId: string;
}) {
  const router = useRouter();
  const [items, setItems] = useState(ordenes);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const columns = getKanbanColumns(activePhases);

  const handleMove = useCallback(async (ordenId: string, targetState: string) => {
    setItems((prev) => prev.map((o) => (o.id === ordenId ? { ...o, estado: targetState } : o)));
    try {
      await cambiarEstadoOrden(ordenId, targetState as any);
      toast.success("Estado actualizado");
    } catch {
      setItems(ordenes);
      toast.error("Error al cambiar estado");
    }
  }, [ordenes]);

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const ordenId = active.id as string;
    const targetCol = over.id as string;
    const orden = items.find((o) => o.id === ordenId);
    if (!orden) return;
    const currentCol = getColumnForState(orden.estado, activePhases);
    if (currentCol === targetCol) return;
    handleMove(ordenId, targetCol);
  }

  async function handleCambiarFlujo(flujo: string) {
    try {
      await cambiarFlujoTaller(flujo);
      toast.success(`Flujo cambiado a "${workflowPresets[flujo]?.label || flujo}"`);
      router.refresh();
    } catch {
      toast.error("Error al cambiar flujo");
    }
  }

  const activeOrden = activeId ? items.find((o) => o.id === activeId) : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Taller</h1>
          <p className="text-sm text-muted-foreground">{items.length} vehículo{items.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Workflow selector */}
          <div className="flex items-center gap-1 rounded-full bg-stone-100 p-0.5">
            {Object.entries(workflowPresets).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => handleCambiarFlujo(key)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  flujoActual === key
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Board */}
      <DndContext sensors={sensors} collisionDetection={closestCenter}
        onDragStart={(e: DragStartEvent) => setActiveId(e.active.id as string)}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colItems = items.filter((o) => getColumnForState(o.estado, activePhases) === col.id);
            const nextIdx = activePhases.indexOf(col.id);
            const nextPhase = nextIdx < activePhases.length - 1 ? activePhases[nextIdx + 1] : "";
            const nextLabel = nextPhase === "entregado" ? "Entregar" : columns.find(c => c.id === nextPhase)?.label || "Siguiente";

            return (
              <DroppableColumn key={col.id} id={col.id} label={col.label} icon={col.icon}
                color={col.color} bg={col.bg} border={col.border} count={colItems.length}
              >
                {colItems.length === 0 ? (
                  <div className="flex items-center justify-center h-16 text-[10px] text-stone-300">Sin vehículos</div>
                ) : (
                  colItems.map((orden) => (
                    <DraggableCard key={orden.id} orden={orden} nextLabel={nextLabel} nextState={nextPhase} onMove={handleMove} />
                  ))
                )}
              </DroppableColumn>
            );
          })}
        </div>

        <DragOverlay>
          {activeOrden && (
            <div className="rounded-2xl border-2 border-brand-400 bg-white p-3.5 shadow-xl rotate-2 w-[260px]">
              <span className="text-base font-extrabold tracking-wider">{activeOrden.matricula}</span>
              <span className="text-[10px] text-stone-400 ml-2">OR-{activeOrden.numero}</span>
              <p className="text-xs text-stone-500 mt-1">{[activeOrden.marca, activeOrden.modelo].filter(Boolean).join(" ")}</p>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
