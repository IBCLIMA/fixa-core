"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const rolLabels: Record<string, string> = {
  admin: "Administrador",
  mecanico: "Mecánico",
  recepcion: "Recepción",
};

const rolColors: Record<string, string> = {
  admin: "bg-red-100 text-red-700",
  mecanico: "bg-blue-100 text-blue-700",
  recepcion: "bg-emerald-100 text-emerald-700",
};

export function UsuarioActions({
  usuarioId,
  rolActual,
  isCurrentUser,
}: {
  usuarioId: string;
  rolActual: string;
  isCurrentUser: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCambiarRol(nuevoRol: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/equipo/${usuarioId}/rol`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol: nuevoRol }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Rol cambiado a ${rolLabels[nuevoRol]}`);
      router.refresh();
    } catch {
      toast.error("Error al cambiar rol");
    } finally {
      setLoading(false);
    }
  }

  async function handleEliminar() {
    if (!confirm("¿Eliminar este usuario del equipo?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/equipo/${usuarioId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Usuario eliminado");
      router.refresh();
    } catch {
      toast.error("Error al eliminar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Role selector */}
      <select
        value={rolActual}
        onChange={(e) => handleCambiarRol(e.target.value)}
        disabled={loading || isCurrentUser}
        className={`h-8 rounded-lg border-0 px-2 text-xs font-bold cursor-pointer ${rolColors[rolActual]} ${isCurrentUser ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <option value="admin">Administrador</option>
        <option value="mecanico">Mecánico</option>
        <option value="recepcion">Recepción</option>
      </select>

      {/* Delete button (not for current user) */}
      {!isCurrentUser && (
        <button
          onClick={handleEliminar}
          disabled={loading}
          className="p-1.5 rounded-lg text-stone-300 hover:text-red-500 hover:bg-red-50 transition-colors"
          title="Eliminar del equipo"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
