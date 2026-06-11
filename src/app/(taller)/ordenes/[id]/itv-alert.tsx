"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { actualizarFechaItv } from "../../actions/clientes";
import { toast } from "sonner";

/**
 * Aviso ITV en la orden: el coche está físicamente en el taller — es EL momento
 * de mirar la pegatina del parabrisas y capturar (o explotar) la fecha de ITV.
 */
export function ItvAlert({
  vehiculoId,
  fechaItv,
  anio,
}: {
  vehiculoId: string;
  fechaItv: string | null;
  anio: number | null;
}) {
  const router = useRouter();
  const [fecha, setFecha] = useState("");
  const [saving, setSaving] = useState(false);

  async function guardar() {
    if (!fecha) return;
    setSaving(true);
    try {
      await actualizarFechaItv(vehiculoId, fecha);
      toast.success("Fecha ITV guardada — FIXA avisará cuando se acerque");
      router.refresh();
    } catch {
      toast.error("Error al guardar la fecha");
    } finally {
      setSaving(false);
    }
  }

  // ── Con fecha registrada: avisar si caduca pronto o ya caducó ──
  if (fechaItv) {
    const dias = Math.ceil((new Date(fechaItv).getTime() - Date.now()) / 86400000);
    if (dias > 60) return null;

    const caducada = dias < 0;
    const fechaFmt = new Date(fechaItv).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
    return (
      <div className={`no-print rounded-2xl border p-4 flex items-center gap-3 ${caducada ? "border-red-300 bg-red-50/60" : "border-amber-300 bg-amber-50/60"}`}>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${caducada ? "bg-red-500" : "bg-amber-500"}`}>
          <ShieldAlert className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-extrabold ${caducada ? "text-red-900" : "text-amber-900"}`}>
            {caducada ? `ITV caducada desde el ${fechaFmt}` : `La ITV caduca el ${fechaFmt} (${dias} días)`}
          </p>
          <p className={`text-xs mt-0.5 ${caducada ? "text-red-700" : "text-amber-700"}`}>
            El coche está aquí: buen momento para ofrecer la pre-ITV y llevarla nosotros.
          </p>
        </div>
      </div>
    );
  }

  // ── Sin fecha: estimación por edad del vehículo ──
  if (!anio) return null;
  const edad = new Date().getFullYear() - anio;
  if (edad < 4) return null;

  const ciclo = edad > 10 ? "cada año" : "cada 2 años";
  return (
    <div className="no-print rounded-2xl border border-blue-200 bg-blue-50/50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-blue-900">
            Coche de {anio} ({edad} años): le toca ITV {ciclo}
          </p>
          <p className="text-xs text-blue-700 mt-0.5">
            No tenemos su fecha. Mira la pegatina del parabrisas y guárdala — FIXA avisará al cliente cuando se acerque.
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <Input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="h-10 rounded-xl bg-white max-w-[180px]"
          aria-label="Fecha de caducidad de la ITV"
        />
        <Button
          onClick={guardar}
          disabled={!fecha || saving}
          className="h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
        >
          {saving ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </div>
  );
}
