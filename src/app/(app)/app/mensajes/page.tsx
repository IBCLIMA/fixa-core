"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { plantillas, abrirWhatsApp, type Cliente, type RegistroMensaje } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, User, Clock, CheckCircle2, MessageSquare } from "lucide-react";
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
    <div className="space-y-5 pb-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Mensajes</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Prepara mensajes de WhatsApp en segundos</p>
      </div>

      {clientes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60"><MessageSquare className="h-6 w-6 text-muted-foreground/60" /></div>
          <p className="font-bold">Aún no hay clientes</p>
          <p className="text-sm text-muted-foreground">Añade clientes en la pestaña Clientes</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white p-5 space-y-5">
          {/* Cliente */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Cliente</Label>
            <Select value={clienteId} onValueChange={setClienteId}>
              <SelectTrigger className="h-12 rounded-xl border-border"><SelectValue placeholder="Selecciona un cliente" /></SelectTrigger>
              <SelectContent>{clientes.map((c) => (<SelectItem key={c.id} value={c.id}>{c.nombre}{c.vehiculo ? ` — ${c.vehiculo}` : ""}</SelectItem>))}</SelectContent>
            </Select>
          </div>

          {/* Plantillas */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Mensaje rápido</Label>
            <div className="grid grid-cols-2 gap-2">
              {plantillas.map((p) => (
                <button key={p.id} className="flex items-center gap-2.5 rounded-xl border border-border p-3 text-left text-xs font-semibold active:bg-muted hover:bg-muted/60 transition-colors" onClick={() => aplicarPlantilla(p.id)}>
                  <span className="text-lg">{p.emoji}</span>{p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Texto */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Mensaje</Label>
            <Textarea placeholder="Elige un mensaje rápido o escribe aquí..." value={mensaje} onChange={(e) => { setMensaje(e.target.value); setPlantillaUsada(""); }} rows={3} className="rounded-xl text-sm border-border" />
          </div>

          {/* Preview */}
          {cliente && mensaje && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="mb-1.5 text-[10px] font-bold text-green-700 uppercase tracking-[0.15em]">Vista previa</p>
              <p className="text-sm text-green-900/80 leading-relaxed">{mensaje}</p>
              <p className="mt-2 text-[10px] text-green-600">Se abrirá WhatsApp con este mensaje para {cliente.nombre}</p>
            </div>
          )}

          {/* Enviar */}
          <Button onClick={enviar} disabled={!cliente || !mensaje} className="w-full bg-green-600 hover:bg-green-500 active:bg-green-700 h-12 rounded-xl text-sm font-semibold">
            <Send className="mr-2 h-4 w-4" />Abrir en WhatsApp
          </Button>
        </div>
      )}

      {/* Registro */}
      {registro.length > 0 && (
        <div className="space-y-2.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Mensajes preparados</p>
          <div className="rounded-2xl border border-border bg-white divide-y divide-border/60">
            {registro.slice(0, 8).map((r) => (
              <div key={r.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-50">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{r.clienteNombre}</p>
                    <p className="text-[10px] text-muted-foreground">{r.plantilla}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0 tabular-nums">
                  <Clock className="h-3 w-3" />
                  {new Date(r.fecha).toLocaleDateString("es-ES", { day: "numeric", month: "short" })} {new Date(r.fecha).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground/60 text-center">Solo registra que el mensaje se preparó, no si se envió</p>
        </div>
      )}
    </div>
  );
}
