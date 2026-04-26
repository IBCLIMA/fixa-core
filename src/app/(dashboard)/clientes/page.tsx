"use client";

import { useState } from "react";
import { clientesMock, plantillasWhatsApp, type Cliente } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, MessageSquare, Phone, Car, User } from "lucide-react";

export default function ClientesPage() {
  const [busqueda, setBusqueda] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);

  const clientesFiltrados = clientesMock.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.vehiculo.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.telefono.includes(busqueda)
  );

  function enviarWhatsApp(telefono: string, nombre: string, mensaje: string) {
    const texto = mensaje.replace(/\{\{nombre\}\}/g, nombre.split(" ")[0]);
    window.open(
      `https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`,
      "_blank"
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-extrabold">Clientes</h1>
        <p className="text-sm text-muted-foreground">
          {clientesMock.length} clientes · Toca para enviar mensaje
        </p>
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar nombre, matrícula..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Lista simple */}
      <div className="divide-y divide-border rounded-lg border border-border">
        {clientesFiltrados.map((cliente) => (
          <button
            key={cliente.id}
            className="flex w-full items-center gap-3 p-3 text-left transition-colors active:bg-accent hover:bg-accent"
            onClick={() => setClienteSeleccionado(cliente)}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
              <User className="h-4 w-4 text-amber-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{cliente.nombre}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Car className="h-3 w-3" />
                  {cliente.vehiculo.split("—")[1]?.trim()}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  +{cliente.telefono.slice(-9)}
                </span>
              </div>
            </div>
            <MessageSquare className="h-5 w-5 shrink-0 text-green-500" />
          </button>
        ))}

        {clientesFiltrados.length === 0 && (
          <p className="p-6 text-center text-sm text-muted-foreground">
            No se encontraron clientes
          </p>
        )}
      </div>

      {/* Modal mensajes rápidos */}
      <Dialog
        open={!!clienteSeleccionado}
        onOpenChange={(open) => !open && setClienteSeleccionado(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">
              Mensaje a {clienteSeleccionado?.nombre}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {plantillasWhatsApp.map((plantilla) => (
              <Button
                key={plantilla.id}
                variant="outline"
                className="h-auto w-full justify-start gap-3 p-3 text-left active:bg-accent"
                onClick={() => {
                  if (clienteSeleccionado) {
                    enviarWhatsApp(
                      clienteSeleccionado.telefono,
                      clienteSeleccionado.nombre,
                      plantilla.mensaje
                    );
                  }
                }}
              >
                <span className="text-lg">{plantilla.emoji}</span>
                <div className="min-w-0">
                  <p className="font-medium text-sm">{plantilla.label}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {plantilla.mensaje
                      .replace(
                        /\{\{nombre\}\}/g,
                        clienteSeleccionado?.nombre.split(" ")[0] || ""
                      )
                      .substring(0, 50)}...
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
