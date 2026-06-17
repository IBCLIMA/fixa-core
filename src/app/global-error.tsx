"use client";

import { AlertTriangle, RotateCcw, MessageCircle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <div className="text-center space-y-6 max-w-sm">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900">
              Algo ha salido mal
            </h1>
            <p className="text-sm text-stone-500 mt-2">
              Ha ocurrido un error inesperado. Puedes intentar de nuevo o contactar con soporte.
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
            <a
              href="https://wa.me/34611433218?text=Hola%2C%20tengo%20un%20problema%20con%20FIXA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-6 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Contactar soporte
            </a>
          </div>
          <p className="text-xs text-stone-400">FIXA by Ibanez Clima</p>
        </div>
      </body>
    </html>
  );
}
