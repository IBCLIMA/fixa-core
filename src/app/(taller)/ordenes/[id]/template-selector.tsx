"use client";

import { useState } from "react";
import { ChevronDown, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { serviceTemplates } from "@/lib/service-templates";
import { agregarLineaOrden } from "../../actions/ordenes";
import { toast } from "sonner";

export function TemplateSelector({ ordenId }: { ordenId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSelect(template: (typeof serviceTemplates)[number]) {
    setLoading(true);
    try {
      for (const line of template.lines) {
        await agregarLineaOrden({
          ordenId,
          tipo: line.tipo,
          descripcion: line.descripcion,
          cantidad: line.cantidad,
          precioUnitario: line.precioUnitario,
        });
      }
      toast.success(`Plantilla aplicada: ${template.name}`);
    } catch {
      toast.error("Error al aplicar plantilla");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          disabled={loading}
        >
          <Layers className="mr-1 h-3 w-3" />
          {loading ? "Aplicando..." : "Aplicar plantilla"}
          <ChevronDown className="ml-1 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {serviceTemplates.map((template) => (
          <DropdownMenuItem
            key={template.name}
            onClick={() => handleSelect(template)}
            className="cursor-pointer"
          >
            <div>
              <p className="text-sm font-medium">{template.name}</p>
              <p className="text-xs text-muted-foreground">
                {template.lines.length} líneas
              </p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
