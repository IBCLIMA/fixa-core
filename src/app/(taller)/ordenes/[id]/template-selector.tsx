"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { serviceTemplates } from "@/lib/service-templates";
import { getPlantillas, type LineaPlantilla } from "../../actions/plantillas";
import { agregarLineaOrden } from "../../actions/ordenes";
import { toast } from "sonner";

type Template = {
  name: string;
  lines: { tipo: "mano_obra" | "recambio" | "otros"; descripcion: string; cantidad: number; precioUnitario: number }[];
  custom?: boolean;
};

export function TemplateSelector({ ordenId }: { ordenId: string }) {
  const [loading, setLoading] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<Template[]>([]);

  useEffect(() => {
    getPlantillas()
      .then((plantillas) => {
        setCustomTemplates(
          plantillas.map((p) => ({
            name: p.nombre,
            lines: p.lineas as LineaPlantilla[],
            custom: true,
          }))
        );
      })
      .catch(() => {});
  }, []);

  const allTemplates: Template[] = [
    ...customTemplates,
    ...serviceTemplates,
  ];

  async function handleSelect(template: Template) {
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
          className="rounded-full h-11 sm:h-9 w-full sm:w-auto whitespace-nowrap"
          disabled={loading}
        >
          <Layers className="mr-1 h-4 w-4" />
          {loading ? "Aplicando..." : "Aplicar plantilla"}
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {customTemplates.length > 0 && (
          <>
            <div className="px-2 py-1.5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Mis plantillas</p>
            </div>
            {customTemplates.map((template) => (
              <DropdownMenuItem
                key={`custom-${template.name}`}
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
            <DropdownMenuSeparator />
          </>
        )}
        <div className="px-2 py-1.5">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Predefinidas</p>
        </div>
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
