"use client";

import { useState } from "react";
import { clientesMock, plantillasWhatsApp } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
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
import { Send, MessageSquare } from "lucide-react";

export default function MensajesPage() {
  const [clienteId, setClienteId] = useState("");
  const [mensaje, setMensaje] = useState("");

  const clienteSeleccionado = clientesMock.find((c) => c.id === clienteId);

  function aplicarPlantilla(plantillaId: string) {
    const plantilla = plantillasWhatsApp.find((p) => p.id === plantillaId);
    if (plantilla && clienteSeleccionado) {
      setMensaje(
        plantilla.mensaje.replace(
          /\{\{nombre\}\}/g,
          clienteSeleccionado.nombre.split(" ")[0]
        )
      );
    } else if (plantilla) {
      setMensaje(plantilla.mensaje);
    }
  }

  function enviar() {
    if (!clienteSeleccionado || !mensaje) return;
    const url = `https://wa.me/${clienteSeleccionado.telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Mensajes</h1>
        <p className="text-sm text-muted-foreground">
          Envía mensajes por WhatsApp en segundos
        </p>
      </div>

      {/* Seleccionar cliente */}
      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="space-y-1">
            <Label>Cliente</Label>
            <Select value={clienteId} onValueChange={setClienteId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientesMock.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.nombre} — {cliente.vehiculo.split("—")[1]?.trim()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Botones rápidos */}
          <div className="space-y-1">
            <Label>Mensaje rápido</Label>
            <div className="grid grid-cols-2 gap-2">
              {plantillasWhatsApp.map((plantilla) => (
                <Button
                  key={plantilla.id}
                  variant="outline"
                  size="sm"
                  className="h-auto justify-start gap-2 p-2 text-left text-xs"
                  onClick={() => aplicarPlantilla(plantilla.id)}
                >
                  <span>{plantilla.emoji}</span>
                  {plantilla.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Mensaje personalizado */}
          <div className="space-y-1">
            <Label>Mensaje</Label>
            <Textarea
              placeholder="Escribe el mensaje o selecciona uno rápido arriba..."
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={4}
            />
          </div>

          {/* Botón enviar */}
          <Button
            onClick={enviar}
            disabled={!clienteSeleccionado || !mensaje}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            <Send className="mr-2 h-4 w-4" />
            Enviar por WhatsApp
          </Button>

          {/* Preview */}
          {clienteSeleccionado && mensaje && (
            <div className="rounded-lg bg-green-950/30 p-3">
              <p className="mb-1 text-xs text-muted-foreground">
                Vista previa — WhatsApp a +{clienteSeleccionado.telefono}
              </p>
              <p className="text-sm">{mensaje}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
