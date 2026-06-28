"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Pencil, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { crearRecambista, editarRecambista, eliminarRecambista } from "../actions/recambistas";
import { useConfirm } from "@/components/confirm-dialog";
import { toast } from "sonner";

interface Recambista {
  id: string;
  nombre: string;
  telefono: string;
  notas: string | null;
}

export function RecambistasForm({ recambistas }: { recambistas: Recambista[] }) {
  const router = useRouter();
  const { confirm, ConfirmUI } = useConfirm();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [notas, setNotas] = useState("");
  const [loading, setLoading] = useState(false);

  function reset() {
    setShowForm(false);
    setEditId(null);
    setNombre("");
    setTelefono("");
    setNotas("");
  }

  function startEdit(r: Recambista) {
    setEditId(r.id);
    setNombre(r.nombre);
    setTelefono(r.telefono);
    setNotas(r.notas || "");
    setShowForm(true);
  }

  async function handleSave() {
    setLoading(true);
    try {
      if (editId) {
        await editarRecambista(editId, { nombre, telefono, notas });
        toast.success("Recambista actualizado");
      } else {
        await crearRecambista({ nombre, telefono, notas });
        toast.success("Recambista añadido");
      }
      reset();
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    const ok = await confirm({
      title: `¿Eliminar a ${name}?`,
      description: "No se borrarán los pedidos anteriores, solo el contacto.",
      confirmText: "Eliminar",
      destructive: true,
    });
    if (!ok) return;
    await eliminarRecambista(id);
    toast.success("Recambista eliminado");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Recambistas</CardTitle>
          {!showForm && (
            <Button size="sm" variant="outline" className="rounded-full" onClick={() => setShowForm(true)}>
              <Plus className="mr-1 h-3.5 w-3.5" />Añadir
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Tus proveedores de recambios habituales. Desde la orden de trabajo podrás enviarles un WhatsApp con la pieza que necesitas en un toque.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Lista */}
        {recambistas.length === 0 && !showForm && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Sin recambistas configurados. Añade a tus proveedores para pedir piezas desde la orden de trabajo.
          </p>
        )}
        {recambistas.map((r) => (
          <div key={r.id} className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50">
              <Phone className="h-4 w-4 text-brand-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{r.nombre}</p>
              <p className="text-xs text-muted-foreground">{r.telefono}{r.notas ? ` · ${r.notas}` : ""}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => startEdit(r)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors cursor-pointer" aria-label="Editar">
                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              <button onClick={() => handleDelete(r.id, r.nombre)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors cursor-pointer" aria-label="Eliminar">
                <Trash2 className="h-3.5 w-3.5 text-red-500" />
              </button>
            </div>
          </div>
        ))}

        {/* Formulario */}
        {showForm && (
          <div className="rounded-xl border border-brand-200 bg-brand-50/30 p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Nombre *</Label>
                <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Recambios López" className="h-10 rounded-xl" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">WhatsApp *</Label>
                <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="612 345 678" className="h-10 rounded-xl" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold">Notas (opcional)</Label>
              <Input value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Bueno para frenos, entrega rápida..." className="h-10 rounded-xl" />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={loading || !nombre.trim() || !telefono.trim()} className="rounded-xl h-10 font-bold">
                {loading ? "Guardando..." : editId ? "Guardar cambios" : "Añadir recambista"}
              </Button>
              <Button variant="outline" onClick={reset} className="rounded-xl h-10">Cancelar</Button>
            </div>
          </div>
        )}
      </CardContent>
      {ConfirmUI}
    </Card>
  );
}
