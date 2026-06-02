"use client";

import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center space-y-6 max-w-sm">
        <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-stone-900">
            Ha ocurrido un error
          </h2>
          <p className="text-sm text-stone-500 mt-2">
            {error.message || "No hemos podido cargar esta pagina. Intentalo de nuevo."}
          </p>
          {error.digest && (
            <p className="text-xs text-stone-400 mt-1">
              Ref: {error.digest}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reintentar
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-6 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
