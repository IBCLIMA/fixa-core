"use client";

import { useState } from "react";
import Image from "next/image";
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
  precioHora: string | null;
  logoUrl: string | null;
  horarioApertura: string | null;
  horarioCierre: string | null;
  trabajaSabados: boolean | null;
  horarioSabadoApertura: string | null;
  horarioSabadoCierre: string | null;
  capacidadDiaria: number | null;
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
  const [sabados, setSabados] = useState(taller.trabajaSabados || false);
  const [logoUrl, setLogoUrl] = useState(taller.logoUrl || "");
  const [uploadingLogo, setUploadingLogo] = useState(false);

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
          precioHora: formData.get("precioHora"),
          horarioApertura: formData.get("horarioApertura"),
          horarioCierre: formData.get("horarioCierre"),
          trabajaSabados: sabados,
          horarioSabadoApertura: formData.get("horarioSabadoApertura"),
          horarioSabadoCierre: formData.get("horarioSabadoCierre"),
          capacidadDiaria: formData.get("capacidadDiaria") ? Number(formData.get("capacidadDiaria")) : 4,
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
          {/* Logo */}
          <div className="flex items-center gap-4 pb-2">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 overflow-hidden">
              {logoUrl ? (
                <Image src={logoUrl} alt="Logo" width={64} height={64} className="h-full w-full object-contain" />
              ) : (
                <span className="text-[10px] text-stone-300 text-center">Logo</span>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-stone-500">Logo del taller</p>
              <p className="text-[10px] text-stone-400">Aparece en presupuestos, ORs y documentos que envías a clientes.</p>
              <p className="text-[10px] text-stone-300">Recomendado: PNG con fondo transparente, mín. 200x200px. Formatos: PNG, JPG, WebP, SVG. Máx 2MB.</p>
              <label className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700 cursor-pointer">
                {uploadingLogo ? "Subiendo..." : logoUrl ? "Cambiar" : "Subir logo"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingLogo(true);
                    try {
                      const fd = new FormData();
                      fd.append("file", file);
                      const res = await fetch("/api/taller/logo", { method: "POST", body: fd });
                      if (!res.ok) throw new Error();
                      const data = await res.json();
                      setLogoUrl(data.url);
                      toast.success("Logo subido");
                    } catch {
                      toast.error("Error al subir el logo");
                    } finally {
                      setUploadingLogo(false);
                    }
                  }}
                />
              </label>
            </div>
          </div>

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
            <div className="space-y-1.5">
              <Label htmlFor="precioHora">Precio/hora mano de obra (EUR)</Label>
              <Input id="precioHora" name="precioHora" type="number" step="0.50" min="0" defaultValue={taller.precioHora || "40.00"} className="h-11 rounded-xl" />
              <p className="text-xs text-muted-foreground">Se aplica por defecto al añadir mano de obra en las órdenes.</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="capacidadDiaria">Coches máx. por día</Label>
              <Input id="capacidadDiaria" name="capacidadDiaria" type="number" min="1" max="50" defaultValue={taller.capacidadDiaria || 4} className="h-11 rounded-xl" />
              <p className="text-xs text-muted-foreground">Cuando se llena un día, se bloquea en las citas online.</p>
            </div>
          </div>

          <Separator />

          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Horario del taller</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="horarioApertura">Apertura (L-V)</Label>
              <Input id="horarioApertura" name="horarioApertura" type="time" defaultValue={taller.horarioApertura || "08:00"} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="horarioCierre">Cierre (L-V)</Label>
              <Input id="horarioCierre" name="horarioCierre" type="time" defaultValue={taller.horarioCierre || "18:00"} className="h-11 rounded-xl" />
            </div>
            <div className="sm:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sabados}
                  onChange={(e) => setSabados(e.target.checked)}
                  className="accent-orange-500 h-5 w-5"
                />
                <span className="text-sm font-medium">Abrimos los sábados</span>
              </label>
            </div>
            {sabados && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="horarioSabadoApertura">Apertura sábados</Label>
                  <Input id="horarioSabadoApertura" name="horarioSabadoApertura" type="time" defaultValue={taller.horarioSabadoApertura || "09:00"} className="h-11 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="horarioSabadoCierre">Cierre sábados</Label>
                  <Input id="horarioSabadoCierre" name="horarioSabadoCierre" type="time" defaultValue={taller.horarioSabadoCierre || "13:00"} className="h-11 rounded-xl" />
                </div>
              </>
            )}
          </div>

          <Separator />

          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Rama de actividad</p>
          <div className="flex flex-wrap gap-3">
            {RAMAS_ACTIVIDAD.map((rama) => (
              <label key={rama.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ramas.includes(rama.value)}
                  onChange={() => toggleRama(rama.value)}
                  className="accent-orange-500 h-5 w-5"
                />
                <span className="text-sm font-medium">{rama.label}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Obligatorio en la OR segun RD 1457/1986. Aparecera en el PDF.</p>

          <Separator />

          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Otros</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="registroIndustrial">N.º registro industrial</Label>
              <Input id="registroIndustrial" name="registroIndustrial" defaultValue={taller.registroIndustrial || ""} placeholder="Ej: 46/1234" className="h-11 rounded-xl" />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="googleReviewLink">Enlace de reseñas de Google</Label>
                <a
                  href="https://support.google.com/business/answer/7035772"
                  target="_blank"
                  className="text-[11px] font-medium text-orange-600 hover:underline"
                >
                  ¿Cómo lo consigo?
                </a>
              </div>
              <Input id="googleReviewLink" name="googleReviewLink" defaultValue={taller.googleReviewLink || ""} placeholder="https://g.page/r/..." className="h-11 rounded-xl" />
              <div className="rounded-lg bg-blue-50 border border-blue-100 p-2.5 text-xs text-blue-800 space-y-1">
                <p className="font-bold">Cómo obtener tu enlace:</p>
                <ol className="list-decimal list-inside space-y-0.5 text-blue-700">
                  <li>Busca el nombre de tu taller en Google</li>
                  <li>En tu ficha, pulsa "Pedir reseñas"</li>
                  <li>Copia el enlace y pégalo aquí</li>
                </ol>
              </div>
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
