"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Clock,
  CheckCircle2,
  FileText,
  CalendarDays,
  Bell,
  Wrench,
  Send,
  MessageSquare,
  PhoneOff,
  Check,
} from "lucide-react";

const citasHoy = [
  {
    id: "1",
    hora: "09:30",
    nombre: "Antonio García",
    vehiculo: "Seat León — 4532 HBK",
    motivo: "Revisión de frenos",
    estado: "en_taller" as const,
    telefono: "34612345678",
  },
  {
    id: "2",
    hora: "11:00",
    nombre: "María López",
    vehiculo: "Renault Clio — 7891 JNM",
    motivo: "Cambio aceite y filtros",
    estado: "listo" as const,
    telefono: "34623456789",
  },
  {
    id: "3",
    hora: "16:30",
    nombre: "Pedro Martínez",
    vehiculo: "VW Golf — 2345 FGT",
    motivo: "Ruido en suspensión",
    estado: "pendiente" as const,
    telefono: "34634567890",
  },
];

const interrupciones = [
  {
    id: "1",
    cliente: "Laura Sánchez",
    pregunta: "¿Está listo mi coche?",
    respuesta: "Respuesta automática disponible",
    boton: "Coche listo",
    color: "text-green-500",
    telefono: "34645678901",
    mensaje: "Hola Laura, tu coche ya está listo para recoger. Puedes pasar cuando quieras. ¡Un saludo!",
  },
  {
    id: "2",
    cliente: "Carlos Ruiz",
    pregunta: "¿Tenéis cita para la semana que viene?",
    respuesta: "Link de cita listo para enviar",
    boton: "Enviar cita",
    color: "text-amber-500",
    telefono: "34656789012",
    mensaje: "Hola Carlos, claro que sí. Puedes reservar tu cita aquí. ¿Qué día te viene mejor? ¡Un saludo!",
  },
  {
    id: "3",
    cliente: "Ana Fernández",
    pregunta: "¿Cuándo me toca revisión?",
    respuesta: "Aviso automático preparado",
    boton: "Enviar aviso",
    color: "text-purple-500",
    telefono: "34667890123",
    mensaje: "Hola Ana, según nuestros registros, a tu vehículo le toca revisión. ¿Reservamos cita? ¡Un saludo!",
  },
];

const estadoConfig = {
  pendiente: { label: "Esperando", color: "bg-zinc-500" },
  en_taller: { label: "En taller", color: "bg-amber-500" },
  listo: { label: "Listo", color: "bg-green-500" },
};

const accionesRapidas = [
  {
    id: "coche_listo",
    label: "Coche listo",
    sub: "1 clic → cliente avisado",
    icon: CheckCircle2,
    color: "bg-green-600 hover:bg-green-700 active:bg-green-800",
    mensaje: "Hola {{nombre}}, tu coche ya está listo para recoger. Puedes pasar cuando quieras. ¡Un saludo!",
  },
  {
    id: "presupuesto",
    label: "Presupuesto listo",
    sub: "sin llamar, sin esperar",
    icon: FileText,
    color: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800",
    mensaje: "Hola {{nombre}}, ya tenemos el presupuesto preparado. Pásate o llámanos para revisarlo. ¡Gracias!",
  },
  {
    id: "pide_cita",
    label: "Pide cita aquí",
    sub: "el cliente reserva solo",
    icon: CalendarDays,
    color: "bg-amber-600 hover:bg-amber-700 active:bg-amber-800",
    mensaje: "Hola {{nombre}}, puedes pedir cita en nuestro taller cuando quieras. ¿Qué día te viene mejor? ¡Un saludo!",
  },
  {
    id: "revision",
    label: "Te toca revisión",
    sub: "genera trabajo automático",
    icon: Wrench,
    color: "bg-purple-600 hover:bg-purple-700 active:bg-purple-800",
    mensaje: "Hola {{nombre}}, a tu vehículo le toca revisión. ¿Reservamos cita? ¡Un saludo!",
  },
];

export default function HoyPage() {
  const [enviados, setEnviados] = useState<Set<string>>(new Set());
  const [accionEnviada, setAccionEnviada] = useState<string | null>(null);

  function enviarWhatsApp(id: string, telefono: string, nombre: string, mensaje: string) {
    const texto = mensaje.replace(/\{\{nombre\}\}/g, nombre.split(" ")[0]);
    setEnviados((prev) => new Set(prev).add(id));
    setTimeout(() => {
      window.open(
        `https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`,
        "_blank"
      );
    }, 400);
  }

  function enviarAccion(id: string, mensaje: string) {
    setAccionEnviada(id);
    const texto = mensaje.replace(/\{\{nombre\}\}/g, "Antonio");
    setTimeout(() => {
      window.open(
        `https://wa.me/${citasHoy[0].telefono}?text=${encodeURIComponent(texto)}`,
        "_blank"
      );
    }, 600);
    setTimeout(() => setAccionEnviada(null), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Hero — impacto inmediato */}
      <div className="rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 p-4">
        <div className="flex items-start gap-3">
          <PhoneOff className="mt-0.5 h-6 w-6 shrink-0 text-amber-500" />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">
              Deja de coger el teléfono 50 veces al día
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              FIXA responde a tus clientes por ti
            </p>
          </div>
        </div>
      </div>

      {/* Simulación real — LO QUE ESTÁ PASANDO AHORA */}
      <div className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Lo que está pasando ahora
        </h2>

        {interrupciones.map((item) => {
          const yaEnviado = enviados.has(item.id);
          return (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Pregunta del cliente */}
                <div className="border-b border-border bg-muted/30 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{item.cliente} pregunta:</span>
                  </div>
                  <p className="mt-0.5 font-medium text-sm">"{item.pregunta}"</p>
                </div>

                {/* Respuesta FIXA */}
                <div className="flex items-center justify-between px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    {yaEnviado ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Send className={`h-4 w-4 ${item.color}`} />
                    )}
                    <span className={`text-xs ${yaEnviado ? "text-green-500 font-medium" : "text-muted-foreground"}`}>
                      {yaEnviado ? "Mensaje preparado · WhatsApp listo" : item.respuesta}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant={yaEnviado ? "ghost" : "default"}
                    className={`text-xs ${yaEnviado ? "text-green-500" : "bg-green-600 hover:bg-green-700"}`}
                    onClick={() =>
                      enviarWhatsApp(item.id, item.telefono, item.cliente, item.mensaje)
                    }
                  >
                    {yaEnviado ? (
                      <>
                        <Check className="mr-1 h-3 w-3" />
                        Enviado
                      </>
                    ) : (
                      <>
                        Responder
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Citas de hoy */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Citas de hoy
          </h2>
          <span className="text-xs text-muted-foreground">
            {citasHoy.length} vehículos
          </span>
        </div>

        {citasHoy.map((cita) => {
          const estado = estadoConfig[cita.estado];
          return (
            <Card key={cita.id}>
              <CardContent className="flex items-center justify-between p-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${estado.color}`} />
                    <span className="font-medium text-sm">{cita.nombre}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {cita.hora}
                    </span>
                    <span className="flex items-center gap-1">
                      <Car className="h-3 w-3" />
                      {cita.vehiculo.split("—")[1]?.trim()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{cita.motivo}</p>
                </div>

                {cita.estado === "listo" && (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-xs"
                    onClick={() =>
                      enviarWhatsApp(
                        `cita-${cita.id}`,
                        cita.telefono,
                        cita.nombre,
                        "Hola {{nombre}}, tu coche ya está listo. Puedes pasar a recogerlo cuando quieras. ¡Un saludo!"
                      )
                    }
                  >
                    <Send className="mr-1 h-3 w-3" />
                    Avisar
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Acciones rápidas */}
      <div className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Responde en 1 clic
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {accionesRapidas.map((accion) => {
            const enviado = accionEnviada === accion.id;
            return (
              <Button
                key={accion.id}
                className={`h-20 flex-col gap-0.5 text-white transition-all ${
                  enviado
                    ? "bg-green-600 scale-95"
                    : accion.color
                }`}
                onClick={() => enviarAccion(accion.id, accion.mensaje)}
              >
                {enviado ? (
                  <>
                    <Check className="h-5 w-5" />
                    <span className="text-xs font-semibold">WhatsApp listo</span>
                  </>
                ) : (
                  <>
                    <accion.icon className="h-5 w-5" />
                    <span className="text-xs font-semibold">{accion.label}</span>
                    <span className="text-[10px] opacity-70">{accion.sub}</span>
                  </>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Footer de valor */}
      <div className="rounded-lg bg-muted/30 border border-border p-3 text-center">
        <p className="text-xs text-muted-foreground">
          Menos llamadas · Menos interrupciones · Trabaja sin parar
        </p>
      </div>
    </div>
  );
}
