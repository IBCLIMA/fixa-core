"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Wrench,
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
  PhoneOff,
  Timer,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Mockup, MockupFrame } from "@/components/ui/mockup";
import Glow from "@/components/ui/glow";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">

      {/* ═══ NAV ═══ */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl line-b">
        <div className="max-w-container mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand shadow-lg shadow-brand/20">
              <Wrench className="h-[18px] w-[18px] text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">FIXA</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/app/hoy" className="hidden sm:block text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              Acceder
            </Link>
            <Link href="/app/hoy">
              <Button className="bg-foreground text-background hover:bg-foreground/90 font-semibold rounded-full px-6 h-10 text-sm">
                Solicitar demo
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <Section className="fade-bottom overflow-hidden pb-0 sm:pb-0 md:pb-0 border-0">
        <div className="max-w-container mx-auto flex flex-col gap-12 pt-16 sm:gap-24">
          <div className="flex flex-col items-center gap-6 text-center sm:gap-10">
            {/* Badge */}
            <div className="animate-appear inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-2">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              <span className="text-xs font-semibold text-brand">
                Creado por un mecánico para mecánicos
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-appear relative z-10 inline-block text-4xl leading-tight font-bold text-balance text-foreground drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-8xl md:leading-tight opacity-0 delay-100">
              Menos interrupciones.
              <br />
              <span className="text-brand">Más taller.</span>
            </h1>

            {/* Description */}
            <p className="text-md animate-appear text-muted-foreground relative z-10 max-w-[640px] font-medium text-balance opacity-0 delay-200 sm:text-xl">
              Responde a tus clientes por WhatsApp en segundos y organiza citas sin coger el teléfono. Desde el móvil. Sin complicaciones.
            </p>

            {/* CTAs */}
            <div className="animate-appear relative z-10 flex flex-col sm:flex-row justify-center gap-3 opacity-0 delay-300">
              <Link href="/app/hoy">
                <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 font-bold h-12 px-8 text-sm rounded-full">
                  Solicitar demo gratuita
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/app/hoy">
                <Button size="lg" variant="outline" className="h-12 px-8 text-sm rounded-full font-semibold">
                  Ver cómo funciona
                </Button>
              </Link>
            </div>

            {/* Trust */}
            <div className="animate-appear flex items-center justify-center gap-6 text-sm text-muted-foreground opacity-0 delay-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Sin permanencia</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Listo en 7 días</span>
            </div>

            {/* Mockup */}
            <div className="relative w-full pt-12">
              <MockupFrame className="animate-appear opacity-0 delay-700" size="small">
                <Mockup type="responsive" className="bg-background/90 w-full rounded-xl border-0">
                  {/* Product UI inside mockup */}
                  <div className="p-4 sm:p-8 w-full" style={{ background: "linear-gradient(180deg, #f8f7f4 0%, #f1f0ed 100%)" }}>
                    <div className="max-w-md mx-auto space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand shadow-sm">
                          <Wrench className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="text-xs font-extrabold">FIXA</span>
                        <span className="ml-auto text-[9px] text-muted-foreground">lunes, 28 abril</span>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Hoy</p>
                        <p className="text-base font-extrabold">Tu taller hoy</p>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { n: "12", l: "Clientes" },
                          { n: "3", l: "Citas" },
                          { n: "8", l: "Mensajes" },
                        ].map((k) => (
                          <div key={k.l} className="rounded-xl bg-white p-2.5 text-center shadow-sm border border-border/50">
                            <p className="text-lg font-extrabold leading-none">{k.n}</p>
                            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">{k.l}</p>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { l: "Coche listo", c: "bg-emerald-500", i: CheckCircle2 },
                          { l: "Presupuesto", c: "bg-blue-500", i: Send },
                          { l: "Pide cita", c: "bg-brand", i: CalendarDays },
                          { l: "Revisión", c: "bg-violet-500", i: Wrench },
                        ].map((a) => (
                          <div key={a.l} className={`flex items-center gap-2 rounded-xl ${a.c} p-2.5 text-white shadow-sm`}>
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20">
                              <a.i className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-[10px] font-bold">{a.l}</span>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-xl bg-white p-3 shadow-sm border border-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 flex-col items-center justify-center rounded-lg bg-muted">
                            <span className="text-[10px] font-extrabold leading-none">09</span>
                            <span className="text-[7px] font-bold text-muted-foreground">:30</span>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold">Antonio García</p>
                            <p className="text-[8px] text-muted-foreground">Revisión de frenos</p>
                          </div>
                        </div>
                        <div className="flex h-6 items-center gap-1 rounded-full bg-emerald-500 px-2 shadow-sm">
                          <Send className="h-2.5 w-2.5 text-white" />
                          <span className="text-[8px] text-white font-bold">Avisar</span>
                        </div>
                      </div>

                      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-[9px] font-semibold text-emerald-700">Mensaje preparado para Antonio</span>
                      </div>
                    </div>
                  </div>
                </Mockup>
              </MockupFrame>
              <Glow variant="top" className="animate-appear-zoom opacity-0 delay-1000" />
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ FEATURES ═══ */}
      <Section>
        <div className="max-w-container mx-auto">
          <div className="text-center space-y-3 mb-16">
            <p className="text-sm font-bold text-brand">Qué hace FIXA</p>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl text-balance">
              Todo lo que necesitas. Nada que sobre.
            </h2>
            <p className="mx-auto max-w-lg text-muted-foreground text-lg">
              Herramientas simples para que te centres en lo que importa.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: MessageSquare, color: "bg-emerald-500", title: "Mensajes en 1 toque", desc: 'Pulsa "Coche listo", elige el cliente, y WhatsApp se abre con el mensaje escrito.', span: "md:col-span-2" },
              { icon: CalendarDays, color: "bg-brand", title: "Citas organizadas", desc: "Fecha, hora y motivo. Ve las de hoy y las próximas.", span: "" },
              { icon: Users, color: "bg-blue-500", title: "Clientes a mano", desc: "Nombre, teléfono, vehículo. Todo en segundos.", span: "" },
              { icon: Wrench, color: "bg-violet-500", title: "Avisos de revisión e ITV", desc: "Tú le avisas con un toque y el trabajo vuelve solo.", span: "md:col-span-2" },
            ].map((f) => (
              <div key={f.title} className={f.span}>
                <div className="glass-2 h-full rounded-2xl p-8 hover:shadow-md transition-all duration-300">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${f.color} shadow-lg mb-5`}>
                    <f.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ PROBLEMA ═══ */}
      <Section>
        <div className="max-w-container mx-auto grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-bold text-brand">El problema</p>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl leading-tight">
              Cada llamada te saca de debajo de un coche
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              El teléfono no para. Los clientes preguntan siempre lo mismo. Y tú pierdes horas que deberías estar facturando.
            </p>
          </div>
          <div className="space-y-3">
            {[
              { icon: PhoneOff, bg: "bg-red-50 border-red-100", ic: "text-red-500", text: '"¿Está listo mi coche?" — La misma pregunta, muchas veces al día.' },
              { icon: Timer, bg: "bg-amber-50 border-amber-100", ic: "text-amber-600", text: '"¿Tenéis cita?" — Buscas hueco, apuntas a mano. Tiempo muerto.' },
              { icon: Clock, bg: "bg-blue-50 border-blue-100", ic: "text-blue-500", text: '"¿Cuándo me toca revisión?" — No se acuerda. Esa revisión nunca llega.' },
            ].map((item) => (
              <div key={item.text} className={`flex items-start gap-4 rounded-2xl border p-5 ${item.bg}`}>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ${item.ic}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed pt-2">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ CÓMO FUNCIONA ═══ */}
      <section className="bg-foreground text-background relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-1/4 h-[400px] w-[500px] rounded-[50%] bg-brand/10 blur-[120px]" />
        <div className="max-w-container mx-auto px-4 py-16 sm:py-24 md:py-32 relative">
          <div className="text-center space-y-3 mb-16">
            <p className="text-sm font-bold text-brand-foreground">Así de fácil</p>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
              Funcionando en 3 pasos
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: "01", title: "Añade tus clientes", desc: "Nombre, teléfono y vehículo. En 30 segundos tienes tu lista." },
              { step: "02", title: "Pulsa un botón", desc: '"Coche listo", "Presupuesto"... Elige la acción y el cliente.' },
              { step: "03", title: "WhatsApp listo", desc: "Se abre con el mensaje escrito. Tú solo pulsas enviar." },
            ].map((item) => (
              <div key={item.step} className="rounded-3xl bg-background/[0.05] border border-background/[0.08] p-8 backdrop-blur-sm hover:bg-background/[0.08] transition-all duration-500">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand shadow-lg shadow-brand/30 mb-6">
                  <span className="text-sm font-extrabold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-background/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SIN COMPLICACIONES ═══ */}
      <Section>
        <div className="max-w-container mx-auto grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=800&q=80"
              alt="Mecánico usando tecnología en taller"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="space-y-6">
            <p className="text-sm font-bold text-brand">Sin complicaciones</p>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl leading-tight">
              Si sabes usar WhatsApp, sabes usar FIXA
            </h2>
            <div className="space-y-3">
              {[
                { icon: ShieldCheck, text: "No cambias cómo trabajas" },
                { icon: Smartphone, text: "Funciona desde el móvil — no necesitas ordenador" },
                { icon: Zap, text: "Lo dejamos todo montado — no tocas nada técnico" },
                { icon: CheckCircle2, text: "En menos de 7 días funcionando" },
                { icon: Car, text: "Sin permanencia — si no te convence, lo dejas" },
              ].map((item) => (
                <div key={item.text} className="glass-2 flex items-center gap-3.5 rounded-2xl p-4 hover:shadow-md transition-all duration-300">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                    <item.icon className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-sm font-medium">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ QUIÉN ═══ */}
      <Section className="bg-muted/50">
        <div className="max-w-container mx-auto">
          <div className="mx-auto max-w-2xl text-center space-y-6">
            <p className="text-sm font-bold text-brand">Quién está detrás</p>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
              Creado desde dentro de un taller
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              FIXA no lo ha creado una empresa de informáticos. Lo ha creado alguien que lleva años gestionando un taller real.
            </p>
            <p className="text-2xl font-extrabold tracking-tight">
              Sabemos lo que necesitas porque lo necesitábamos nosotros.
            </p>
          </div>
        </div>
      </Section>

      {/* ═══ CTA ═══ */}
      <Section className="relative overflow-hidden border-0">
        <Glow variant="center" />
        <div className="max-w-container mx-auto relative">
          <div className="mx-auto max-w-2xl text-center space-y-8">
            <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl leading-tight text-balance">
              Deja de perder tiempo.
              <br />
              <span className="text-brand">Empieza a usar FIXA.</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Te lo enseñamos en 10 minutos y lo tienes funcionando en menos de una semana.
            </p>
            <Link href="/app/hoy">
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 font-bold h-14 px-10 text-base rounded-full shadow-xl">
                Quiero dejar de perder tiempo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              Sin permanencia · Creado por un mecánico para mecánicos
            </p>
          </div>
        </div>
      </Section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-foreground text-background line-t">
        <div className="max-w-container mx-auto px-6 py-10">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-background/10">
                <Wrench className="h-4 w-4 text-background" />
              </div>
              <span className="font-bold">FIXA</span>
              <span className="text-sm text-background/40">Soluciones digitales para talleres</span>
            </div>
            <p className="text-sm text-background/30">FIXA by Ibañez Clima</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
