"use client";

import { useState } from "react";
import { MessageSquare, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type MensajeTipo = "estado" | "informe" | "presupuesto" | "resena" | "averia";

const MENSAJES_CONFIG: {
  id: MensajeTipo;
  label: string;
  descripcion: string;
  variables: string[];
  default: string;
}[] = [
  {
    id: "estado",
    label: "Estado de la reparación",
    descripcion: "Se envía cuando compartes el estado del coche con el cliente.",
    variables: ["{nombre}", "{marca}", "{modelo}", "{matricula}", "{enlace}"],
    default: "Hola {nombre} 👋\n\nTu {marca} {modelo} está en buenas manos. Y para que no tengas que llamar para saber cómo va, mira esto:\n\n👉 Toca aquí y ve el estado de tu coche en directo:\n{enlace}\n\nCualquier cosa, nos escribes por aquí mismo.",
  },
  {
    id: "informe",
    label: "Informe del trabajo",
    descripcion: "Se envía cuando mandas el informe de la reparación al cliente.",
    variables: ["{nombre}", "{marca}", "{modelo}", "{matricula}", "{enlace}", "{taller}", "{telefono_taller}"],
    default: "Hola {nombre} 👋\n\nYa está listo el informe de tu {marca} {modelo}: todo lo que le hemos hecho, con fotos y detalle. Sin letra pequeña.\n\n👉 Échale un vistazo aquí:\n{enlace}\n\nSi te surge cualquier duda, llámanos: {telefono_taller}\nGracias por confiar en {taller}.",
  },
  {
    id: "presupuesto",
    label: "Presupuesto",
    descripcion: "Se envía cuando compartes un presupuesto con el cliente.",
    variables: ["{nombre}", "{marca}", "{modelo}", "{matricula}", "{enlace}"],
    default: "Hola {nombre} 👋\n\nTe hemos preparado el presupuesto de tu {marca} {modelo}. Sin sorpresas: lo ves, y si te encaja, lo aceptas desde el móvil en un toque.\n\n👉 Aquí lo tienes:\n{enlace}\n\nCualquier duda, nos dices y te lo explicamos.",
  },
  {
    id: "resena",
    label: "Solicitud de reseña",
    descripcion: "Se envía después de entregar el vehículo para pedir una reseña en Google.",
    variables: ["{nombre}", "{taller}", "{enlace_resena}"],
    default: "Hola {nombre} 👋\n\nHa sido un placer cuidar de tu coche. Si te has quedado a gusto, ¿nos echas un cable con una reseña? A ti te cuesta un minuto y a nosotros nos cambia el día.\n\n👉 Aquí mismo:\n{enlace_resena}\n\n¡Gracias de parte de todo el equipo de {taller}!",
  },
  {
    id: "averia",
    label: "Avería oculta",
    descripcion: "Se envía cuando se encuentra un problema adicional durante la reparación.",
    variables: ["{nombre}", "{marca}", "{modelo}", "{matricula}", "{descripcion_averia}", "{coste}", "{enlace}", "{telefono_taller}"],
    default: "Hola {nombre} 👋\n\nMientras revisábamos tu {marca} {modelo} hemos visto algo que conviene que sepas antes de seguir:\n\n{descripcion_averia}\n{coste}\n\nTú decides. Apruébalo o recházalo aquí en un toque:\n👉 {enlace}\n\nSi prefieres que te lo contemos por teléfono, llámanos: {telefono_taller}",
  },
];

export function MensajesWhatsapp({ mensajesActuales }: { mensajesActuales: Record<string, string> }) {
  const [mensajes, setMensajes] = useState<Record<string, string>>(mensajesActuales || {});
  const [editando, setEditando] = useState<MensajeTipo | null>(null);
  const [loading, setLoading] = useState(false);

  function getMensaje(tipo: MensajeTipo): string {
    return mensajes[tipo] || MENSAJES_CONFIG.find((m) => m.id === tipo)?.default || "";
  }

  async function guardar(tipo: MensajeTipo, texto: string) {
    setLoading(true);
    try {
      const updated = { ...mensajes, [tipo]: texto };
      const res = await fetch("/api/taller", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensajesWhatsapp: updated }),
      });
      if (!res.ok) throw new Error();
      setMensajes(updated);
      setEditando(null);
      toast.success("Mensaje guardado");
    } catch {
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  function resetear(tipo: MensajeTipo) {
    const defaultMsg = MENSAJES_CONFIG.find((m) => m.id === tipo)?.default || "";
    setMensajes((prev) => ({ ...prev, [tipo]: defaultMsg }));
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-emerald-600" />
          Mensajes de WhatsApp
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Personaliza los mensajes que se envían a tus clientes. Usa las variables entre llaves para datos dinámicos.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {MENSAJES_CONFIG.map((config) => (
          <div key={config.id} className="rounded-xl border border-stone-200 p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-bold">{config.label}</p>
              <div className="flex gap-1">
                {editando !== config.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 px-2 text-stone-500"
                    onClick={() => setEditando(config.id)}
                  >
                    Editar
                  </Button>
                )}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">{config.descripcion}</p>

            {editando === config.id ? (
              <div className="space-y-2">
                <Textarea
                  value={getMensaje(config.id)}
                  onChange={(e) => setMensajes((prev) => ({ ...prev, [config.id]: e.target.value }))}
                  rows={6}
                  className="rounded-xl text-sm font-mono"
                />
                <div className="flex flex-wrap gap-1">
                  {config.variables.map((v) => (
                    <Badge key={v} variant="outline" className="text-[9px] font-mono cursor-help" title={`Variable: se reemplaza automáticamente`}>
                      {v}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => guardar(config.id, getMensaje(config.id))} disabled={loading} className="rounded-full text-xs">
                    {loading ? "Guardando..." : "Guardar"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditando(null)} className="rounded-full text-xs">
                    Cancelar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => resetear(config.id)} className="rounded-full text-xs text-stone-400">
                    <RotateCcw className="h-3 w-3 mr-1" />Restaurar original
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-500 whitespace-pre-line line-clamp-3 bg-stone-50 rounded-lg p-2">
                {getMensaje(config.id)}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
