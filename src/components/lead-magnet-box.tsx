"use client";

import { useState } from "react";
import { FileText, Download, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@vercel/analytics";

/**
 * Lead magnet: email a cambio de la plantilla de OR (RD 1457/1986) en PDF.
 */
export function LeadMagnetBox() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fuente: "plantilla-or", consent }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "" }));
        setError(data.error || "Error al enviar. Inténtalo de nuevo.");
        return;
      }
      track("lead_plantilla_or");
      setDone(true);
      // Descargar el PDF
      window.location.href = "/api/plantilla-or";
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="my-10 rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50/50 p-6 not-prose">
      <div className="flex items-start gap-4">
        <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500 shadow-lg shadow-orange-500/25">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-stone-900">
            Descarga gratis la plantilla de Orden de Reparación
          </p>
          <p className="text-sm text-stone-600 mt-1">
            En PDF, lista para imprimir y conforme al RD 1457/1986: campos legales,
            renuncia a presupuesto, daños preexistentes y firmas.
          </p>

          {done ? (
            <div className="flex items-center gap-2 mt-4 text-emerald-700 font-bold text-sm">
              <CheckCircle2 className="h-5 w-5" />
              ¡Descargando! Si no empieza,{" "}
              <a href="/api/plantilla-or" className="underline">pulsa aquí</a>.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="flex-1 h-11 rounded-xl border border-orange-200 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
                <Button
                  type="submit"
                  disabled={loading || !consent}
                  className="h-11 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold px-6 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Download className="mr-1.5 h-4 w-4" />
                      Descargar
                    </>
                  )}
                </Button>
              </div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-orange-600 cursor-pointer"
                />
                <span className="text-xs text-stone-500 leading-relaxed">
                  Acepto recibir la plantilla y consejos para talleres por email, según la{" "}
                  <a href="/privacidad" target="_blank" rel="noopener noreferrer" className="underline text-orange-600">
                    política de privacidad
                  </a>
                  . Date de baja cuando quieras.
                </span>
              </label>
              {error && <p className="text-xs text-red-600">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
