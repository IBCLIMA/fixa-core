"use client";

import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

// Error público para el cliente final del taller: tono humano, sin jerga técnica.
export default function EstadoError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-xl font-bold mb-2">No hemos podido cargar la información</h1>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        Ha sido un fallo momentáneo. Dale a reintentar y en un segundo lo tienes.
      </p>
      <Button onClick={reset} className="rounded-full">
        <RotateCcw className="mr-2 h-4 w-4" />
        Reintentar
      </Button>
    </div>
  );
}
