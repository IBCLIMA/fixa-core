"use client";

import { useState } from "react";
import { AlertTriangle, Check, X, Phone, Car, Wrench, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FixaLogo } from "@/components/ui/fixa-logo";
import { responderAveria } from "@/app/(taller)/actions/averias-ocultas";

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
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, #fff7ed 0%, #faf9f7 40%, #f5f3f0 100%)",
      }}
    >
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <FixaLogo size="md" variant="icon" />
          <h1 className="text-xl font-extrabold tracking-tight text-stone-900">
            {taller.nombre}
          </h1>
          <p className="text-sm text-stone-500">
            Orden de trabajo OR-{orden.numero}
          </p>
        </div>

        {/* Vehicle info */}
        <div className="flex items-center justify-center gap-2 text-sm text-stone-600">
          <Car className="h-4 w-4" />
          <span className="font-bold tracking-wider">{vehiculo.matricula}</span>
          <span className="text-stone-400">
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
                <h2 className="text-lg font-bold text-stone-900">
                  {resultado === "aprobada"
                    ? "Reparación aprobada"
                    : "Reparación rechazada"}
                </h2>
                <p className="text-sm text-stone-500 mt-1">
                  {resultado === "aprobada"
                    ? "El taller procederá con la reparación adicional."
                    : "El taller no realizará esta reparación adicional."}
                </p>
              </div>
              <p className="text-xs text-stone-400">
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
                  <h2 className="font-bold text-stone-900">
                    Avería adicional encontrada
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Durante la revisión de tu vehículo, hemos detectado un problema adicional que requiere tu aprobación.
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="rounded-xl bg-stone-50 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-wider">
                  <Wrench className="h-3.5 w-3.5" />
                  Descripción
                </div>
                <p className="text-sm text-stone-800 font-medium leading-relaxed">
                  {averia.descripcion}
                </p>
              </div>

              {/* Photo if exists */}
              {averia.fotoUrl && (
                <img
                  src={averia.fotoUrl}
                  alt="Foto de la avería"
                  className="w-full rounded-xl border"
                />
              )}

              {/* Cost estimate */}
              {averia.importeEstimado && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-center">
                  <p className="text-xs text-amber-700 font-bold uppercase tracking-wider">
                    Coste estimado
                  </p>
                  <p className="text-2xl font-extrabold text-stone-900 mt-1">
                    {Number(averia.importeEstimado).toFixed(2)}EUR
                  </p>
                  <p className="text-[10px] text-amber-600 mt-1">IVA no incluido</p>
                </div>
              )}

              {/* Legal note */}
              <p className="text-[11px] text-stone-400 leading-snug">
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
          <div className="text-center">
            <a
              href={`tel:${taller.telefono}`}
              className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 transition-colors"
            >
              <Phone className="h-4 w-4" />
              ¿Dudas? Llama al {taller.telefono}
            </a>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-[10px] text-stone-300">
          Gestionado con FIXA
        </p>
      </div>
    </div>
  );
}
