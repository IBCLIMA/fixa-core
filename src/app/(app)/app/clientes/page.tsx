"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { plantillas, abrirWhatsApp, type Cliente, type RegistroMensaje } from "@/lib/data";
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
import {
  Plus,
  Search,
  User,
  MessageSquare,
  Trash2,
  Phone,
  Car,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";

export default function ClientesPage() {
  const [clientes, setClientes, loaded] = useLocalStorage<Cliente[]>(
    "fixa-clientes",
    []
  );
  const [registro, setRegistro] = useLocalStorage<RegistroMensaje[]>(
    "fixa-registro",
    []
  );
  const [busqueda, setBusqueda] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [clienteMsg, setClienteMsg] = useState<Cliente | null>(null);
  const [form, setForm] = useState({ nombre: "", telefono: "", vehiculo: "" });

  const filtrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.vehiculo.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.telefono.includes(busqueda)
  );

  function abrirNuevo() {
    setForm({ nombre: "", telefono: "", vehiculo: "" });
    setEditando(null);
    setMostrarForm(true);
  }

  function abrirEdicion(c: Cliente) {
    setForm({ nombre: c.nombre, telefono: c.telefono, vehiculo: c.vehiculo });
    setEditando(c);
    setMostrarForm(true);
  }

  function guardar() {
    const nombre = form.nombre.trim();
    const telefono = form.telefono.replace(/\s/g, "").replace(/^\+/, "");
    if (!nombre || !telefono) return;

    if (editando) {
      setClientes((prev) =>
        prev.map((c) =>
          c.id === editando.id
            ? { ...c, nombre, telefono, vehiculo: form.vehiculo.trim() }
            : c
        )
      );
      toast.success("Cliente actualizado");
    } else {
      setClientes((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          nombre,
          telefono,
          vehiculo: form.vehiculo.trim(),
        },
      ]);
      toast.success("Cliente añadido");
    }

    setForm({ nombre: "", telefono: "", vehiculo: "" });
    setEditando(null);
    setMostrarForm(false);
  }

  function eliminar(id: string) {
    setClientes((prev) => prev.filter((c) => c.id !== id));
    toast("Cliente eliminado");
  }

  function enviarMsg(cliente: Cliente, plantillaId: string) {
    const p = plantillas.find((t) => t.id === plantillaId);
    if (!p) return;
    abrirWhatsApp(cliente.telefono, cliente.nombre, p.mensaje);
    setRegistro((prev) => [
      {
        id: Date.now().toString(),
        clienteNombre: cliente.nombre,
        plantilla: p.label,
        fecha: new Date().toISOString(),
      },
      ...prev.slice(0, 19),
    ]);
    toast.success(`Mensaje preparado para ${cliente.nombre.split(" ")[0]}`);
    setClienteMsg(null);
  }

  if (!loaded) return null;

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold">Clientes</h1>
          <p className="text-xs text-muted-foreground">
            {clientes.length} cliente{clientes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button size="sm" onClick={abrirNuevo}>
          <Plus className="mr-1 h-4 w-4" />
          Nuevo
        </Button>
      </div>

      {/* Buscador */}
      {clientes.length > 3 && (
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
        <Card className="border-dashed">
          <CardContent className="p-6 text-center space-y-3">
            <User className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">Aún no hay clientes</p>
            <p className="text-xs text-muted-foreground">
              Añade el primero para empezar a usar FIXA
            </p>
            <Button onClick={abrirNuevo}>
              <Plus className="mr-1 h-4 w-4" />
              Añadir cliente
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border">
          {filtrados.map((c) => (
            <div key={c.id} className="flex items-center gap-2 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{c.nombre}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {c.vehiculo && (
                    <span className="flex items-center gap-1 truncate">
                      <Car className="h-3 w-3 shrink-0" />
                      {c.vehiculo}
                    </span>
                  )}
                  <span className="flex items-center gap-1 shrink-0">
                    <Phone className="h-3 w-3" />
                    {c.telefono.slice(-9)}
                  </span>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="shrink-0 h-9 w-9"
                onClick={() => abrirEdicion(c)}
              >
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="shrink-0 h-9 w-9 text-green-500"
                onClick={() => setClienteMsg(c)}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="shrink-0 h-9 w-9 text-muted-foreground hover:text-destructive"
                onClick={() => eliminar(c.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {filtrados.length === 0 && busqueda && (
            <p className="p-4 text-center text-sm text-muted-foreground">
              Sin resultados para "{busqueda}"
            </p>
          )}
        </div>
      )}

      {/* Modal: añadir / editar */}
      <Dialog open={mostrarForm} onOpenChange={setMostrarForm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">
              {editando ? "Editar cliente" : "Nuevo cliente"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Nombre</Label>
              <Input
                placeholder="Antonio García"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="h-11"
                autoFocus
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Teléfono (con prefijo 34)</Label>
              <Input
                placeholder="34612345678"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className="h-11"
                type="tel"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Vehículo</Label>
              <Input
                placeholder="Seat León — 4532 HBK"
                value={form.vehiculo}
                onChange={(e) => setForm({ ...form, vehiculo: e.target.value })}
                className="h-11"
              />
            </div>
            <Button onClick={guardar} className="w-full h-11">
              {editando ? "Guardar cambios" : "Añadir cliente"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: mensaje rápido */}
      <Dialog
        open={!!clienteMsg}
        onOpenChange={(o) => !o && setClienteMsg(null)}
      >
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
                onClick={() => clienteMsg && enviarMsg(clienteMsg, p.id)}
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
