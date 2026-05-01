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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { crearVehiculo } from "../../actions/clientes";
import { toast } from "sonner";

export function NuevoVehiculoDialog({ clienteId }: { clienteId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [combustible, setCombustible] = useState<string>("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await crearVehiculo({
        clienteId,
        matricula: formData.get("matricula") as string,
        marca: (formData.get("marca") as string) || undefined,
        modelo: (formData.get("modelo") as string) || undefined,
        anio: formData.get("anio") ? Number(formData.get("anio")) : undefined,
        km: formData.get("km") ? Number(formData.get("km")) : undefined,
        vin: (formData.get("vin") as string) || undefined,
        combustible: combustible as "gasolina" | "diesel" | "electrico" | "hibrido" | "glp" | undefined || undefined,
        color: (formData.get("color") as string) || undefined,
        fechaItv: (formData.get("fechaItv") as string) || undefined,
      });
      toast.success("Vehículo añadido");
      setOpen(false);
    } catch {
      toast.error("Error al añadir vehículo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="rounded-full">
          <Plus className="mr-1 h-3 w-3" />
          Añadir vehículo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo vehículo</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="matricula">Matrícula *</Label>
              <Input id="matricula" name="matricula" placeholder="1234 ABC" required className="h-11 rounded-xl uppercase" autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="marca">Marca</Label>
              <Input id="marca" name="marca" placeholder="Seat" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="modelo">Modelo</Label>
              <Input id="modelo" name="modelo" placeholder="León" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="anio">Año</Label>
              <Input id="anio" name="anio" type="number" placeholder="2020" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="km">Kilómetros</Label>
              <Input id="km" name="km" type="number" placeholder="85000" className="h-11 rounded-xl" />
            </div>
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
            <div className="space-y-1.5">
              <Label htmlFor="color">Color</Label>
              <Input id="color" name="color" placeholder="Negro" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vin">VIN</Label>
              <Input id="vin" name="vin" placeholder="WVWZZZ..." className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fechaItv">Próxima ITV</Label>
              <Input id="fechaItv" name="fechaItv" type="date" className="h-11 rounded-xl" />
            </div>
          </div>
          <Button type="submit" className="w-full h-11 rounded-xl" disabled={loading}>
            {loading ? "Guardando..." : "Añadir vehículo"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
