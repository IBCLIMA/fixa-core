"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  plantillas,
  abrirWhatsApp,
  type Cliente,
  type RegistroMensaje,
} from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, User, Clock } from "lucide-react";
import { toast } from "sonner";

export default function MensajesPage() {
  const [clientes] = useLocalStorage<Cliente[]>("fixa-clientes", []);
  const [registro, setRegistro] = useLocalStorage<RegistroMensaje[]>(
    "fixa-registro",
    []
  );
  const [clienteId, setClienteId] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [plantillaUsada, setPlantillaUsada] = useState("");

  const cliente = clientes.find((c) => c.id === clienteId);

  function aplicarPlantilla(id: string) {
    const p = plantillas.find((t) => t.id === id);
    if (!p) return;
    setPlantillaUsada(p.label);
    if (cliente) {
      setMensaje(
        p.mensaje.replace(/\{\{nombre\}\}/g, cliente.nombre.split(" ")[0])
      );
    } else {
      setMensaje(p.mensaje);
    }
  }

  function enviar() {
    if (!cliente || !mensaje) return;
    abrirWhatsApp(cliente.telefono, cliente.nombre, mensaje);
    setRegistro((prev) => [
      {
        id: Date.now().toString(),
        clienteNombre: cliente.nombre,
        plantilla: plantillaUsada || "Personalizado",
        fecha: new Date().toISOString(),
      },
      ...prev.slice(0, 19),
    ]);
    toast.success(`Mensaje preparado para ${cliente.nombre.split(" ")[0]}`);
    setMensaje("");
    setPlantillaUsada("");
  }

  return (
    <div className="space-y-5 pb-4">
      <h1 className="text-xl font-extrabold">Mensajes</h1>

      {clientes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center">
          <User className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium">Aún no hay clientes</p>
          <p className="text-xs text-muted-foreground">
            Añade clientes primero en la pestaña Clientes
          </p>
        </div>
      ) : (
        <>
          {/* Cliente */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Cliente
            </Label>
            <Select value={clienteId} onValueChange={setClienteId}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Selecciona un cliente" />
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

          {/* Plantillas */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Mensaje rápido
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {plantillas.map((p) => (
                <Button
                  key={p.id}
                  variant="outline"
                  className="h-12 justify-start gap-2 px-3 text-xs font-medium active:bg-accent"
                  onClick={() => aplicarPlantilla(p.id)}
                >
                  <span className="text-base">{p.emoji}</span>
                  {p.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Texto */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Mensaje
            </Label>
            <Textarea
              placeholder="Elige un mensaje rápido o escribe aquí..."
              value={mensaje}
              onChange={(e) => {
                setMensaje(e.target.value);
                setPlantillaUsada("");
              }}
              rows={3}
              className="text-sm"
            />
          </div>

          {/* Preview */}
          {cliente && mensaje && (
            <div className="rounded-lg bg-green-950/20 border border-green-900/30 p-3">
              <p className="mb-1 text-[11px] font-medium text-green-500">
                Se abrirá WhatsApp con este mensaje para {cliente.nombre}
              </p>
              <p className="text-sm text-foreground/80">{mensaje}</p>
            </div>
          )}

          {/* Enviar */}
          <Button
            onClick={enviar}
            disabled={!cliente || !mensaje}
            className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 h-12"
          >
            <Send className="mr-2 h-4 w-4" />
            Abrir en WhatsApp
          </Button>
        </>
      )}

      {/* Registro de actividad */}
      {registro.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Últimos mensajes preparados
          </p>
          <div className="divide-y divide-border rounded-lg border border-border">
            {registro.slice(0, 8).map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="text-sm truncate">{r.clienteNombre}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.plantilla}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0">
                  <Clock className="h-3 w-3" />
                  {new Date(r.fecha).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                  })}{" "}
                  {new Date(r.fecha).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground text-center">
            Solo registra que el mensaje se preparó, no si se envió finalmente
          </p>
        </div>
      )}
    </div>
  );
}
