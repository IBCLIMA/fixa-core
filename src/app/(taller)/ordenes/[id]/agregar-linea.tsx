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
import { toast } from "sonner";

export function AgregarLineaForm({ ordenId }: { ordenId: string }) {
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState<"mano_obra" | "recambio" | "otros">("mano_obra");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await agregarLineaOrden({
        ordenId,
        tipo,
        descripcion: formData.get("descripcion") as string,
        cantidad: Number(formData.get("cantidad") || 1),
        precioUnitario: Number(formData.get("precio") || 0),
        ivaPct: Number(formData.get("iva") || 21),
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
        size="sm"
        className="rounded-full w-full"
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
          <Select value={tipo} onValueChange={(v) => setTipo(v as typeof tipo)}>
            <SelectTrigger className="h-10 rounded-lg">
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
          <Input name="iva" type="number" defaultValue="21" className="h-10 rounded-lg" />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Descripción *</Label>
        <Input name="descripcion" placeholder="Cambio pastillas de freno..." required className="h-10 rounded-lg" autoFocus />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Cantidad</Label>
          <Input name="cantidad" type="number" step="0.01" defaultValue="1" className="h-10 rounded-lg" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Precio unitario (€)</Label>
          <Input name="precio" type="number" step="0.01" placeholder="0.00" className="h-10 rounded-lg" />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" className="flex-1 rounded-lg" disabled={loading}>
          {loading ? "Guardando..." : "Añadir"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)} className="rounded-lg">
          Cancelar
        </Button>
      </div>
    </form>
  );
}
