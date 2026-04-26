"use client";

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

const estadoConfig = {
  pendiente: { label: "Pendiente", color: "bg-zinc-500" },
  en_taller: { label: "En taller", color: "bg-amber-500" },
  listo: { label: "Listo", color: "bg-green-500" },
};

const accionesRapidas = [
  {
    id: "coche_listo",
    label: "Coche listo",
    icon: CheckCircle2,
    color: "bg-green-600 hover:bg-green-700 active:bg-green-800",
    mensaje: "Hola {{nombre}}, tu coche ya está listo para recoger. Puedes pasar cuando quieras. ¡Un saludo!",
  },
  {
    id: "presupuesto",
    label: "Presupuesto preparado",
    icon: FileText,
    color: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800",
    mensaje: "Hola {{nombre}}, ya tenemos el presupuesto preparado para tu vehículo. Llámanos o pásate para revisarlo. ¡Gracias!",
  },
  {
    id: "recordatorio",
    label: "Recordatorio cita",
    icon: CalendarDays,
    color: "bg-amber-600 hover:bg-amber-700 active:bg-amber-800",
    mensaje: "Hola {{nombre}}, te recordamos que tienes cita en el taller mañana. ¡Te esperamos!",
  },
  {
    id: "itv",
    label: "Aviso ITV",
    icon: Bell,
    color: "bg-orange-600 hover:bg-orange-700 active:bg-orange-800",
    mensaje: "Hola {{nombre}}, te avisamos de que la ITV de tu vehículo caduca pronto. ¿Quieres que te hagamos la revisión previa? ¡Llámanos!",
  },
  {
    id: "revision",
    label: "Toca revisión",
    icon: Wrench,
    color: "bg-purple-600 hover:bg-purple-700 active:bg-purple-800",
    mensaje: "Hola {{nombre}}, según nuestros registros, a tu vehículo le toca revisión. ¿Reservamos cita? ¡Un saludo!",
  },
];

export default function HoyPage() {
  function enviarWhatsApp(telefono: string, nombre: string, mensaje: string) {
    const texto = mensaje.replace(/\{\{nombre\}\}/g, nombre.split(" ")[0]);
    window.open(
      `https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`,
      "_blank"
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero — enfoque venta */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Trabaja sin interrupciones
        </h1>
        <p className="text-sm text-muted-foreground">
          Responde a tus clientes sin tocar el teléfono
        </p>
      </div>

      {/* Citas de hoy */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Hoy en el taller
          </h2>
          <Badge variant="secondary" className="text-xs">
            {citasHoy.length} citas
          </Badge>
        </div>

        {citasHoy.map((cita) => {
          const estado = estadoConfig[cita.estado];
          return (
            <Card key={cita.id}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm font-bold">{cita.hora}</span>
                      <span className={`inline-block h-2 w-2 rounded-full ${estado.color}`} />
                      <span className="text-xs text-muted-foreground">
                        {estado.label}
                      </span>
                    </div>
                    <p className="font-medium">{cita.nombre}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Car className="h-3 w-3" />
                      {cita.vehiculo}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {cita.motivo}
                    </p>
                  </div>

                  {/* Botón rápido contextual */}
                  {cita.estado === "listo" && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-xs"
                      onClick={() =>
                        enviarWhatsApp(
                          cita.telefono,
                          cita.nombre,
                          "Hola {{nombre}}, tu coche ya está listo para recoger. Puedes pasar cuando quieras. ¡Un saludo!"
                        )
                      }
                    >
                      <Send className="mr-1 h-3 w-3" />
                      Avisar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Acciones rápidas */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Acciones rápidas
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {accionesRapidas.map((accion) => (
            <Button
              key={accion.id}
              className={`h-16 flex-col gap-1 text-xs font-semibold text-white ${accion.color}`}
              onClick={() =>
                enviarWhatsApp(
                  citasHoy[0].telefono,
                  citasHoy[0].nombre,
                  accion.mensaje
                )
              }
            >
              <accion.icon className="h-5 w-5" />
              {accion.label}
            </Button>
          ))}
        </div>
        <p className="text-center text-[11px] text-muted-foreground">
          Toca un botón → se abre WhatsApp con el mensaje listo
        </p>
      </div>
    </div>
  );
}
