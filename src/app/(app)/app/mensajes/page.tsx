"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { plantillas, enviarWhatsApp, type Cliente } from "@/lib/data";
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
import { Send, User } from "lucide-react";

export default function MensajesPage() {
  const [clientes] = useLocalStorage<Cliente[]>("fixa-clientes", []);
  const [clienteId, setClienteId] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cliente = clientes.find((c) => c.id === clienteId);

  function aplicarPlantilla(plantillaId: string) {
    const p = plantillas.find((t) => t.id === plantillaId);
    if (p && cliente) {
      setMensaje(p.mensaje.replace(/\{\{nombre\}\}/g, cliente.nombre.split(" ")[0]));
    } else if (p) {
      setMensaje(p.mensaje);
    }
  }

  function enviar() {
    if (!cliente || !mensaje) return;
    enviarWhatsApp(cliente.telefono, cliente.nombre, mensaje);
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-extrabold">Mensajes</h1>

      {clientes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <User className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium">No hay clientes todavía</p>
          <p className="text-xs text-muted-foreground">Añade clientes primero en la pestaña Clientes</p>
        </div>
      ) : (
        <>
          {/* Seleccionar cliente */}
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
                    {c.nombre} {c.vehiculo ? `— ${c.vehiculo}` : ""}
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

          {/* Mensaje libre */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Mensaje
            </Label>
            <Textarea
              placeholder="Selecciona un mensaje rápido o escribe aquí..."
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={3}
              className="text-sm"
            />
          </div>

          {/* Preview */}
          {cliente && mensaje && (
            <div className="rounded-lg bg-green-950/20 border border-green-900/30 p-3">
              <p className="mb-1 text-[11px] font-medium text-green-500">
                WhatsApp a {cliente.nombre}
              </p>
              <p className="text-sm text-foreground/80">{mensaje}</p>
            </div>
          )}

          {/* Enviar */}
          <Button
            onClick={enviar}
            disabled={!cliente || !mensaje}
            className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800"
            size="lg"
          >
            <Send className="mr-2 h-4 w-4" />
            Enviar por WhatsApp
          </Button>
        </>
      )}
    </div>
  );
}
