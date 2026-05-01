"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface Taller {
  id: string;
  nombre: string;
  cif: string | null;
  direccion: string | null;
  telefono: string | null;
  email: string | null;
}

export function ConfigForm({ taller }: { taller: Taller }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      const res = await fetch("/api/taller", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.get("nombre"),
          cif: formData.get("cif"),
          direccion: formData.get("direccion"),
          telefono: formData.get("telefono"),
          email: formData.get("email"),
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Configuración guardada");
    } catch {
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Datos del taller</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="nombre">Nombre del taller *</Label>
              <Input id="nombre" name="nombre" defaultValue={taller.nombre} className="h-11 rounded-xl" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cif">CIF / NIF</Label>
              <Input id="cif" name="cif" defaultValue={taller.cif || ""} placeholder="B12345678" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" name="telefono" defaultValue={taller.telefono || ""} placeholder="960 000 000" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={taller.email || ""} placeholder="info@mitaller.com" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="direccion">Dirección</Label>
              <Input id="direccion" name="direccion" defaultValue={taller.direccion || ""} placeholder="Calle Principal, 1" className="h-11 rounded-xl" />
            </div>
          </div>
          <Separator />
          <Button type="submit" className="rounded-xl" disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
