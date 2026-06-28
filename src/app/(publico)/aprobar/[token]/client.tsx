"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertTriangle, Check, X, Phone, Car, Wrench, CheckCircle2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FixaLogo } from "@/components/ui/fixa-logo";
import { responderAveria } from "@/app/(taller)/actions/averias-ocultas";
import { formatMoney } from "@/lib/format";
import { formatWhatsAppUrl } from "@/lib/utils";

export function AprobarAveriaClient({
  token,
  averia,
  orden,
  vehiculo,
  taller,
}: {
  token: string;
  averia: {
    descripcion: string;
    importeEstimado: string | null;
    estado: string;
    fotoUrl: string | null;
  };
  orden: { numero: number };
  vehiculo: { matricula: string | null; marca: string | null; modelo: string | null };
  taller: { nombre: string; telefono: string | null };
}) {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<"aprobada" | "rechazada" | null>(
    averia.estado !== "pendiente" ? (averia.estado as "aprobada" | "rechazada") : null
  );

  async function handleDecision(decision: "aprobada" | "rechazada") {
    setLoading(true);
    try {
      await responderAveria(token, decision);
      setResultado(decision);
    } catch {
      alert("Error al procesar tu respuesta. Intenta de nuevo o llama al taller.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-brand-50 via-background to-muted">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <FixaLogo size="md" variant="icon" />
          <h1 className="text-xl font-extrabold tracking-tight text-foreground">
            {taller.nombre}
          </h1>
          <p className="text-sm text-muted-foreground">
            Orden de trabajo OR-{orden.numero}
          </p>
        </div>

        {/* Vehicle info */}
        <div className="flex items-center justify-center gap-2 text-sm text-foreground">
          <Car className="h-4 w-4" />
          <span className="font-bold tracking-wider">{vehiculo.matricula}</span>
          <span className="text-muted-foreground">
            {[vehiculo.marca, vehiculo.modelo].filter(Boolean).join(" ")}
          </span>
        </div>

        {/* Main card */}
        {resultado ? (
          // Already responded
          <Card className={`border-2 ${resultado === "aprobada" ? "border-emerald-300" : "border-red-300"}`}>
            <CardContent className="p-6 text-center space-y-4">
              <div
                className={`inline-flex h-16 w-16 items-center justify-center rounded-full ${
                  resultado === "aprobada"
                    ? "bg-emerald-100"
                    : "bg-red-100"
                }`}
              >
                {resultado === "aprobada" ? (
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                ) : (
                  <X className="h-8 w-8 text-red-600" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {resultado === "aprobada"
                    ? "Reparación aprobada"
                    : "Reparación rechazada"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {resultado === "aprobada"
                    ? "El taller procederá con la reparación adicional."
                    : "El taller no realizará esta reparación adicional."}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Tu respuesta ha sido registrada. {taller.nombre} ha sido notificado.
              </p>
            </CardContent>
          </Card>
        ) : (
          // Pending decision
          <Card className="border-2 border-amber-300">
            <CardContent className="p-6 space-y-5">
              {/* Alert header */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground">
                    Hemos encontrado algo más
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Mientras revisábamos tu vehículo hemos detectado un problema adicional. Antes de tocarlo, necesitamos tu visto bueno.
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="rounded-xl bg-muted p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <Wrench className="h-3.5 w-3.5" />
                  Descripción
                </div>
                <p className="text-sm text-foreground font-medium leading-relaxed">
                  {averia.descripcion}
                </p>
              </div>

              {/* Photo if exists */}
              {averia.fotoUrl && (
                <Image
                  src={averia.fotoUrl}
                  alt="Foto de la avería"
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-xl border"
                />
              )}

              {/* Cost estimate */}
              {averia.importeEstimado && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-center">
                  <p className="text-xs text-amber-700 font-bold uppercase tracking-wider">
                    Coste estimado
                  </p>
                  <p className="text-2xl font-extrabold text-foreground mt-1">
                    {formatMoney(Number(averia.importeEstimado))}
                  </p>
                  <p className="text-[10px] text-amber-600 mt-1">IVA no incluido</p>
                </div>
              )}

              {/* Legal note */}
              <p className="text-[11px] text-muted-foreground leading-snug">
                Según el RD 1457/1986, el taller debe informarte de averías encontradas durante la reparación y obtener tu conformidad antes de proceder.
              </p>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  onClick={() => handleDecision("rechazada")}
                  disabled={loading}
                  variant="outline"
                  className="h-14 rounded-xl text-sm font-bold border-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                >
                  <X className="mr-1.5 h-4 w-4" />
                  No aprobar
                </Button>
                <Button
                  onClick={() => handleDecision("aprobada")}
                  disabled={loading}
                  className="h-14 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  <Check className="mr-1.5 h-4 w-4" />
                  {loading ? "Procesando..." : "Aprobar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact */}
        {taller.telefono && (
          <div className="space-y-2">
            <p className="text-center text-xs text-muted-foreground">¿Tienes dudas antes de decidir?</p>
            <div className="flex gap-2">
              <a
                href={`tel:${taller.telefono}`}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <Phone className="h-4 w-4" /> Llamar
              </a>
              <a
                href={formatWhatsAppUrl(taller.telefono, `Hola, tengo una duda sobre la avería de la orden OR-${orden.numero}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
              >
                <MessageSquare className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-[10px] text-muted-foreground/60">
          Gestionado con FIXA
        </p>
      </div>
    </div>
  );
}
