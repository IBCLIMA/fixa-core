"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Plus, Send, Check, X, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { registrarAveriaOculta, getAveriaWhatsAppUrl } from "../../actions/averias-ocultas";
import { toast } from "sonner";

type Averia = {
  id: string;
  descripcion: string;
  importeEstimado: string | null;
  fotoUrl: string | null;
  estado: string;
  notificadoAt: Date | null;
  respondidoAt: Date | null;
  createdAt: Date;
};

export function AveriasOcultas({
  ordenId,
  averias,
  clienteTelefono,
}: {
  ordenId: string;
  averias: Averia[];
  clienteTelefono?: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enviando, setEnviando] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      const descripcion = formData.get("descripcion") as string;
      const importeStr = formData.get("importe") as string;

      if (!descripcion.trim()) {
        toast.error("Describe la avería encontrada");
        return;
      }

      await registrarAveriaOculta({
        ordenId,
        descripcion: descripcion.trim(),
        importeEstimado: importeStr ? parseFloat(importeStr) : undefined,
      });

      toast.success("Avería registrada");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Error al registrar la avería");
    } finally {
      setLoading(false);
    }
  }

  async function handleEnviarWhatsApp(averiaId: string) {
    setEnviando(averiaId);
    try {
      const url = await getAveriaWhatsAppUrl(averiaId);
      window.open(url, "_blank");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Error al generar enlace");
    } finally {
      setEnviando(null);
    }
  }

  const pendientes = averias.filter((a) => a.estado === "pendiente");
  const aprobadas = averias.filter((a) => a.estado === "aprobada");
  const rechazadas = averias.filter((a) => a.estado === "rechazada");

  return (
    <Card className="no-print border-amber-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            Averías ocultas
            {pendientes.length > 0 && (
              <Badge className="bg-amber-100 text-amber-800 text-[10px]">
                {pendientes.length} pendiente{pendientes.length > 1 ? "s" : ""}
              </Badge>
            )}
          </CardTitle>
          <Button size="sm" variant="outline" className="rounded-full text-amber-700 border-amber-300 hover:bg-amber-50" onClick={() => setOpen(true)}>
            <Plus className="mr-1 h-3.5 w-3.5" />
            Registrar avería
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Avería oculta encontrada
                </DialogTitle>
              </DialogHeader>
              <form action={handleSubmit} className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Describe la avería encontrada durante la reparación. El cliente será notificado y deberá aprobar antes de continuar.
                </p>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-stone-500">Descripción de la avería *</Label>
                  <Textarea
                    name="descripcion"
                    placeholder="Ej: Disco de freno trasero derecho con desgaste excesivo, necesita sustitución..."
                    rows={3}
                    className="rounded-xl"
                    required
                    autoFocus
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-stone-500">Coste estimado</Label>
                  <div className="relative">
                    <Input
                      name="importe"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="h-11 rounded-xl pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">EUR</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" disabled={loading} className="flex-1 h-11 rounded-xl font-bold bg-amber-600 hover:bg-amber-500 text-white">
                    {loading ? "Registrando..." : "Registrar avería"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      {averias.length > 0 && (
        <CardContent className="space-y-2">
          {averias.map((averia) => (
            <div
              key={averia.id}
              className={`rounded-xl border p-3 space-y-2 ${
                averia.estado === "pendiente"
                  ? "border-amber-200 bg-amber-50/50"
                  : averia.estado === "aprobada"
                    ? "border-emerald-200 bg-emerald-50/50"
                    : "border-red-200 bg-red-50/50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{averia.descripcion}</p>
                  {averia.importeEstimado && (
                    <p className="text-sm font-bold mt-0.5">
                      ~{Number(averia.importeEstimado).toFixed(2)}EUR
                    </p>
                  )}
                </div>
                <Badge
                  className={`shrink-0 text-[10px] ${
                    averia.estado === "pendiente"
                      ? "bg-amber-100 text-amber-800"
                      : averia.estado === "aprobada"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {averia.estado === "pendiente" && <Clock className="mr-1 h-3 w-3" />}
                  {averia.estado === "aprobada" && <Check className="mr-1 h-3 w-3" />}
                  {averia.estado === "rechazada" && <X className="mr-1 h-3 w-3" />}
                  {averia.estado === "pendiente" ? "Pendiente" : averia.estado === "aprobada" ? "Aprobada" : "Rechazada"}
                </Badge>
              </div>

              {/* Actions for pending items */}
              {averia.estado === "pendiente" && (
                <div className="flex items-center gap-2 pt-1">
                  {clienteTelefono ? (
                    <Button
                      size="sm"
                      onClick={() => handleEnviarWhatsApp(averia.id)}
                      disabled={enviando === averia.id}
                      className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8"
                    >
                      <Send className="mr-1 h-3 w-3" />
                      {enviando === averia.id
                        ? "Abriendo..."
                        : averia.notificadoAt
                          ? "Reenviar WhatsApp"
                          : "Notificar al cliente"}
                    </Button>
                  ) : (
                    <p className="text-xs text-muted-foreground">Sin teléfono — notificar presencialmente</p>
                  )}
                  {averia.notificadoAt && (
                    <span className="text-[10px] text-muted-foreground">
                      Notificado {new Date(averia.notificadoAt).toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  )}
                </div>
              )}

              {averia.respondidoAt && (
                <p className="text-[10px] text-muted-foreground">
                  Respondido {new Date(averia.respondidoAt).toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      )}

      {averias.length === 0 && (
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-2">
            No se han encontrado averías adicionales
          </p>
        </CardContent>
      )}
    </Card>
  );
}
