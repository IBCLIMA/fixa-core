"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { eliminarOrden } from "../../actions/ordenes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/components/confirm-dialog";

export function EliminarOrdenBtn({ ordenId }: { ordenId: string }) {
  const router = useRouter();
  const { confirm, ConfirmUI } = useConfirm();
  const [loading, setLoading] = useState(false);

  async function handleEliminar() {
    const ok = await confirm({
      title: "¿Eliminar esta orden de trabajo?",
      description:
        "Se borrarán todas las líneas, fotos, historial y presupuestos asociados. Esta acción no se puede deshacer.",
      confirmText: "Eliminar orden",
      destructive: true,
    });
    if (!ok) return;
    setLoading(true);
    try {
      await eliminarOrden(ordenId);
      toast.success("Orden eliminada");
      router.push("/ordenes");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al eliminar la orden");
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        variant="outline"
        disabled={loading}
        className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
        onClick={handleEliminar}
      >
        {loading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Trash2 className="mr-1.5 h-4 w-4" />}
        Eliminar orden
      </Button>
      {ConfirmUI}
    </>
  );
}
