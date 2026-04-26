"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Car,
  Clock,
  CheckCircle2,
  FileText,
  CalendarDays,
  Wrench,
  Send,
  MessageSquare,
  PhoneOff,
  Check,
  ArrowDown,
  PhoneCall,
  Timer,
  Users,
  BarChart3,
  Smartphone,
  Zap,
  Star,
  ShieldCheck,
} from "lucide-react";

const interrupciones = [
  {
    id: "1",
    cliente: "Laura Sánchez",
    pregunta: "¿Está listo mi coche?",
    telefono: "34645678901",
    mensaje: "Hola Laura, tu coche ya está listo para recoger. Puedes pasar cuando quieras. ¡Un saludo!",
  },
  {
    id: "2",
    cliente: "Carlos Ruiz",
    pregunta: "¿Tenéis cita para la semana que viene?",
    telefono: "34656789012",
    mensaje: "Hola Carlos, claro que sí. ¿Qué día te viene mejor? ¡Un saludo!",
  },
  {
    id: "3",
    cliente: "Ana Fernández",
    pregunta: "¿Cuándo me toca revisión?",
    telefono: "34667890123",
    mensaje: "Hola Ana, a tu vehículo le toca revisión. ¿Reservamos cita? ¡Un saludo!",
  },
];

const citasHoy = [
  {
    id: "1",
    hora: "09:30",
    nombre: "Antonio García",
    vehiculo: "4532 HBK",
    motivo: "Revisión de frenos",
    estado: "en_taller" as const,
    telefono: "34612345678",
  },
  {
    id: "2",
    hora: "11:00",
    nombre: "María López",
    vehiculo: "7891 JNM",
    motivo: "Cambio aceite y filtros",
    estado: "listo" as const,
    telefono: "34623456789",
  },
  {
    id: "3",
    hora: "16:30",
    nombre: "Pedro Martínez",
    vehiculo: "2345 FGT",
    motivo: "Ruido en suspensión",
    estado: "pendiente" as const,
    telefono: "34634567890",
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
      window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`, "_blank");
    }, 400);
  }

  function enviarAccion(id: string, mensaje: string) {
    setAccionEnviada(id);
    const texto = mensaje.replace(/\{\{nombre\}\}/g, "Antonio");
    setTimeout(() => {
      window.open(`https://wa.me/${citasHoy[0].telefono}?text=${encodeURIComponent(texto)}`, "_blank");
    }, 600);
    setTimeout(() => setAccionEnviada(null), 2000);
  }

  function scrollToDemo() {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="space-y-8">
      {/* ═══ HERO ═══ */}
      <div className="space-y-4">
        <div className="rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 p-5">
          <div className="flex items-start gap-3">
            <PhoneOff className="mt-1 h-7 w-7 shrink-0 text-amber-500" />
            <div>
              <h1 className="text-xl font-extrabold tracking-tight leading-tight">
                Pierdes horas cada semana atendiendo el teléfono del taller
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                FIXA responde por ti y organiza tus citas sin llamadas
              </p>
              <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-400">
                <Zap className="h-3 w-3" />
                En menos de 7 días funcionando
              </p>
              <Button
                onClick={scrollToDemo}
                className="mt-4 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-black font-semibold"
                size="lg"
              >
                <ArrowDown className="mr-2 h-4 w-4" />
                Ver cómo funciona
              </Button>
            </div>
          </div>
        </div>

        {/* Contador visual */}
        <div className="rounded-lg bg-red-950/20 border border-red-900/20 px-4 py-3 text-center">
          <p className="text-2xl font-extrabold text-red-400">15 llamadas</p>
          <p className="text-xs text-muted-foreground">
            podrías evitar hoy con FIXA
          </p>
        </div>
      </div>

      {/* ═══ LO QUE GANAS ═══ */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Lo que ganas con FIXA
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <Card>
            <CardContent className="flex items-center gap-3 p-3">
              <PhoneCall className="h-5 w-5 shrink-0 text-green-500" />
              <p className="text-xs font-medium">Menos llamadas cada día</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-3">
              <Timer className="h-5 w-5 shrink-0 text-amber-500" />
              <p className="text-xs font-medium">Menos interrupciones trabajando</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-3">
              <Users className="h-5 w-5 shrink-0 text-blue-500" />
              <p className="text-xs font-medium">Clientes atendidos sin perder tiempo</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-3">
              <BarChart3 className="h-5 w-5 shrink-0 text-purple-500" />
              <p className="text-xs font-medium">Más control sin complicarte</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ═══ DEMO: ASÍ FUNCIONA ═══ */}
      <div id="demo" className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Así funciona en 10 segundos
        </h2>
        <p className="text-sm text-muted-foreground">
          El cliente pregunta → tú pulsas un botón → WhatsApp listo
        </p>

        {interrupciones.map((item) => {
          const yaEnviado = enviados.has(item.id);
          return (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="border-b border-border bg-muted/30 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{item.cliente}:</span>
                  </div>
                  <p className="mt-0.5 font-medium text-sm">"{item.pregunta}"</p>
                </div>
                <div className="flex items-center justify-between px-3 py-2.5">
                  {yaEnviado ? (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-xs font-medium text-green-500">Mensaje listo</p>
                        <p className="text-[10px] text-green-500/70">WhatsApp preparado</p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Respuesta lista para enviar</span>
                  )}
                  <Button
                    size="sm"
                    className={`text-xs ${
                      yaEnviado
                        ? "bg-green-600/20 text-green-500 hover:bg-green-600/30"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                    onClick={() => enviarWhatsApp(item.id, item.telefono, item.cliente, item.mensaje)}
                  >
                    {yaEnviado ? (
                      <>
                        <Check className="mr-1 h-3 w-3" />
                        Enviado
                      </>
                    ) : (
                      <>
                        <Send className="mr-1 h-3 w-3" />
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

      {/* ═══ CITAS DE HOY ═══ */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Citas de hoy
          </h2>
          <span className="text-xs text-muted-foreground">{citasHoy.length} vehículos</span>
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
                      {cita.vehiculo}
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
                        "Hola {{nombre}}, tu coche ya está listo. Puedes pasar a recogerlo. ¡Un saludo!"
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

      {/* ═══ ACCIONES RÁPIDAS ═══ */}
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
                  enviado ? "bg-green-600 scale-95" : accion.color
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

      {/* ═══ PRUEBA SOCIAL ═══ */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Talleres como el tuyo ya están evitando llamadas
        </h2>

        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              ))}
            </div>
            <p className="text-sm italic text-foreground/80">
              "Antes no paraba el teléfono. Ahora muchas respuestas salen solas. Mis mecánicos trabajan sin que nadie les interrumpa."
            </p>
            <p className="text-xs text-muted-foreground">
              Taller mecánico · 3 operarios
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              ))}
            </div>
            <p className="text-sm italic text-foreground/80">
              "Nos ahorra tiempo todos los días. Los clientes reciben los avisos sin que tengamos que llamar uno por uno."
            </p>
            <p className="text-xs text-muted-foreground">
              Taller pequeño · 2 operarios
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              ))}
            </div>
            <p className="text-sm italic text-foreground/80">
              "Lo mejor es que no tuve que aprender nada. Me lo dejaron montado y funciona desde el móvil."
            </p>
            <p className="text-xs text-muted-foreground">
              Taller multimarca · 1 operario
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ═══ SIN COMPLICACIONES ═══ */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          No tienes que aprender nada
        </h2>
        <div className="space-y-2">
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-green-500" />
            <p className="text-sm">No cambias cómo trabajas</p>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <Smartphone className="h-5 w-5 shrink-0 text-green-500" />
            <p className="text-sm">No necesitas ordenador — funciona desde el móvil</p>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <Zap className="h-5 w-5 shrink-0 text-green-500" />
            <p className="text-sm">Lo dejamos todo montado — no tocas nada</p>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
            <p className="text-sm">En menos de 7 días funcionando</p>
          </div>
        </div>
      </div>

      {/* ═══ CTA FINAL ═══ */}
      <div className="rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 p-5 text-center space-y-3">
        <p className="text-lg font-extrabold">
          Te lo enseño en 10 minutos y lo tienes funcionando en días
        </p>
        <p className="text-sm text-muted-foreground">
          Menos llamadas · Menos interrupciones · Trabaja sin parar
        </p>
        <Button
          className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-black font-semibold"
          size="lg"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Quiero dejar de perder tiempo
        </Button>
      </div>
    </div>
  );
}
