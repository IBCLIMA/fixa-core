"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { plantillas, abrirWhatsApp, type Cliente, type RegistroMensaje } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search, User, MessageSquare, Trash2, Phone, Car, Pencil } from "lucide-react";
import { toast } from "sonner";

export default function ClientesPage() {
  const [clientes, setClientes, loaded] = useLocalStorage<Cliente[]>("fixa-clientes", []);
  const [registro, setRegistro] = useLocalStorage<RegistroMensaje[]>("fixa-registro", []);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [clienteMsg, setClienteMsg] = useState<Cliente | null>(null);
  const [form, setForm] = useState({ nombre: "", telefono: "", vehiculo: "" });

  const filtrados = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.vehiculo.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.telefono.includes(busqueda)
  );

  function abrirNuevo() { setForm({ nombre: "", telefono: "", vehiculo: "" }); setEditando(null); setMostrarForm(true); }
  function abrirEdicion(c: Cliente) { setForm({ nombre: c.nombre, telefono: c.telefono, vehiculo: c.vehiculo }); setEditando(c); setMostrarForm(true); }

  function guardar() {
    const nombre = form.nombre.trim();
    const telefono = form.telefono.replace(/\s/g, "").replace(/^\+/, "");
    if (!nombre || !telefono) return;
    if (editando) {
      setClientes((prev) => prev.map((c) => c.id === editando.id ? { ...c, nombre, telefono, vehiculo: form.vehiculo.trim() } : c));
      toast.success("Cliente actualizado");
    } else {
      setClientes((prev) => [...prev, { id: Date.now().toString(), nombre, telefono, vehiculo: form.vehiculo.trim() }]);
      toast.success("Cliente añadido");
    }
    setForm({ nombre: "", telefono: "", vehiculo: "" }); setEditando(null); setMostrarForm(false);
  }

  function eliminar(id: string) { setClientes((prev) => prev.filter((c) => c.id !== id)); toast("Cliente eliminado"); }

  function enviarMsg(cliente: Cliente, plantillaId: string) {
    const p = plantillas.find((t) => t.id === plantillaId);
    if (!p) return;
    abrirWhatsApp(cliente.telefono, cliente.nombre, p.mensaje);
    setRegistro((prev) => [{ id: Date.now().toString(), clienteNombre: cliente.nombre, plantilla: p.label, fecha: new Date().toISOString() }, ...prev.slice(0, 19)]);
    toast.success(`Mensaje preparado para ${cliente.nombre.split(" ")[0]}`);
    setClienteMsg(null);
  }

  if (!loaded) return null;

  return (
    <div className="space-y-5 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Clientes</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{clientes.length} cliente{clientes.length !== 1 ? "s" : ""}</p>
        </div>
        <Button className="rounded-full" onClick={abrirNuevo}>
          <Plus className="mr-1.5 h-4 w-4" />Nuevo
        </Button>
      </div>

      {clientes.length > 3 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar nombre, matrícula..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="pl-10 h-11 rounded-xl" />
        </div>
      )}

      {clientes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <User className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="font-bold">Aún no hay clientes</p>
            <p className="text-sm text-muted-foreground">Añade el primero para empezar a usar FIXA</p>
          </div>
          <Button className="rounded-full" onClick={abrirNuevo}><Plus className="mr-1.5 h-4 w-4" />Añadir cliente</Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-card divide-y divide-border/40">
          {filtrados.map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{c.nombre}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  {c.vehiculo && <span className="flex items-center gap-1 truncate"><Car className="h-3 w-3 shrink-0" />{c.vehiculo}</span>}
                  <span className="flex items-center gap-1 shrink-0"><Phone className="h-3 w-3" />{c.telefono.slice(-9)}</span>
                </div>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                <button className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors" onClick={() => abrirEdicion(c)}><Pencil className="h-4 w-4" /></button>
                <button className="h-9 w-9 rounded-full flex items-center justify-center text-green-500 hover:bg-green-500/10 transition-colors" onClick={() => setClienteMsg(c)}><MessageSquare className="h-4 w-4" /></button>
                <button className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" onClick={() => eliminar(c.id)}><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
          {filtrados.length === 0 && busqueda && <p className="p-6 text-center text-sm text-muted-foreground">Sin resultados para "{busqueda}"</p>}
        </div>
      )}

      {/* Modal form */}
      <Dialog open={mostrarForm} onOpenChange={setMostrarForm}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>{editando ? "Editar cliente" : "Nuevo cliente"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1"><Label className="text-xs">Nombre</Label><Input placeholder="Antonio García" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="h-11 rounded-xl" autoFocus /></div>
            <div className="space-y-1"><Label className="text-xs">Teléfono (con 34)</Label><Input placeholder="34612345678" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} className="h-11 rounded-xl" type="tel" /></div>
            <div className="space-y-1"><Label className="text-xs">Vehículo</Label><Input placeholder="Seat León — 4532 HBK" value={form.vehiculo} onChange={(e) => setForm({ ...form, vehiculo: e.target.value })} className="h-11 rounded-xl" /></div>
            <Button onClick={guardar} className="w-full h-11 rounded-xl">{editando ? "Guardar cambios" : "Añadir cliente"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal mensajes */}
      <Dialog open={!!clienteMsg} onOpenChange={(o) => !o && setClienteMsg(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Mensaje a {clienteMsg?.nombre}</DialogTitle></DialogHeader>
          <div className="space-y-2">
            {plantillas.map((p) => (
              <button key={p.id} className="flex w-full items-center gap-3 rounded-xl border border-border/60 p-3.5 text-left active:bg-accent hover:bg-accent transition-colors" onClick={() => clienteMsg && enviarMsg(clienteMsg, p.id)}>
                <span className="text-xl">{p.emoji}</span>
                <span className="text-sm font-semibold">{p.label}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
