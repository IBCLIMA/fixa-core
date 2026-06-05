"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import {
  Car, ArrowRight, Wrench, CheckCircle2,
  Package, GripVertical,
} from "lucide-react";
import { cambiarEstadoOrden } from "../actions/ordenes";
import { toast } from "sonner";

type OrdenCard = {
  id: string;
  numero: number;
  estado: string;
  descripcionCliente: string | null;
  fechaEntrada: string;
  kmEntrada: number | null;
  asignadoA: string | null;
  asignadoNombre: string | null;
  matricula: string | null;
  marca: string | null;
  modelo: string | null;
  color: string | null;
  clienteNombre: string | null;
  clienteTelefono: string | null;
};

const columns = [
  { id: "recibido", label: "Recibidos", icon: Package, color: "bg-stone-500", bgCard: "bg-white", border: "border-stone-200", states: ["recibido"] },
  { id: "en_taller", label: "En taller", icon: Wrench, color: "bg-orange-500", bgCard: "bg-orange-50/50", border: "border-orange-200", states: ["diagnostico", "presupuestado", "aprobado", "en_reparacion", "esperando_recambio"] },
  { id: "listo", label: "Listos", icon: CheckCircle2, color: "bg-emerald-500", bgCard: "bg-emerald-50/50", border: "border-emerald-200", states: ["listo"] },
];

const columnTargetState: Record<string, string> = {
  recibido: "recibido",
  en_taller: "en_reparacion",
  listo: "listo",
};

const subStateBadge: Record<string, { label: string; cls: string }> = {
  diagnostico: { label: "Diagnóstico", cls: "bg-blue-100 text-blue-700" },
  presupuestado: { label: "Presupuestado", cls: "bg-amber-100 text-amber-700" },
  aprobado: { label: "Aprobado", cls: "bg-emerald-100 text-emerald-700" },
  en_reparacion: { label: "Reparando", cls: "bg-orange-100 text-orange-700" },
  esperando_recambio: { label: "Esp. recambio", cls: "bg-red-100 text-red-700" },
};

function timeAgo(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days === 0) return "Hoy";
  if (days === 1) return "Ayer";
  return `${days}d`;
}

function getColumnForState(estado: string): string {
  for (const col of columns) {
    if (col.states.includes(estado)) return col.id;
  }
  return "recibido";
}

// ═══ Draggable Card ═══
function DraggableCard({ orden, onQuickMove }: { orden: OrdenCard; onQuickMove: (id: string, state: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: orden.id });
  const colId = getColumnForState(orden.estado);
  const nextState = colId === "recibido" ? "en_reparacion" : colId === "en_taller" ? "listo" : "entregado";
  const nextLabel = colId === "recibido" ? "Al taller" : colId === "en_taller" ? "Listo" : "Entregar";
  const sub = subStateBadge[orden.estado];

  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-2xl border bg-white p-3.5 shadow-sm transition-shadow ${isDragging ? "opacity-50 shadow-lg rotate-2" : "hover:shadow-md"}`}
    >
      {/* Drag handle */}
      <div
        {...listeners}
        {...attributes}
        className="absolute left-1 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing p-1 text-stone-200 hover:text-stone-400 transition-colors"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="pl-5">
        {/* Top row */}
        <div className="flex items-center justify-between mb-2">
          <Link href={`/ordenes/${orden.id}`} className="flex items-center gap-2 min-w-0">
            <span className="text-base font-extrabold tracking-wider text-stone-900">{orden.matricula}</span>
            <span className="text-[10px] text-stone-400 font-medium">OR-{orden.numero}</span>
          </Link>
          <span className="text-[10px] text-stone-400 shrink-0">{timeAgo(orden.fechaEntrada)}</span>
        </div>

        <p className="text-xs text-stone-500 mb-1.5">{[orden.marca, orden.modelo].filter(Boolean).join(" ") || "—"}</p>

        {orden.descripcionCliente && (
          <p className="text-xs text-stone-700 line-clamp-2 mb-2 leading-relaxed">{orden.descripcionCliente}</p>
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[11px] text-stone-500 truncate">{orden.clienteNombre?.split(" ")[0] || "—"}</span>
            {orden.asignadoNombre && (
              <span className="text-[10px] font-medium text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-full truncate">{orden.asignadoNombre.split(" ")[0]}</span>
            )}
            {sub && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${sub.cls}`}>{sub.label}</span>}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onQuickMove(orden.id, nextState); }}
            className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[10px] font-bold text-white bg-stone-800 hover:bg-stone-700 px-2.5 py-1 rounded-full transition-all shrink-0"
          >
            {nextLabel}<ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══ Droppable Column ═══
function DroppableColumn({ column, children }: { column: typeof columns[number]; children: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({ id: column.id });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5 px-1">
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${column.color} text-white`}>
          <column.icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-sm font-bold text-stone-700">{column.label}</span>
        <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-stone-100 px-1.5 text-[10px] font-bold text-stone-500">
          {React.Children.count(children) || 0}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`space-y-2.5 min-h-[120px] rounded-2xl p-2.5 border border-dashed transition-colors ${
          isOver ? "bg-orange-50 border-orange-300" : `${column.bgCard} ${column.border}`
        }`}
      >
        {children}
      </div>
    </div>
  );
}

import React from "react";

// ═══ MAIN BOARD ═══
export function TallerBoard({ ordenes }: { ordenes: OrdenCard[] }) {
  const router = useRouter();
  const [items, setItems] = useState(ordenes);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleMove = useCallback(async (ordenId: string, targetState: string) => {
    // Optimistic
    setItems((prev) => prev.map((o) => (o.id === ordenId ? { ...o, estado: targetState } : o)));

    try {
      await cambiarEstadoOrden(ordenId, targetState as any);
      if (targetState === "entregado") {
        setItems((prev) => prev.filter((o) => o.id !== ordenId));
        toast.success("Vehículo entregado");
      } else {
        toast.success("Estado actualizado");
      }
    } catch {
      setItems(ordenes);
      toast.error("Error al cambiar estado");
    }
  }, [ordenes]);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const ordenId = active.id as string;
    const targetColumnId = over.id as string;

    // Find current column
    const orden = items.find((o) => o.id === ordenId);
    if (!orden) return;
    const currentCol = getColumnForState(orden.estado);

    // Don't do anything if dropped in same column
    if (currentCol === targetColumnId) return;

    // Get target state
    const targetState = columnTargetState[targetColumnId];
    if (targetState) {
      handleMove(ordenId, targetState);
    }
  }

  const activeOrden = activeId ? items.find((o) => o.id === activeId) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Taller</h1>
          <p className="text-sm text-muted-foreground">{items.length} vehículo{items.length !== 1 ? "s" : ""} en taller</p>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((col) => {
            const colItems = items.filter((o) => col.states.includes(o.estado));
            return (
              <DroppableColumn key={col.id} column={col}>
                {colItems.length === 0 ? (
                  <div className="flex items-center justify-center h-20 text-xs text-stone-300">Sin vehículos</div>
                ) : (
                  colItems.map((orden) => (
                    <DraggableCard key={orden.id} orden={orden} onQuickMove={handleMove} />
                  ))
                )}
              </DroppableColumn>
            );
          })}
        </div>

        <DragOverlay>
          {activeOrden && (
            <div className="rounded-2xl border-2 border-orange-400 bg-white p-3.5 shadow-xl rotate-2 w-[300px]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base font-extrabold tracking-wider">{activeOrden.matricula}</span>
                <span className="text-[10px] text-stone-400">OR-{activeOrden.numero}</span>
              </div>
              <p className="text-xs text-stone-500">{[activeOrden.marca, activeOrden.modelo].filter(Boolean).join(" ")}</p>
              {activeOrden.descripcionCliente && (
                <p className="text-xs text-stone-700 line-clamp-1 mt-1">{activeOrden.descripcionCliente}</p>
              )}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
