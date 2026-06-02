"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { enviarInformeCliente } from "../../actions/ordenes";
import { toast } from "sonner";

export function EnviarInformeBtn({ ordenId }: { ordenId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const whatsappUrl = await enviarInformeCliente(ordenId);
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
      <Send className="mr-1.5 h-4 w-4" />
      {loading ? "Abriendo..." : "Enviar informe"}
    </Button>
  );
}
