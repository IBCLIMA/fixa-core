"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { plantillas, abrirWhatsApp, type Cliente, type RegistroMensaje } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Clock, CheckCircle2, MessageSquare, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function MensajesPage() {
  const [clientes] = useLocalStorage<Cliente[]>("fixa-clientes", []);
  const [registro, setRegistro] = useLocalStorage<RegistroMensaje[]>("fixa-registro", []);
  const [clienteId, setClienteId] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [plantillaUsada, setPlantillaUsada] = useState("");

  const cliente = clientes.find((c) => c.id === clienteId);

  function aplicarPlantilla(id: string) {
    const p = plantillas.find((t) => t.id === id); if (!p) return;
    setPlantillaUsada(p.label);
    setMensaje(cliente ? p.mensaje.replace(/\{\{nombre\}\}/g, cliente.nombre.split(" ")[0]) : p.mensaje);
  }

  function enviar() {
    if (!cliente || !mensaje) return;
    abrirWhatsApp(cliente.telefono, cliente.nombre, mensaje);
    setRegistro((prev) => [{ id: Date.now().toString(), clienteNombre: cliente.nombre, plantilla: plantillaUsada || "Personalizado", fecha: new Date().toISOString() }, ...prev.slice(0, 19)]);
    toast.success(`Mensaje preparado para ${cliente.nombre.split(" ")[0]}`);
    setMensaje(""); setPlantillaUsada("");
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[28px] font-extrabold tracking-tight text-stone-900">Mensajes</h1>
        <p className="text-[12px] text-stone-400 font-medium mt-0.5">Prepara mensajes de WhatsApp en segundos</p>
      </div>

      {clientes.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-stone-200/60">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100 mb-4"><MessageSquare className="h-7 w-7 text-stone-300" /></div>
          <h2 className="text-lg font-extrabold text-stone-900 mb-1">Sin clientes aún</h2>
          <p className="text-[13px] text-stone-400">Añade clientes en la pestaña Clientes</p>
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-stone-200/60 space-y-5">
          {/* Cliente */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-stone-500">Cliente</Label>
            <Select value={clienteId} onValueChange={setClienteId}>
              <SelectTrigger className="h-12 rounded-xl border-stone-200 text-[13px]"><SelectValue placeholder="Selecciona un cliente" /></SelectTrigger>
              <SelectContent>{clientes.map((c) => (<SelectItem key={c.id} value={c.id}>{c.nombre}{c.vehiculo ? ` — ${c.vehiculo}` : ""}</SelectItem>))}</SelectContent>
            </Select>
          </div>

          {/* Plantillas */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-stone-500">Mensaje rápido</Label>
            <div className="grid grid-cols-2 gap-2">
              {plantillas.map((p) => (
                <button key={p.id} className="flex items-center gap-2 rounded-xl border border-stone-200/60 p-3 text-left text-[12px] font-bold text-stone-700 active:bg-stone-50 hover:bg-stone-50 hover:border-stone-300 transition-all duration-200" onClick={() => aplicarPlantilla(p.id)}>
                  <span className="text-lg">{p.emoji}</span>{p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Texto */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-stone-500">Mensaje</Label>
            <Textarea placeholder="Elige un mensaje rápido o escribe aquí..." value={mensaje} onChange={(e) => { setMensaje(e.target.value); setPlantillaUsada(""); }} rows={3} className="rounded-xl text-[13px] border-stone-200" />
          </div>

          {/* Preview */}
          {cliente && mensaje && (
            <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/60 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500"><Send className="h-3 w-3 text-white" /></div>
                <p className="text-[11px] font-bold text-emerald-700">Vista previa — WhatsApp a {cliente.nombre}</p>
              </div>
              <p className="text-[13px] text-emerald-900/70 leading-relaxed">{mensaje}</p>
            </div>
          )}

          {/* Enviar */}
          <Button onClick={enviar} disabled={!cliente || !mensaje} className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 h-12 rounded-xl text-[13px] font-bold shadow-lg shadow-emerald-500/25">
            <Send className="mr-2 h-4 w-4" />Abrir en WhatsApp
          </Button>
        </div>
      )}

      {/* Registro */}
      {registro.length > 0 && (
        <div>
          <h2 className="text-[13px] font-extrabold text-stone-900 mb-3">Mensajes preparados</h2>
          <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-stone-200/60 divide-y divide-stone-100">
            {registro.slice(0, 8).map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /></div>
                  <div className="min-w-0"><p className="text-[13px] font-semibold text-stone-900 truncate">{r.clienteNombre}</p><p className="text-[10px] text-stone-400">{r.plantilla}</p></div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-stone-300 shrink-0 tabular-nums font-medium"><Clock className="h-3 w-3" />{new Date(r.fecha).toLocaleDateString("es-ES", { day: "numeric", month: "short" })} {new Date(r.fecha).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-stone-300 text-center mt-2">Solo registra que el mensaje se preparó, no si se envió</p>
        </div>
      )}
    </div>
  );
}
