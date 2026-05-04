"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-xl font-bold mb-2">Algo ha fallado</h2>
      <p className="text-sm text-muted-foreground mb-1 max-w-md">
        {error.message || "Error interno del servidor"}
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground mb-4">
          Código: {error.digest}
        </p>
      )}
      <Button onClick={reset} variant="outline" className="rounded-full">
        Reintentar
      </Button>
    </div>
  );
}
