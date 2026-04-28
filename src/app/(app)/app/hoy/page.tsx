"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { plantillas, abrirWhatsApp, type Cita, type Cliente, type RegistroMensaje } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, FileText, CalendarDays, Wrench, Send, Clock, Plus, User, Users, MessageSquare, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const acciones = [
  { id: "coche_listo", label: "Coche listo", desc: "Avisar recogida", icon: CheckCircle2, color: "bg-emerald-500 shadow-emerald-500/20" },
  { id: "presupuesto", label: "Presupuesto", desc: "Enviar presupuesto", icon: FileText, color: "bg-blue-500 shadow-blue-500/20" },
  { id: "pide_cita", label: "Pide cita", desc: "Proponer cita", icon: CalendarDays, color: "bg-primary shadow-primary/20" },
  { id: "revision", label: "Revisión", desc: "Aviso revisión", icon: Wrench, color: "bg-violet-500 shadow-violet-500/20" },
];

export default function HoyPage() {
  const [clientes] = useLocalStorage<Cliente[]>("fixa-clientes", []);
  const [citas, setCitas, loaded] = useLocalStorage<Cita[]>("fixa-citas", []);
  const [registro, setRegistro] = useLocalStorage<RegistroMensaje[]>("fixa-registro", []);
  const [accionActiva, setAccionActiva] = useState<string | null>(null);
  const [mostrarFormCita, setMostrarFormCita] = useState(false);
  const [nuevaCita, setNuevaCita] = useState({ clienteId: "", nombreManual: "", telefonoManual: "", fecha: new Date().toISOString().split("T")[0], hora: "", motivo: "" });

  const hoy = new Date().toISOString().split("T")[0];
  const citasHoy = citas.filter((c) => c.fecha === hoy).sort((a, b) => (a.hora || "").localeCompare(b.hora || ""));
  const citasProximas = citas.filter((c) => c.fecha > hoy).sort((a, b) => a.fecha.localeCompare(b.fecha)).slice(0, 3);

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
    <div className="space-y-5 pb-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Hoy</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Gestiona clientes, citas y mensajes sin perder tiempo</p>
      </div>

      {/* Resumen */}
      {!sinDatos && (
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { value: clientes.length, label: "Clientes", href: "/app/clientes" },
            { value: citasHoy.length, label: "Citas hoy", action: () => setMostrarFormCita(true) },
            { value: registro.length, label: "Mensajes", href: "/app/mensajes" },
          ].map((s) => (
            s.href ? (
              <Link key={s.label} href={s.href} className="rounded-2xl bg-white border border-border/50 p-3.5 text-center shadow-sm hover:shadow-md transition-all duration-300">
                <p className="text-2xl font-extrabold">{s.value}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] mt-0.5">{s.label}</p>
              </Link>
            ) : (
              <button key={s.label} onClick={s.action} className="rounded-2xl bg-white border border-border/50 p-3.5 text-center shadow-sm hover:shadow-md transition-all duration-300">
                <p className="text-2xl font-extrabold">{s.value}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] mt-0.5">{s.label}</p>
              </button>
            )
          ))}
        </div>
      )}

      {/* Estado vacío */}
      {sinDatos && (
        <div className="rounded-3xl bg-white border border-border/50 p-8 text-center space-y-4 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <p className="font-bold">Empieza añadiendo tu primer cliente</p>
          <p className="text-sm text-muted-foreground">Después podrás enviar mensajes y crear citas.</p>
          <Link href="/app/clientes">
            <Button size="lg" className="rounded-full bg-accent text-white hover:bg-accent/90 font-semibold shadow-md shadow-accent/10">
              <Plus className="mr-2 h-4 w-4" />Añadir cliente
            </Button>
          </Link>
        </div>
      )}

      {/* Acciones rápidas */}
      {!sinDatos && (
        <div className="space-y-2.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Acciones rápidas</p>
          <div className="grid grid-cols-2 gap-2.5">
            {acciones.map((a) => (
              <button key={a.id} className={`flex items-center gap-3 rounded-2xl p-4 text-white text-left transition-all duration-200 active:scale-[0.97] shadow-lg ${a.color}`} onClick={() => setAccionActiva(a.id)}>
                <a.icon className="h-6 w-6 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-bold leading-tight">{a.label}</p>
                  <p className="text-[10px] text-white/70">{a.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Citas de hoy */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Citas de hoy</p>
          <button onClick={() => setMostrarFormCita(true)} className="text-[10px] font-bold text-primary flex items-center gap-0.5 hover:underline">
            <Plus className="h-3 w-3" />Nueva
          </button>
        </div>
        {citasHoy.length === 0 ? (
          <div className="rounded-2xl bg-white border border-dashed border-border p-6 text-center shadow-sm space-y-2">
            <CalendarDays className="mx-auto h-5 w-5 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No tienes citas para hoy</p>
            <button onClick={() => setMostrarFormCita(true)} className="text-xs font-bold text-primary hover:underline">Crear cita</button>
          </div>
        ) : (
          <div className="space-y-2">
            {citasHoy.map((cita) => (
              <div key={cita.id} className="flex items-center justify-between rounded-2xl bg-white border border-border/50 p-4 gap-3 shadow-sm">
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    {cita.hora && <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">{cita.hora}</span>}
                    <span className="text-sm font-semibold truncate">{cita.nombre}</span>
                  </div>
                  {cita.motivo && <p className="text-xs text-muted-foreground truncate">{cita.motivo}</p>}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {cita.telefono && (
                    <button className="flex h-8 items-center gap-1 rounded-full bg-emerald-500 px-3 text-white shadow-sm hover:bg-emerald-400 transition-colors" onClick={() => enviarDesdeCita(cita)}>
                      <Send className="h-3 w-3" /><span className="text-[10px] font-bold">Avisar</span>
                    </button>
                  )}
                  <button className="h-7 w-7 rounded-full text-muted-foreground/40 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors text-sm" onClick={() => setCitas((p) => p.filter((c) => c.id !== cita.id))}>×</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Próximas */}
      {citasProximas.length > 0 && (
        <div className="space-y-2.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Próximas</p>
          <div className="space-y-2">
            {citasProximas.map((cita) => (
              <div key={cita.id} className="flex items-center justify-between rounded-2xl bg-white border border-border/50 p-4 gap-3 shadow-sm">
                <div className="min-w-0 space-y-0.5">
                  <span className="text-sm font-semibold truncate block">{cita.nombre}</span>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 shrink-0" />
                    {new Date(cita.fecha + "T12:00:00").toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })}
                    {cita.hora ? ` · ${cita.hora}` : ""}
                  </div>
                </div>
                <button className="h-7 w-7 rounded-full text-muted-foreground/40 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors text-sm shrink-0" onClick={() => setCitas((p) => p.filter((c) => c.id !== cita.id))}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actividad */}
      {registro.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Actividad reciente</p>
            <Link href="/app/mensajes" className="text-[10px] font-bold text-primary flex items-center gap-0.5 hover:underline">Ver todo<ChevronRight className="h-3 w-3" /></Link>
          </div>
          <div className="rounded-2xl bg-white border border-border/50 divide-y divide-border/40 shadow-sm">
            {registro.slice(0, 3).map((r) => (
              <div key={r.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /></div>
                  <div className="min-w-0"><p className="text-sm font-medium truncate">{r.clienteNombre}</p><p className="text-[10px] text-muted-foreground">{r.plantilla}</p></div>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">{new Date(r.fecha).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: seleccionar cliente */}
      <Dialog open={!!accionActiva} onOpenChange={(o) => !o && setAccionActiva(null)}>
        <DialogContent className="max-w-sm"><DialogHeader><DialogTitle>¿A quién?</DialogTitle></DialogHeader>
          <div className="max-h-72 space-y-1 overflow-y-auto">
            {clientes.map((c) => (
              <button key={c.id} className="flex w-full items-center gap-3 rounded-2xl p-3 text-left active:bg-muted hover:bg-muted transition-colors" onClick={() => enviarMensaje(c.id)}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10"><User className="h-4 w-4 text-primary" /></div>
                <div className="min-w-0"><p className="text-sm font-semibold truncate">{c.nombre}</p>{c.vehiculo && <p className="text-xs text-muted-foreground truncate">{c.vehiculo}</p>}</div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: nueva cita */}
      <Dialog open={mostrarFormCita} onOpenChange={setMostrarFormCita}>
        <DialogContent className="max-w-sm"><DialogHeader><DialogTitle>Nueva cita</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {clientes.length > 0 && (
              <div className="space-y-1"><Label className="text-xs">Cliente</Label>
                <Select value={nuevaCita.clienteId} onValueChange={(v) => setNuevaCita({ ...nuevaCita, clienteId: v, nombreManual: "", telefonoManual: "" })}>
                  <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                  <SelectContent>{clientes.map((c) => (<SelectItem key={c.id} value={c.id}>{c.nombre}{c.vehiculo ? ` — ${c.vehiculo}` : ""}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            )}
            {!nuevaCita.clienteId && (<>
              <div className="space-y-1"><Label className="text-xs">{clientes.length > 0 ? "O nombre manual" : "Nombre"}</Label><Input placeholder="Nombre" value={nuevaCita.nombreManual} onChange={(e) => setNuevaCita({ ...nuevaCita, nombreManual: e.target.value })} className="h-11 rounded-xl" /></div>
              <div className="space-y-1"><Label className="text-xs">Teléfono</Label><Input placeholder="34612345678" value={nuevaCita.telefonoManual} onChange={(e) => setNuevaCita({ ...nuevaCita, telefonoManual: e.target.value })} className="h-11 rounded-xl" type="tel" /></div>
            </>)}
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
