"use client";

import { Trash2 } from "lucide-react";
import { eliminarOrden } from "../actions/ordenes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function EliminarRapido({ ordenId, numero }: { ordenId: string; numero: number }) {
  const router = useRouter();

  async function handleEliminar(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`¿Eliminar OR-${numero}? Esta acción no se puede deshacer.`)) return;
    try {
      await eliminarOrden(ordenId);
      toast.success(`OR-${numero} eliminada`);
      router.refresh();
    } catch {
      toast.error("Error al eliminar");
    }
  }

  return (
    <button
      onClick={handleEliminar}
      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-stone-300 hover:text-red-500 hover:bg-red-50 transition-all"
      title="Eliminar orden"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
