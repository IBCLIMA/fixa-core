"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton({ className }: { className?: string }) {
  return (
    <Button
      variant="outline"
      className={`rounded-full no-print ${className || ""}`}
      onClick={() => window.print()}
    >
      <Printer className="mr-1.5 h-4 w-4" />
      Imprimir
    </Button>
  );
}
