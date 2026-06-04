"use client";

import { useState } from "react";
import { Plus, Clock, X, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { crearCita, eliminarCita } from "../actions/citas";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

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

interface CalendarioViewProps {
  days: string[];
  citas: Cita[];
  totalCitas: number;
}

const dayNames = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"];
const dayNamesFull = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];

// Colors for appointment cards - cycles through for visual variety
const citaColors = [
  { border: "border-l-orange-500", bg: "bg-orange-50", text: "text-orange-700", time: "text-orange-600" },
  { border: "border-l-blue-500", bg: "bg-blue-50", text: "text-blue-700", time: "text-blue-600" },
  { border: "border-l-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700", time: "text-emerald-600" },
  { border: "border-l-violet-500", bg: "bg-violet-50", text: "text-violet-700", time: "text-violet-600" },
  { border: "border-l-rose-500", bg: "bg-rose-50", text: "text-rose-700", time: "text-rose-600" },
];

export function CalendarioView({ days, citas, totalCitas }: CalendarioViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);

  const hoy = new Date().toISOString().split("T")[0];

  function openNewCita(date: string) {
    setSelectedDate(date);
    setShowForm(true);
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

  return (
    <>
      {/* Vista semanal -- desktop */}
      <div className="hidden md:grid grid-cols-7 gap-3">
        {days.map((dayIso, i) => {
          const date = new Date(dayIso);
          const dateStr = date.toISOString().split("T")[0];
          const isToday = dateStr === hoy;
          const isWeekend = i >= 5;
          const dayCitas = citas.filter((c) => c.fecha === dateStr);

          return (
            <div
              key={dayIso}
              className={cn(
                "min-h-[140px] rounded-xl border transition-all duration-200",
                isToday
                  ? "border-orange-200 bg-orange-50/30 shadow-sm shadow-orange-500/5"
                  : isWeekend
                  ? "border-stone-100 bg-stone-50/50"
                  : "border-stone-200/60 bg-white"
              )}
            >
              {/* Day header */}
              <div
                className={cn(
                  "text-center py-2.5 rounded-t-xl border-b",
                  isToday
                    ? "bg-orange-500 text-white border-orange-500"
                    : isWeekend
                    ? "bg-stone-100/80 border-stone-100 text-stone-400"
                    : "bg-stone-50 border-stone-200/40"
                )}
              >
                <p className={cn(
                  "text-[10px] font-bold uppercase tracking-wider",
                  isToday ? "text-orange-100" : isWeekend ? "text-stone-400" : "text-stone-400"
                )}>
                  {dayNames[i]}
                </p>
                <p className={cn(
                  "text-xl font-extrabold leading-none mt-0.5",
                  isToday ? "text-white" : isWeekend ? "text-stone-400" : "text-stone-700"
                )}>
                  {date.getDate()}
                </p>
              </div>

              {/* Citas */}
              <div className="p-1.5 space-y-1.5">
                {dayCitas.length === 0 && (
                  <p className={cn(
                    "text-[10px] text-center py-2",
                    isWeekend ? "text-stone-300" : "text-stone-300"
                  )}>
                    Sin citas
                  </p>
                )}

                {dayCitas.map((cita, citaIdx) => {
                  const color = citaColors[citaIdx % citaColors.length];
                  return (
                    <div
                      key={cita.id}
                      className={cn(
                        "group relative rounded-lg border-l-[3px] p-2 text-[11px] transition-all duration-200 hover:shadow-sm",
                        color.border, color.bg
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
                      <button
                        onClick={() => handleEliminar(cita.id)}
                        className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-white hidden group-hover:flex items-center justify-center text-[8px] transition-all duration-200 hover:bg-red-600"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  );
                })}

                {/* Add button */}
                <button
                  onClick={() => openNewCita(dateStr)}
                  className={cn(
                    "group/add w-full rounded-lg border border-dashed p-2 transition-all duration-200",
                    isWeekend
                      ? "border-stone-200 text-stone-300 hover:border-orange-300 hover:text-orange-400 hover:bg-orange-50/50"
                      : "border-stone-200 text-stone-300 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50/50"
                  )}
                >
                  <Plus className="h-3 w-3 mx-auto transition-transform duration-200 group-hover/add:scale-110" />
                  <span className="text-[9px] font-medium hidden group-hover/add:block mt-0.5">
                    Anadir cita
                  </span>
                </button>
              </div>
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
        </div>
        <Button
          size="sm"
          variant="outline"
          className="rounded-xl text-xs h-8 border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
          onClick={() => openNewCita(hoy)}
        >
          <Plus className="mr-1 h-3 w-3" />
          Nueva cita
        </Button>
      </div>

      {/* Mobile: lista de citas */}
      <div className="md:hidden space-y-3 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold">Citas de la semana</h2>
            <p className="text-xs text-muted-foreground">
              {totalCitas} {totalCitas === 1 ? "cita programada" : "citas programadas"}
            </p>
          </div>
          <Button size="sm" variant="outline" className="rounded-xl" onClick={() => openNewCita(hoy)}>
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
              onClick={() => openNewCita(hoy)}
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
                    "flex items-center justify-between rounded-xl border bg-white p-3.5 transition-all duration-200 border-l-[3px]",
                    color.border,
                    isDateToday && "ring-1 ring-orange-200"
                  )}
                >
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
                  <button
                    onClick={() => handleEliminar(cita.id)}
                    className="h-8 w-8 rounded-xl text-stone-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all duration-200 shrink-0 ml-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dialog nueva cita */}
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
