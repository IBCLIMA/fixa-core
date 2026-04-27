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
    color: "bg-green-600 hover:bg-green-500 active:bg-green-700",
  },
  {
    id: "presupuesto",
    label: "Presupuesto",
    icon: FileText,
    color: "bg-blue-600 hover:bg-blue-500 active:bg-blue-700",
  },
  {
    id: "pide_cita",
    label: "Pide cita",
    icon: CalendarDays,
    color: "bg-amber-600 hover:bg-amber-500 active:bg-amber-700",
  },
  {
    id: "revision",
    label: "Revisión",
    icon: Wrench,
    color: "bg-purple-600 hover:bg-purple-500 active:bg-purple-700",
  },
];

export default function HoyPage() {
  const [clientes] = useLocalStorage<Cliente[]>("fixa-clientes", []);
  const [citas, setCitas, loaded] = useLocalStorage<Cita[]>("fixa-citas", []);
  const [registro, setRegistro] = useLocalStorage<RegistroMensaje[]>("fixa-registro", []);
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
  const citasHoy = citas.filter((c) => c.fecha === hoy).sort((a, b) => (a.hora || "").localeCompare(b.hora || ""));
  const citasProximas = citas.filter((c) => c.fecha > hoy).sort((a, b) => a.fecha.localeCompare(b.fecha)).slice(0, 5);

  function enviarMensaje(clienteId: string) {
    const cliente = clientes.find((c) => c.id === clienteId);
    const plantilla = plantillas.find((p) => p.id === accionActiva);
    if (!cliente || !plantilla) return;
    abrirWhatsApp(cliente.telefono, cliente.nombre, plantilla.mensaje);
    setRegistro((prev) => [{ id: Date.now().toString(), clienteNombre: cliente.nombre, plantilla: plantilla.label, fecha: new Date().toISOString() }, ...prev.slice(0, 19)]);
    toast.success(`Mensaje preparado para ${cliente.nombre.split(" ")[0]}`);
    setAccionActiva(null);
  }

  function enviarDesdeCita(cita: Cita) {
    if (!cita.telefono) return;
    abrirWhatsApp(cita.telefono, cita.nombre, "Hola {{nombre}}, tu coche ya está listo. Puedes pasar a recogerlo. ¡Un saludo!");
    setRegistro((prev) => [{ id: Date.now().toString(), clienteNombre: cita.nombre, plantilla: "Coche listo", fecha: new Date().toISOString() }, ...prev.slice(0, 19)]);
    toast.success(`Mensaje preparado para ${cita.nombre.split(" ")[0]}`);
  }

  function guardarCita() {
    const c = clientes.find((c) => c.id === nuevaCita.clienteId);
    const nombre = c ? c.nombre : nuevaCita.nombreManual.trim();
    const telefono = c ? c.telefono : nuevaCita.telefonoManual.replace(/\s/g, "").replace(/^\+/, "");
    if (!nombre || !nuevaCita.fecha) return;
    setCitas((prev) => [...prev, { id: Date.now().toString(), clienteId: nuevaCita.clienteId || "", nombre, telefono, fecha: nuevaCita.fecha, hora: nuevaCita.hora, motivo: nuevaCita.motivo }]);
    setNuevaCita({ clienteId: "", nombreManual: "", telefonoManual: "", fecha: hoy, hora: "", motivo: "" });
    setMostrarFormCita(false);
    toast.success("Cita guardada");
  }

  if (!loaded) return null;
  const sinDatos = clientes.length === 0;

  return (
    <div className="space-y-7 pb-4">
      <h1 className="text-2xl font-extrabold tracking-tight">Hoy</h1>

      {/* Estado vacío */}
      {sinDatos && (
        <div className="rounded-2xl border border-border/60 bg-card p-8 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
            <Users className="h-6 w-6 text-amber-600" />
          </div>
          <div className="space-y-1">
            <p className="font-bold">Empieza añadiendo tu primer cliente</p>
            <p className="text-sm text-muted-foreground">Después podrás enviar mensajes y crear citas.</p>
          </div>
          <Link href="/app/clientes">
            <Button size="lg" className="rounded-full bg-primary text-white hover:bg-primary/90 font-semibold">
              <Plus className="mr-2 h-4 w-4" />
              Añadir cliente
            </Button>
          </Link>
        </div>
      )}

      {/* Acciones rápidas */}
      {!sinDatos && (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Acciones rápidas</p>
          <div className="grid grid-cols-2 gap-3">
            {acciones.map((a) => (
              <button
                key={a.id}
                className={`flex flex-col items-center justify-center gap-2 rounded-2xl p-5 text-white transition-all active:scale-[0.97] ${a.color}`}
                onClick={() => setAccionActiva(a.id)}
              >
                <a.icon className="h-7 w-7" />
                <span className="text-xs font-bold">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Citas de hoy */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Citas de hoy</p>
          <Button size="sm" variant="outline" className="h-8 text-xs rounded-full" onClick={() => setMostrarFormCita(true)}>
            <Plus className="mr-1 h-3 w-3" />
            Nueva
          </Button>
        </div>
        {citasHoy.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center space-y-3">
            <CalendarDays className="mx-auto h-6 w-6 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No tienes citas para hoy</p>
            <Button size="sm" variant="outline" className="rounded-full" onClick={() => setMostrarFormCita(true)}>Crear cita</Button>
          </div>
        ) : (
          <div className="space-y-2">
            {citasHoy.map((cita) => (
              <div key={cita.id} className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-4 gap-3">
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    {cita.hora && <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{cita.hora}</span>}
                    <span className="text-sm font-semibold truncate">{cita.nombre}</span>
                  </div>
                  {cita.motivo && <p className="text-xs text-muted-foreground truncate">{cita.motivo}</p>}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {cita.telefono && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-500 text-xs h-8 rounded-full" onClick={() => enviarDesdeCita(cita)}>
                      <Send className="mr-1 h-3 w-3" />Avisar
                    </Button>
                  )}
                  <button className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center justify-center transition-colors" onClick={() => setCitas((p) => p.filter((c) => c.id !== cita.id))}>×</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Próximas */}
      {citasProximas.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Próximas citas</p>
          <div className="space-y-2">
            {citasProximas.map((cita) => (
              <div key={cita.id} className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-4 gap-3">
                <div className="min-w-0 space-y-0.5">
                  <span className="text-sm font-semibold truncate block">{cita.nombre}</span>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 shrink-0" />
                    {new Date(cita.fecha + "T12:00:00").toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })}
                    {cita.hora ? ` · ${cita.hora}` : ""}
                  </div>
                  {cita.motivo && <p className="text-xs text-muted-foreground truncate">{cita.motivo}</p>}
                </div>
                <button className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center justify-center transition-colors shrink-0" onClick={() => setCitas((p) => p.filter((c) => c.id !== cita.id))}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Registro */}
      {registro.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Últimos mensajes</p>
          <div className="rounded-2xl border border-border/60 bg-card divide-y divide-border/40">
            {registro.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center justify-between px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{r.clienteNombre}</p>
                  <p className="text-xs text-muted-foreground">{r.plantilla}</p>
                </div>
                <span className="text-[11px] text-muted-foreground shrink-0 tabular-nums">
                  {new Date(r.fecha).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: seleccionar cliente */}
      <Dialog open={!!accionActiva} onOpenChange={(o) => !o && setAccionActiva(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>¿A quién?</DialogTitle></DialogHeader>
          <div className="max-h-72 space-y-1 overflow-y-auto">
            {clientes.map((c) => (
              <button key={c.id} className="flex w-full items-center gap-3 rounded-xl p-3 text-left active:bg-accent hover:bg-accent transition-colors" onClick={() => enviarMensaje(c.id)}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/10"><User className="h-4 w-4 text-amber-600" /></div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{c.nombre}</p>
                  {c.vehiculo && <p className="text-xs text-muted-foreground truncate">{c.vehiculo}</p>}
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: nueva cita */}
      <Dialog open={mostrarFormCita} onOpenChange={setMostrarFormCita}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Nueva cita</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {clientes.length > 0 && (
              <div className="space-y-1">
                <Label className="text-xs">Cliente</Label>
                <Select value={nuevaCita.clienteId} onValueChange={(v) => setNuevaCita({ ...nuevaCita, clienteId: v, nombreManual: "", telefonoManual: "" })}>
                  <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                  <SelectContent>{clientes.map((c) => (<SelectItem key={c.id} value={c.id}>{c.nombre}{c.vehiculo ? ` — ${c.vehiculo}` : ""}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            )}
            {!nuevaCita.clienteId && (
              <>
                <div className="space-y-1">
                  <Label className="text-xs">{clientes.length > 0 ? "O nombre manual" : "Nombre"}</Label>
                  <Input placeholder="Nombre" value={nuevaCita.nombreManual} onChange={(e) => setNuevaCita({ ...nuevaCita, nombreManual: e.target.value })} className="h-11 rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Teléfono</Label>
                  <Input placeholder="34612345678" value={nuevaCita.telefonoManual} onChange={(e) => setNuevaCita({ ...nuevaCita, telefonoManual: e.target.value })} className="h-11 rounded-xl" type="tel" />
                </div>
              </>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label className="text-xs">Fecha</Label><Input type="date" value={nuevaCita.fecha} onChange={(e) => setNuevaCita({ ...nuevaCita, fecha: e.target.value })} className="h-11 rounded-xl" /></div>
              <div className="space-y-1"><Label className="text-xs">Hora</Label><Input type="time" value={nuevaCita.hora} onChange={(e) => setNuevaCita({ ...nuevaCita, hora: e.target.value })} className="h-11 rounded-xl" /></div>
            </div>
            <div className="space-y-1"><Label className="text-xs">Motivo</Label><Input placeholder="Revisión frenos, cambio aceite..." value={nuevaCita.motivo} onChange={(e) => setNuevaCita({ ...nuevaCita, motivo: e.target.value })} className="h-11 rounded-xl" /></div>
            <Button onClick={guardarCita} className="w-full h-11 rounded-xl">Guardar cita</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
