"use client";

import { Button } from "@/components/ui/button";
import { Printer, MessageSquare, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { formatWhatsAppUrl } from "@/lib/utils";

export function DocumentoActions({
  documentoId,
  tokenPublico,
  clienteTelefono,
  clienteNombre,
  matricula,
  docNumero,
}: {
  documentoId: string;
  tokenPublico: string | null;
  clienteTelefono: string | null;
  clienteNombre: string;
  matricula: string;
  docNumero: string;
}) {
  function handlePrint() {
    window.print();
  }

  function getWhatsAppUrl() {
    if (!clienteTelefono || !tokenPublico) return null;
    const baseUrl = window.location.origin;
    const docUrl = `${baseUrl}/documento/${tokenPublico}`;
    const msg = `Hola ${clienteNombre.split(" ")[0]}, aquí tienes el documento de cobro ${docNumero} de tu vehículo ${matricula}. ${docUrl}`;
    return formatWhatsAppUrl(clienteTelefono, msg);
  }

  function handleCopyLink() {
    if (!tokenPublico) return;
    const url = `${window.location.origin}/documento/${tokenPublico}`;
    navigator.clipboard.writeText(url);
    toast.success("Enlace copiado al portapapeles");
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" className="rounded-full h-11" onClick={handlePrint}>
        <Printer className="mr-1.5 h-3.5 w-3.5" />
        Imprimir
      </Button>
      {clienteTelefono && tokenPublico && (
        <a
          href={getWhatsAppUrl() || "#"}
          target="_blank"
          onClick={() => toast.success("Abriendo WhatsApp con el enlace al documento")}
        >
          <Button variant="outline" size="sm" className="rounded-full h-11 text-emerald-700">
            <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
            Enviar por WhatsApp
          </Button>
        </a>
      )}
      {tokenPublico && (
        <Button variant="outline" size="sm" className="rounded-full h-11" onClick={handleCopyLink}>
          <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
          Copiar enlace
        </Button>
      )}
    </div>
  );
}
