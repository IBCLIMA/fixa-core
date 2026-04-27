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
  CalendarDays,
  Users,
  Star,
  ChevronRight,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ═══════════════════════════════════════════ */}
      {/* NAV */}
      {/* ═══════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-amber-500" />
            <span className="text-lg font-extrabold tracking-tight">FIXA</span>
          </div>
          <Link href="/app/hoy">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
              Probar ahora
            </Button>
          </Link>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════ */}
      {/* HERO */}
      {/* ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Glow orbs */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-amber-500/5 blur-[120px]" />
        <div className="pointer-events-none absolute top-20 -right-40 h-[300px] w-[300px] rounded-full bg-amber-500/10 blur-[100px]" />

        <div className="mx-auto max-w-5xl px-5 pb-20 pt-16 lg:pt-24 lg:pb-28">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs font-semibold text-amber-500">
                Creado por un mecánico para mecánicos
              </span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight leading-[1.1] lg:text-5xl">
              Tu taller no necesita más llamadas.
              <br />
              <span className="text-amber-500">Necesita FIXA.</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Prepara respuestas de WhatsApp en un clic, organiza citas sin
              coger el teléfono, y deja de perder horas cada semana repitiendo
              lo mismo.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/app/hoy">
                <Button
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold h-12 px-6 text-base"
                >
                  Ver cómo funciona
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <span className="text-sm text-muted-foreground">
                Sin permanencia · Funcionando en 7 días
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* STATS */}
      {/* ═══════════════════════════════════════════ */}
      <section className="border-y border-border/50 bg-card/50">
        <div className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-border/50 lg:grid-cols-4">
          {[
            { value: "10s", label: "para responder a un cliente" },
            { value: "0", label: "llamadas innecesarias" },
            { value: "100%", label: "desde el móvil" },
            { value: "7 días", label: "para tenerlo funcionando" },
          ].map((stat) => (
            <div key={stat.label} className="px-5 py-6 text-center lg:py-8">
              <p className="text-2xl font-extrabold text-amber-500 lg:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground lg:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* PROBLEMA */}
      {/* ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-5 py-16 lg:py-24">
        <div className="mx-auto max-w-2xl text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">
            El problema
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
            ¿Cuántas veces al día te interrumpen para lo mismo?
          </h2>
          <p className="text-muted-foreground text-lg">
            El teléfono no para. Los clientes preguntan siempre lo mismo.
            Y tú pierdes horas que deberías estar debajo de un coche.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Phone,
              title: '"¿Está listo mi coche?"',
              desc: "La misma pregunta, 15 veces al día. Cada llamada te saca de debajo del coche.",
            },
            {
              icon: CalendarDays,
              title: '"¿Tenéis cita?"',
              desc: "Buscas hueco, miras la agenda, apuntas a mano. Tiempo que no facturas.",
            },
            {
              icon: Clock,
              title: '"¿Cuándo me toca revisión?"',
              desc: "El cliente no se acuerda. Tú tampoco. Y esa revisión no llega.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border bg-card p-6 space-y-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                <item.icon className="h-5 w-5 text-red-400" />
              </div>
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* SOLUCIÓN — FEATURES */}
      {/* ═══════════════════════════════════════════ */}
      <section className="bg-card/50 border-y border-border/50">
        <div className="mx-auto max-w-5xl px-5 py-16 lg:py-24">
          <div className="mx-auto max-w-2xl text-center space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">
              La solución
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
              FIXA te quita trabajo de encima
            </h2>
            <p className="text-muted-foreground text-lg">
              No es un software complejo. Es una herramienta rápida que se usa
              desde el móvil en el taller.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: MessageSquare,
                color: "bg-green-500/10 text-green-500",
                title: "Mensajes en 1 toque",
                desc: 'Pulsa "Coche listo", elige el cliente, y WhatsApp se abre con el mensaje escrito. Tú solo pulsas enviar.',
              },
              {
                icon: CalendarDays,
                color: "bg-amber-500/10 text-amber-500",
                title: "Citas organizadas",
                desc: "Crea citas con fecha, hora y motivo. Ve las de hoy y las próximas de un vistazo.",
              },
              {
                icon: Users,
                color: "bg-blue-500/10 text-blue-500",
                title: "Clientes al alcance",
                desc: "Tu lista de clientes con nombre, teléfono y vehículo. Añadir, editar o enviar mensaje en segundos.",
              },
              {
                icon: Wrench,
                color: "bg-purple-500/10 text-purple-500",
                title: "Avisos de revisión e ITV",
                desc: "Prepara avisos de revisión o ITV para tus clientes. Un toque y el mensaje está listo.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border bg-background p-6 space-y-3 transition-colors hover:border-amber-500/30"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.color}`}
                >
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* CÓMO FUNCIONA */}
      {/* ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-5 py-16 lg:py-24">
        <div className="mx-auto max-w-2xl text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">
            Así de fácil
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
            Funcionando en 3 pasos
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            {
              step: "01",
              title: "Añade tus clientes",
              desc: "Nombre, teléfono y vehículo. En 30 segundos tienes tu lista.",
            },
            {
              step: "02",
              title: "Pulsa un botón",
              desc: '"Coche listo", "Presupuesto preparado", "Pide cita"... Elige la acción y el cliente.',
            },
            {
              step: "03",
              title: "WhatsApp listo",
              desc: "Se abre WhatsApp con el mensaje escrito. Tú solo pulsas enviar. Menos de 10 segundos.",
            },
          ].map((item) => (
            <div key={item.step} className="relative space-y-3">
              <span className="text-5xl font-extrabold text-amber-500/20">
                {item.step}
              </span>
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* SIN COMPLICACIONES */}
      {/* ═══════════════════════════════════════════ */}
      <section className="bg-card/50 border-y border-border/50">
        <div className="mx-auto max-w-5xl px-5 py-16 lg:py-24">
          <div className="mx-auto max-w-2xl text-center space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">
              Sin complicaciones
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
              No tienes que aprender nada
            </h2>
            <p className="text-muted-foreground text-lg">
              Si sabes usar WhatsApp, sabes usar FIXA.
            </p>
          </div>

          <div className="mt-12 mx-auto max-w-lg space-y-3">
            {[
              {
                icon: ShieldCheck,
                text: "No cambias cómo trabajas",
              },
              {
                icon: Smartphone,
                text: "Funciona desde el móvil — no necesitas ordenador",
              },
              {
                icon: Zap,
                text: "Lo dejamos todo montado — no tocas nada técnico",
              },
              {
                icon: CheckCircle2,
                text: "En menos de 7 días funcionando en tu taller",
              },
              {
                icon: Car,
                text: "Sin permanencia — si no te convence, lo dejas",
              },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-4 rounded-lg border border-border bg-background p-4"
              >
                <item.icon className="h-5 w-5 shrink-0 text-green-500" />
                <p className="text-sm font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* QUIÉN ESTÁ DETRÁS */}
      {/* ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-5 py-16 lg:py-24">
        <div className="mx-auto max-w-2xl text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">
            Quién está detrás
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
            Creado desde dentro de un taller
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            FIXA no lo ha creado una empresa de informáticos que imagina cómo
            funciona un taller. Lo ha creado alguien que lleva años gestionando
            un taller real, atendiendo clientes reales, y que estaba harto de
            perder tiempo con el teléfono.
          </p>
          <p className="text-muted-foreground">
            Sabemos lo que necesitas porque lo necesitábamos nosotros.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* CTA FINAL */}
      {/* ═══════════════════════════════════════════ */}
      <section className="border-t border-border/50">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent" />
          <div className="mx-auto max-w-5xl px-5 py-20 lg:py-28">
            <div className="mx-auto max-w-2xl text-center space-y-6">
              <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
                Deja de perder tiempo.
                <br />
                <span className="text-amber-500">Empieza a usar FIXA.</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Te lo enseñamos en 10 minutos y lo tienes funcionando en tu
                taller en menos de una semana.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href="/app/hoy">
                  <Button
                    size="lg"
                    className="bg-amber-500 hover:bg-amber-600 text-black font-semibold h-12 px-8 text-base"
                  >
                    Quiero dejar de perder tiempo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-muted-foreground">
                Creado por un mecánico para mecánicos · Sin permanencia · Sin
                complicaciones
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* FOOTER */}
      {/* ═══════════════════════════════════════════ */}
      <footer className="border-t border-border/50 bg-card/50">
        <div className="mx-auto max-w-5xl px-5 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-bold">FIXA</span>
              <span className="text-xs text-muted-foreground">
                Soluciones digitales para talleres
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              FIXA by Ibañez Clima
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
