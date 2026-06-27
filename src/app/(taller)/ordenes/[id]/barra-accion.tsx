"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, MessageSquare, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cambiarEstadoOrden } from "../../actions/ordenes";
import { estadoLabelsDetalle } from "@/lib/constants";
import { getColumnForState } from "@/lib/workflow";
import { EntregarDialog } from "./entregar-dialog";
import { CobrarDialog } from "./cobrar-dialog";

/**
 * Barra de acción sticky del detalle de orden.
 *
 * Objetivo (mobile-first): el mecánico ejecuta la acción principal del estado
 * actual sin hacer scroll. NO duplica lógica: invoca las MISMAS server actions
 * y reutiliza los MISMOS diálogos (Entregar / Cobrar) que el resto de la pantalla.
 *
 * Acción principal contextual según estado:
 *  - recibido / diagnóstico / … → avanzar a la siguiente fase del flujo del taller
 *  - listo                      → Entregar coche (EntregarDialog)
 *  - entregado sin cobrar       → Cobrar (CobrarDialog)
 *  - cancelado                  → Reactivar (vuelve a la primera fase)
 * Más acceso rápido a WhatsApp al cliente.
 */

// Copy más natural para el botón de avance según la fase destino.
const advanceLabels: Record<string, string> = {
  diagnostico: "Empezar diagnóstico",
  presupuestado: "Pasar a presupuesto",
  aprobado: "Marcar como aprobado",
  en_reparacion: "Empezar reparación",
  esperando_recambio: "Marcar esperando recambio",
  listo: "Marcar como finalizado",
  entregado: "Marcar como entregado",
};

function AdvanceButton({
  ordenId,
  estado,
  label,
  icon,
}: {
  ordenId: string;
  estado: string;
  label: string;
  icon?: ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function avanzar() {
    setLoading(true);
    try {
      await cambiarEstadoOrden(ordenId, estado as Parameters<typeof cambiarEstadoOrden>[1]);
      toast.success(`Estado cambiado a: ${estadoLabelsDetalle[estado] || estado}`);
      router.refresh();
    } catch {
      toast.error("Error al cambiar el estado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={avanzar}
      disabled={loading}
      className="w-full rounded-xl h-12 text-base font-bold shadow-brand"
    >
      {loading ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        icon ?? <ArrowRight className="mr-2 h-5 w-5" />
      )}
      {label}
    </Button>
  );
}

export type BarraAccionProps = {
  ordenId: string;
  estadoActual: string;
  activePhases: string[];
  totalFinal: number;
  hayLineas: boolean;
  yaCobrado: boolean;
  documentoId?: string | null;
  matricula?: string;
  clienteNombre?: string;
  clienteTelefono?: string | null;
  tieneTelefono: boolean;
  whatsappEstadoUrl: string | null;
};

function resolvePrimary(props: BarraAccionProps): ReactNode {
  const { ordenId, estadoActual, activePhases, totalFinal, hayLineas, yaCobrado, documentoId } = props;

  if (estadoActual === "listo") {
    return (
      <EntregarDialog
        barMode
        ordenId={ordenId}
        totalFinal={totalFinal}
        matricula={props.matricula}
        clienteNombre={props.clienteNombre}
        tieneTelefono={props.tieneTelefono}
        hayLineas={hayLineas}
      />
    );
  }

  if (estadoActual === "entregado") {
    if (hayLineas) {
      return (
        <CobrarDialog
          barMode
          ordenId={ordenId}
          totalFinal={totalFinal}
          clienteTelefono={props.clienteTelefono}
          clienteNombre={props.clienteNombre}
          matricula={props.matricula}
          yaGenerado={yaCobrado}
          documentoId={documentoId}
        />
      );
    }
    return null;
  }

  if (estadoActual === "cancelado") {
    const target = activePhases[0];
    if (!target) return null;
    return (
      <AdvanceButton
        ordenId={ordenId}
        estado={target}
        label="Reactivar orden"
        icon={<RotateCcw className="mr-2 h-5 w-5" />}
      />
    );
  }

  // Estados intermedios → avanzar a la siguiente fase del flujo del taller.
  const anchor = activePhases.includes(estadoActual)
    ? estadoActual
    : getColumnForState(estadoActual, activePhases);
  const idx = activePhases.indexOf(anchor);
  if (idx >= 0 && idx < activePhases.length - 1) {
    const next = activePhases[idx + 1];
    return (
      <AdvanceButton
        ordenId={ordenId}
        estado={next}
        label={advanceLabels[next] || `Pasar a ${estadoLabelsDetalle[next] || next}`}
      />
    );
  }

  return null;
}

function BarraInterior(props: BarraAccionProps) {
  const primary = resolvePrimary(props);
  const { whatsappEstadoUrl } = props;

  if (!primary && !whatsappEstadoUrl) return null;

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-lg shadow-black/[0.06] p-2 flex items-center gap-2">
      {whatsappEstadoUrl && (
        <a
          href={whatsappEstadoUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Avisar al cliente por WhatsApp"
          aria-label="Avisar al cliente por WhatsApp"
          className="flex shrink-0 items-center justify-center h-12 w-12 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
        >
          <MessageSquare className="h-5 w-5" />
        </a>
      )}
      <div className="flex-1 min-w-0">
        {primary ?? (
          <p className="text-center text-sm font-medium text-muted-foreground py-2">
            Avisar al cliente
          </p>
        )}
      </div>
    </div>
  );
}

export function BarraAccionOrden(props: BarraAccionProps) {
  const primary = resolvePrimary(props);
  if (!primary && !props.whatsappEstadoUrl) return null;

  return (
    <>
      {/* Móvil/tablet: fija sobre la barra de navegación inferior flotante */}
      <div className="no-print fixed inset-x-0 bottom-[76px] z-40 px-4 lg:hidden">
        <BarraInterior {...props} />
      </div>
      {/* Desktop: flota anclada al fondo de la columna de contenido */}
      <div className="no-print hidden lg:block sticky bottom-6 z-30">
        <BarraInterior {...props} />
      </div>
    </>
  );
}
