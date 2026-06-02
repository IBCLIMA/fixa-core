"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registrarPago } from "../actions/ordenes";
import { toast } from "sonner";
import { Check, CreditCard } from "lucide-react";
import Link from "next/link";

type OrdenPendiente = {
  id: string;
  numero: number;
  clienteNombre: string | null;
  matricula: string | null;
  fechaEntrega: Date | null;
  total: number;
};

export function CobrosPendientes({ ordenes }: { ordenes: OrdenPendiente[] }) {
  const [pagoAbierto, setPagoAbierto] = useState<string | null>(null);
  const [metodo, setMetodo] = useState<string>("tarjeta");
  const [loading, setLoading] = useState(false);

  const totalPendiente = ordenes.reduce((sum, o) => sum + Number(o.total), 0);

  async function handlePagar(orden: OrdenPendiente) {
    setLoading(true);
    try {
      await registrarPago({
        ordenId: orden.id,
        metodoPago: metodo as "efectivo" | "tarjeta" | "transferencia" | "bizum" | "domiciliacion" | "otro",
        importeTotal: Number(orden.total),
      });
      toast.success(`Pago registrado: OR-${orden.numero}`);
      setPagoAbierto(null);
    } catch {
      toast.error("Error al registrar pago");
    } finally {
      setLoading(false);
    }
  }

  if (ordenes.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        No hay cobros pendientes
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Total pendiente de cobro</p>
          <p className="text-2xl font-extrabold text-amber-900">{totalPendiente.toFixed(2)}€</p>
        </div>
        <Badge className="bg-amber-600 text-white text-sm px-3 py-1">
          {ordenes.length} {ordenes.length === 1 ? "orden" : "órdenes"}
        </Badge>
      </div>

      <div className="space-y-2">
        {ordenes.map((o) => (
          <div key={o.id} className="rounded-xl bg-muted/50 px-3 py-2.5">
            <div className="flex items-center justify-between">
              <Link href={`/ordenes/${o.id}`} className="flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity">
                <span className="text-xs font-bold text-muted-foreground">OR-{o.numero}</span>
                <span className="text-sm font-medium">{o.matricula}</span>
                <span className="text-xs text-muted-foreground truncate">{o.clienteNombre}</span>
              </Link>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-bold">{Number(o.total).toFixed(2)}€</span>
                {o.fechaEntrega && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(o.fechaEntrega).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full h-7 text-xs"
                  onClick={() => setPagoAbierto(pagoAbierto === o.id ? null : o.id)}
                >
                  <CreditCard className="mr-1 h-3 w-3" />
                  Cobrar
                </Button>
              </div>
            </div>

            {pagoAbierto === o.id && (
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
                <Select value={metodo} onValueChange={setMetodo}>
                  <SelectTrigger className="h-8 rounded-lg w-40 text-xs">
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
                <Button
                  size="sm"
                  className="rounded-lg h-8 text-xs"
                  disabled={loading}
                  onClick={() => handlePagar(o)}
                >
                  <Check className="mr-1 h-3 w-3" />
                  {loading ? "Registrando..." : "Confirmar pago"}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
