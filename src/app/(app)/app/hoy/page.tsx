"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { plantillas, enviarWhatsApp, type Cita, type Cliente } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  FileText,
  CalendarDays,
  Wrench,
  Send,
  Clock,
  Car,
  User,
} from "lucide-react";

const accionesRapidas = [
  {
    id: "coche_listo",
    label: "Coche listo",
    icon: CheckCircle2,
    color: "bg-green-600 hover:bg-green-700 active:bg-green-800",
    plantillaId: "coche_listo",
  },
  {
    id: "presupuesto",
    label: "Presupuesto listo",
    icon: FileText,
    color: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800",
    plantillaId: "presupuesto",
  },
  {
    id: "pide_cita",
    label: "Pide cita",
    icon: CalendarDays,
    color: "bg-amber-600 hover:bg-amber-700 active:bg-amber-800",
    plantillaId: "pide_cita",
  },
  {
    id: "revision",
    label: "Toca revisión",
    icon: Wrench,
    color: "bg-purple-600 hover:bg-purple-700 active:bg-purple-800",
    plantillaId: "revision",
  },
];

export default function HoyPage() {
  const [clientes] = useLocalStorage<Cliente[]>("fixa-clientes", []);
  const [citas] = useLocalStorage<Cita[]>("fixa-citas", []);
  const [accionActiva, setAccionActiva] = useState<string | null>(null);
  const [clienteModal, setClienteModal] = useState<string | null>(null);

  const hoy = new Date().toISOString().split("T")[0];
  const citasHoy = citas.filter((c) => c.fecha === hoy);

  function handleAccion(plantillaId: string) {
    if (clientes.length === 0) return;
    setAccionActiva(plantillaId);
  }

  function enviarAccionACliente(clienteId: string) {
    const cliente = clientes.find((c) => c.id === clienteId);
    const plantilla = plantillas.find((p) => p.id === accionActiva);
    if (cliente && plantilla) {
      enviarWhatsApp(cliente.telefono, cliente.nombre, plantilla.mensaje);
    }
    setAccionActiva(null);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-extrabold">Hoy</h1>

      {/* Acciones rápidas */}
      <div className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Acciones rápidas
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {accionesRapidas.map((accion) => (
            <Button
              key={accion.id}
              className={`h-20 flex-col gap-1 text-white ${accion.color}`}
              onClick={() => handleAccion(accion.plantillaId)}
              disabled={clientes.length === 0}
            >
              <accion.icon className="h-6 w-6" />
              <span className="text-xs font-semibold">{accion.label}</span>
            </Button>
          ))}
        </div>
        {clientes.length === 0 && (
          <p className="text-center text-xs text-muted-foreground">
            Añade clientes primero en la pestaña Clientes
          </p>
        )}
      </div>

      {/* Citas de hoy */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Citas de hoy
          </h2>
          <span className="text-xs text-muted-foreground">{citasHoy.length}</span>
        </div>

        {citasHoy.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No hay citas para hoy
          </p>
        ) : (
          citasHoy.map((cita) => (
            <Card key={cita.id}>
              <CardContent className="flex items-center justify-between p-3">
                <div className="space-y-0.5">
                  <p className="font-medium text-sm">{cita.nombre}</p>
                  <p className="text-xs text-muted-foreground">{cita.motivo}</p>
                </div>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-xs"
                  onClick={() =>
                    enviarWhatsApp(
                      cita.telefono,
                      cita.nombre,
                      "Hola {{nombre}}, tu coche ya está listo. Puedes pasar a recogerlo. ¡Un saludo!"
                    )
                  }
                >
                  <Send className="mr-1 h-3 w-3" />
                  Avisar
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Todos los clientes — resumen */}
      {clientes.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Clientes ({clientes.length})
          </h2>
          <div className="divide-y divide-border rounded-lg border border-border">
            {clientes.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-2.5 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 truncate">{c.nombre}</span>
                <span className="text-xs text-muted-foreground">{c.vehiculo}</span>
              </div>
            ))}
          </div>
          {clientes.length > 5 && (
            <p className="text-center text-xs text-muted-foreground">
              y {clientes.length - 5} más
            </p>
          )}
        </div>
      )}

      {/* Modal selección de cliente para acción rápida */}
      <Dialog open={!!accionActiva} onOpenChange={(open) => !open && setAccionActiva(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">¿A quién?</DialogTitle>
          </DialogHeader>
          <div className="max-h-64 space-y-1 overflow-y-auto">
            {clientes.map((c) => (
              <button
                key={c.id}
                className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors active:bg-accent hover:bg-accent"
                onClick={() => enviarAccionACliente(c.id)}
              >
                <User className="h-4 w-4 text-amber-500" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{c.nombre}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.vehiculo}</p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
