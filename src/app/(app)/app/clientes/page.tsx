"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { plantillas, abrirWhatsApp, type Cliente, type RegistroMensaje } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, User, MessageSquare, Trash2, Phone, Car, Pencil, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function ClientesPage() {
  const [clientes, setClientes, loaded] = useLocalStorage<Cliente[]>("fixa-clientes", []);
  const [registro, setRegistro] = useLocalStorage<RegistroMensaje[]>("fixa-registro", []);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [clienteMsg, setClienteMsg] = useState<Cliente | null>(null);
  const [form, setForm] = useState({ nombre: "", telefono: "", vehiculo: "" });

  const filtrados = clientes.filter((c) => c.nombre.toLowerCase().includes(busqueda.toLowerCase()) || c.vehiculo.toLowerCase().includes(busqueda.toLowerCase()) || c.telefono.includes(busqueda));

  function abrirNuevo() { setForm({ nombre: "", telefono: "", vehiculo: "" }); setEditando(null); setMostrarForm(true); }
  function abrirEdicion(c: Cliente) { setForm({ nombre: c.nombre, telefono: c.telefono, vehiculo: c.vehiculo }); setEditando(c); setMostrarForm(true); }

  function guardar() {
    const nombre = form.nombre.trim(); const telefono = form.telefono.replace(/\s/g, "").replace(/^\+/, "");
    if (!nombre || !telefono) return;
    if (editando) { setClientes((prev) => prev.map((c) => c.id === editando.id ? { ...c, nombre, telefono, vehiculo: form.vehiculo.trim() } : c)); toast.success("Cliente actualizado"); }
    else { setClientes((prev) => [...prev, { id: Date.now().toString(), nombre, telefono, vehiculo: form.vehiculo.trim() }]); toast.success("Cliente añadido"); }
    setForm({ nombre: "", telefono: "", vehiculo: "" }); setEditando(null); setMostrarForm(false);
  }

  function eliminar(id: string) { setClientes((prev) => prev.filter((c) => c.id !== id)); toast("Cliente eliminado"); }

  function enviarMsg(cliente: Cliente, plantillaId: string) {
    const p = plantillas.find((t) => t.id === plantillaId); if (!p) return;
    abrirWhatsApp(cliente.telefono, cliente.nombre, p.mensaje);
    setRegistro((prev) => [{ id: Date.now().toString(), clienteNombre: cliente.nombre, plantilla: p.label, fecha: new Date().toISOString() }, ...prev.slice(0, 19)]);
    toast.success(`Mensaje preparado para ${cliente.nombre.split(" ")[0]}`); setClienteMsg(null);
  }

  if (!loaded) return null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-stone-900">Clientes</h1>
          <p className="text-[12px] text-stone-400 font-medium mt-0.5">{clientes.length} cliente{clientes.length !== 1 ? "s" : ""} guardado{clientes.length !== 1 ? "s" : ""}</p>
        </div>
        <Button className="rounded-full bg-stone-900 text-white hover:bg-stone-800 font-bold shadow-lg shadow-stone-900/10 h-10 px-5 text-[13px]" onClick={abrirNuevo}>
          <Plus className="mr-1.5 h-4 w-4" />Nuevo
        </Button>
      </div>

      {clientes.length > 3 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-300" />
          <Input placeholder="Buscar nombre, matrícula..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="pl-10 h-11 rounded-xl bg-white border-stone-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-[13px]" />
        </div>
      )}

      {clientes.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-stone-200/60">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100 mb-4"><User className="h-7 w-7 text-stone-300" /></div>
          <h2 className="text-lg font-extrabold text-stone-900 mb-1">Sin clientes aún</h2>
          <p className="text-[13px] text-stone-400 mb-5">Añade el primero para empezar</p>
          <Button className="rounded-full bg-stone-900 text-white hover:bg-stone-800 font-bold shadow-lg shadow-stone-900/10" onClick={abrirNuevo}><Plus className="mr-1.5 h-4 w-4" />Añadir cliente</Button>
        </div>
      ) : (
        <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-stone-200/60 divide-y divide-stone-100">
          {filtrados.map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-4 hover:bg-stone-50/50 transition-colors">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-50 to-orange-100">
                <span className="text-[14px] font-extrabold text-orange-500">{c.nombre.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-stone-900 truncate">{c.nombre}</p>
                <div className="flex items-center gap-2.5 text-[11px] text-stone-400 mt-0.5">
                  {c.vehiculo && <span className="flex items-center gap-1 truncate"><Car className="h-3 w-3 shrink-0 text-stone-300" />{c.vehiculo}</span>}
                  <span className="flex items-center gap-1 shrink-0"><Phone className="h-3 w-3 text-stone-300" />{c.telefono.slice(-9)}</span>
                </div>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                <button className="h-8 w-8 rounded-full flex items-center justify-center text-stone-300 hover:text-stone-600 hover:bg-stone-100 transition-all" onClick={() => abrirEdicion(c)}><Pencil className="h-3.5 w-3.5" /></button>
                <button className="h-8 w-8 rounded-full flex items-center justify-center text-emerald-500 hover:bg-emerald-50 transition-all" onClick={() => setClienteMsg(c)}><MessageSquare className="h-4 w-4" /></button>
                <button className="h-8 w-8 rounded-full flex items-center justify-center text-stone-200 hover:text-red-500 hover:bg-red-50 transition-all" onClick={() => eliminar(c.id)}><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
          {filtrados.length === 0 && busqueda && <div className="p-6 text-center text-[13px] text-stone-400">Sin resultados para &ldquo;{busqueda}&rdquo;</div>}
        </div>
      )}

      <Dialog open={mostrarForm} onOpenChange={setMostrarForm}>
        <DialogContent className="max-w-sm"><DialogHeader><DialogTitle className="text-[15px]">{editando ? "Editar cliente" : "Nuevo cliente"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label className="text-[11px] font-bold text-stone-500">Nombre</Label><Input placeholder="Antonio García" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="h-11 rounded-xl border-stone-200" autoFocus /></div>
            <div className="space-y-1.5"><Label className="text-[11px] font-bold text-stone-500">Teléfono (con 34)</Label><Input placeholder="34612345678" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} className="h-11 rounded-xl border-stone-200" type="tel" /></div>
            <div className="space-y-1.5"><Label className="text-[11px] font-bold text-stone-500">Vehículo</Label><Input placeholder="Seat León — 4532 HBK" value={form.vehiculo} onChange={(e) => setForm({ ...form, vehiculo: e.target.value })} className="h-11 rounded-xl border-stone-200" /></div>
            <Button onClick={guardar} className="w-full h-11 rounded-xl bg-stone-900 text-white hover:bg-stone-800 font-bold">{editando ? "Guardar cambios" : "Añadir cliente"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!clienteMsg} onOpenChange={(o) => !o && setClienteMsg(null)}>
        <DialogContent className="max-w-sm"><DialogHeader><DialogTitle className="text-[15px]">Mensaje a {clienteMsg?.nombre}</DialogTitle></DialogHeader>
          <div className="space-y-2">
            {plantillas.map((p) => (
              <button key={p.id} className="flex w-full items-center gap-3 rounded-2xl p-4 text-left active:bg-stone-50 hover:bg-stone-50 transition-colors border border-stone-100" onClick={() => clienteMsg && enviarMsg(clienteMsg, p.id)}>
                <span className="text-xl">{p.emoji}</span>
                <span className="text-[13px] font-bold text-stone-900 flex-1">{p.label}</span>
                <ChevronRight className="h-4 w-4 text-stone-300" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
