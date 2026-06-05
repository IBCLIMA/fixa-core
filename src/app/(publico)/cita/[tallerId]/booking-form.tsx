"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, CheckCircle2, Clock } from "lucide-react";

interface BookingFormProps {
  tallerId: string;
  trabajaSabados: boolean;
  horarioApertura: string;
  horarioCierre: string;
  horarioSabadoApertura: string;
  horarioSabadoCierre: string;
  fechasBloqueadas: string[];
}

export function BookingForm({
  tallerId,
  trabajaSabados,
  horarioApertura,
  horarioCierre,
  horarioSabadoApertura,
  horarioSabadoCierre,
  fechasBloqueadas,
}: BookingFormProps) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [matricula, setMatricula] = useState("");
  const [motivo, setMotivo] = useState("");
  const [fecha, setFecha] = useState("");
  const [horaPreferida, setHoraPreferida] = useState("indiferente");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Min date: tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // Max date: 30 days from now
  const maxDateObj = new Date();
  maxDateObj.setDate(maxDateObj.getDate() + 30);
  const maxDate = maxDateObj.toISOString().split("T")[0];

  // Set of blocked date strings for quick lookup
  const blockedSet = new Set(fechasBloqueadas);

  function validateDate(dateStr: string): string | null {
    const d = new Date(dateStr + "T00:00:00");
    const day = d.getDay();

    // Block Sundays always
    if (day === 0) return "No abrimos los domingos.";

    // Block Saturdays if workshop doesn't work Saturdays
    if (day === 6 && !trabajaSabados) return "No abrimos los sábados.";

    // Block manually blocked or full days
    if (blockedSet.has(dateStr)) return "Este día no hay disponibilidad. Prueba otro día.";

    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Final validation before submit
    if (fecha) {
      const dateError = validateDate(fecha);
      if (dateError) {
        setError(dateError);
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch("/api/cita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tallerId,
          nombre,
          telefono,
          matricula: matricula || undefined,
          motivo,
          fecha,
          horaPreferida,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al solicitar la cita.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <Card className="border-emerald-200 bg-emerald-50/30">
        <CardContent className="p-8 text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mx-auto">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Solicitud enviada</h2>
          <p className="text-sm text-muted-foreground">
            Tu solicitud será confirmada por el taller. Te contactaremos por WhatsApp lo antes posible.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Workshop hours info */}
      <Card className="border-blue-200 bg-blue-50/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-sm space-y-1">
              <p className="font-medium text-blue-900">Horario del taller</p>
              <p className="text-blue-700">
                Lunes a viernes: {horarioApertura} - {horarioCierre}
              </p>
              {trabajaSabados && (
                <p className="text-blue-700">
                  Sábados: {horarioSabadoApertura} - {horarioSabadoCierre}
                </p>
              )}
              {!trabajaSabados && (
                <p className="text-blue-700">Sábados y domingos: cerrado</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre completo"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="612 345 678"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              />
            </div>

            {/* Matrícula */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Matrícula del vehículo <span className="text-xs text-muted-foreground">(opcional)</span>
              </label>
              <input
                type="text"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value.toUpperCase())}
                placeholder="1234 ABC"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              />
            </div>

            {/* Motivo */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Motivo / Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Describe brevemente qué necesitas (ej: revisión de frenos, cambio de aceite...)"
                rows={3}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 resize-none"
              />
            </div>

            {/* Fecha */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Fecha deseada <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={fecha}
                onChange={(e) => {
                  const dateStr = e.target.value;
                  const dateError = validateDate(dateStr);
                  if (dateError) {
                    setError(dateError);
                    return;
                  }
                  setError("");
                  setFecha(dateStr);
                }}
                min={minDate}
                max={maxDate}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              />
            </div>

            {/* Hora preferida */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Hora preferida</label>
              <select
                value={horaPreferida}
                onChange={(e) => setHoraPreferida(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              >
                <option value="manana">Mañana ({horarioApertura} - 13:00)</option>
                <option value="tarde">Tarde (15:00 - {horarioCierre})</option>
                <option value="indiferente">Me da igual</option>
              </select>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold py-3"
            >
              {loading ? (
                "Enviando solicitud..."
              ) : (
                <>
                  <CalendarCheck className="mr-2 h-4 w-4" />
                  Solicitar cita
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Tu solicitud será confirmada por el taller. Te contactaremos por WhatsApp.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
