"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { asignarMecanico } from "../../actions/ordenes";
import { toast } from "sonner";

type Usuario = {
  id: string;
  nombre: string;
  rol: string;
};

export function AsignarMecanico({
  ordenId,
  asignadoActual,
  mecanicos,
}: {
  ordenId: string;
  asignadoActual: string | null;
  mecanicos: Usuario[];
}) {
  const [loading, setLoading] = useState(false);

  async function handleChange(value: string) {
    setLoading(true);
    try {
      const uid = value === "sin_asignar" ? null : value;
      await asignarMecanico(ordenId, uid);
      toast.success(uid ? "Mecánico asignado" : "Asignación eliminada");
    } catch {
      toast.error("Error al asignar mecánico");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Select
      value={asignadoActual || "sin_asignar"}
      onValueChange={handleChange}
      disabled={loading}
    >
      <SelectTrigger className="h-11 rounded-xl text-sm w-full">
        <SelectValue placeholder="Sin asignar" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="sin_asignar">Sin asignar</SelectItem>
        {mecanicos.map((m) => (
          <SelectItem key={m.id} value={m.id}>
            {m.nombre} ({m.rol === "mecanico" ? "Mecánico" : m.rol === "admin" ? "Admin" : "Recepción"})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
