"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { actualizarDatosLegales } from "../../actions/orden-legal";

interface DatosLegalesProps {
  ordenId: string;
  motivoDeposito: string | null;
  fechaEstimada: Date | string | null;
  observacionesEntrada: string | null;
  renunciaPresupuesto: boolean | null;
  renunciaPiezas: boolean | null;
}

export function DatosLegales({
  ordenId,
  motivoDeposito,
  fechaEstimada,
  observacionesEntrada,
  renunciaPresupuesto,
  renunciaPiezas,
}: DatosLegalesProps) {
  const [motivo, setMotivo] = useState(motivoDeposito || "reparacion");
  const [fecha, setFecha] = useState(() => {
    if (!fechaEstimada) return "";
    const d = typeof fechaEstimada === "string" ? new Date(fechaEstimada) : fechaEstimada;
    return d.toISOString().split("T")[0];
  });
  const [observaciones, setObservaciones] = useState(observacionesEntrada || "");
  const [rPresupuesto, setRPresupuesto] = useState(renunciaPresupuesto || false);
  const [rPiezas, setRPiezas] = useState(renunciaPiezas || false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(false);

  const guardar = useCallback(
    (overrides?: Partial<{
      motivoDeposito: string;
      fechaEstimada: string | null;
      observacionesEntrada: string;
      renunciaPresupuesto: boolean;
      renunciaPiezas: boolean;
    }>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(async () => {
        try {
          await actualizarDatosLegales(ordenId, {
            motivoDeposito: overrides?.motivoDeposito ?? motivo,
            fechaEstimada: overrides?.fechaEstimada !== undefined ? overrides.fechaEstimada : (fecha || null),
            observacionesEntrada: overrides?.observacionesEntrada ?? observaciones,
            renunciaPresupuesto: overrides?.renunciaPresupuesto ?? rPresupuesto,
            renunciaPiezas: overrides?.renunciaPiezas ?? rPiezas,
          });
          toast.success("Datos legales guardados");
        } catch {
          toast.error("Error al guardar datos legales");
        }
      }, 500);
    },
    [ordenId, motivo, fecha, observaciones, rPresupuesto, rPiezas]
  );

  // Auto-save on state changes (skip first render)
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    guardar();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [motivo, fecha, observaciones, rPresupuesto, rPiezas]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
          Datos legales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Motivo del depósito */}
        <div>
          <p className="text-xs font-bold text-stone-500 mb-2">Motivo del depósito</p>
          <div className="flex gap-4">
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="radio"
                name="motivo"
                value="presupuesto"
                checked={motivo === "presupuesto"}
                onChange={() => setMotivo("presupuesto")}
                className="accent-orange-500 h-4 w-4"
              />
              Presupuesto
            </label>
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="radio"
                name="motivo"
                value="reparacion"
                checked={motivo === "reparacion"}
                onChange={() => setMotivo("reparacion")}
                className="accent-orange-500 h-4 w-4"
              />
              Reparación
            </label>
          </div>
        </div>

        {/* Fecha estimada de entrega */}
        <div>
          <p className="text-xs font-bold text-stone-500 mb-2">Fecha estimada de entrega</p>
          <Input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="h-11 rounded-xl max-w-xs"
          />
        </div>

        {/* Observaciones de entrada */}
        <div>
          <p className="text-xs font-bold text-stone-500 mb-2">Observaciones de entrada (daños preexistentes)</p>
          <Textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Rayado en puerta delantera izquierda, golpe en paragolpes..."
            rows={3}
            className="rounded-xl text-sm"
          />
        </div>

        {/* Opciones del cliente */}
        <div>
          <p className="text-xs font-bold text-stone-500 mb-2">Opciones del cliente</p>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={rPresupuesto}
                onChange={(e) => setRPresupuesto(e.target.checked)}
                className="accent-orange-500 h-4 w-4"
              />
              El cliente renuncia al presupuesto previo
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={rPiezas}
                onChange={(e) => setRPiezas(e.target.checked)}
                className="accent-orange-500 h-4 w-4"
              />
              El cliente renuncia a recibir las piezas sustituidas
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
