"use client";

import { useState } from "react";
import { Plus, Clock, X, CalendarDays, Truck, Ban, Zap, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { crearCita, eliminarCita, crearOrdenDesdeCita, bloquearDia, desbloquearDia } from "../actions/citas";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Cita {
  id: string;
  fecha: string;
  horaInicio: string | null;
  horaFin: string | null;
  nombreCliente: string;
  telefonoCliente: string | null;
  motivo: string | null;
  estado: string;
}

interface Entrega {
  id: string;
  numero: number;
  estado: string;
  fechaEstimada: Date | null;
  fechaEstimadaStr: string | null;
  descripcionCliente: string | null;
  clienteNombre: string | null;
  vehiculoMatricula: string | null;
}

interface DiaBloqueado {
  id: string;
  tallerId: string;
  fecha: string;
  motivo: string | null;
  createdAt: Date;
}

interface CalendarioViewProps {
  days: string[];
  citas: Cita[];
  totalCitas: number;
  capacidadDiaria: number;
  trabajaSabados: boolean;
  ordenesPorDia: Record<string, number>;
  entregas: Entrega[];
  diasBloqueados: DiaBloqueado[];
}

const dayNames = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"];

const citaColors = [
  { border: "border-l-orange-500", bg: "bg-orange-50", text: "text-orange-700", time: "text-orange-600" },
  { border: "border-l-blue-500", bg: "bg-blue-50", text: "text-blue-700", time: "text-blue-600" },
  { border: "border-l-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700", time: "text-emerald-600" },
  { border: "border-l-violet-500", bg: "bg-violet-50", text: "text-violet-700", time: "text-violet-600" },
  { border: "border-l-rose-500", bg: "bg-rose-50", text: "text-rose-700", time: "text-rose-600" },
];

export function CalendarioView({ days, citas, totalCitas, capacidadDiaria, trabajaSabados, ordenesPorDia, entregas, diasBloqueados }: CalendarioViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [showDayMenu, setShowDayMenu] = useState(false);
  const [showBlockForm, setShowBlockForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [llegadaLoading, setLlegadaLoading] = useState<string | null>(null);
  const router = useRouter();

  const hoy = new Date().toISOString().split("T")[0];

  // Helpers
  function getBlockedDay(dateStr: string) {
    return diasBloqueados.find((d) => d.fecha === dateStr);
  }

  function getDayEntregas(dateStr: string) {
    return entregas.filter((e) => e.fechaEstimadaStr === dateStr);
  }

  function getDayCapacity(dateStr: string) {
    return ordenesPorDia[dateStr] || 0;
  }

  function openDayMenu(date: string) {
    setSelectedDate(date);
    setShowDayMenu(true);
  }

  function openNewCita() {
    setShowDayMenu(false);
    setShowForm(true);
  }

  function openBlockDay() {
    setShowDayMenu(false);
    setShowBlockForm(true);
  }

  async function handleCrear(formData: FormData) {
    setLoading(true);
    try {
      await crearCita({
        nombreCliente: formData.get("nombre") as string,
        telefonoCliente: (formData.get("telefono") as string) || undefined,
        fecha: selectedDate,
        horaInicio: (formData.get("hora") as string) || undefined,
        motivo: (formData.get("motivo") as string) || undefined,
      });
      toast.success("Cita creada");
      setShowForm(false);
    } catch {
      toast.error("Error al crear cita");
    } finally {
      setLoading(false);
    }
  }

  async function handleEliminar(id: string) {
    if (!window.confirm("Eliminar esta cita?")) return;
    try {
      await eliminarCita(id);
      toast.success("Cita eliminada");
    } catch {
      toast.error("Error al eliminar");
    }
  }

  async function handleLlegada(citaId: string) {
    setLlegadaLoading(citaId);
    try {
      const orden = await crearOrdenDesdeCita(citaId);
      toast.success(`OR #${orden.numero} creada`);
      router.push(`/ordenes/${orden.id}`);
    } catch (e: any) {
      toast.error(e?.message || "Error al crear orden");
    } finally {
      setLlegadaLoading(null);
    }
  }

  async function handleBloquear(formData: FormData) {
    setLoading(true);
    try {
      const motivo = (formData.get("motivo") as string) || undefined;
      await bloquearDia(selectedDate, motivo);
      toast.success("Dia bloqueado");
      setShowBlockForm(false);
    } catch {
      toast.error("Error al bloquear dia");
    } finally {
      setLoading(false);
    }
  }

  async function handleDesbloquear(diaId: string) {
    try {
      await desbloquearDia(diaId);
      toast.success("Dia desbloqueado");
    } catch {
      toast.error("Error al desbloquear");
    }
  }

  // ── Feature 5: Today section data ────────────────────────────────────
  const todayCitas = citas.filter((c) => c.fecha === hoy);
  const todayEntregas = getDayEntregas(hoy);
  const todayCapacity = getDayCapacity(hoy);
  const todayBlocked = getBlockedDay(hoy);
  const capacityPct = Math.min((todayCapacity / capacidadDiaria) * 100, 100);
  const isFull = todayCapacity >= capacidadDiaria;

  // ── Capacity bar component ──────────────────────────────────────────
  function CapacityBar({ count, className }: { count: number; className?: string }) {
    const pct = Math.min((count / capacidadDiaria) * 100, 100);
    const full = count >= capacidadDiaria;
    return (
      <div className={cn("flex items-center gap-1.5", className)}>
        <span className={cn(
          "text-[10px] font-bold",
          full ? "text-red-600" : "text-stone-500"
        )}>
          {count}/{capacidadDiaria}
        </span>
        <div className="flex-1 h-1 rounded-full bg-stone-200 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              full ? "bg-red-500" : pct > 70 ? "bg-orange-400" : "bg-emerald-400"
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Feature 5: Today section ──────────────────────────────── */}
      <div className="rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50/80 to-white p-4 shadow-sm shadow-orange-500/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
              <CalendarDays className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-stone-900">Hoy</h2>
              <p className="text-[10px] text-stone-500">
                {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl text-xs h-8 border-orange-200 text-orange-600 hover:bg-orange-50"
              onClick={() => { setSelectedDate(hoy); setShowForm(true); }}
            >
              <Plus className="mr-1 h-3 w-3" />
              Nueva cita
            </Button>
            <Link href="/ordenes/nueva">
              <Button
                size="sm"
                className="rounded-xl text-xs h-8 bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Zap className="mr-1 h-3 w-3" />
                Entrada rapida
              </Button>
            </Link>
          </div>
        </div>

        {/* Capacity bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-stone-500">Capacidad del taller</span>
            <span className={cn(
              "text-xs font-bold",
              isFull ? "text-red-600" : "text-emerald-600"
            )}>
              {todayCapacity}/{capacidadDiaria} ordenes activas
            </span>
          </div>
          <div className="h-2 rounded-full bg-stone-200 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                isFull ? "bg-red-500" : capacityPct > 70 ? "bg-orange-400" : "bg-emerald-400"
              )}
              style={{ width: `${capacityPct}%` }}
            />
          </div>
        </div>

        {todayBlocked ? (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-center">
            <Ban className="h-5 w-5 text-red-400 mx-auto mb-1" />
            <p className="text-sm font-bold text-red-700">DIA BLOQUEADO</p>
            {todayBlocked.motivo && <p className="text-xs text-red-600 mt-0.5">{todayBlocked.motivo}</p>}
            <button
              onClick={() => handleDesbloquear(todayBlocked.id)}
              className="mt-2 text-[10px] text-red-500 underline hover:text-red-700"
            >
              Desbloquear
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Today's appointments */}
            <div>
              <p className="text-xs font-bold text-stone-500 mb-1.5">Citas ({todayCitas.length})</p>
              {todayCitas.length === 0 ? (
                <p className="text-[11px] text-stone-400 py-2">Sin citas hoy</p>
              ) : (
                <div className="space-y-1.5">
                  {todayCitas.map((cita, idx) => {
                    const color = citaColors[idx % citaColors.length];
                    return (
                      <div key={cita.id} className={cn(
                        "rounded-lg border-l-[3px] p-2.5 text-[11px]",
                        color.border, color.bg,
                        cita.estado === "completada" && "opacity-50"
                      )}>
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              {cita.horaInicio && (
                                <span className={cn("font-mono font-bold text-[10px]", color.time)}>
                                  {cita.horaInicio.slice(0, 5)}
                                </span>
                              )}
                              <span className={cn("font-semibold truncate", color.text)}>{cita.nombreCliente}</span>
                            </div>
                            {cita.telefonoCliente && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <Phone className="h-2.5 w-2.5 text-stone-400" />
                                <span className="text-[10px] text-stone-500">{cita.telefonoCliente}</span>
                              </div>
                            )}
                            {cita.motivo && (
                              <p className="text-stone-500 text-[10px] mt-0.5">{cita.motivo}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0 ml-2">
                            {cita.estado !== "completada" && (
                              <button
                                onClick={() => handleLlegada(cita.id)}
                                disabled={llegadaLoading === cita.id}
                                className="flex items-center gap-1 rounded-lg bg-emerald-500 text-white px-2 py-1 text-[10px] font-bold hover:bg-emerald-600 transition-all disabled:opacity-50"
                              >
                                {llegadaLoading === cita.id ? "..." : (
                                  <>
                                    <ArrowRight className="h-2.5 w-2.5" />
                                    Ha llegado
                                  </>
                                )}
                              </button>
                            )}
                            <button
                              onClick={() => handleEliminar(cita.id)}
                              className="h-5 w-5 rounded-full text-stone-300 hover:text-red-500 flex items-center justify-center"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Today's deliveries */}
            <div>
              <p className="text-xs font-bold text-stone-500 mb-1.5">Entregas previstas ({todayEntregas.length})</p>
              {todayEntregas.length === 0 ? (
                <p className="text-[11px] text-stone-400 py-2">Sin entregas hoy</p>
              ) : (
                <div className="space-y-1.5">
                  {todayEntregas.map((entrega) => (
                    <Link key={entrega.id} href={`/ordenes/${entrega.id}`}>
                      <div className="rounded-lg border-l-[3px] border-l-blue-400 border border-dashed border-blue-200 bg-blue-50/50 p-2.5 text-[11px] hover:bg-blue-50 transition-all">
                        <div className="flex items-center gap-1.5">
                          <Truck className="h-3 w-3 text-blue-500" />
                          <span className="font-bold text-blue-700">OR #{entrega.numero}</span>
                          {entrega.vehiculoMatricula && (
                            <span className="text-blue-500 font-mono text-[10px]">{entrega.vehiculoMatricula}</span>
                          )}
                        </div>
                        {entrega.clienteNombre && (
                          <p className="text-blue-600 truncate mt-0.5">{entrega.clienteNombre}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Weekly grid -- desktop ──────────────────────────────── */}
      <div className="hidden md:grid grid-cols-7 gap-3">
        {days.map((dayIso, i) => {
          const date = new Date(dayIso);
          const dateStr = date.toISOString().split("T")[0];
          const isToday = dateStr === hoy;
          const isSunday = i === 6;
          const isSaturday = i === 5;
          const isWeekend = i >= 5;
          const dayCitas = citas.filter((c) => c.fecha === dateStr);
          const dayEntregas = getDayEntregas(dateStr);
          const isNonWorkingDay = isSunday || (isSaturday && !trabajaSabados);
          const blocked = isNonWorkingDay
            ? { id: isSunday ? "sunday" : "saturday", fecha: dateStr, motivo: isSunday ? "Domingo" : "Sábado no laborable" }
            : getBlockedDay(dateStr);
          const dayOrdenes = getDayCapacity(dateStr);

          return (
            <div
              key={dayIso}
              className={cn(
                "min-h-[140px] rounded-xl border transition-all duration-200",
                blocked
                  ? "border-red-200 bg-red-50/30"
                  : isToday
                  ? "border-orange-300 bg-orange-50/30 shadow-sm shadow-orange-500/10 ring-1 ring-orange-200"
                  : isWeekend
                  ? "border-stone-100 bg-stone-50/50"
                  : "border-stone-200/60 bg-white"
              )}
            >
              {/* Day header */}
              <div
                className={cn(
                  "text-center py-2 rounded-t-xl border-b",
                  blocked
                    ? "bg-red-100 border-red-200 text-red-700"
                    : isToday
                    ? "bg-orange-500 text-white border-orange-500"
                    : isWeekend
                    ? "bg-stone-100/80 border-stone-100 text-stone-400"
                    : "bg-stone-50 border-stone-200/40"
                )}
              >
                <p className={cn(
                  "text-[10px] font-bold uppercase tracking-wider",
                  blocked ? "text-red-400" : isToday ? "text-orange-100" : "text-stone-400"
                )}>
                  {dayNames[i]}
                </p>
                <p className={cn(
                  "text-xl font-extrabold leading-none mt-0.5",
                  blocked ? "text-red-700" : isToday ? "text-white" : isWeekend ? "text-stone-400" : "text-stone-700"
                )}>
                  {date.getDate()}
                </p>
                {/* Capacity bar in header */}
                {!blocked && (
                  <CapacityBar count={dayOrdenes} className="px-2 mt-1" />
                )}
              </div>

              {/* Blocked overlay */}
              {blocked ? (
                <div className="p-2 text-center">
                  <Ban className="h-4 w-4 text-red-400 mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-red-600 uppercase">Bloqueado</p>
                  {blocked.motivo && <p className="text-[9px] text-red-500 mt-0.5">{blocked.motivo}</p>}
                  <button
                    onClick={() => handleDesbloquear(blocked.id)}
                    className="mt-1.5 text-[9px] text-red-400 underline hover:text-red-600"
                  >
                    Desbloquear
                  </button>
                </div>
              ) : (
                <div className="p-1.5 space-y-1">
                  {/* Citas */}
                  {dayCitas.length === 0 && dayEntregas.length === 0 && (
                    <p className="text-[10px] text-center py-2 text-stone-300">Sin citas</p>
                  )}

                  {dayCitas.map((cita, citaIdx) => {
                    const color = citaColors[citaIdx % citaColors.length];
                    return (
                      <div
                        key={cita.id}
                        className={cn(
                          "group relative rounded-lg border-l-[3px] p-2 text-[11px] transition-all duration-200 hover:shadow-sm",
                          color.border, color.bg,
                          cita.estado === "completada" && "opacity-50"
                        )}
                      >
                        {cita.horaInicio && (
                          <div className="flex items-center gap-1 mb-0.5">
                            <Clock className={cn("h-2.5 w-2.5", color.time)} />
                            <p className={cn("font-mono font-bold text-[10px]", color.time)}>
                              {cita.horaInicio.slice(0, 5)}
                            </p>
                          </div>
                        )}
                        <p className={cn("font-semibold truncate", color.text)}>{cita.nombreCliente}</p>
                        {cita.motivo && (
                          <p className="text-stone-500 truncate text-[10px] mt-0.5">{cita.motivo}</p>
                        )}
                        {/* "Ha llegado" button */}
                        {cita.estado !== "completada" && (
                          <button
                            onClick={() => handleLlegada(cita.id)}
                            disabled={llegadaLoading === cita.id}
                            className="mt-1 w-full flex items-center justify-center gap-1 rounded-md bg-emerald-500 text-white py-0.5 text-[9px] font-bold hover:bg-emerald-600 transition-all disabled:opacity-50"
                          >
                            {llegadaLoading === cita.id ? "..." : (
                              <>
                                <ArrowRight className="h-2.5 w-2.5" />
                                Ha llegado
                              </>
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => handleEliminar(cita.id)}
                          className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-white hidden group-hover:flex items-center justify-center text-[8px] transition-all duration-200 hover:bg-red-600"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    );
                  })}

                  {/* Delivery promises */}
                  {dayEntregas.length > 0 && (
                    <>
                      {dayCitas.length > 0 && <div className="border-t border-dashed border-stone-200 my-1" />}
                      <p className="text-[9px] font-bold text-blue-500 uppercase tracking-wide px-0.5">Entregas</p>
                      {dayEntregas.map((entrega) => (
                        <Link key={entrega.id} href={`/ordenes/${entrega.id}`}>
                          <div className="rounded-lg border-l-[3px] border-l-blue-400 border border-dashed border-blue-200 bg-blue-50/50 p-1.5 text-[10px] hover:bg-blue-50 transition-all">
                            <div className="flex items-center gap-1">
                              <Truck className="h-2.5 w-2.5 text-blue-500" />
                              <span className="font-bold text-blue-700">#{entrega.numero}</span>
                            </div>
                            {entrega.clienteNombre && (
                              <p className="text-blue-600 truncate">{entrega.clienteNombre}</p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </>
                  )}

                  {/* Add button → opens menu */}
                  <button
                    onClick={() => openDayMenu(dateStr)}
                    className={cn(
                      "group/add w-full rounded-lg border border-dashed p-2 transition-all duration-200",
                      isWeekend
                        ? "border-stone-200 text-stone-300 hover:border-orange-300 hover:text-orange-400 hover:bg-orange-50/50"
                        : "border-stone-200 text-stone-300 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50/50"
                    )}
                  >
                    <Plus className="h-3 w-3 mx-auto transition-transform duration-200 group-hover/add:scale-110" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Weekly summary */}
      <div className="hidden md:flex items-center justify-between rounded-xl bg-white border border-stone-200/60 px-4 py-3 mt-1">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-orange-500" />
          <span className="text-sm text-stone-600">
            <span className="font-bold text-stone-900">{totalCitas}</span>{" "}
            {totalCitas === 1 ? "cita" : "citas"} esta semana
          </span>
          {entregas.length > 0 && (
            <>
              <span className="text-stone-300 mx-1">|</span>
              <Truck className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-stone-600">
                <span className="font-bold text-stone-900">{entregas.length}</span>{" "}
                {entregas.length === 1 ? "entrega" : "entregas"} prevista{entregas.length !== 1 && "s"}
              </span>
            </>
          )}
        </div>
        <Button
          size="sm"
          variant="outline"
          className="rounded-xl text-xs h-8 border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
          onClick={() => { setSelectedDate(hoy); setShowForm(true); }}
        >
          <Plus className="mr-1 h-3 w-3" />
          Nueva cita
        </Button>
      </div>

      {/* ── Mobile: list view ──────────────────────────────────── */}
      <div className="md:hidden space-y-3 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold">Citas de la semana</h2>
            <p className="text-xs text-muted-foreground">
              {totalCitas} {totalCitas === 1 ? "cita programada" : "citas programadas"}
            </p>
          </div>
          <Button size="sm" variant="outline" className="rounded-xl" onClick={() => { setSelectedDate(hoy); setShowForm(true); }}>
            <Plus className="mr-1 h-3 w-3" />Nueva cita
          </Button>
        </div>

        {citas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center rounded-xl border border-dashed border-stone-200 bg-stone-50/50">
            <CalendarDays className="h-12 w-12 text-stone-200 mb-3" />
            <p className="text-sm font-semibold text-stone-500">Sin citas esta semana</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-[250px]">
              Pulsa &quot;Nueva cita&quot; para programar la entrada de un vehiculo.
            </p>
            <Button
              size="sm"
              className="mt-4 rounded-xl"
              onClick={() => { setSelectedDate(hoy); setShowForm(true); }}
            >
              <Plus className="mr-1 h-3 w-3" />
              Crear primera cita
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {citas.map((cita, idx) => {
              const color = citaColors[idx % citaColors.length];
              const citaDate = new Date(cita.fecha + "T12:00:00");
              const isDateToday = cita.fecha === hoy;

              return (
                <div
                  key={cita.id}
                  className={cn(
                    "rounded-xl border bg-white p-3.5 transition-all duration-200 border-l-[3px]",
                    color.border,
                    isDateToday && "ring-1 ring-orange-200",
                    cita.estado === "completada" && "opacity-50"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {cita.horaInicio && (
                        <div className={cn("shrink-0 flex flex-col items-center rounded-lg px-2 py-1", color.bg)}>
                          <Clock className={cn("h-3 w-3 mb-0.5", color.time)} />
                          <span className={cn("text-xs font-mono font-bold", color.time)}>
                            {cita.horaInicio.slice(0, 5)}
                          </span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{cita.nombreCliente}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {citaDate.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })}
                          {isDateToday && (
                            <span className="ml-1.5 inline-flex items-center rounded-full bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-600">
                              Hoy
                            </span>
                          )}
                        </p>
                        {cita.motivo && (
                          <p className="text-xs text-stone-500 mt-0.5 truncate">{cita.motivo}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      {cita.estado !== "completada" && (
                        <button
                          onClick={() => handleLlegada(cita.id)}
                          disabled={llegadaLoading === cita.id}
                          className="flex items-center gap-1 rounded-xl bg-emerald-500 text-white px-2.5 py-1.5 text-[10px] font-bold hover:bg-emerald-600 transition-all disabled:opacity-50"
                        >
                          {llegadaLoading === cita.id ? "..." : (
                            <>
                              <ArrowRight className="h-3 w-3" />
                              Ha llegado
                            </>
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleEliminar(cita.id)}
                        className="h-8 w-8 rounded-xl text-stone-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all duration-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mobile: deliveries */}
        {entregas.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-bold text-blue-500 uppercase tracking-wide mb-2">Entregas previstas esta semana</p>
            <div className="space-y-2">
              {entregas.map((entrega) => (
                <Link key={entrega.id} href={`/ordenes/${entrega.id}`}>
                  <div className="rounded-xl border-l-[3px] border-l-blue-400 border border-dashed border-blue-200 bg-blue-50/50 p-3 hover:bg-blue-50 transition-all">
                    <div className="flex items-center gap-2">
                      <Truck className="h-3.5 w-3.5 text-blue-500" />
                      <span className="text-sm font-bold text-blue-700">OR #{entrega.numero}</span>
                      {entrega.vehiculoMatricula && (
                        <span className="text-xs text-blue-500 font-mono">{entrega.vehiculoMatricula}</span>
                      )}
                    </div>
                    {entrega.clienteNombre && (
                      <p className="text-xs text-blue-600 mt-0.5">{entrega.clienteNombre}</p>
                    )}
                    {entrega.fechaEstimadaStr && (
                      <p className="text-[10px] text-blue-400 mt-0.5">
                        {new Date(entrega.fechaEstimadaStr + "T12:00:00").toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Dialog: Day menu (new cita or block) ──────────────── */}
      <Dialog open={showDayMenu} onOpenChange={setShowDayMenu}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>
              {selectedDate && new Date(selectedDate + "T12:00:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <button
              onClick={openNewCita}
              className="w-full flex items-center gap-3 rounded-xl border border-stone-200 p-3 hover:bg-orange-50 hover:border-orange-200 transition-all"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100">
                <Plus className="h-4 w-4 text-orange-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">Nueva cita</p>
                <p className="text-[10px] text-stone-500">Programar entrada de vehiculo</p>
              </div>
            </button>
            <button
              onClick={openBlockDay}
              className="w-full flex items-center gap-3 rounded-xl border border-stone-200 p-3 hover:bg-red-50 hover:border-red-200 transition-all"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100">
                <Ban className="h-4 w-4 text-red-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">Bloquear dia</p>
                <p className="text-[10px] text-stone-500">Vacaciones, festivo, cierre...</p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Block day ─────────────────────────────────── */}
      <Dialog open={showBlockForm} onOpenChange={setShowBlockForm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Bloquear dia</DialogTitle>
          </DialogHeader>
          <form action={handleBloquear} className="space-y-3">
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-center">
              <Ban className="h-5 w-5 text-red-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-red-700">
                {selectedDate && new Date(selectedDate + "T12:00:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Motivo (opcional)</Label>
              <Input name="motivo" placeholder="Vacaciones, festivo..." className="h-11 rounded-xl" autoFocus />
            </div>
            <Button type="submit" className="w-full h-11 rounded-xl bg-red-500 hover:bg-red-600" disabled={loading}>
              {loading ? "Bloqueando..." : "Bloquear dia"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: New appointment ───────────────────────────── */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Nueva cita</DialogTitle>
          </DialogHeader>
          <form action={handleCrear} className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Nombre del cliente *</Label>
              <Input name="nombre" placeholder="Antonio Garcia" required className="h-11 rounded-xl" autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Telefono</Label>
              <Input name="telefono" placeholder="612 345 678" type="tel" className="h-11 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Fecha</Label>
                <Input type="date" value={selectedDate} disabled className="h-11 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Hora</Label>
                <Input name="hora" type="time" className="h-11 rounded-xl" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Motivo</Label>
              <Input name="motivo" placeholder="Revision, cambio aceite..." className="h-11 rounded-xl" />
            </div>
            <Button type="submit" className="w-full h-11 rounded-xl" disabled={loading}>
              {loading ? "Guardando..." : "Crear cita"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
