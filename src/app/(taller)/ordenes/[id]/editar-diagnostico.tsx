"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { VoiceRecorder } from "@/components/voice-recorder";

export function EditarDiagnostico({
  ordenId,
  diagnosticoActual,
  descripcionActual,
}: {
  ordenId: string;
  diagnosticoActual: string | null;
  descripcionActual: string | null;
}) {
  const [descripcion, setDescripcion] = useState(descripcionActual || "");
  const [diagnostico, setDiagnostico] = useState(diagnosticoActual || "");
  const descRef = useRef(descripcionActual || "");
  const diagRef = useRef(diagnosticoActual || "");

  async function guardar(campo: "descripcion" | "diagnostico", valor: string) {
    // Skip if unchanged
    const ref = campo === "descripcion" ? descRef : diagRef;
    if (valor === ref.current) return;
    ref.current = valor;

    try {
      const body = campo === "diagnostico" ? { diagnostico: valor } : { descripcion: valor };
      const res = await fetch(`/api/ordenes/${ordenId}/diagnostico`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      toast.success("Guardado", { duration: 1500 });
    } catch {
      toast.error("Error al guardar");
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Descripción del cliente */}
      <Card>
        <CardContent className="p-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Qué dice el cliente
          </p>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            onBlur={() => guardar("descripcion", descripcion)}
            placeholder="Toca para escribir lo que dice el cliente..."
            rows={3}
            className="w-full text-sm leading-relaxed bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/50 placeholder:italic"
          />
        </CardContent>
      </Card>

      {/* Diagnóstico del mecánico */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Diagnóstico del mecánico
            </p>
            <VoiceRecorder
              onTranscription={(text) => {
                setDiagnostico((prev) => (prev ? prev + " " + text : text));
              }}
            />
          </div>
          <textarea
            value={diagnostico}
            onChange={(e) => setDiagnostico(e.target.value)}
            onBlur={() => guardar("diagnostico", diagnostico)}
            placeholder="Toca para escribir el diagnóstico..."
            rows={3}
            className="w-full text-sm leading-relaxed bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/50 placeholder:italic"
          />
        </CardContent>
      </Card>
    </div>
  );
}
