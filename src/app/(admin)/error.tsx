"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";

// Error del panel de administración: genérico, con el digest visible para depurar.
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-xl font-bold mb-2">Error en el panel de administración</h2>
      <p className="text-sm text-muted-foreground mb-1 max-w-md">
        {error.message || "Se ha producido un error inesperado."}
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground mb-4">Código: {error.digest}</p>
      )}
      <div className="flex gap-3 mt-4">
        <Button onClick={reset} variant="outline" className="rounded-full">
          <RotateCcw className="mr-2 h-4 w-4" />
          Reintentar
        </Button>
        <Link href="/admin">
          <Button variant="ghost" className="rounded-full">
            Volver al panel
          </Button>
        </Link>
      </div>
    </div>
  );
}
