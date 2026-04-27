import Link from "next/link";
import {
  Wrench,
  PhoneOff,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
  Smartphone,
  Zap,
  ShieldCheck,
  Clock,
  Send,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8 space-y-10">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Wrench className="h-5 w-5 text-amber-500" />
        <span className="text-lg font-extrabold tracking-tight">FIXA</span>
      </div>

      {/* Hero */}
      <div className="space-y-4">
        <h1 className="text-2xl font-extrabold tracking-tight leading-tight">
          Si no paras de coger el teléfono en el taller, esto es para ti
        </h1>
        <p className="text-muted-foreground">
          FIXA te prepara respuestas en un clic y te ayuda a organizar
          citas sin llamadas. Desde el móvil. Sin complicaciones.
        </p>
        <div className="flex items-center gap-2">
          <Link href="/app/hoy">
            <Button
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              size="lg"
            >
              Ver cómo funciona
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          Creado por un mecánico para mecánicos
        </p>
      </div>

      {/* Problema */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          ¿Te suena esto?
        </h2>
        <Card className="border-red-900/30 bg-red-950/10">
          <CardContent className="p-4 space-y-2.5">
            <div className="flex items-start gap-3">
              <PhoneOff className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
              <div className="space-y-2 text-sm">
                <p>El teléfono no para de sonar mientras trabajas</p>
                <p>Clientes preguntando siempre lo mismo: "¿Está listo?"</p>
                <p>Pierdes tiempo respondiendo en vez de reparando</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cómo funciona */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Así funciona
        </h2>

        <div className="space-y-2">
          <Card>
            <CardContent className="flex items-center gap-3 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-sm font-bold text-amber-500">
                1
              </div>
              <div>
                <p className="text-sm font-medium">El cliente pregunta algo</p>
                <p className="text-xs text-muted-foreground">"¿Está listo mi coche?"</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-sm font-bold text-amber-500">
                2
              </div>
              <div>
                <p className="text-sm font-medium">Tú pulsas un botón</p>
                <p className="text-xs text-muted-foreground">Sin escribir nada, sin llamar</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-sm font-bold text-green-500">
                3
              </div>
              <div>
                <p className="text-sm font-medium">WhatsApp enviado</p>
                <p className="text-xs text-muted-foreground">El cliente recibe la respuesta al instante</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Beneficios */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Lo que ganas
        </h2>
        <div className="space-y-2">
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <Clock className="h-5 w-5 shrink-0 text-green-500" />
            <p className="text-sm">Menos llamadas cada día</p>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <Car className="h-5 w-5 shrink-0 text-green-500" />
            <p className="text-sm">Clientes informados sin interrumpirte</p>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <Send className="h-5 w-5 shrink-0 text-green-500" />
            <p className="text-sm">Avisos de ITV y revisión que generan trabajo</p>
          </div>
        </div>
      </div>

      {/* Sin complicaciones */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          No tienes que aprender nada
        </h2>
        <div className="space-y-2">
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-amber-500" />
            <p className="text-sm">No cambias cómo trabajas</p>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <Smartphone className="h-5 w-5 shrink-0 text-amber-500" />
            <p className="text-sm">Funciona desde el móvil — no necesitas ordenador</p>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <Zap className="h-5 w-5 shrink-0 text-amber-500" />
            <p className="text-sm">Lo dejamos todo montado — en menos de 7 días funcionando</p>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-amber-500" />
            <p className="text-sm">Sin permanencia — si no te convence, lo dejas</p>
          </div>
        </div>
      </div>

      {/* CTA final */}
      <div className="rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 p-5 text-center space-y-3">
        <p className="text-lg font-extrabold">
          Te lo enseño en 10 minutos y lo tienes funcionando en días
        </p>
        <Link href="/app/hoy">
          <Button
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
            size="lg"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Quiero dejar de perder tiempo
          </Button>
        </Link>
        <p className="text-xs text-muted-foreground">
          Creado por un mecánico para mecánicos · Sin permanencia
        </p>
      </div>
    </div>
  );
}
