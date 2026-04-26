"use client";

import { useState } from "react";
import { clientesMock, plantillasWhatsApp, type Cliente } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, MessageSquare, Phone, Car } from "lucide-react";

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
    const textoFinal = mensaje.replace(/\{\{nombre\}\}/g, nombre.split(" ")[0]);
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(textoFinal)}`;
    window.open(url, "_blank");
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Clientes</h1>
        <p className="text-sm text-muted-foreground">
          Selecciona un cliente para enviar mensaje
        </p>
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, matrícula o teléfono..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Lista de clientes */}
      <div className="space-y-2">
        {clientesFiltrados.map((cliente) => (
          <Card
            key={cliente.id}
            className="cursor-pointer transition-colors hover:bg-accent"
            onClick={() => setClienteSeleccionado(cliente)}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="font-medium">{cliente.nombre}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Car className="h-3 w-3" />
                  {cliente.vehiculo}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  +{cliente.telefono}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {cliente.ultimaVisita && (
                  <Badge variant="secondary" className="text-xs">
                    {new Date(cliente.ultimaVisita).toLocaleDateString("es-ES")}
                  </Badge>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-green-500 hover:text-green-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    setClienteSeleccionado(cliente);
                  }}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {clientesFiltrados.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No se encontraron clientes
          </p>
        )}
      </div>

      {/* Modal de mensajes rápidos */}
      <Dialog
        open={!!clienteSeleccionado}
        onOpenChange={(open) => !open && setClienteSeleccionado(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              Enviar mensaje a {clienteSeleccionado?.nombre}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {plantillasWhatsApp.map((plantilla) => (
              <Button
                key={plantilla.id}
                variant="outline"
                className="h-auto w-full justify-start gap-3 p-3 text-left"
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
                <div>
                  <p className="font-medium">{plantilla.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {plantilla.mensaje
                      .replace(
                        /\{\{nombre\}\}/g,
                        clienteSeleccionado?.nombre.split(" ")[0] || ""
                      )
                      .substring(0, 60)}
                    ...
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
