"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { crearPresupuestoDesdeOrden } from "../../actions/presupuestos";
import { toast } from "sonner";

export function CrearPresupuestoBtn({ ordenId }: { ordenId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleCrear() {
    setLoading(true);
    try {
      const p = await crearPresupuestoDesdeOrden(ordenId);
      toast.success(`Presupuesto PT-${p.numero} creado`);
    } catch {
      toast.error("Error al crear presupuesto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleCrear} disabled={loading} variant="outline" className="rounded-full">
      <FileText className="mr-1.5 h-4 w-4" />
      {loading ? "Creando..." : "Crear presupuesto"}
    </Button>
  );
}
