"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { plantillas, enviarWhatsApp, type Cita, type Cliente } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  FileText,
  CalendarDays,
  Wrench,
  Send,
  Clock,
  Plus,
  User,
  Users,
} from "lucide-react";
import { toast } from "sonner";

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
  const [citas, setCitas, citasLoaded] = useLocalStorage<Cita[]>("fixa-citas", []);
  const [accionActiva, setAccionActiva] = useState<string | null>(null);
  const [mostrarFormCita, setMostrarFormCita] = useState(false);
  const [nuevaCita, setNuevaCita] = useState({
    clienteId: "",
    nombreManual: "",
    telefonoManual: "",
    fecha: new Date().toISOString().split("T")[0],
    motivo: "",
  });

  const hoy = new Date().toISOString().split("T")[0];
  const citasHoy = citas.filter((c) => c.fecha === hoy);
  const citasFuturas = citas
    .filter((c) => c.fecha > hoy)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(0, 3);

  function handleAccion(plantillaId: string) {
    if (clientes.length === 0) return;
    setAccionActiva(plantillaId);
  }

  function enviarAccionACliente(clienteId: string) {
    const cliente = clientes.find((c) => c.id === clienteId);
    const plantilla = plantillas.find((p) => p.id === accionActiva);
    if (cliente && plantilla) {
      enviarWhatsApp(cliente.telefono, cliente.nombre, plantilla.mensaje);
      toast.success("Mensaje preparado en WhatsApp");
    }
    setAccionActiva(null);
  }

  function guardarCita() {
    const clienteExistente = clientes.find((c) => c.id === nuevaCita.clienteId);
    const nombre = clienteExistente ? clienteExistente.nombre : nuevaCita.nombreManual;
    const telefono = clienteExistente
      ? clienteExistente.telefono
      : nuevaCita.telefonoManual.replace(/\s/g, "").replace(/^\+/, "");

    if (!nombre || !nuevaCita.fecha) return;

    const cita: Cita = {
      id: Date.now().toString(),
      clienteId: nuevaCita.clienteId || "",
      nombre,
      telefono,
      fecha: nuevaCita.fecha,
      motivo: nuevaCita.motivo,
    };

    setCitas([...citas, cita]);
    setNuevaCita({
      clienteId: "",
      nombreManual: "",
      telefonoManual: "",
      fecha: new Date().toISOString().split("T")[0],
      motivo: "",
    });
    setMostrarFormCita(false);
    toast.success("Cita guardada");
  }

  function eliminarCita(id: string) {
    setCitas(citas.filter((c) => c.id !== id));
    toast("Cita eliminada");
  }

  function enviarYToast(telefono: string, nombre: string, mensaje: string) {
    enviarWhatsApp(telefono, nombre, mensaje);
    toast.success("Mensaje preparado en WhatsApp");
  }

  if (!citasLoaded) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-extrabold">Hoy</h1>

      {/* Estado vacío total */}
      {clientes.length === 0 && citas.length === 0 && (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="p-5 text-center space-y-3">
            <Users className="mx-auto h-8 w-8 text-amber-500" />
            <p className="font-semibold">Empieza añadiendo tu primer cliente</p>
            <p className="text-xs text-muted-foreground">
              Después podrás enviar mensajes y crear citas
            </p>
            <Link href="/app/clientes">
              <Button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                <Plus className="mr-1 h-4 w-4" />
                Añadir cliente
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Acciones rápidas — solo si hay clientes */}
      {clientes.length > 0 && (
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
              >
                <accion.icon className="h-6 w-6" />
                <span className="text-xs font-semibold">{accion.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Citas de hoy */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Citas de hoy
          </h2>
          <Button size="sm" variant="ghost" onClick={() => setMostrarFormCita(true)}>
            <Plus className="mr-1 h-3 w-3" />
            Nueva cita
          </Button>
        </div>

        {citasHoy.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-center space-y-2">
            <CalendarDays className="mx-auto h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No tienes citas para hoy</p>
            <Button size="sm" variant="outline" onClick={() => setMostrarFormCita(true)}>
              Crear cita
            </Button>
          </div>
        ) : (
          citasHoy.map((cita) => (
            <Card key={cita.id}>
              <CardContent className="flex items-center justify-between p-3">
                <div className="space-y-0.5 min-w-0">
                  <p className="font-medium text-sm truncate">{cita.nombre}</p>
                  {cita.motivo && (
                    <p className="text-xs text-muted-foreground truncate">{cita.motivo}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {cita.telefono && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-xs"
                      onClick={() =>
                        enviarYToast(
                          cita.telefono,
                          cita.nombre,
                          "Hola {{nombre}}, tu coche ya está listo. Puedes pasar a recogerlo. ¡Un saludo!"
                        )
                      }
                    >
                      <Send className="mr-1 h-3 w-3" />
                      Avisar
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive h-8 w-8"
                    onClick={() => eliminarCita(cita.id)}
                  >
                    ×
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Próximas citas */}
      {citasFuturas.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Próximas citas
          </h2>
          {citasFuturas.map((cita) => (
            <Card key={cita.id}>
              <CardContent className="flex items-center justify-between p-3">
                <div className="space-y-0.5 min-w-0">
                  <p className="font-medium text-sm truncate">{cita.nombre}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(cita.fecha).toLocaleDateString("es-ES", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                  {cita.motivo && (
                    <p className="text-xs text-muted-foreground truncate">{cita.motivo}</p>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-muted-foreground hover:text-destructive h-8 w-8 shrink-0"
                  onClick={() => eliminarCita(cita.id)}
                >
                  ×
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal selección cliente para acción rápida */}
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
                  {c.vehiculo && (
                    <p className="text-xs text-muted-foreground truncate">{c.vehiculo}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal nueva cita */}
      <Dialog open={mostrarFormCita} onOpenChange={setMostrarFormCita}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Nueva cita</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {clientes.length > 0 && (
              <div className="space-y-1">
                <Label className="text-xs">Cliente existente</Label>
                <Select
                  value={nuevaCita.clienteId}
                  onValueChange={(v) =>
                    setNuevaCita({ ...nuevaCita, clienteId: v, nombreManual: "", telefonoManual: "" })
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Seleccionar cliente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nombre} {c.vehiculo ? `— ${c.vehiculo}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {!nuevaCita.clienteId && (
              <>
                <div className="space-y-1">
                  <Label className="text-xs">
                    {clientes.length > 0 ? "O nombre manual" : "Nombre"}
                  </Label>
                  <Input
                    placeholder="Nombre del cliente"
                    value={nuevaCita.nombreManual}
                    onChange={(e) => setNuevaCita({ ...nuevaCita, nombreManual: e.target.value })}
                    className="h-11"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Teléfono</Label>
                  <Input
                    placeholder="34612345678"
                    value={nuevaCita.telefonoManual}
                    onChange={(e) => setNuevaCita({ ...nuevaCita, telefonoManual: e.target.value })}
                    className="h-11"
                    type="tel"
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <Label className="text-xs">Fecha</Label>
              <Input
                type="date"
                value={nuevaCita.fecha}
                onChange={(e) => setNuevaCita({ ...nuevaCita, fecha: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Motivo</Label>
              <Textarea
                placeholder="Revisión de frenos, cambio aceite..."
                value={nuevaCita.motivo}
                onChange={(e) => setNuevaCita({ ...nuevaCita, motivo: e.target.value })}
                rows={2}
              />
            </div>
            <Button onClick={guardarCita} className="w-full h-11">
              Guardar cita
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
