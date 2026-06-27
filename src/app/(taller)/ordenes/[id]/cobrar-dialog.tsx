"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { generarDocumentoCobro } from "../../actions/documentos";
import { toast } from "sonner";
import { Receipt, Check, Printer, MessageSquare, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatWhatsAppUrl } from "@/lib/utils";
import { formatMoney } from "@/lib/format";

type MetodoPago = "efectivo" | "tarjeta" | "transferencia" | "bizum" | "domiciliacion" | "otro";

export function CobrarDialog({
  ordenId,
  totalFinal,
  clienteTelefono,
  clienteNombre,
  matricula,
  yaGenerado,
  documentoId,
  barMode = false,
}: {
  ordenId: string;
  totalFinal: number;
  clienteTelefono?: string | null;
  clienteNombre?: string;
  matricula?: string;
  yaGenerado?: boolean;
  documentoId?: string | null;
  /** When true, the trigger fills the sticky action bar (full width). */
  barMode?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [metodo, setMetodo] = useState<MetodoPago>("tarjeta");
  const [notas, setNotas] = useState("");
  const [loading, setLoading] = useState(false);
  const [generado, setGenerado] = useState<{
    id: string;
    numero: number;
    tokenPublico: string | null;
  } | null>(null);

  async function handleGenerar() {
    setLoading(true);
    try {
      const doc = await generarDocumentoCobro(ordenId, metodo, notas || undefined);
      setGenerado({ id: doc.id, numero: doc.numero, tokenPublico: doc.tokenPublico });
      toast.success(`Documento DOC-${String(doc.numero).padStart(4, "0")} generado`);
    } catch (e: any) {
      toast.error(e.message || "Error al generar documento");
    } finally {
      setLoading(false);
    }
  }

  function getWhatsAppUrl() {
    if (!clienteTelefono || !generado?.tokenPublico) return null;
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const docUrl = `${baseUrl}/documento/${generado.tokenPublico}`;
    const msg = `Hola ${clienteNombre?.split(" ")[0] || ""}, aqui tienes el documento de cobro de tu vehiculo ${matricula || ""}. ${docUrl}`;
    return formatWhatsAppUrl(clienteTelefono, msg);
  }

  // If document already generated, show link to it
  if (yaGenerado && documentoId) {
    return (
      <Link href={`/documentos/${documentoId}`} className={barMode ? "block" : undefined}>
        <Button variant="outline" className={barMode ? "w-full rounded-xl h-12" : "rounded-full"}>
          <FileText className="mr-1.5 h-4 w-4" />
          Ver documento de cobro
        </Button>
      </Link>
    );
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className={`bg-emerald-600 hover:bg-emerald-500 text-white ${barMode ? "w-full rounded-xl h-12 font-bold" : "rounded-full"}`}>
        <Receipt className="mr-1.5 h-4 w-4" />
        Cobrar y generar documento ({formatMoney(totalFinal)})
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        {!generado ? (
          <>
            <DialogHeader>
              <DialogTitle>Cobrar y generar documento</DialogTitle>
              <DialogDescription>
                Se registrara el pago y se generara un documento de cobro para esta orden.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Total a cobrar</p>
                <p className="text-3xl font-extrabold text-emerald-900">{formatMoney(totalFinal)}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Metodo de pago</label>
                <Select value={metodo} onValueChange={(v) => setMetodo(v as MetodoPago)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                    <SelectItem value="bizum">Bizum</SelectItem>
                    <SelectItem value="domiciliacion">Domiciliacion</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notas (opcional)</label>
                <Textarea
                  placeholder="Notas adicionales..."
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="rounded-xl resize-none"
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white"
                disabled={loading}
                onClick={handleGenerar}
              >
                <Check className="mr-1.5 h-4 w-4" />
                {loading ? "Generando..." : "Confirmar cobro"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-emerald-700">
                <Check className="h-5 w-5" />
                Documento generado
              </DialogTitle>
              <DialogDescription>
                DOC-{String(generado.numero).padStart(4, "0")} creado correctamente.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4">
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center">
                <p className="text-sm font-bold text-emerald-800">
                  DOC-{String(generado.numero).padStart(4, "0")}
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  Pago registrado - {formatMoney(totalFinal)}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Link href={`/documentos/${generado.id}`}>
                  <Button variant="outline" className="w-full rounded-xl justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Ver documento
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="w-full rounded-xl justify-start"
                  onClick={() => {
                    window.open(`/documentos/${generado.id}`, "_blank");
                    setTimeout(() => window.print(), 500);
                  }}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir
                </Button>

                {clienteTelefono && generado.tokenPublico && (
                  <a href={getWhatsAppUrl() || "#"} target="_blank">
                    <Button variant="outline" className="w-full rounded-xl justify-start text-emerald-700">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Enviar por WhatsApp
                    </Button>
                  </a>
                )}

                {generado.tokenPublico && (
                  <Button
                    variant="outline"
                    className="w-full rounded-xl justify-start"
                    onClick={() => {
                      const url = `${window.location.origin}/documento/${generado.tokenPublico}`;
                      navigator.clipboard.writeText(url);
                      toast.success("Enlace copiado");
                    }}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Copiar enlace publico
                  </Button>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                className="rounded-xl"
                onClick={() => {
                  setOpen(false);
                  setGenerado(null);
                }}
              >
                Cerrar
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
      </Dialog>
    </>
  );
}
