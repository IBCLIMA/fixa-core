"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { actualizarCliente } from "../../actions/clientes";
import { toast } from "sonner";

interface Props {
  cliente: {
    id: string;
    nombre: string;
    telefono: string | null;
    email: string | null;
    nif: string | null;
    direccion: string | null;
    notas: string | null;
  };
}

export function EditarClienteDialog({ cliente }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await actualizarCliente(cliente.id, {
        nombre: formData.get("nombre") as string,
        telefono: (formData.get("telefono") as string) || undefined,
        email: (formData.get("email") as string) || undefined,
        nif: (formData.get("nif") as string) || undefined,
        direccion: (formData.get("direccion") as string) || undefined,
        notas: (formData.get("notas") as string) || undefined,
      });
      toast.success("Cliente actualizado");
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
        <Button variant="outline" size="sm" className="rounded-full">
          <Pencil className="mr-1.5 h-3 w-3" />Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Editar cliente</DialogTitle></DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input id="nombre" name="nombre" defaultValue={cliente.nombre} required className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" name="telefono" defaultValue={cliente.telefono || ""} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" defaultValue={cliente.email || ""} type="email" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nif">NIF / CIF</Label>
              <Input id="nif" name="nif" defaultValue={cliente.nif || ""} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="direccion">Dirección</Label>
              <Input id="direccion" name="direccion" defaultValue={cliente.direccion || ""} className="h-11 rounded-xl" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="notas">Notas</Label>
              <Textarea id="notas" name="notas" defaultValue={cliente.notas || ""} rows={2} className="rounded-xl" />
            </div>
          </div>
          <Button type="submit" className="w-full h-11 rounded-xl" disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
