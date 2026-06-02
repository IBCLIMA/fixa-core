"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, CheckCircle2 } from "lucide-react";

export function BookingForm({ tallerId }: { tallerId: string }) {
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
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
          <h2 className="text-xl font-extrabold tracking-tight">Cita solicitada</h2>
          <p className="text-sm text-muted-foreground">
            Te confirmaremos por WhatsApp. Si necesitas cambiar algo, llama al taller directamente.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
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
                const d = new Date(e.target.value + "T00:00:00");
                const day = d.getDay();
                if (day === 0 || day === 6) {
                  setError("Selecciona un día entre lunes y viernes.");
                  return;
                }
                setError("");
                setFecha(e.target.value);
              }}
              min={minDate}
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
              <option value="manana">Mañana (9-13h)</option>
              <option value="tarde">Tarde (15-19h)</option>
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
              "Solicitando..."
            ) : (
              <>
                <CalendarCheck className="mr-2 h-4 w-4" />
                Solicitar cita
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Te confirmaremos la cita por WhatsApp lo antes posible
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
