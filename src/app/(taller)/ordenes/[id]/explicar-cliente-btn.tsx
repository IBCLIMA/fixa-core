"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sparkles, Loader2, MessageSquare, Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { explicarOrdenAlCliente } from "./ia-actions";
import { formatWhatsAppUrl } from "@/lib/utils";

export function ExplicarClienteBtn({
  ordenId,
  clienteTelefono,
  clienteNombre,
  matricula,
  iaDisponible,
}: {
  ordenId: string;
  clienteTelefono?: string | null;
  clienteNombre?: string | null;
  matricula?: string | null;
  iaDisponible: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [texto, setTexto] = useState("");

  async function generar() {
    setLoading(true);
    setTexto("");
    try {
      const mensaje = await explicarOrdenAlCliente(ordenId);
      setTexto(mensaje);
    } catch (e: any) {
      toast.error(e?.message || "No se pudo generar el mensaje");
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  function abrir() {
    setOpen(true);
    generar();
  }

  function whatsappUrl() {
    if (!clienteTelefono || !texto.trim()) return null;
    return formatWhatsAppUrl(clienteTelefono, texto.trim());
  }

  // IA no configurada: botón deshabilitado con tooltip explicativo.
  if (!iaDisponible) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled
                className="rounded-full h-11"
              >
                <Sparkles className="mr-1.5 h-4 w-4" />
                Explicar al cliente
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>Falta configurar la IA</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={abrir}
        className="rounded-full h-11 border-brand-200 text-brand-700 hover:bg-brand-50"
      >
        <Sparkles className="mr-1.5 h-4 w-4" />
        Explicar al cliente
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-600" />
              Mensaje para el cliente
            </DialogTitle>
            <DialogDescription>
              FIXA propone un mensaje claro a partir del diagnóstico. Revísalo y
              edítalo antes de enviarlo.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-muted-foreground">
                <Loader2 className="h-7 w-7 animate-spin text-brand-600" />
                <p className="text-sm">Generando mensaje…</p>
              </div>
            ) : (
              <Textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                rows={6}
                className="rounded-xl resize-none text-sm leading-relaxed"
                placeholder="El mensaje generado aparecerá aquí…"
              />
            )}
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={generar}
              disabled={loading}
              className="rounded-full h-11 justify-center"
            >
              <RotateCcw className="mr-1.5 h-4 w-4" />
              Regenerar
            </Button>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="rounded-full h-11"
                disabled={loading || !texto.trim()}
                onClick={() => {
                  navigator.clipboard.writeText(texto.trim());
                  toast.success("Mensaje copiado");
                }}
              >
                <Copy className="mr-1.5 h-4 w-4" />
                Copiar
              </Button>

              {clienteTelefono ? (
                <a
                  href={whatsappUrl() || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    loading || !texto.trim() ? "pointer-events-none opacity-50" : ""
                  }
                  aria-disabled={loading || !texto.trim()}
                >
                  <Button
                    type="button"
                    className="w-full rounded-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white"
                    disabled={loading || !texto.trim()}
                  >
                    <MessageSquare className="mr-1.5 h-4 w-4" />
                    Enviar por WhatsApp
                  </Button>
                </a>
              ) : (
                <Button
                  type="button"
                  className="rounded-full h-11 bg-emerald-600 text-white"
                  disabled
                  title="El cliente no tiene teléfono"
                >
                  <MessageSquare className="mr-1.5 h-4 w-4" />
                  Sin teléfono
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
