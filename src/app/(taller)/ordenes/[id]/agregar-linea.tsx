"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { agregarLineaOrden } from "../../actions/ordenes";
import { formatMoney } from "@/lib/format";
import { toast } from "sonner";

export function AgregarLineaForm({ ordenId, precioHora = 0 }: { ordenId: string; precioHora?: number }) {
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState<"mano_obra" | "recambio" | "otros">("mano_obra");
  const [tipoPieza, setTipoPieza] = useState<"nueva" | "reconstruida" | "usada">("nueva");
  const [loading, setLoading] = useState(false);
  const [precio, setPrecio] = useState<string>(precioHora > 0 ? String(precioHora) : "");
  const [cantidad, setCantidad] = useState<string>("1");
  const [descuento, setDescuento] = useState<string>("0");
  const [iva, setIva] = useState<string>("21");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await agregarLineaOrden({
        ordenId,
        tipo,
        descripcion: formData.get("descripcion") as string,
        cantidad: Number(cantidad),
        precioUnitario: Number(precio),
        descuentoPct: Number(descuento) || undefined,
        ivaPct: Number(iva),
        ...(tipo === "recambio" ? {
          tipoPieza,
          referencia: (formData.get("referencia") as string) || undefined,
        } : {}),
      });
      toast.success("Línea añadida");
      setOpen(false);
    } catch {
      toast.error("Error al añadir línea");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <Button
        variant="outline"
        className="rounded-xl w-full h-11"
        onClick={() => setOpen(true)}
      >
        <Plus className="mr-1 h-3 w-3" />
        Añadir línea
      </Button>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Tipo</Label>
          <Select value={tipo} onValueChange={(v) => {
            const newTipo = v as typeof tipo;
            setTipo(newTipo);
            if (newTipo === "mano_obra" && precioHora > 0) {
              setPrecio(String(precioHora));
            } else {
              setPrecio("");
            }
          }}>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mano_obra">Mano de obra</SelectItem>
              <SelectItem value="recambio">Recambio</SelectItem>
              <SelectItem value="otros">Otros</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">IVA %</Label>
          <Input name="iva" type="number" value={iva} onChange={(e) => setIva(e.target.value)} className="h-11 rounded-xl" />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Descripcion <span className="text-red-500">*</span></Label>
        <Input name="descripcion" placeholder="Cambio pastillas de freno..." required className="h-11 rounded-xl" autoFocus />
      </div>
      {tipo === "recambio" && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Referencia</Label>
            <Input name="referencia" placeholder="Ej: 0986494128" className="h-11 rounded-xl font-mono" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Tipo de pieza</Label>
            <Select value={tipoPieza} onValueChange={(v) => setTipoPieza(v as typeof tipoPieza)}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nueva">Nueva</SelectItem>
                <SelectItem value="reconstruida">Reconstruida</SelectItem>
                <SelectItem value="usada">Usada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Cantidad</Label>
          <Input type="number" step="0.01" min="0.01" value={cantidad} onChange={(e) => setCantidad(e.target.value)} className="h-11 rounded-xl" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Precio unit. (EUR) <span className="text-red-500">*</span></Label>
          <Input type="number" step="0.01" placeholder="0.00" required min="0" value={precio} onChange={(e) => setPrecio(e.target.value)} className="h-11 rounded-xl" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Descuento %</Label>
          <Input type="number" step="1" min="0" max="100" value={descuento} onChange={(e) => setDescuento(e.target.value)} className="h-11 rounded-xl" />
        </div>
      </div>
      {/* Subtotal en tiempo real */}
      {Number(precio) > 0 && Number(cantidad) > 0 && (() => {
        const base = Number(cantidad) * Number(precio) * (1 - Number(descuento) / 100);
        const total = base * (1 + Number(iva) / 100);
        return (
          <div className="flex justify-between items-center rounded-lg bg-stone-50 px-3 py-2">
            <span className="text-xs text-stone-500">
              Subtotal{Number(descuento) > 0 ? ` (-${descuento}%)` : ""} + IVA {iva}%
            </span>
            <span className="text-sm font-bold">{formatMoney(total)}</span>
          </div>
        );
      })()}
      <div className="flex gap-2">
        <Button type="submit" className="flex-1 h-11 rounded-xl" disabled={loading}>
          {loading ? "Guardando..." : "Añadir"}
        </Button>
        <Button type="button" variant="ghost" className="h-11 rounded-xl" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
