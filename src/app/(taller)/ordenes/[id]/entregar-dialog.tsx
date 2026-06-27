"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { entregarOrden } from "../../actions/ordenes";
import { formatMoney } from "@/lib/format";
import { toast } from "sonner";
import { Car, Check, MessageSquare, FileText, Clock } from "lucide-react";
import Link from "next/link";

type MetodoPago = "efectivo" | "tarjeta" | "transferencia" | "bizum" | "domiciliacion" | "otro";

export function EntregarDialog({
  ordenId,
  totalFinal,
  matricula,
  clienteNombre,
  tieneTelefono,
  hayLineas,
  barMode = false,
}: {
  ordenId: string;
  totalFinal: number;
  matricula?: string;
  clienteNombre?: string;
  tieneTelefono: boolean;
  hayLineas: boolean;
  /** When true, the trigger fills the sticky action bar (full width). */
  barMode?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [metodo, setMetodo] = useState<MetodoPago>("tarjeta");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<{
    whatsappUrl: string | null;
    documentoId: string | null;
  } | null>(null);

  async function handleEntregar(cobrar: boolean) {
    setLoading(true);
    try {
      const res = await entregarOrden(ordenId, cobrar ? metodo : undefined);
      setResultado(res);
      toast.success(cobrar ? "Coche entregado y cobrado" : "Coche entregado (cobro pendiente)");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al entregar");
    } finally {
      setLoading(false);
    }
  }

  function cerrar() {
    setOpen(false);
    setResultado(null);
    router.refresh();
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className={`bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 px-6 text-base shadow-lg shadow-emerald-600/20 ${barMode ? "w-full rounded-xl" : "rounded-full"}`}>
        <Car className="mr-2 h-5 w-5" />
        Entregar coche
      </Button>
      <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : cerrar())}>
      <DialogContent className="sm:max-w-md">
        {!resultado ? (
          <>
            <DialogHeader>
              <DialogTitle>Entregar {matricula}</DialogTitle>
              <DialogDescription>
                {clienteNombre ? `Entrega a ${clienteNombre}. ` : ""}
                Se marcará como entregada y podrás cobrar y avisar al cliente en el mismo paso.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {hayLineas && totalFinal > 0 ? (
                <>
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center">
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Total a cobrar</p>
                    <p className="text-3xl font-extrabold text-emerald-900">{formatMoney(totalFinal)}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Método de pago</label>
                    <Select value={metodo} onValueChange={(v) => setMetodo(v as MetodoPago)}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="efectivo">Efectivo</SelectItem>
                        <SelectItem value="tarjeta">Tarjeta</SelectItem>
                        <SelectItem value="transferencia">Transferencia</SelectItem>
                        <SelectItem value="bizum">Bizum</SelectItem>
                        <SelectItem value="domiciliacion">Domiciliación</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground rounded-xl bg-muted/50 p-3">
                  Esta orden no tiene líneas con importe. Se entregará sin cobro.
                </p>
              )}
            </div>

            <DialogFooter className="flex-col gap-2 sm:flex-col">
              {hayLineas && totalFinal > 0 ? (
                <>
                  <Button
                    className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white h-12 font-bold"
                    disabled={loading}
                    onClick={() => handleEntregar(true)}
                  >
                    <Check className="mr-1.5 h-4 w-4" />
                    {loading ? "Entregando..." : `Entregar y cobrar ${formatMoney(totalFinal)}`}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl"
                    disabled={loading}
                    onClick={() => handleEntregar(false)}
                  >
                    <Clock className="mr-1.5 h-4 w-4" />
                    Entregar sin cobrar (queda pendiente)
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white h-12 font-bold"
                  disabled={loading}
                  onClick={() => handleEntregar(false)}
                >
                  <Check className="mr-1.5 h-4 w-4" />
                  {loading ? "Entregando..." : "Confirmar entrega"}
                </Button>
              )}
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-emerald-700">
                <Check className="h-5 w-5" />
                Coche entregado
              </DialogTitle>
              <DialogDescription>
                {resultado.documentoId
                  ? "Cobro registrado y documento generado."
                  : "El cobro queda pendiente — lo verás en Facturación."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 py-3">
              {tieneTelefono && resultado.whatsappUrl && (
                <a href={resultado.whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full rounded-xl bg-[#25D366] hover:bg-[#1fb959] text-white h-12 font-bold">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Enviar informe y pedir reseña
                  </Button>
                </a>
              )}
              {resultado.documentoId && (
                <Link href={`/documentos/${resultado.documentoId}`}>
                  <Button variant="outline" className="w-full rounded-xl justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Ver documento de cobro
                  </Button>
                </Link>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" className="rounded-xl w-full" onClick={cerrar}>
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
