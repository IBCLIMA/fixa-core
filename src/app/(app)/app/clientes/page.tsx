"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { plantillas, enviarWhatsApp, type Cliente } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search, User, MessageSquare, Trash2, Phone, Car } from "lucide-react";
import { toast } from "sonner";

export default function ClientesPage() {
  const [clientes, setClientes, loaded] = useLocalStorage<Cliente[]>("fixa-clientes", []);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [clienteMsg, setClienteMsg] = useState<Cliente | null>(null);
  const [nuevo, setNuevo] = useState({ nombre: "", telefono: "", vehiculo: "" });

  const filtrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.vehiculo.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.telefono.includes(busqueda)
  );

  function agregar() {
    if (!nuevo.nombre || !nuevo.telefono) return;
    const cliente: Cliente = {
      id: Date.now().toString(),
      nombre: nuevo.nombre,
      telefono: nuevo.telefono.replace(/\s/g, "").replace(/^\+/, ""),
      vehiculo: nuevo.vehiculo,
    };
    setClientes([...clientes, cliente]);
    setNuevo({ nombre: "", telefono: "", vehiculo: "" });
    setMostrarForm(false);
    toast.success("Cliente añadido");
  }

  function eliminar(id: string) {
    setClientes(clientes.filter((c) => c.id !== id));
  }

  if (!loaded) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold">Clientes</h1>
          <p className="text-xs text-muted-foreground">{clientes.length} clientes</p>
        </div>
        <Button size="sm" onClick={() => setMostrarForm(true)}>
          <Plus className="mr-1 h-4 w-4" />
          Nuevo
        </Button>
      </div>

      {/* Formulario nuevo cliente */}
      {mostrarForm && (
        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="space-y-1">
              <Label htmlFor="nombre" className="text-xs">Nombre</Label>
              <Input
                id="nombre"
                placeholder="Antonio García"
                value={nuevo.nombre}
                onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="tel" className="text-xs">Teléfono (con prefijo 34)</Label>
              <Input
                id="tel"
                placeholder="34612345678"
                value={nuevo.telefono}
                onChange={(e) => setNuevo({ ...nuevo, telefono: e.target.value })}
                className="h-11"
                type="tel"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="vehiculo" className="text-xs">Vehículo</Label>
              <Input
                id="vehiculo"
                placeholder="Seat León — 4532 HBK"
                value={nuevo.vehiculo}
                onChange={(e) => setNuevo({ ...nuevo, vehiculo: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={agregar} className="flex-1 h-11">Guardar</Button>
              <Button variant="ghost" onClick={() => setMostrarForm(false)} className="h-11">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Buscador */}
      {clientes.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar nombre, matrícula..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-9 h-11"
          />
        </div>
      )}

      {/* Lista */}
      {clientes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <User className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium">No hay clientes todavía</p>
          <p className="text-xs text-muted-foreground">Pulsa "Nuevo" para añadir el primero</p>
        </div>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border">
          {filtrados.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-3 p-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
                <User className="h-4 w-4 text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{c.nombre}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {c.vehiculo && (
                    <span className="flex items-center gap-1 truncate">
                      <Car className="h-3 w-3 shrink-0" />
                      {c.vehiculo}
                    </span>
                  )}
                  <span className="flex items-center gap-1 shrink-0">
                    <Phone className="h-3 w-3" />
                    +{c.telefono.slice(-9)}
                  </span>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="shrink-0 text-green-500"
                onClick={() => setClienteMsg(c)}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => eliminar(c.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {filtrados.length === 0 && (
            <p className="p-4 text-center text-sm text-muted-foreground">
              Sin resultados
            </p>
          )}
        </div>
      )}

      {/* Modal mensajes */}
      <Dialog open={!!clienteMsg} onOpenChange={(open) => !open && setClienteMsg(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">
              Mensaje a {clienteMsg?.nombre}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {plantillas.map((p) => (
              <Button
                key={p.id}
                variant="outline"
                className="h-auto w-full justify-start gap-3 p-3 text-left active:bg-accent"
                onClick={() => {
                  if (clienteMsg) {
                    enviarWhatsApp(clienteMsg.telefono, clienteMsg.nombre, p.mensaje);
                  }
                }}
              >
                <span className="text-lg">{p.emoji}</span>
                <span className="text-sm font-medium">{p.label}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
