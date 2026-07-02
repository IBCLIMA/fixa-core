"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function haceCuanto(desdeMs: number, ahoraMs: number): string {
  const s = Math.max(0, Math.round((ahoraMs - desdeMs) / 1000));
  if (s < 90) return "hace un momento";
  const min = Math.round(s / 60);
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? "ayer" : `hace ${d} días`;
}

/**
 * Señal de "EN DIRECTO" del portal del cliente. Dos cosas:
 *  1. Muestra "🟢 En directo · actualizado hace X" con tiempo relativo real
 *     (timestamp del último cambio de estado o foto), que se va actualizando.
 *  2. Refresca los datos del servidor cada minuto sin recargar la página, para
 *     que el cliente vea avanzar su reparación sola. Ese es el WOW creíble.
 */
export function PortalLive({ desde }: { desde: string }) {
  const router = useRouter();
  const desdeMs = new Date(desde).getTime();
  const [ahora, setAhora] = useState(desdeMs);

  useEffect(() => {
    setAhora(Date.now());
    // Re-pinta la etiqueta "hace X" cada 30 s.
    const tick = setInterval(() => setAhora(Date.now()), 30_000);
    // Trae datos frescos del servidor cada 60 s (sin recargar).
    const refrescar = setInterval(() => router.refresh(), 60_000);
    return () => {
      clearInterval(tick);
      clearInterval(refrescar);
    };
  }, [router, desde]);

  // "En directo · hace 3 días" es una contradicción que mata la credibilidad.
  // Si el último cambio tiene más de 24h, el badge se degrada a un neutro
  // "Actualizado hace X" sin punto verde ni promesa de directo.
  const esReciente = ahora - desdeMs < 24 * 60 * 60 * 1000;
  if (!esReciente) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-500 ring-1 ring-stone-200">
        Actualizado {haceCuanto(desdeMs, ahora)}
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:hidden" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      En directo
      <span className="font-normal text-emerald-600/80">· {haceCuanto(desdeMs, ahora)}</span>
    </span>
  );
}
