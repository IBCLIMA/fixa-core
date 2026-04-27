"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  plantillas,
  abrirWhatsApp,
  type Cita,
  type Cliente,
  type RegistroMensaje,
} from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const acciones = [
  {
    id: "coche_listo",
    label: "Coche listo",
    icon: CheckCircle2,
    color: "bg-green-600 hover:bg-green-700 active:bg-green-800",
  },
  {
    id: "presupuesto",
    label: "Presupuesto listo",
    icon: FileText,
    color: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800",
  },
  {
    id: "pide_cita",
    label: "Pide cita",
    icon: CalendarDays,
    color: "bg-amber-600 hover:bg-amber-700 active:bg-amber-800",
  },
  {
    id: "revision",
    label: "Toca revisión",
    icon: Wrench,
    color: "bg-purple-600 hover:bg-purple-700 active:bg-purple-800",
  },
];

export default function HoyPage() {
  const [clientes] = useLocalStorage<Cliente[]>("fixa-clientes", []);
  const [citas, setCitas, loaded] = useLocalStorage<Cita[]>("fixa-citas", []);
  const [registro, setRegistro] = useLocalStorage<RegistroMensaje[]>(
    "fixa-registro",
    []
  );
  const [accionActiva, setAccionActiva] = useState<string | null>(null);
  const [mostrarFormCita, setMostrarFormCita] = useState(false);
  const [nuevaCita, setNuevaCita] = useState({
    clienteId: "",
    nombreManual: "",
    telefonoManual: "",
    fecha: new Date().toISOString().split("T")[0],
    hora: "",
    motivo: "",
  });

  const hoy = new Date().toISOString().split("T")[0];
  const citasHoy = citas
    .filter((c) => c.fecha === hoy)
    .sort((a, b) => (a.hora || "").localeCompare(b.hora || ""));
  const citasProximas = citas
    .filter((c) => c.fecha > hoy)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(0, 5);

  function enviarMensaje(clienteId: string) {
    const cliente = clientes.find((c) => c.id === clienteId);
    const plantilla = plantillas.find((p) => p.id === accionActiva);
    if (!cliente || !plantilla) return;

    abrirWhatsApp(cliente.telefono, cliente.nombre, plantilla.mensaje);

    setRegistro((prev) => [
      {
        id: Date.now().toString(),
        clienteNombre: cliente.nombre,
        plantilla: plantilla.label,
        fecha: new Date().toISOString(),
      },
      ...prev.slice(0, 19),
    ]);

    toast.success(`Mensaje preparado para ${cliente.nombre.split(" ")[0]}`);
    setAccionActiva(null);
  }

  function enviarDesdesCita(cita: Cita) {
    if (!cita.telefono) return;
    abrirWhatsApp(
      cita.telefono,
      cita.nombre,
      "Hola {{nombre}}, tu coche ya está listo. Puedes pasar a recogerlo. ¡Un saludo!"
    );
    setRegistro((prev) => [
      {
        id: Date.now().toString(),
        clienteNombre: cita.nombre,
        plantilla: "Coche listo",
        fecha: new Date().toISOString(),
      },
      ...prev.slice(0, 19),
    ]);
    toast.success(`Mensaje preparado para ${cita.nombre.split(" ")[0]}`);
  }

  function guardarCita() {
    const clienteExistente = clientes.find(
      (c) => c.id === nuevaCita.clienteId
    );
    const nombre = clienteExistente
      ? clienteExistente.nombre
      : nuevaCita.nombreManual.trim();
    const telefono = clienteExistente
      ? clienteExistente.telefono
      : nuevaCita.telefonoManual.replace(/\s/g, "").replace(/^\+/, "");

    if (!nombre || !nuevaCita.fecha) return;

    setCitas((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        clienteId: nuevaCita.clienteId || "",
        nombre,
        telefono,
        fecha: nuevaCita.fecha,
        hora: nuevaCita.hora,
        motivo: nuevaCita.motivo,
      },
    ]);

    setNuevaCita({
      clienteId: "",
      nombreManual: "",
      telefonoManual: "",
      fecha: hoy,
      hora: "",
      motivo: "",
    });
    setMostrarFormCita(false);
    toast.success("Cita guardada");
  }

  function eliminarCita(id: string) {
    setCitas((prev) => prev.filter((c) => c.id !== id));
  }

  if (!loaded) return null;

  const sinDatos = clientes.length === 0;

  return (
    <div className="space-y-6 pb-4">
      <h1 className="text-xl font-extrabold">Hoy</h1>

      {/* ── Estado vacío: sin clientes ── */}
      {sinDatos && (
        <Card className="border-border">
          <CardContent className="p-5 space-y-3 text-center">
            <Users className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">
              Empieza añadiendo tu primer cliente para usar los mensajes rápidos
              y organizar tus citas.
            </p>
            <Link href="/app/clientes">
              <Button size="lg" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Añadir cliente
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* ── Acciones rápidas ── */}
      {!sinDatos && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Acciones rápidas
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {acciones.map((a) => (
              <Button
                key={a.id}
                className={`h-[72px] flex-col gap-1.5 text-white ${a.color}`}
                onClick={() => setAccionActiva(a.id)}
              >
                <a.icon className="h-6 w-6" />
                <span className="text-xs font-semibold">{a.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* ── Citas de hoy ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Citas de hoy
          </p>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={() => setMostrarFormCita(true)}
          >
            <Plus className="mr-1 h-3 w-3" />
            Nueva cita
          </Button>
        </div>

        {citasHoy.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-5 text-center space-y-2">
              <CalendarDays className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No tienes citas para hoy
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setMostrarFormCita(true)}
              >
                Crear cita
              </Button>
            </CardContent>
          </Card>
        ) : (
          citasHoy.map((cita) => (
            <Card key={cita.id}>
              <CardContent className="flex items-center justify-between p-3 gap-2">
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    {cita.hora && (
                      <span className="text-xs font-mono text-muted-foreground">
                        {cita.hora}
                      </span>
                    )}
                    <span className="text-sm font-medium truncate">
                      {cita.nombre}
                    </span>
                  </div>
                  {cita.motivo && (
                    <p className="text-xs text-muted-foreground truncate">
                      {cita.motivo}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {cita.telefono && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-xs h-8"
                      onClick={() => enviarDesdesCita(cita)}
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

      {/* ── Próximas citas ── */}
      {citasProximas.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Próximas citas
          </p>
          {citasProximas.map((cita) => (
            <Card key={cita.id}>
              <CardContent className="flex items-center justify-between p-3 gap-2">
                <div className="min-w-0 space-y-0.5">
                  <span className="text-sm font-medium truncate block">
                    {cita.nombre}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 shrink-0" />
                    <span>
                      {new Date(cita.fecha + "T12:00:00").toLocaleDateString(
                        "es-ES",
                        { weekday: "short", day: "numeric", month: "short" }
                      )}
                      {cita.hora ? ` · ${cita.hora}` : ""}
                    </span>
                  </div>
                  {cita.motivo && (
                    <p className="text-xs text-muted-foreground truncate">
                      {cita.motivo}
                    </p>
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

      {/* ── Últimos mensajes ── */}
      {registro.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Últimos mensajes preparados
          </p>
          <div className="divide-y divide-border rounded-lg border border-border">
            {registro.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center justify-between px-3 py-2">
                <div className="min-w-0">
                  <p className="text-sm truncate">{r.clienteNombre}</p>
                  <p className="text-xs text-muted-foreground">{r.plantilla}</p>
                </div>
                <span className="text-[11px] text-muted-foreground shrink-0">
                  {new Date(r.fecha).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Modal: seleccionar cliente para acción ── */}
      <Dialog
        open={!!accionActiva}
        onOpenChange={(o) => !o && setAccionActiva(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">¿A quién?</DialogTitle>
          </DialogHeader>
          <div className="max-h-72 space-y-1 overflow-y-auto -mx-1 px-1">
            {clientes.map((c) => (
              <button
                key={c.id}
                className="flex w-full items-center gap-3 rounded-lg p-3 text-left active:bg-accent hover:bg-accent"
                onClick={() => enviarMensaje(c.id)}
              >
                <User className="h-4 w-4 shrink-0 text-amber-500" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{c.nombre}</p>
                  {c.vehiculo && (
                    <p className="text-xs text-muted-foreground truncate">
                      {c.vehiculo}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Modal: nueva cita ── */}
      <Dialog open={mostrarFormCita} onOpenChange={setMostrarFormCita}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Nueva cita</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {clientes.length > 0 && (
              <div className="space-y-1">
                <Label className="text-xs">Cliente</Label>
                <Select
                  value={nuevaCita.clienteId}
                  onValueChange={(v) =>
                    setNuevaCita({
                      ...nuevaCita,
                      clienteId: v,
                      nombreManual: "",
                      telefonoManual: "",
                    })
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Seleccionar cliente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nombre}
                        {c.vehiculo ? ` — ${c.vehiculo}` : ""}
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
                    onChange={(e) =>
                      setNuevaCita({
                        ...nuevaCita,
                        nombreManual: e.target.value,
                      })
                    }
                    className="h-11"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Teléfono</Label>
                  <Input
                    placeholder="34612345678"
                    value={nuevaCita.telefonoManual}
                    onChange={(e) =>
                      setNuevaCita({
                        ...nuevaCita,
                        telefonoManual: e.target.value,
                      })
                    }
                    className="h-11"
                    type="tel"
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Fecha</Label>
                <Input
                  type="date"
                  value={nuevaCita.fecha}
                  onChange={(e) =>
                    setNuevaCita({ ...nuevaCita, fecha: e.target.value })
                  }
                  className="h-11"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Hora</Label>
                <Input
                  type="time"
                  value={nuevaCita.hora}
                  onChange={(e) =>
                    setNuevaCita({ ...nuevaCita, hora: e.target.value })
                  }
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Motivo</Label>
              <Input
                placeholder="Revisión frenos, cambio aceite..."
                value={nuevaCita.motivo}
                onChange={(e) =>
                  setNuevaCita({ ...nuevaCita, motivo: e.target.value })
                }
                className="h-11"
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
