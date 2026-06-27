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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <Label className="text-sm font-bold">Trabajos y recambios</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                onChange={(e) => {
                  const t = serviceTemplates.find((t) => t.name === e.target.value);
                  if (t) { applyTemplate(t); e.target.value = ""; }
                }}
                defaultValue=""
                className="h-11 sm:h-9 rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="" disabled>Aplicar plantilla...</option>
                {serviceTemplates.map((t) => (
                  <option key={t.name} value={t.name}>{t.name}</option>
                ))}
              </select>
              <Button type="button" variant="outline" onClick={addLinea} className="rounded-full h-11 sm:h-9">
                <Plus className="h-4 w-4 mr-1" />Añadir línea
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
                <div key={i} className="rounded-xl border border-stone-200 bg-stone-50/50 p-3 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <select
                      value={l.tipo}
                      onChange={(e) => updateLinea(i, "tipo", e.target.value)}
                      className="h-11 sm:h-9 rounded-lg border border-input bg-white px-3 text-sm"
                    >
                      <option value="mano_obra">Mano de obra</option>
                      <option value="recambio">Recambio</option>
                      <option value="otros">Otros</option>
                    </select>
                    <button type="button" onClick={() => removeLinea(i)} aria-label="Eliminar línea" className="inline-flex h-11 w-11 sm:h-9 sm:w-9 shrink-0 items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-muted-foreground">Concepto</label>
                    <Input
                      value={l.descripcion}
                      onChange={(e) => updateLinea(i, "descripcion", e.target.value)}
                      placeholder="Descripción del trabajo o recambio"
                      className="h-11 sm:h-10 rounded-lg text-sm"
                    />
                  </div>
                  {l.tipo === "recambio" && (
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted-foreground">Referencia</label>
                      <Input
                        value={l.referencia || ""}
                        onChange={(e) => updateLinea(i, "referencia", e.target.value)}
                        placeholder="Ej: 0986494128"
                        className="h-11 sm:h-10 rounded-lg text-sm font-mono"
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted-foreground">Cantidad</label>
                      <Input type="number" value={l.cantidad} onChange={(e) => updateLinea(i, "cantidad", Number(e.target.value))} className="h-11 sm:h-9 rounded-lg text-sm" min={0} step={0.25} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted-foreground">Precio (EUR)</label>
                      <Input type="number" value={l.precioUnitario} onChange={(e) => updateLinea(i, "precioUnitario", Number(e.target.value))} className="h-11 sm:h-9 rounded-lg text-sm" min={0} step={0.5} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted-foreground">IVA %</label>
                      <Input type="number" value={l.ivaPct} onChange={(e) => updateLinea(i, "ivaPct", Number(e.target.value))} className="h-11 sm:h-9 rounded-lg text-sm" min={0} step={1} />
                    </div>
                  </div>
                </div>
              ))}

              {/* Totals */}
              <div className="rounded-xl bg-muted/50 px-4 py-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base imponible</span>
                  <span className="tabular-nums">{formatMoney(totalBase)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IVA</span>
                  <span className="tabular-nums">{formatMoney(totalIva)}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-1">
                  <span>Total</span>
                  <span className="tabular-nums">{formatMoney(totalFinal)}</span>
                </div>
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
