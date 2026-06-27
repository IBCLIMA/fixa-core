"use client";

import { useTransition } from "react";
import { AlertTriangle, LogOut } from "lucide-react";
import { salirImpersonacion } from "./actions/taller-activo";

/**
 * Banner rojo fijo que avisa al super-admin de que está OPERANDO COMO otro taller.
 * Se renderiza por encima de toda la app del taller (ver layout). El botón "Salir"
 * llama a la server action `salirImpersonacion()`, que borra la cookie y redirige
 * al panel de admin.
 */
export function ImpersonacionBanner({ tallerNombre }: { tallerNombre: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="sticky top-0 z-[60] flex items-center justify-center gap-3 bg-red-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-md">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span className="min-w-0">
        Estás operando como <b>{tallerNombre}</b>
      </span>
      <button
        onClick={() => startTransition(() => salirImpersonacion())}
        disabled={pending}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide transition-colors hover:bg-white/25 disabled:opacity-60"
      >
        <LogOut className="h-3.5 w-3.5" />
        {pending ? "Saliendo…" : "Salir"}
      </button>
    </div>
  );
}
