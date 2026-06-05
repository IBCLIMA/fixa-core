"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Car, Pencil, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MarcaAutocomplete, ModeloAutocomplete } from "@/components/vehicle-autocomplete";
import { toast } from "sonner";

type Vehiculo = {
  id: string;
  matricula: string;
  marca: string | null;
  modelo: string | null;
  anio: number | null;
  color: string | null;
  vin: string | null;
  combustible: string | null;
};

export function VehiculoCard({
  vehiculo,
  kmEntrada,
}: {
  vehiculo: Vehiculo | null;
  kmEntrada?: number | null;
}) {
  const router = useRouter();
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(false);
  const [marca, setMarca] = useState(vehiculo?.marca || "");
  const [modelo, setModelo] = useState(vehiculo?.modelo || "");
  const [modelosSugeridos, setModelosSugeridos] = useState<string[]>([]);
  const [anio, setAnio] = useState(vehiculo?.anio ? String(vehiculo.anio) : "");
  const [color, setColor] = useState(vehiculo?.color || "");

  if (!vehiculo) return null;

  async function guardar() {
    setLoading(true);
    try {
      const res = await fetch(`/api/vehiculos/${vehiculo!.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marca: marca.trim(),
          modelo: modelo.trim(),
          anio: anio ? Number(anio) : null,
          color: color.trim(),
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Vehículo actualizado");
      setEditando(false);
      router.refresh();
    } catch {
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
              <Car className="h-4 w-4 text-blue-600" />
            </div>
            <p className="font-bold">Vehículo</p>
          </div>
          {!editando && (
            <button
              onClick={() => setEditando(true)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
        </div>

        {editando ? (
          <div className="space-y-2">
            <p className="text-lg font-bold tracking-wider">{vehiculo.matricula}</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[10px] text-stone-400">Marca</Label>
                <MarcaAutocomplete
                  value={marca}
                  onChange={setMarca}
                  onModeloChange={setModelosSugeridos}
                  className="h-9 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-stone-400">Modelo</Label>
                <ModeloAutocomplete
                  value={modelo}
                  onChange={setModelo}
                  modelos={modelosSugeridos}
                  className="h-9 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-stone-400">Año</Label>
                <Input value={anio} onChange={(e) => setAnio(e.target.value)} type="number" placeholder="2020" className="h-9 rounded-lg text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-stone-400">Color</Label>
                <Input value={color} onChange={(e) => setColor(e.target.value)} placeholder="Blanco" className="h-9 rounded-lg text-sm" />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={guardar} disabled={loading} className="flex items-center gap-1 text-xs font-bold text-white bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded-full">
                <Check className="h-3 w-3" />{loading ? "..." : "Guardar"}
              </button>
              <button onClick={() => setEditando(false)} className="flex items-center gap-1 text-xs text-stone-500 px-3 py-1.5 rounded-full">
                <X className="h-3 w-3" />Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-1 text-sm">
            <p className="font-bold text-lg tracking-wider">{vehiculo.matricula}</p>
            <p className="text-muted-foreground">
              {[vehiculo.marca, vehiculo.modelo, vehiculo.anio].filter(Boolean).join(" · ")}
            </p>
            {kmEntrada && (
              <p className="text-muted-foreground">
                Entrada: {kmEntrada.toLocaleString("es-ES")} km
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
