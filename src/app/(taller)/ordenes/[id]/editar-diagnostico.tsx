"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  const [editandoDesc, setEditandoDesc] = useState(false);
  const [editandoDiag, setEditandoDiag] = useState(false);
  const [descripcion, setDescripcion] = useState(descripcionActual || "");
  const [diagnostico, setDiagnostico] = useState(diagnosticoActual || "");
  const [loading, setLoading] = useState(false);

  async function guardar(campo: "descripcion" | "diagnostico") {
    setLoading(true);
    try {
      const body =
        campo === "diagnostico"
          ? { diagnostico }
          : { descripcion };
      const res = await fetch(`/api/ordenes/${ordenId}/diagnostico`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      toast.success("Guardado");
      if (campo === "diagnostico") setEditandoDiag(false);
      else setEditandoDesc(false);
    } catch {
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Descripción del cliente */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Qué dice el cliente
            </p>
            {!editandoDesc && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs rounded-full text-muted-foreground"
                onClick={() => setEditandoDesc(true)}
              >
                <Pencil className="h-3 w-3 mr-1" />Editar
              </Button>
            )}
          </div>
          {editandoDesc ? (
            <div className="space-y-2">
              <Textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Lo que el cliente describe..."
                rows={3}
                className="rounded-xl text-sm"
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => guardar("descripcion")} disabled={loading} className="rounded-full">
                  <Check className="h-3 w-3 mr-1" />{loading ? "..." : "Guardar"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setEditandoDesc(false); setDescripcion(descripcionActual || ""); }} className="rounded-full">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed">
              {descripcionActual || <span className="text-muted-foreground italic">Sin descripción</span>}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Diagnóstico del mecánico */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Diagnóstico del mecánico
            </p>
            <div className="flex items-center gap-1">
              <VoiceRecorder
                onTranscription={(text) => {
                  setDiagnostico((prev) => (prev ? prev + " " + text : text));
                  setEditandoDiag(true);
                }}
              />
              {!editandoDiag && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs rounded-full text-muted-foreground"
                  onClick={() => setEditandoDiag(true)}
                >
                  <Pencil className="h-3 w-3 mr-1" />{diagnosticoActual ? "Editar" : "Añadir"}
                </Button>
              )}
            </div>
          </div>
          {editandoDiag ? (
            <div className="space-y-2">
              <Textarea
                value={diagnostico}
                onChange={(e) => setDiagnostico(e.target.value)}
                placeholder="Describe lo que has encontrado..."
                rows={3}
                className="rounded-xl text-sm"
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => guardar("diagnostico")} disabled={loading} className="rounded-full">
                  <Check className="h-3 w-3 mr-1" />{loading ? "..." : "Guardar"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setEditandoDiag(false); setDiagnostico(diagnosticoActual || ""); }} className="rounded-full">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed">
              {diagnosticoActual || <span className="text-muted-foreground italic">Sin diagnóstico todavía</span>}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
