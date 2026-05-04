"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { actualizarVehiculo } from "../../actions/clientes";
import { toast } from "sonner";

interface Props {
  vehiculo: {
    id: string;
    matricula: string;
    marca: string | null;
    modelo: string | null;
    anio: number | null;
    km: number | null;
    vin: string | null;
    combustible: string | null;
    color: string | null;
    fechaItv: string | null;
  };
}

export function EditarVehiculoDialog({ vehiculo }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [combustible, setCombustible] = useState(vehiculo.combustible || "");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await actualizarVehiculo(vehiculo.id, {
        matricula: formData.get("matricula") as string,
        marca: (formData.get("marca") as string) || undefined,
        modelo: (formData.get("modelo") as string) || undefined,
        anio: formData.get("anio") ? Number(formData.get("anio")) : undefined,
        km: formData.get("km") ? Number(formData.get("km")) : undefined,
        vin: (formData.get("vin") as string) || undefined,
        combustible: combustible as any || undefined,
        color: (formData.get("color") as string) || undefined,
        fechaItv: (formData.get("fechaItv") as string) || undefined,
      });
      toast.success("Vehículo actualizado");
      setOpen(false);
    } catch {
      toast.error("Error al actualizar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="rounded-full h-7 px-2 text-xs text-stone-400 hover:text-stone-900">
          <Pencil className="h-3 w-3 mr-1" />Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Editar vehículo — {vehiculo.matricula}</DialogTitle></DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label>Matrícula *</Label>
              <Input name="matricula" defaultValue={vehiculo.matricula} required className="h-11 rounded-xl uppercase" />
            </div>
            <div className="space-y-1.5"><Label>Marca</Label><Input name="marca" defaultValue={vehiculo.marca || ""} className="h-11 rounded-xl" /></div>
            <div className="space-y-1.5"><Label>Modelo</Label><Input name="modelo" defaultValue={vehiculo.modelo || ""} className="h-11 rounded-xl" /></div>
            <div className="space-y-1.5"><Label>Año</Label><Input name="anio" type="number" defaultValue={vehiculo.anio || ""} className="h-11 rounded-xl" /></div>
            <div className="space-y-1.5"><Label>Kilómetros</Label><Input name="km" type="number" defaultValue={vehiculo.km || ""} className="h-11 rounded-xl" /></div>
            <div className="space-y-1.5">
              <Label>Combustible</Label>
              <Select value={combustible} onValueChange={setCombustible}>
                <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasolina">Gasolina</SelectItem>
                  <SelectItem value="diesel">Diésel</SelectItem>
                  <SelectItem value="electrico">Eléctrico</SelectItem>
                  <SelectItem value="hibrido">Híbrido</SelectItem>
                  <SelectItem value="glp">GLP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Color</Label><Input name="color" defaultValue={vehiculo.color || ""} className="h-11 rounded-xl" /></div>
            <div className="space-y-1.5"><Label>VIN</Label><Input name="vin" defaultValue={vehiculo.vin || ""} className="h-11 rounded-xl" /></div>
            <div className="space-y-1.5"><Label>Próxima ITV</Label><Input name="fechaItv" type="date" defaultValue={vehiculo.fechaItv || ""} className="h-11 rounded-xl" /></div>
          </div>
          <Button type="submit" className="w-full h-11 rounded-xl" disabled={loading}>{loading ? "Guardando..." : "Guardar cambios"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
