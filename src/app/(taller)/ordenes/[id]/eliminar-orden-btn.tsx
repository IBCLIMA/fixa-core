"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { eliminarOrden } from "../../actions/ordenes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function EliminarOrdenBtn({ ordenId }: { ordenId: string }) {
  const router = useRouter();

  async function handleEliminar() {
    if (!window.confirm("¿Eliminar esta orden de trabajo? Se borrarán todas las líneas, fotos, historial y presupuestos asociados. Esta acción no se puede deshacer.")) {
      return;
    }
    try {
      await eliminarOrden(ordenId);
      toast.success("Orden eliminada");
      router.push("/ordenes");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al eliminar la orden");
    }
  }

  return (
    <Button
      variant="outline"
      className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
      onClick={handleEliminar}
    >
      <Trash2 className="mr-1.5 h-4 w-4" />Eliminar orden
    </Button>
  );
}
