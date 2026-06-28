"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { actualizarDatosLegales } from "../../actions/orden-legal";

interface DatosLegalesProps {
  ordenId: string;
  fechaEstimada: Date | string | null;
  observacionesEntrada: string | null;
  renunciaPresupuesto: boolean | null;
  renunciaPiezas: boolean | null;
}

export function DatosLegales({
  ordenId,
  fechaEstimada,
  observacionesEntrada,
  renunciaPresupuesto,
  renunciaPiezas,
}: DatosLegalesProps) {
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
      fechaEstimada: string | null;
      observacionesEntrada: string;
      renunciaPresupuesto: boolean;
      renunciaPiezas: boolean;
    }>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(async () => {
        try {
          await actualizarDatosLegales(ordenId, {
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
    [ordenId, fecha, observaciones, rPresupuesto, rPiezas]
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
  }, [fecha, observaciones, rPresupuesto, rPiezas]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-5">
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
    </div>
  );
}
