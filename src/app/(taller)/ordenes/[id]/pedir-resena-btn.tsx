"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { enviarSolicitudResena } from "../../actions/ordenes";
import { toast } from "sonner";

export function PedirResenaBtn({ ordenId }: { ordenId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const whatsappUrl = await enviarSolicitudResena(ordenId);
      window.open(whatsappUrl, "_blank");
    } catch (e: any) {
      toast.error(e.message || "Error al generar el enlace");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      className="rounded-full"
      onClick={handleClick}
      disabled={loading}
    >
      <Star className="mr-1.5 h-4 w-4 text-yellow-500" />
      {loading ? "Abriendo..." : "Pedir reseña"}
    </Button>
  );
}
