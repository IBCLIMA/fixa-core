"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Car, User, Clock, ArrowRight, Wrench, CheckCircle2,
  Package, ChevronRight, GripVertical,
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

// Columns config
const columns = [
  {
    id: "recibido",
    label: "Recibidos",
    icon: Package,
    color: "bg-stone-500",
    bgCard: "bg-white",
    border: "border-stone-200",
    states: ["recibido"],
  },
  {
    id: "en_taller",
    label: "En taller",
    icon: Wrench,
    color: "bg-orange-500",
    bgCard: "bg-orange-50/50",
    border: "border-orange-200",
    states: ["diagnostico", "presupuestado", "aprobado", "en_reparacion", "esperando_recambio"],
  },
  {
    id: "listo",
    label: "Listos",
    icon: CheckCircle2,
    color: "bg-emerald-500",
    bgCard: "bg-emerald-50/50",
    border: "border-emerald-200",
    states: ["listo"],
  },
];

// Sub-state badges (only for "en_taller" column)
const subStateBadge: Record<string, { label: string; class: string }> = {
  diagnostico: { label: "Diagnóstico", class: "bg-blue-100 text-blue-700" },
  presupuestado: { label: "Presupuestado", class: "bg-amber-100 text-amber-700" },
  aprobado: { label: "Aprobado", class: "bg-emerald-100 text-emerald-700" },
  en_reparacion: { label: "Reparando", class: "bg-orange-100 text-orange-700" },
  esperando_recambio: { label: "Esp. recambio", class: "bg-red-100 text-red-700" },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Hoy";
  if (days === 1) return "Ayer";
  return `Hace ${days}d`;
}

function CarCard({
  orden,
  columnId,
  onMove,
}: {
  orden: OrdenCard;
  columnId: string;
  onMove: (ordenId: string, targetState: string) => void;
}) {
  const nextState = columnId === "recibido" ? "en_reparacion" : columnId === "en_taller" ? "listo" : "entregado";
  const nextLabel = columnId === "recibido" ? "Al taller" : columnId === "en_taller" ? "Listo" : "Entregar";
  const sub = subStateBadge[orden.estado];

  return (
    <div className="group relative rounded-2xl border bg-white p-3.5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
      {/* Top: Matrícula + time */}
      <div className="flex items-center justify-between mb-2">
        <Link href={`/ordenes/${orden.id}`} className="flex items-center gap-2 min-w-0">
          <span className="text-base font-extrabold tracking-wider text-stone-900">
            {orden.matricula}
          </span>
          <span className="text-[10px] text-stone-400 font-medium">
            OR-{orden.numero}
          </span>
        </Link>
        <span className="text-[10px] text-stone-400 shrink-0">
          {timeAgo(orden.fechaEntrada)}
        </span>
      </div>

      {/* Vehicle info */}
      <p className="text-xs text-stone-500 mb-1.5">
        {[orden.marca, orden.modelo].filter(Boolean).join(" ") || "—"}
      </p>

      {/* Work description */}
      {orden.descripcionCliente && (
        <p className="text-xs text-stone-700 line-clamp-2 mb-2 leading-relaxed">
          {orden.descripcionCliente}
        </p>
      )}

      {/* Bottom row: client + assigned + sub-state */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* Client */}
          <span className="text-[11px] text-stone-500 truncate">
            {orden.clienteNombre?.split(" ")[0] || "—"}
          </span>
          {/* Assigned mechanic */}
          {orden.asignadoNombre && (
            <span className="text-[10px] font-medium text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-full truncate">
              {orden.asignadoNombre.split(" ")[0]}
            </span>
          )}
          {/* Sub-state badge */}
          {sub && (
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${sub.class}`}>
              {sub.label}
            </span>
          )}
        </div>

        {/* Quick action button */}
        <button
          onClick={(e) => { e.stopPropagation(); onMove(orden.id, nextState); }}
          className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[10px] font-bold text-white bg-stone-800 hover:bg-stone-700 px-2.5 py-1 rounded-full transition-all duration-150 shrink-0"
        >
          {nextLabel}
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

export function TallerBoard({ ordenes }: { ordenes: OrdenCard[] }) {
  const router = useRouter();
  const [items, setItems] = useState(ordenes);
  const [moving, setMoving] = useState<string | null>(null);

  const handleMove = useCallback(async (ordenId: string, targetState: string) => {
    setMoving(ordenId);

    // Optimistic update
    setItems((prev) =>
      prev.map((o) => (o.id === ordenId ? { ...o, estado: targetState } : o))
    );

    try {
      await cambiarEstadoOrden(ordenId, targetState as any);
      toast.success(
        targetState === "entregado"
          ? "Vehículo entregado"
          : targetState === "listo"
            ? "Marcado como listo"
            : "Movido al taller"
      );

      // Remove from board if delivered
      if (targetState === "entregado") {
        setItems((prev) => prev.filter((o) => o.id !== ordenId));
      }
    } catch {
      // Revert
      setItems(ordenes);
      toast.error("Error al cambiar estado");
    } finally {
      setMoving(null);
    }
  }, [ordenes]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Taller</h1>
          <p className="text-sm text-muted-foreground">
            {items.length} vehículo{items.length !== 1 ? "s" : ""} en taller
          </p>
        </div>
      </div>

      {/* Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => {
          const colItems = items.filter((o) => col.states.includes(o.estado));
          return (
            <div key={col.id} className="space-y-3">
              {/* Column header */}
              <div className="flex items-center gap-2.5 px-1">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${col.color} text-white`}>
                  <col.icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-bold text-stone-700">{col.label}</span>
                <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-stone-100 px-1.5 text-[10px] font-bold text-stone-500">
                  {colItems.length}
                </span>
              </div>

              {/* Cards */}
              <div className={`space-y-2.5 min-h-[120px] rounded-2xl p-2.5 ${col.bgCard} border ${col.border} border-dashed`}>
                {colItems.length === 0 ? (
                  <div className="flex items-center justify-center h-20 text-xs text-stone-300">
                    Sin vehículos
                  </div>
                ) : (
                  colItems.map((orden) => (
                    <CarCard
                      key={orden.id}
                      orden={orden}
                      columnId={col.id}
                      onMove={handleMove}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
