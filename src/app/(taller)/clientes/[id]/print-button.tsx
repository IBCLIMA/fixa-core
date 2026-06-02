"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton({ className }: { className?: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={`rounded-full no-print ${className || ""}`}
      onClick={() => window.print()}
    >
      <Printer className="mr-1.5 h-3.5 w-3.5" />
      Imprimir
    </Button>
  );
}
