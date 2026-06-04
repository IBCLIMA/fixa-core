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
  googleReviewLink: string | null;
  registroIndustrial: string | null;
  ramaActividad: string[] | null;
}

const RAMAS_ACTIVIDAD = [
  { value: "mecanica", label: "Mecánica" },
  { value: "electricidad", label: "Electricidad-Electrónica" },
  { value: "carroceria", label: "Carrocería (Chapa)" },
  { value: "pintura", label: "Pintura" },
];

export function ConfigForm({ taller }: { taller: Taller }) {
  const [loading, setLoading] = useState(false);
  const [ramas, setRamas] = useState<string[]>(taller.ramaActividad || []);

  function toggleRama(value: string) {
    setRamas((prev) =>
      prev.includes(value) ? prev.filter((r) => r !== value) : [...prev, value]
    );
  }

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
          googleReviewLink: formData.get("googleReviewLink"),
          registroIndustrial: formData.get("registroIndustrial"),
          ramaActividad: ramas,
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
      <CardHeader className="pb-3">
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
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" name="email" type="email" defaultValue={taller.email || ""} placeholder="info@mitaller.com" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="direccion">Dirección</Label>
              <Input id="direccion" name="direccion" defaultValue={taller.direccion || ""} placeholder="Calle Principal, 1" className="h-11 rounded-xl" />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="googleReviewLink">Enlace de reseñas de Google</Label>
              <Input id="googleReviewLink" name="googleReviewLink" defaultValue={taller.googleReviewLink || ""} placeholder="https://g.page/r/..." className="h-11 rounded-xl" />
              <p className="text-xs text-muted-foreground">Pega aquí tu enlace de reseñas de Google Business para enviar solicitudes de reseña a tus clientes.</p>
            </div>
          </div>

          <Separator />

          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Registro industrial</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="registroIndustrial" className="text-xs font-bold text-stone-500">N.º de registro industrial</Label>
              <Input id="registroIndustrial" name="registroIndustrial" defaultValue={taller.registroIndustrial || ""} placeholder="Ej: 46/1234" className="h-11 rounded-xl" />
              <p className="text-xs text-muted-foreground">Número del Registro Integrado Industrial (RII). Obligatorio en todos los documentos.</p>
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-xs font-bold text-stone-500">Rama de actividad</Label>
              <div className="flex flex-wrap gap-4 mt-1">
                {RAMAS_ACTIVIDAD.map((rama) => (
                  <label key={rama.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ramas.includes(rama.value)}
                      onChange={() => toggleRama(rama.value)}
                      className="accent-orange-500 h-4 w-4"
                    />
                    <span className="text-sm">{rama.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Selecciona las ramas en las que está registrado tu taller.</p>
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
