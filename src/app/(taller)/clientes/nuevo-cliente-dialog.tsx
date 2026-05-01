"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { crearCliente } from "../actions/clientes";
import { toast } from "sonner";

export function NuevoClienteDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await crearCliente({
        nombre: formData.get("nombre") as string,
        telefono: (formData.get("telefono") as string) || undefined,
        email: (formData.get("email") as string) || undefined,
        nif: (formData.get("nif") as string) || undefined,
        direccion: (formData.get("direccion") as string) || undefined,
        notas: (formData.get("notas") as string) || undefined,
      });
      toast.success("Cliente creado");
      setOpen(false);
    } catch {
      toast.error("Error al crear cliente");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full">
          <Plus className="mr-1.5 h-4 w-4" />
          Nuevo cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo cliente</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                name="nombre"
                placeholder="Antonio García"
                required
                className="h-11 rounded-xl"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                name="telefono"
                placeholder="612 345 678"
                type="tel"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="cliente@email.com"
                type="email"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nif">NIF / CIF</Label>
              <Input
                id="nif"
                name="nif"
                placeholder="12345678A"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                name="direccion"
                placeholder="Calle Mayor, 1"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="notas">Notas</Label>
              <Textarea
                id="notas"
                name="notas"
                placeholder="Notas sobre el cliente..."
                rows={2}
                className="rounded-xl"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full h-11 rounded-xl"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Crear cliente"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
