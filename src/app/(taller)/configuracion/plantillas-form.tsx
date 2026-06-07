"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { crearPlantilla, actualizarPlantilla, eliminarPlantilla, type LineaPlantilla } from "../actions/plantillas";
import { serviceTemplates } from "@/lib/service-templates";
import { toast } from "sonner";

type Plantilla = {
  id: string;
  nombre: string;
  lineas: LineaPlantilla[];
};

function LineaEditor({
  lineas,
  onChange,
}: {
  lineas: LineaPlantilla[];
  onChange: (lineas: LineaPlantilla[]) => void;
}) {
  function addLinea() {
    onChange([...lineas, { tipo: "mano_obra", descripcion: "", cantidad: 1, precioUnitario: 0 }]);
  }
  function removeLinea(i: number) {
    onChange(lineas.filter((_, idx) => idx !== i));
  }
  function updateLinea(i: number, field: keyof LineaPlantilla, value: any) {
    const updated = [...lineas];
    updated[i] = { ...updated[i], [field]: value };
    onChange(updated);
  }

  return (
    <div className="space-y-3">
      {lineas.map((l, i) => (
        <div key={i} className="rounded-xl border border-stone-200 bg-stone-50/50 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <select
              value={l.tipo}
              onChange={(e) => updateLinea(i, "tipo", e.target.value)}
              className="h-9 rounded-lg border border-input bg-white px-2 text-sm"
            >
              <option value="mano_obra">Mano de obra</option>
              <option value="recambio">Recambio</option>
              <option value="otros">Otros</option>
            </select>
            <button onClick={() => removeLinea(i)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <Input
            value={l.descripcion}
            onChange={(e) => updateLinea(i, "descripcion", e.target.value)}
            placeholder="Descripción del trabajo o recambio"
            className="h-10 rounded-lg text-sm"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-stone-400">Cantidad</label>
              <Input
                type="number"
                value={l.cantidad}
                onChange={(e) => updateLinea(i, "cantidad", Number(e.target.value))}
                className="h-9 rounded-lg text-sm"
                min={0}
                step={0.25}
              />
            </div>
            <div>
              <label className="text-[10px] text-stone-400">Precio unitario (EUR)</label>
              <Input
                type="number"
                value={l.precioUnitario}
                onChange={(e) => updateLinea(i, "precioUnitario", Number(e.target.value))}
                className="h-9 rounded-lg text-sm"
                min={0}
                step={0.5}
              />
            </div>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addLinea} className="rounded-full text-xs">
        <Plus className="h-3 w-3 mr-1" />Añadir línea
      </Button>
    </div>
  );
}

export function PlantillasForm({ plantillasIniciales }: { plantillasIniciales: Plantilla[] }) {
  const [plantillas, setPlantillas] = useState(plantillasIniciales);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [lineas, setLineas] = useState<LineaPlantilla[]>([
    { tipo: "mano_obra", descripcion: "", cantidad: 1, precioUnitario: 0 },
  ]);
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setNombre("");
    setLineas([{ tipo: "mano_obra", descripcion: "", cantidad: 1, precioUnitario: 0 }]);
    setEditando(null);
  }

  function startEdit(p: Plantilla) {
    setEditando(p.id);
    setNombre(p.nombre);
    setLineas(p.lineas);
    setOpen(true);
  }

  async function handleGuardar() {
    if (!nombre.trim()) { toast.error("Pon un nombre"); return; }
    const lineasValidas = lineas.filter((l) => l.descripcion.trim());
    if (lineasValidas.length === 0) { toast.error("Añade al menos una línea"); return; }

    setLoading(true);
    try {
      if (editando) {
        await actualizarPlantilla(editando, { nombre: nombre.trim(), lineas: lineasValidas });
        setPlantillas((prev) =>
          prev.map((p) => (p.id === editando ? { ...p, nombre: nombre.trim(), lineas: lineasValidas } : p))
        );
        toast.success("Plantilla actualizada");
      } else {
        const nueva = await crearPlantilla({ nombre: nombre.trim(), lineas: lineasValidas });
        setPlantillas((prev) => [...prev, { id: nueva.id, nombre: nombre.trim(), lineas: lineasValidas }]);
        toast.success("Plantilla creada");
      }
      setOpen(false);
      resetForm();
    } catch {
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  async function handleEliminar(id: string) {
    if (!confirm("¿Eliminar esta plantilla?")) return;
    try {
      await eliminarPlantilla(id);
      setPlantillas((prev) => prev.filter((p) => p.id !== id));
      toast.success("Plantilla eliminada");
    } catch {
      toast.error("Error al eliminar");
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            Plantillas de servicio
          </CardTitle>
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-full">
                <Plus className="mr-1 h-3.5 w-3.5" />Nueva plantilla
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>{editando ? "Editar plantilla" : "Nueva plantilla"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-stone-500">Nombre *</label>
                  <Input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Cambio de aceite + filtro"
                    className="h-11 rounded-xl mt-1"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-500 mb-2 block">Líneas</label>
                  <LineaEditor lineas={lineas} onChange={setLineas} />
                </div>
                <Button onClick={handleGuardar} disabled={loading} className="w-full h-11 rounded-xl font-bold">
                  {loading ? "Guardando..." : editando ? "Guardar cambios" : "Crear plantilla"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Custom plantillas */}
        {plantillas.length > 0 && (
          <div className="space-y-2 mb-4">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Mis plantillas</p>
            {plantillas.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{p.nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.lineas.length} línea{p.lineas.length !== 1 ? "s" : ""}{" · "}
                    {p.lineas.reduce((sum, l) => sum + l.cantidad * l.precioUnitario, 0).toFixed(2)}€
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => startEdit(p)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700" onClick={() => handleEliminar(p.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Default plantillas */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Predefinidas</p>
          {serviceTemplates.map((t) => (
            <div key={t.name} className="flex items-center justify-between rounded-xl bg-stone-50 border border-stone-100 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-stone-600">{t.name}</p>
                <p className="text-xs text-stone-400">
                  {t.lines.length} línea{t.lines.length !== 1 ? "s" : ""}{" · "}
                  {t.lines.reduce((sum, l) => sum + l.cantidad * l.precioUnitario, 0).toFixed(2)}€
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-orange-600 hover:text-orange-700"
                onClick={() => {
                  setNombre(t.name);
                  setLineas(t.lines.map(l => ({ ...l })));
                  setEditando(null);
                  setOpen(true);
                }}
              >
                <Pencil className="h-3 w-3 mr-1" />Personalizar
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
