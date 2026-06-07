"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MarcaAutocomplete, ModeloAutocomplete } from "@/components/vehicle-autocomplete";
import { toast } from "sonner";

export default function NuevoPresupuestoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [modelosSugeridos, setModelosSugeridos] = useState<string[]>([]);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      const res = await fetch("/api/presupuestos/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreCliente: formData.get("nombreCliente") as string,
          telefonoCliente: (formData.get("telefonoCliente") as string) || undefined,
          matricula: ((formData.get("matricula") as string) || "").toUpperCase().replace(/[\s\-]/g, ""),
          marca: marca || undefined,
          modelo: modelo || undefined,
          descripcion: (formData.get("descripcion") as string) || undefined,
        }),
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      toast.success(`Presupuesto PT-${data.numero} creado`);
      router.push(`/presupuestos/${data.id}`);
    } catch {
      toast.error("Error al crear el presupuesto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div className="flex items-start gap-3">
        <Link href="/presupuestos">
          <Button variant="ghost" size="icon" className="rounded-full mt-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Nuevo presupuesto</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Crea un presupuesto para enviar al cliente antes de empezar el trabajo.
          </p>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-stone-500">Nombre del cliente *</Label>
            <Input name="nombreCliente" placeholder="Antonio García" required className="h-11 rounded-xl" autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-stone-500">Teléfono</Label>
            <Input name="telefonoCliente" placeholder="612 345 678" type="tel" className="h-11 rounded-xl" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-stone-500">Matrícula</Label>
          <Input
            name="matricula"
            placeholder="1234ABC"
            className="h-12 rounded-xl font-bold tracking-widest uppercase text-center text-lg"
          />
          <p className="text-[10px] text-muted-foreground">Opcional — puedes añadirla más tarde</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-stone-500">Marca</Label>
            <MarcaAutocomplete
              value={marca}
              onChange={setMarca}
              onModeloChange={setModelosSugeridos}
              name="marca"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-stone-500">Modelo</Label>
            <ModeloAutocomplete
              value={modelo}
              onChange={setModelo}
              modelos={modelosSugeridos}
              name="modelo"
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-stone-500">Descripción del trabajo</Label>
          <Textarea name="descripcion" placeholder="Cambio de embrague, revisión completa..." rows={3} className="rounded-xl" />
        </div>

        <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={loading}>
          <FileText className="mr-1.5 h-4 w-4" />
          {loading ? "Creando..." : "Crear presupuesto"}
        </Button>
      </form>
    </div>
  );
}
