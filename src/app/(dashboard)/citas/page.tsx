"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Plus, Trash2, Phone } from "lucide-react";
import type { Cita } from "@/lib/data";

export default function CitasPage() {
  const [citas, setCitas] = useState<Cita[]>([
    {
      id: "1",
      nombre: "Antonio García",
      telefono: "34612345678",
      fecha: "2026-04-28",
      comentario: "Revisión de frenos",
    },
    {
      id: "2",
      nombre: "María López",
      telefono: "34623456789",
      fecha: "2026-04-29",
      comentario: "Cambio de aceite y filtros",
    },
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nueva, setNueva] = useState({
    nombre: "",
    telefono: "",
    fecha: "",
    comentario: "",
  });

  function agregarCita() {
    if (!nueva.nombre || !nueva.telefono || !nueva.fecha) return;
    const cita: Cita = {
      id: Date.now().toString(),
      ...nueva,
    };
    setCitas([...citas, cita]);
    setNueva({ nombre: "", telefono: "", fecha: "", comentario: "" });
    setMostrarFormulario(false);
  }

  function eliminarCita(id: string) {
    setCitas(citas.filter((c) => c.id !== id));
  }

  const citasOrdenadas = [...citas].sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Citas</h1>
          <p className="text-sm text-muted-foreground">
            {citas.length} cita{citas.length !== 1 ? "s" : ""} programada
            {citas.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          <Plus className="mr-1 h-4 w-4" />
          Nueva
        </Button>
      </div>

      {/* Formulario nueva cita */}
      {mostrarFormulario && (
        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="space-y-1">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                placeholder="Nombre del cliente"
                value={nueva.nombre}
                onChange={(e) =>
                  setNueva({ ...nueva, nombre: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                placeholder="34612345678"
                value={nueva.telefono}
                onChange={(e) =>
                  setNueva({ ...nueva, telefono: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                type="date"
                value={nueva.fecha}
                onChange={(e) =>
                  setNueva({ ...nueva, fecha: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="comentario">Comentario</Label>
              <Textarea
                id="comentario"
                placeholder="Motivo de la cita..."
                value={nueva.comentario}
                onChange={(e) =>
                  setNueva({ ...nueva, comentario: e.target.value })
                }
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={agregarCita} className="flex-1">
                Guardar cita
              </Button>
              <Button
                variant="ghost"
                onClick={() => setMostrarFormulario(false)}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de citas */}
      <div className="space-y-2">
        {citasOrdenadas.map((cita) => {
          const fecha = new Date(cita.fecha);
          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);
          const esHoy = fecha.toDateString() === hoy.toDateString();
          const esPasada = fecha < hoy;

          return (
            <Card key={cita.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{cita.nombre}</p>
                    {esHoy && (
                      <Badge className="bg-amber-500 text-xs">Hoy</Badge>
                    )}
                    {esPasada && !esHoy && (
                      <Badge variant="secondary" className="text-xs">
                        Pasada
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    {fecha.toLocaleDateString("es-ES", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                  {cita.comentario && (
                    <p className="text-sm text-muted-foreground">
                      {cita.comentario}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    +{cita.telefono}
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => eliminarCita(cita.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}

        {citas.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No hay citas programadas
          </p>
        )}
      </div>
    </div>
  );
}
