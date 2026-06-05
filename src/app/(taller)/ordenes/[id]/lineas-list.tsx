"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { editarLineaOrden, eliminarLineaOrden } from "../../actions/ordenes";
import { toast } from "sonner";

type Linea = {
  id: string;
  tipo: string;
  descripcion: string;
  cantidad: string;
  precioUnitario: string;
  descuentoPct: string | null;
  ivaPct: string;
};

export function LineasList({ ordenId, lineas }: { ordenId: string; lineas: Linea[] }) {
  const router = useRouter();
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ descripcion: "", cantidad: "", precio: "", descuento: "", iva: "" });
  const [loading, setLoading] = useState(false);

  function startEdit(l: Linea) {
    setEditandoId(l.id);
    setEditData({
      descripcion: l.descripcion,
      cantidad: String(Number(l.cantidad)),
      precio: String(Number(l.precioUnitario)),
      descuento: String(Number(l.descuentoPct || 0)),
      iva: String(Number(l.ivaPct)),
    });
  }

  async function saveEdit(lineaId: string) {
    setLoading(true);
    try {
      await editarLineaOrden({
        id: lineaId,
        ordenId,
        descripcion: editData.descripcion,
        cantidad: Number(editData.cantidad),
        precioUnitario: Number(editData.precio),
        descuentoPct: Number(editData.descuento) || undefined,
        ivaPct: Number(editData.iva) || undefined,
      });
      setEditandoId(null);
      toast.success("Línea actualizada");
      router.refresh();
    } catch {
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(lineaId: string) {
    if (!confirm("¿Eliminar esta línea?")) return;
    try {
      await eliminarLineaOrden(lineaId, ordenId);
      toast.success("Línea eliminada");
      router.refresh();
    } catch {
      toast.error("Error al eliminar");
    }
  }

  return (
    <div className="space-y-2">
      {lineas.map((linea) => {
        const base = Number(linea.cantidad) * Number(linea.precioUnitario) * (1 - Number(linea.descuentoPct || 0) / 100);
        const isEditing = editandoId === linea.id;

        if (isEditing) {
          return (
            <div key={linea.id} className="rounded-xl border-2 border-orange-200 bg-orange-50/30 p-3 space-y-2">
              <Input
                value={editData.descripcion}
                onChange={(e) => setEditData({ ...editData, descripcion: e.target.value })}
                className="h-9 rounded-lg text-sm font-medium"
                autoFocus
              />
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[10px] text-stone-400">Cantidad</label>
                  <Input
                    type="number" step="0.25" min="0"
                    value={editData.cantidad}
                    onChange={(e) => setEditData({ ...editData, cantidad: e.target.value })}
                    className="h-8 rounded-lg text-xs"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-stone-400">Precio</label>
                  <Input
                    type="number" step="0.01" min="0"
                    value={editData.precio}
                    onChange={(e) => setEditData({ ...editData, precio: e.target.value })}
                    className="h-8 rounded-lg text-xs"
                  />
                </div>
                <div className="w-16">
                  <label className="text-[10px] text-stone-400">Dto %</label>
                  <Input
                    type="number" step="1" min="0" max="100"
                    value={editData.descuento}
                    onChange={(e) => setEditData({ ...editData, descuento: e.target.value })}
                    className="h-8 rounded-lg text-xs"
                  />
                </div>
                <div className="w-16">
                  <label className="text-[10px] text-stone-400">IVA %</label>
                  <Input
                    type="number" step="1"
                    value={editData.iva}
                    onChange={(e) => setEditData({ ...editData, iva: e.target.value })}
                    className="h-8 rounded-lg text-xs"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => saveEdit(linea.id)}
                  disabled={loading}
                  className="flex items-center gap-1 text-xs font-bold text-white bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded-full transition-colors"
                >
                  <Check className="h-3 w-3" />{loading ? "..." : "Guardar"}
                </button>
                <button
                  onClick={() => setEditandoId(null)}
                  className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-700 px-3 py-1.5 rounded-full transition-colors"
                >
                  <X className="h-3 w-3" />Cancelar
                </button>
              </div>
            </div>
          );
        }

        return (
          <div
            key={linea.id}
            className="group flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">
                  {linea.tipo === "mano_obra" ? "M.O." : linea.tipo === "recambio" ? "Recambio" : "Otros"}
                </Badge>
                <span className="text-sm font-medium">{linea.descripcion}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {Number(linea.cantidad)} × {Number(linea.precioUnitario).toFixed(2)}€
                {Number(linea.descuentoPct || 0) > 0 && ` (-${linea.descuentoPct}%)`}
                {" · IVA "}{linea.ivaPct}%
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold">{base.toFixed(2)}€</span>
              <button
                onClick={() => startEdit(linea)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                title="Editar"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(linea.id)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
