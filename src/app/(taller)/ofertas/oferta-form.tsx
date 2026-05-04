"use client";

import { useState } from "react";
import { Send, MessageSquare, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { generarLinksOferta } from "../actions/ofertas";
import { toast } from "sonner";

const plantillas = [
  { id: "aceite", label: "Cambio de aceite", mensaje: "Hola {{nombre}}, este mes tenemos oferta en cambio de aceite y filtros. ¿Te reservamos cita? ¡Un saludo!" },
  { id: "revision", label: "Revisión general", mensaje: "Hola {{nombre}}, ¿hace cuánto no revisas tu coche? Tenemos revisión general a precio especial. ¡Pide cita!" },
  { id: "neumaticos", label: "Neumáticos", mensaje: "Hola {{nombre}}, es época de cambio de neumáticos. Tenemos ofertas especiales. ¿Te interesa? ¡Llámanos!" },
  { id: "preitv", label: "Pre-ITV", mensaje: "Hola {{nombre}}, ¿tu ITV está al día? Hacemos revisión pre-ITV para que la pases a la primera. ¡Reserva ya!" },
];

interface LinkOferta {
  id: string;
  nombre: string;
  telefono: string;
  url: string;
}

export function OfertaForm({ totalClientes }: { totalClientes: number }) {
  const [mensaje, setMensaje] = useState("");
  const [links, setLinks] = useState<LinkOferta[]>([]);
  const [loading, setLoading] = useState(false);
  const [generado, setGenerado] = useState(false);

  async function handleGenerar() {
    if (!mensaje.trim()) { toast.error("Escribe un mensaje"); return; }
    setLoading(true);
    try {
      const result = await generarLinksOferta(mensaje);
      setLinks(result);
      setGenerado(true);
      toast.success(`${result.length} mensajes preparados`);
    } catch {
      toast.error("Error al generar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {!generado ? (
        <>
          {/* Plantillas */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Plantillas rápidas</Label>
            <div className="grid grid-cols-2 gap-2">
              {plantillas.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setMensaje(p.mensaje)}
                  className="rounded-xl border border-stone-200 bg-white p-3 text-left text-xs font-medium text-stone-700 hover:border-orange-300 hover:bg-orange-50 transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mensaje */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Mensaje</Label>
            <Textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder='Hola {{nombre}}, te escribimos desde el taller...'
              rows={4}
              className="rounded-xl"
            />
            <p className="text-[10px] text-stone-400">
              Usa {"{{nombre}}"} para personalizar con el nombre de cada cliente
            </p>
          </div>

          {/* Preview */}
          {mensaje && (
            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-bold text-stone-500 mb-2">Vista previa</p>
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                  <p className="text-sm text-emerald-900/80">
                    {mensaje.replace(/\{\{nombre\}\}/g, "Antonio")}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enviar */}
          <Button onClick={handleGenerar} disabled={loading || !mensaje.trim()} className="w-full h-12 rounded-xl font-bold text-base">
            <Send className="mr-2 h-4 w-4" />
            {loading ? "Preparando..." : `Preparar envío a ${totalClientes} clientes`}
          </Button>
        </>
      ) : (
        <>
          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardContent className="p-4 text-center">
              <p className="font-bold text-emerald-800">{links.length} mensajes listos para enviar</p>
              <p className="text-xs text-emerald-600 mt-1">Haz clic en cada cliente para abrir WhatsApp con el mensaje</p>
            </CardContent>
          </Card>

          <div className="space-y-2">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                className="flex items-center justify-between rounded-xl bg-white border border-stone-200 p-3 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all"
              >
                <div>
                  <p className="text-sm font-medium">{link.nombre}</p>
                  <p className="text-xs text-stone-400">{link.telefono}</p>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <MessageSquare className="h-4 w-4" />
                  <ExternalLink className="h-3 w-3" />
                </div>
              </a>
            ))}
          </div>

          <Button variant="outline" onClick={() => { setGenerado(false); setLinks([]); }} className="w-full rounded-xl">
            Nueva oferta
          </Button>
        </>
      )}
    </div>
  );
}
