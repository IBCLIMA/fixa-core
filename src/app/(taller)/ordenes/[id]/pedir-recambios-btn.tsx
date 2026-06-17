"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatWhatsAppUrl } from "@/lib/utils";
import { toast } from "sonner";

type Recambista = { id: string; nombre: string; telefono: string; notas: string | null };
type Linea = { id: string; descripcion: string; referencia?: string | null; estadoRecambio?: string | null };

/**
 * Botón batch: selecciona varias piezas sin_pedir → un solo WhatsApp por recambista
 * con toda la lista de lo que necesita.
 */
export function PedirRecambiosBtn({
  ordenId,
  lineasRecambio,
  recambistas,
  matricula,
  marca,
  modelo,
  anio,
  vin,
  tallerNombre,
  fotosUrl,
}: {
  ordenId: string;
  lineasRecambio: Linea[];
  recambistas: Recambista[];
  matricula?: string;
  marca?: string;
  modelo?: string;
  anio?: number | null;
  vin?: string | null;
  tallerNombre?: string;
  fotosUrl?: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedRecambista, setSelectedRecambista] = useState<Recambista | null>(null);

  const sinPedir = lineasRecambio.filter((l) => !l.estadoRecambio || l.estadoRecambio === "sin_pedir");

  if (sinPedir.length === 0) return null;

  function buildMsg(recambista: Recambista) {
    const vehiculo = [matricula, marca, modelo, anio].filter(Boolean).join(" · ");
    const piezas = sinPedir.map((l) => `— ${l.descripcion}${l.referencia ? ` (Ref: ${l.referencia})` : ""}`).join("\n");
    const msg = [
      `Hola, soy ${tallerNombre || "el taller"}. Necesito para ${vehiculo}:`,
      piezas,
      vin ? `VIN: ${vin}` : "",
      fotosUrl ? `Fotos del vehículo: ${fotosUrl}` : "",
      `¿Precio y disponibilidad? Gracias`,
    ].filter(Boolean).join("\n");
    return formatWhatsAppUrl(recambista.telefono, msg);
  }

  async function marcarConsultadas() {
    try {
      await Promise.all(
        sinPedir.map((l) =>
          fetch(`/api/ordenes/${ordenId}/lineas/${l.id}/recambio`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estadoRecambio: "consultado" }),
          })
        )
      );
      router.refresh();
    } catch {
      // Silent fail — the WhatsApp was sent regardless
    }
  }

  if (recambistas.length === 0) {
    return (
      <a href="/configuracion">
        <Button className="rounded-full bg-[#25D366] hover:bg-[#1fb959] text-white font-bold shadow-sm cursor-pointer">
          <MessageSquare className="mr-1.5 h-4 w-4" />
          Pedir {sinPedir.length} recambio{sinPedir.length > 1 ? "s" : ""}
        </Button>
      </a>
    );
  }

  if (selectedRecambista) {
    // Confirmar y abrir WhatsApp
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground">Enviar {sinPedir.length} pieza{sinPedir.length > 1 ? "s" : ""} a:</span>
        <a
          href={buildMsg(selectedRecambista)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => { marcarConsultadas(); setSelectedRecambista(null); setOpen(false); toast.success(`WhatsApp preparado para ${selectedRecambista.nombre}`); }}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold bg-[#25D366] text-white hover:bg-[#1fb959] transition-colors cursor-pointer shadow-sm"
        >
          <MessageSquare className="h-4 w-4" />{selectedRecambista.nombre}
        </a>
        <button onClick={() => setSelectedRecambista(null)} className="text-xs text-muted-foreground hover:text-stone-700 cursor-pointer">Cambiar</button>
      </div>
    );
  }

  if (open) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground">¿A quién le pides?</span>
        {recambistas.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedRecambista(r)}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold bg-[#25D366] text-white hover:bg-[#1fb959] transition-colors cursor-pointer shadow-sm"
          >
            <MessageSquare className="h-3.5 w-3.5" />{r.nombre}
          </button>
        ))}
      </div>
    );
  }

  return (
    <Button
      onClick={() => setOpen(true)}
      className="rounded-full bg-[#25D366] hover:bg-[#1fb959] text-white font-bold shadow-sm cursor-pointer"
    >
      <MessageSquare className="mr-1.5 h-4 w-4" />
      Pedir {sinPedir.length} recambio{sinPedir.length > 1 ? "s" : ""} por WhatsApp
    </Button>
  );
}
