"use client";

import { useState } from "react";
import { RefreshCw, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generarAvisosITV } from "../actions/avisos";
import { toast } from "sonner";

const tonos = {
  emerald: "bg-emerald-600 hover:bg-emerald-500",
  violet: "bg-violet-600 hover:bg-violet-500",
} as const;

export function WhatsAppBoton({
  href,
  label,
  nombre,
  tono = "emerald",
}: {
  href: string;
  label: string;
  nombre?: string;
  tono?: keyof typeof tonos;
}) {
  return (
    <a
      href={href}
      target="_blank"
      onClick={() => toast.success(nombre ? `Abriendo WhatsApp de ${nombre}` : "Abriendo WhatsApp")}
      className={`flex h-11 items-center gap-1.5 rounded-xl px-4 text-white text-xs font-bold transition-colors shrink-0 ${tonos[tono]}`}
    >
      <MessageSquare className="h-3 w-3" />
      {label}
    </a>
  );
}

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
