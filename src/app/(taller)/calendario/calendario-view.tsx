"use client";

import { useState } from "react";
import { Plus, Clock, X } from "lucide-react";
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
}

const dayNames = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];

export function CalendarioView({ days, citas }: CalendarioViewProps) {
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
    try {
      await eliminarCita(id);
      toast.success("Cita eliminada");
    } catch {
      toast.error("Error al eliminar");
    }
  }

  return (
    <>
      {/* Vista semanal */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((dayIso, i) => {
          const date = new Date(dayIso);
          const dateStr = date.toISOString().split("T")[0];
          const isToday = dateStr === hoy;
          const dayCitas = citas.filter((c) => c.fecha === dateStr);

          return (
            <div key={dayIso} className="min-h-[120px]">
              {/* Day header */}
              <div
                className={`text-center mb-2 py-1.5 rounded-lg ${
                  isToday ? "bg-brand text-white" : "bg-muted"
                }`}
              >
                <p className="text-[10px] font-bold uppercase">{dayNames[i]}</p>
                <p className={`text-lg font-extrabold leading-none ${isToday ? "" : "text-foreground"}`}>
                  {date.getDate()}
                </p>
              </div>

              {/* Citas */}
              <div className="space-y-1">
                {dayCitas.map((cita) => (
                  <div
                    key={cita.id}
                    className="group relative rounded-lg bg-brand/10 border border-brand/20 p-1.5 text-[10px]"
                  >
                    {cita.horaInicio && (
                      <p className="font-mono font-bold text-brand">
                        {cita.horaInicio.slice(0, 5)}
                      </p>
                    )}
                    <p className="font-semibold truncate">{cita.nombreCliente}</p>
                    {cita.motivo && (
                      <p className="text-muted-foreground truncate">{cita.motivo}</p>
                    )}
                    <button
                      onClick={() => handleEliminar(cita.id)}
                      className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-white hidden group-hover:flex items-center justify-center text-[8px]"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* Add button */}
                <button
                  onClick={() => openNewCita(dateStr)}
                  className="w-full rounded-lg border border-dashed border-border p-1 text-muted-foreground hover:border-brand hover:text-brand transition-colors"
                >
                  <Plus className="h-3 w-3 mx-auto" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: lista de citas */}
      <div className="lg:hidden space-y-2 mt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold">Citas de la semana</h2>
          <Button size="sm" variant="outline" className="rounded-full" onClick={() => openNewCita(hoy)}>
            <Plus className="mr-1 h-3 w-3" />Nueva cita
          </Button>
        </div>
        {citas.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Sin citas esta semana</p>
        ) : (
          citas.map((cita) => (
            <div key={cita.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
              <div className="flex items-center gap-2.5">
                {cita.horaInicio && (
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {cita.horaInicio.slice(0, 5)}
                  </span>
                )}
                <div>
                  <p className="text-sm font-semibold">{cita.nombreCliente}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(cita.fecha + "T12:00:00").toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })}
                    {cita.motivo ? ` · ${cita.motivo}` : ""}
                  </p>
                </div>
              </div>
              <button onClick={() => handleEliminar(cita.id)} className="h-7 w-7 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors">
                ×
              </button>
            </div>
          ))
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
              <Input name="nombre" placeholder="Antonio García" required className="h-11 rounded-xl" autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Teléfono</Label>
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
              <Input name="motivo" placeholder="Revisión, cambio aceite..." className="h-11 rounded-xl" />
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
