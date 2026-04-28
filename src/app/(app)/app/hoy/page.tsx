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
import { CheckCircle2, FileText, CalendarDays, Wrench, Send, Clock, Plus, User, Users, MessageSquare, ChevronRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

const acciones = [
  { id: "coche_listo", label: "Coche listo", icon: CheckCircle2, gradient: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/30" },
  { id: "presupuesto", label: "Presupuesto", icon: FileText, gradient: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/30" },
  { id: "pide_cita", label: "Pide cita", icon: CalendarDays, gradient: "from-orange-500 to-orange-600", shadow: "shadow-orange-500/30" },
  { id: "revision", label: "Revisión", icon: Wrench, gradient: "from-violet-500 to-violet-600", shadow: "shadow-violet-500/30" },
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
  const hoyFormateado = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="pt-1">
        <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">{hoyFormateado}</p>
        <h1 className="text-[28px] font-extrabold tracking-tight text-stone-900 leading-tight mt-1">Tu taller hoy</h1>
      </div>

      {/* Resumen KPIs */}
      {!sinDatos && (
        <div className="grid grid-cols-3 gap-2">
          <Link href="/app/clientes" className="group relative overflow-hidden rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-stone-200/60 hover:shadow-md transition-all duration-300">
            <p className="text-[28px] font-extrabold text-stone-900 leading-none">{clientes.length}</p>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mt-1">Clientes</p>
            <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-orange-500/[0.04]" />
          </Link>
          <button onClick={() => setMostrarFormCita(true)} className="group relative overflow-hidden rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-stone-200/60 hover:shadow-md transition-all duration-300 text-left">
            <p className="text-[28px] font-extrabold text-stone-900 leading-none">{citasHoy.length}</p>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mt-1">Citas hoy</p>
            <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-blue-500/[0.04]" />
          </button>
          <Link href="/app/mensajes" className="group relative overflow-hidden rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-stone-200/60 hover:shadow-md transition-all duration-300">
            <p className="text-[28px] font-extrabold text-stone-900 leading-none">{registro.length}</p>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mt-1">Mensajes</p>
            <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-emerald-500/[0.04]" />
          </Link>
        </div>
      )}

      {/* Estado vacío */}
      {sinDatos && (
        <div className="rounded-3xl bg-white p-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-stone-200/60">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25 mb-5">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-lg font-extrabold text-stone-900 mb-1">Empieza añadiendo clientes</h2>
          <p className="text-sm text-stone-500 mb-5">Después podrás enviar mensajes y organizar citas.</p>
          <Link href="/app/clientes">
            <Button size="lg" className="rounded-full bg-stone-900 text-white hover:bg-stone-800 font-bold shadow-lg shadow-stone-900/10 h-12 px-6">
              <Plus className="mr-2 h-4 w-4" />Añadir primer cliente
            </Button>
          </Link>
        </div>
      )}

      {/* Acciones rápidas */}
      {!sinDatos && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-extrabold text-stone-900">Acciones rápidas</h2>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {acciones.map((a) => (
              <button
                key={a.id}
                className={`group relative overflow-hidden flex items-center gap-3 rounded-2xl bg-gradient-to-br ${a.gradient} p-4 text-white text-left transition-all duration-200 active:scale-[0.97] shadow-lg ${a.shadow}`}
                onClick={() => setAccionActiva(a.id)}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <a.icon className="h-5 w-5" />
                </div>
                <span className="text-[13px] font-bold leading-tight">{a.label}</span>
                <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/[0.08]" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Citas de hoy */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[13px] font-extrabold text-stone-900">Citas de hoy</h2>
          <button onClick={() => setMostrarFormCita(true)} className="flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 transition-colors">
            <Plus className="h-3.5 w-3.5" />Nueva
          </button>
        </div>
        {citasHoy.length === 0 ? (
          <div className="rounded-2xl bg-white border border-dashed border-stone-200 p-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <CalendarDays className="mx-auto h-6 w-6 text-stone-300 mb-2" />
            <p className="text-[13px] font-semibold text-stone-400">Sin citas para hoy</p>
            <button onClick={() => setMostrarFormCita(true)} className="text-[12px] font-bold text-orange-600 hover:text-orange-700 mt-1 transition-colors">Crear primera cita</button>
          </div>
        ) : (
          <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-stone-200/60 divide-y divide-stone-100">
            {citasHoy.map((cita) => (
              <div key={cita.id} className="flex items-center justify-between p-4 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-stone-50">
                    {cita.hora ? (
                      <>
                        <span className="text-[11px] font-extrabold text-stone-900 leading-none">{cita.hora.split(":")[0]}</span>
                        <span className="text-[8px] font-bold text-stone-400 leading-none">:{cita.hora.split(":")[1]}</span>
                      </>
                    ) : (
                      <Clock className="h-4 w-4 text-stone-300" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-stone-900 truncate">{cita.nombre}</p>
                    {cita.motivo && <p className="text-[11px] text-stone-400 truncate">{cita.motivo}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {cita.telefono && (
                    <button className="flex h-8 items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 text-white shadow-md shadow-emerald-500/25 hover:shadow-lg transition-all active:scale-95" onClick={() => enviarDesdeCita(cita)}>
                      <Send className="h-3 w-3" /><span className="text-[10px] font-bold">Avisar</span>
                    </button>
                  )}
                  <button className="h-7 w-7 rounded-full text-stone-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all text-[14px]" onClick={() => setCitas((p) => p.filter((c) => c.id !== cita.id))}>×</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Próximas */}
      {citasProximas.length > 0 && (
        <div>
          <h2 className="text-[13px] font-extrabold text-stone-900 mb-3">Próximas citas</h2>
          <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-stone-200/60 divide-y divide-stone-100">
            {citasProximas.map((cita) => (
              <div key={cita.id} className="flex items-center justify-between p-4 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                    <CalendarDays className="h-4 w-4 text-orange-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-stone-900 truncate">{cita.nombre}</p>
                    <p className="text-[11px] text-stone-400">
                      {new Date(cita.fecha + "T12:00:00").toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })}
                      {cita.hora ? ` · ${cita.hora}` : ""}
                    </p>
                  </div>
                </div>
                <button className="h-7 w-7 rounded-full text-stone-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all text-[14px] shrink-0" onClick={() => setCitas((p) => p.filter((c) => c.id !== cita.id))}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actividad */}
      {registro.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-extrabold text-stone-900">Actividad reciente</h2>
            <Link href="/app/mensajes" className="flex items-center gap-0.5 text-[11px] font-bold text-orange-600 hover:text-orange-700 transition-colors">Ver todo<ChevronRight className="h-3 w-3" /></Link>
          </div>
          <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-stone-200/60 divide-y divide-stone-100">
            {registro.slice(0, 3).map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-stone-900 truncate">{r.clienteNombre}</p>
                    <p className="text-[10px] text-stone-400">{r.plantilla}</p>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-stone-300 shrink-0 tabular-nums">{new Date(r.fecha).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modales */}
      <Dialog open={!!accionActiva} onOpenChange={(o) => !o && setAccionActiva(null)}>
        <DialogContent className="max-w-sm"><DialogHeader><DialogTitle className="text-[15px]">¿A quién?</DialogTitle></DialogHeader>
          <div className="max-h-72 space-y-1 overflow-y-auto">
            {clientes.map((c) => (
              <button key={c.id} className="flex w-full items-center gap-3 rounded-2xl p-3 text-left active:bg-stone-50 hover:bg-stone-50 transition-colors" onClick={() => enviarMensaje(c.id)}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50"><User className="h-4 w-4 text-orange-500" /></div>
                <div className="min-w-0"><p className="text-[13px] font-bold text-stone-900 truncate">{c.nombre}</p>{c.vehiculo && <p className="text-[11px] text-stone-400 truncate">{c.vehiculo}</p>}</div>
                <ChevronRight className="h-4 w-4 text-stone-300 shrink-0 ml-auto" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={mostrarFormCita} onOpenChange={setMostrarFormCita}>
        <DialogContent className="max-w-sm"><DialogHeader><DialogTitle className="text-[15px]">Nueva cita</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {clientes.length > 0 && (
              <div className="space-y-1.5"><Label className="text-[11px] font-bold text-stone-500">Cliente</Label>
                <Select value={nuevaCita.clienteId} onValueChange={(v) => setNuevaCita({ ...nuevaCita, clienteId: v, nombreManual: "", telefonoManual: "" })}>
                  <SelectTrigger className="h-11 rounded-xl border-stone-200"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                  <SelectContent>{clientes.map((c) => (<SelectItem key={c.id} value={c.id}>{c.nombre}{c.vehiculo ? ` — ${c.vehiculo}` : ""}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            )}
            {!nuevaCita.clienteId && (<>
              <div className="space-y-1.5"><Label className="text-[11px] font-bold text-stone-500">{clientes.length > 0 ? "O nombre manual" : "Nombre"}</Label><Input placeholder="Nombre" value={nuevaCita.nombreManual} onChange={(e) => setNuevaCita({ ...nuevaCita, nombreManual: e.target.value })} className="h-11 rounded-xl border-stone-200" /></div>
              <div className="space-y-1.5"><Label className="text-[11px] font-bold text-stone-500">Teléfono</Label><Input placeholder="34612345678" value={nuevaCita.telefonoManual} onChange={(e) => setNuevaCita({ ...nuevaCita, telefonoManual: e.target.value })} className="h-11 rounded-xl border-stone-200" type="tel" /></div>
            </>)}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5"><Label className="text-[11px] font-bold text-stone-500">Fecha</Label><Input type="date" value={nuevaCita.fecha} onChange={(e) => setNuevaCita({ ...nuevaCita, fecha: e.target.value })} className="h-11 rounded-xl border-stone-200" /></div>
              <div className="space-y-1.5"><Label className="text-[11px] font-bold text-stone-500">Hora</Label><Input type="time" value={nuevaCita.hora} onChange={(e) => setNuevaCita({ ...nuevaCita, hora: e.target.value })} className="h-11 rounded-xl border-stone-200" /></div>
            </div>
            <div className="space-y-1.5"><Label className="text-[11px] font-bold text-stone-500">Motivo</Label><Input placeholder="Revisión frenos, cambio aceite..." value={nuevaCita.motivo} onChange={(e) => setNuevaCita({ ...nuevaCita, motivo: e.target.value })} className="h-11 rounded-xl border-stone-200" /></div>
            <Button onClick={guardarCita} className="w-full h-11 rounded-xl bg-stone-900 text-white hover:bg-stone-800">Guardar cita</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
