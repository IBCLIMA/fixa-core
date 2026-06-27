"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { editarLineaPresupuesto, eliminarLineaPresupuesto } from "../../actions/presupuestos";
import { formatMoney } from "@/lib/format";
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

export function LineasPresupuesto({ presupuestoId, lineas }: { presupuestoId: string; lineas: Linea[] }) {
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
      await editarLineaPresupuesto({
        id: lineaId,
        presupuestoId,
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
      await eliminarLineaPresupuesto(lineaId, presupuestoId);
      toast.success("Línea eliminada");
      router.refresh();
    } catch {
      toast.error("Error al eliminar");
    }
  }

  const totalBase = lineas.reduce((sum, l) => {
    const qty = Number(l.cantidad);
    const price = Number(l.precioUnitario);
    const disc = Number(l.descuentoPct || 0);
    return sum + qty * price * (1 - disc / 100);
  }, 0);
  const totalIva = lineas.reduce((sum, l) => {
    const qty = Number(l.cantidad);
    const price = Number(l.precioUnitario);
    const disc = Number(l.descuentoPct || 0);
    const iva = Number(l.ivaPct || 21);
    const base = qty * price * (1 - disc / 100);
    return sum + base * (iva / 100);
  }, 0);
  const totalFinal = totalBase + totalIva;

  return (
    <div className="space-y-2">
      {lineas.length > 0 ? (
        <>
          {lineas.map((linea) => {
            const base = Number(linea.cantidad) * Number(linea.precioUnitario) * (1 - Number(linea.descuentoPct || 0) / 100);
            const isEditing = editandoId === linea.id;

            if (isEditing) {
              return (
                <div key={linea.id} className="rounded-xl border-2 border-brand-200 bg-brand-50/30 p-3 space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-muted-foreground">Concepto</label>
                    <Input
                      value={editData.descripcion}
                      onChange={(e) => setEditData({ ...editData, descripcion: e.target.value })}
                      className="h-11 sm:h-9 rounded-lg text-sm font-medium"
                      autoFocus
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted-foreground">Cantidad</label>
                      <Input
                        type="number" step="0.25" min="0"
                        value={editData.cantidad}
                        onChange={(e) => setEditData({ ...editData, cantidad: e.target.value })}
                        className="h-11 sm:h-9 rounded-lg text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted-foreground">Precio</label>
                      <Input
                        type="number" step="0.01" min="0"
                        value={editData.precio}
                        onChange={(e) => setEditData({ ...editData, precio: e.target.value })}
                        className="h-11 sm:h-9 rounded-lg text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted-foreground">Dto %</label>
                      <Input
                        type="number" step="1" min="0" max="100"
                        value={editData.descuento}
                        onChange={(e) => setEditData({ ...editData, descuento: e.target.value })}
                        className="h-11 sm:h-9 rounded-lg text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted-foreground">IVA %</label>
                      <Input
                        type="number" step="1"
                        value={editData.iva}
                        onChange={(e) => setEditData({ ...editData, iva: e.target.value })}
                        className="h-11 sm:h-9 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(linea.id)}
                      disabled={loading}
                      className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-1.5 h-11 sm:h-9 px-4 text-sm font-bold text-white bg-stone-800 hover:bg-stone-700 disabled:opacity-60 rounded-full transition-colors"
                    >
                      <Check className="h-4 w-4" />{loading ? "Guardando..." : "Guardar"}
                    </button>
                    <button
                      onClick={() => setEditandoId(null)}
                      className="inline-flex items-center justify-center gap-1.5 h-11 sm:h-9 px-4 text-sm text-stone-500 hover:text-stone-700 rounded-full transition-colors"
                    >
                      <X className="h-4 w-4" />Cancelar
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
                    {Number(linea.cantidad)} x {formatMoney(Number(linea.precioUnitario))}
                    {Number(linea.descuentoPct || 0) > 0 && ` (-${linea.descuentoPct}%)`}
                    {" - IVA "}{linea.ivaPct}%
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold">{formatMoney(base)}</span>
                  <button
                    onClick={() => startEdit(linea)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-brand-600 hover:bg-brand-50 transition-colors no-print"
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(linea.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors no-print"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <Separator className="my-3" />

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base imponible</span>
              <span>{formatMoney(totalBase)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">IVA</span>
              <span>{formatMoney(totalIva)}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-1">
              <span>Total</span>
              <span>{formatMoney(totalFinal)}</span>
            </div>
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-6">
          Sin lineas en este presupuesto
        </p>
      )}
    </div>
  );
}
