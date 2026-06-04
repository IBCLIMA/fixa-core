"use client";

import { useRef, useState } from "react";
import { Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { actualizarDatosSeguro } from "../../actions/orden-legal";

interface SeguroChapaProps {
  ordenId: string;
  tipoIntervencion: string[] | null;
  aseguradora: string | null;
  numPoliza: string | null;
  numSiniestro: string | null;
  numPeritaje: string | null;
  nombrePerito: string | null;
}

export function SeguroChapa({
  ordenId,
  tipoIntervencion,
  aseguradora,
  numPoliza,
  numSiniestro,
  numPeritaje,
  nombrePerito,
}: SeguroChapaProps) {
  const tipos = tipoIntervencion || [];
  const esChapaPintura = tipos.includes("chapa") || tipos.includes("pintura");

  const [datos, setDatos] = useState({
    aseguradora: aseguradora || "",
    numPoliza: numPoliza || "",
    numSiniestro: numSiniestro || "",
    numPeritaje: numPeritaje || "",
    nombrePerito: nombrePerito || "",
  });

  const savingRef = useRef(false);

  function updateField(field: keyof typeof datos, value: string) {
    setDatos((prev) => ({ ...prev, [field]: value }));
  }

  async function guardarOnBlur() {
    if (savingRef.current) return;
    savingRef.current = true;
    try {
      await actualizarDatosSeguro(ordenId, datos);
      toast.success("Datos del seguro guardados");
    } catch {
      toast.error("Error al guardar datos del seguro");
    } finally {
      savingRef.current = false;
    }
  }

  if (!esChapaPintura) return null;

  const fields = [
    { key: "aseguradora" as const, label: "Aseguradora" },
    { key: "numPoliza" as const, label: "N.º Póliza" },
    { key: "numSiniestro" as const, label: "N.º Siniestro" },
    { key: "numPeritaje" as const, label: "N.º Peritaje" },
    { key: "nombrePerito" as const, label: "Nombre del perito" },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          Datos del seguro
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {fields.map(({ key, label }) => (
            <div key={key} className="space-y-1">
              <p className="text-xs font-bold text-stone-500">{label}</p>
              <Input
                value={datos[key]}
                onChange={(e) => updateField(key, e.target.value)}
                onBlur={guardarOnBlur}
                placeholder={label}
                className="h-11 rounded-xl"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
