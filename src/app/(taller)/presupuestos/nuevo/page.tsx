"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { MarcaAutocomplete, ModeloAutocomplete } from "@/components/vehicle-autocomplete";
import { serviceTemplates } from "@/lib/service-templates";
import { formatMoney } from "@/lib/format";
import { toast } from "sonner";

type Linea = {
  tipo: "mano_obra" | "recambio" | "otros";
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  ivaPct: number;
  referencia?: string;
};

export default function NuevoPresupuestoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [modelosSugeridos, setModelosSugeridos] = useState<string[]>([]);
  const [lineas, setLineas] = useState<Linea[]>([]);

  function addLinea() {
    setLineas([...lineas, { tipo: "mano_obra", descripcion: "", cantidad: 1, precioUnitario: 0, ivaPct: 21 }]);
  }

  function updateLinea(i: number, field: keyof Linea, value: any) {
    const updated = [...lineas];
    updated[i] = { ...updated[i], [field]: value };
    setLineas(updated);
  }

  function removeLinea(i: number) {
    setLineas(lineas.filter((_, idx) => idx !== i));
  }

  function applyTemplate(template: typeof serviceTemplates[number]) {
    setLineas([...lineas, ...template.lines.map((l) => ({ ...l, ivaPct: 21 }))]);
    toast.success(`Plantilla "${template.name}" aplicada`);
  }

  const totalBase = lineas.reduce((sum, l) => sum + l.cantidad * l.precioUnitario, 0);
  const totalIva = lineas.reduce((sum, l) => sum + l.cantidad * l.precioUnitario * (l.ivaPct / 100), 0);
  const totalFinal = totalBase + totalIva;

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
          lineas: lineas.filter((l) => l.descripcion.trim()).map((l) => ({
            tipo: l.tipo,
            descripcion: l.descripcion,
            cantidad: l.cantidad,
            precioUnitario: l.precioUnitario,
            ivaPct: l.ivaPct,
            ...(l.referencia ? { referencia: l.referencia } : {}),
          })),
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
    <div className="space-y-6 max-w-2xl">
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

      <form action={handleSubmit} className="space-y-5">
        {/* Client + Vehicle */}
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

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-stone-500">Matrícula</Label>
            <Input name="matricula" placeholder="1234ABC" className="h-11 rounded-xl font-bold tracking-wider uppercase" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-stone-500">Marca</Label>
            <MarcaAutocomplete value={marca} onChange={setMarca} onModeloChange={setModelosSugeridos} className="h-11 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-stone-500">Modelo</Label>
            <ModeloAutocomplete value={modelo} onChange={setModelo} modelos={modelosSugeridos} className="h-11 rounded-xl" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-stone-500">Descripción del trabajo</Label>
          <Textarea name="descripcion" placeholder="Cambio de embrague, revisión completa..." rows={2} className="rounded-xl" />
        </div>

        <Separator />

        {/* Lines */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold">Trabajos y recambios</Label>
            <div className="flex gap-2">
              <select
                onChange={(e) => {
                  const t = serviceTemplates.find((t) => t.name === e.target.value);
                  if (t) { applyTemplate(t); e.target.value = ""; }
                }}
                defaultValue=""
                className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
              >
                <option value="" disabled>Aplicar plantilla...</option>
                {serviceTemplates.map((t) => (
                  <option key={t.name} value={t.name}>{t.name}</option>
                ))}
              </select>
              <Button type="button" variant="outline" size="sm" onClick={addLinea} className="rounded-full text-xs h-8">
                <Plus className="h-3 w-3 mr-1" />Añadir línea
              </Button>
            </div>
          </div>

          {lineas.length === 0 ? (
            <div className="text-center py-6 rounded-xl border border-dashed border-stone-200">
              <p className="text-sm text-stone-400">Sin líneas todavía</p>
              <p className="text-xs text-stone-300 mt-1">Añade líneas o aplica una plantilla</p>
            </div>
          ) : (
            <div className="space-y-2">
              {lineas.map((l, i) => (
                <div key={i} className="rounded-xl border border-stone-200 bg-stone-50/50 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <select
                      value={l.tipo}
                      onChange={(e) => updateLinea(i, "tipo", e.target.value)}
                      className="h-9 rounded-lg border border-input bg-white px-2 text-sm"
                    >
                      <option value="mano_obra">Mano de obra</option>
                      <option value="recambio">Recambio</option>
                      <option value="otros">Otros</option>
                    </select>
                    <button type="button" onClick={() => removeLinea(i)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <Input
                    value={l.descripcion}
                    onChange={(e) => updateLinea(i, "descripcion", e.target.value)}
                    placeholder="Descripción del trabajo o recambio"
                    className="h-10 rounded-lg text-sm"
                  />
                  {l.tipo === "recambio" && (
                    <Input
                      value={l.referencia || ""}
                      onChange={(e) => updateLinea(i, "referencia", e.target.value)}
                      placeholder="Referencia (ej: 0986494128)"
                      className="h-9 rounded-lg text-sm font-mono"
                    />
                  )}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-stone-400">Cantidad</label>
                      <Input type="number" value={l.cantidad} onChange={(e) => updateLinea(i, "cantidad", Number(e.target.value))} className="h-9 rounded-lg text-sm" min={0} step={0.25} />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-400">Precio unitario (EUR)</label>
                      <Input type="number" value={l.precioUnitario} onChange={(e) => updateLinea(i, "precioUnitario", Number(e.target.value))} className="h-9 rounded-lg text-sm" min={0} step={0.5} />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-400">IVA %</label>
                      <Input type="number" value={l.ivaPct} onChange={(e) => updateLinea(i, "ivaPct", Number(e.target.value))} className="h-9 rounded-lg text-sm" min={0} step={1} />
                    </div>
                  </div>
                </div>
              ))}

              {/* Totals */}
              <div className="text-right space-y-1 pt-2">
                <p className="text-sm text-stone-500">Base imponible: {formatMoney(totalBase)}</p>
                <p className="text-sm text-stone-500">IVA: {formatMoney(totalIva)}</p>
                <p className="text-lg font-bold">Total: {formatMoney(totalFinal)}</p>
              </div>
            </div>
          )}
        </div>

        <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={loading}>
          <FileText className="mr-1.5 h-4 w-4" />
          {loading ? "Creando..." : "Crear presupuesto"}
        </Button>
      </form>
    </div>
  );
}
