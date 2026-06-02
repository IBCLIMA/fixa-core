"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function OrdenesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-xl font-bold mb-2">Error al cargar ordenes</h2>
      <p className="text-sm text-muted-foreground mb-1 max-w-md">
        {error.message || "No se han podido cargar las ordenes de trabajo."}
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground mb-4">
          Codigo: {error.digest}
        </p>
      )}
      <div className="flex gap-3 mt-4">
        <Button onClick={reset} variant="outline" className="rounded-full">
          <RotateCcw className="mr-2 h-4 w-4" />
          Reintentar
        </Button>
        <Link href="/">
          <Button variant="ghost" className="rounded-full">
            Volver al panel
          </Button>
        </Link>
      </div>
    </div>
  );
}
