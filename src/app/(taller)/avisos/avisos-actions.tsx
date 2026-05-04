"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generarAvisosITV } from "../actions/avisos";
import { toast } from "sonner";

export function AvisosActions() {
  const [loading, setLoading] = useState(false);

  async function handleGenerar() {
    setLoading(true);
    try {
      const creados = await generarAvisosITV();
      if (creados > 0) {
        toast.success(`${creados} aviso${creados !== 1 ? "s" : ""} de ITV generado${creados !== 1 ? "s" : ""}`);
      } else {
        toast("No hay vehículos con ITV próxima sin aviso");
      }
    } catch {
      toast.error("Error al generar avisos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleGenerar} disabled={loading} className="rounded-full" variant="outline">
      <RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
      {loading ? "Generando..." : "Generar avisos ITV"}
    </Button>
  );
}
