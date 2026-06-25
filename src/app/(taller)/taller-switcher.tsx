"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronsUpDown, Check } from "lucide-react";
import { setTallerActivo } from "./actions/taller-activo";

/**
 * Selector de taller — SOLO se renderiza para super-admin (lo decide el layout).
 * Permite saltar entre los talleres del grupo (Coches / Soldadura / Máquinas)
 * durante el testeo. Invisible para cualquier taller cliente normal.
 */
export function TallerSwitcher({
  talleres,
  activoId,
}: {
  talleres: { id: string; nombre: string }[];
  activoId: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const activo = talleres.find((t) => t.id === activoId) ?? talleres[0];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function seleccionar(id: string) {
    if (id === activoId) {
      setOpen(false);
      return;
    }
    startTransition(async () => {
      await setTallerActivo(id);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={pending}
        className="flex h-8 items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-2.5 text-xs font-bold text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
        title="Cambiar de taller (super-admin)"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
        <span className="max-w-[140px] truncate">{activo?.nombre}</span>
        <ChevronsUpDown className="h-3.5 w-3.5 text-stone-400" />
      </button>
      {open && (
        <div className="absolute left-0 top-9 z-50 w-60 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg">
          <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-stone-400">
            Cambiar de taller
          </p>
          {talleres.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => seleccionar(t.id)}
              className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm text-stone-700 transition hover:bg-stone-50"
            >
              <span className="truncate">{t.nombre}</span>
              {t.id === activoId && <Check className="h-4 w-4 shrink-0 text-orange-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
