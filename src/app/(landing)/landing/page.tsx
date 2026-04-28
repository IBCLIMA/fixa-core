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
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn, FadeInStagger, FadeInItem, ScaleIn } from "@/components/motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">

      {/* ═══ NAV ═══ */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 h-16">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/20">
              <Wrench className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">FIXA</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/app/hoy" className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Acceder
            </Link>
            <Link href="/app/hoy">
              <Button className="bg-accent text-white hover:bg-accent/90 font-semibold rounded-full px-6 h-10 shadow-md shadow-accent/10 text-sm">
                Solicitar demo
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 right-1/4 h-[600px] w-[700px] rounded-full bg-primary/[0.05] blur-[180px]" />
        <div className="pointer-events-none absolute top-60 -left-40 h-[400px] w-[400px] rounded-full bg-orange-300/[0.08] blur-[120px]" />

        <div className="mx-auto max-w-6xl px-6 pt-20 pb-24 lg:pt-32 lg:pb-36">
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.04] px-4 py-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-primary">Creado por un mecánico para mecánicos</span>
              </div>

              <h1 className="text-5xl font-extrabold tracking-tight leading-[1.08] md:text-6xl lg:text-7xl">
                Menos interrupciones.
                <br />
                <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
                  Más taller.
                </span>
              </h1>

              <p className="mx-auto max-w-xl text-lg text-muted-foreground leading-relaxed md:text-xl">
                Responde a tus clientes por WhatsApp en segundos, organiza citas sin coger el teléfono, y deja de perder horas repitiendo lo mismo.
              </p>

              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/app/hoy">
                  <Button size="lg" className="bg-accent text-white hover:bg-accent/90 font-bold h-14 px-10 text-base rounded-full shadow-xl shadow-accent/15">
                    Solicitar demo gratuita
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/app/hoy">
                  <Button variant="outline" size="lg" className="h-14 px-8 text-base rounded-full font-semibold border-border hover:bg-muted">
                    Ver cómo funciona
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Sin permanencia</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Listo en 7 días</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Desde el móvil</span>
              </div>
            </div>
          </FadeIn>

          {/* Product mockup */}
          <ScaleIn delay={0.3}>
            <div className="mt-16 mx-auto max-w-4xl">
              <div className="relative rounded-2xl border border-border bg-white p-2 shadow-2xl shadow-black/[0.06]">
                <div className="rounded-xl bg-muted/30 p-6 lg:p-8">
                  {/* Simulated app UI */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
                      <Wrench className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-extrabold">FIXA</span>
                    <span className="ml-auto text-xs text-muted-foreground">Hoy · 3 citas</span>
                  </div>

                  <div className="grid gap-3 md:grid-cols-[1fr,1.2fr]">
                    {/* Acciones */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Acciones rápidas</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: "Coche listo", color: "bg-emerald-500", icon: CheckCircle2 },
                          { label: "Presupuesto", color: "bg-blue-500", icon: Send },
                          { label: "Pide cita", color: "bg-primary", icon: CalendarDays },
                          { label: "Revisión", color: "bg-violet-500", icon: Wrench },
                        ].map((a) => (
                          <div key={a.label} className={`flex flex-col items-center gap-1.5 rounded-xl ${a.color} p-3 text-white shadow-sm`}>
                            <a.icon className="h-4 w-4" />
                            <span className="text-[10px] font-bold">{a.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Citas */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Citas de hoy</p>
                      <div className="space-y-2">
                        {[
                          { hora: "09:30", nombre: "Antonio García", motivo: "Revisión de frenos", estado: "listo" },
                          { hora: "11:00", nombre: "María López", motivo: "Cambio aceite", estado: "taller" },
                          { hora: "16:30", nombre: "Pedro Martínez", motivo: "Suspensión", estado: "pendiente" },
                        ].map((c) => (
                          <div key={c.hora} className="flex items-center justify-between rounded-xl bg-white border border-border/60 p-3 shadow-sm">
                            <div className="flex items-center gap-2.5">
                              <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{c.hora}</span>
                              <div>
                                <p className="text-xs font-semibold">{c.nombre}</p>
                                <p className="text-[10px] text-muted-foreground">{c.motivo}</p>
                              </div>
                            </div>
                            {c.estado === "listo" && (
                              <div className="flex h-6 items-center gap-1 rounded-full bg-emerald-500 px-2">
                                <Send className="h-2.5 w-2.5 text-white" />
                                <span className="text-[9px] text-white font-bold">Avisar</span>
                              </div>
                            )}
                            {c.estado === "taller" && <span className="h-2 w-2 rounded-full bg-primary" />}
                            {c.estado === "pendiente" && <span className="h-2 w-2 rounded-full bg-zinc-300" />}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-[10px] font-medium text-emerald-700">Mensaje preparado para Antonio</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScaleIn>
        </div>
      </section>

      {/* ═══ BENTO FEATURES ═══ */}
      <section className="border-t border-border/50 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <FadeIn>
            <div className="text-center space-y-4 mb-16">
              <p className="text-sm font-bold text-primary">Qué hace FIXA</p>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                Todo lo que necesitas. Nada que sobre.
              </h2>
            </div>
          </FadeIn>

          <FadeInStagger className="grid gap-4 md:grid-cols-3">
            <FadeInItem className="md:col-span-2">
              <div className="group h-full rounded-3xl bg-white border border-border/50 p-8 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 shadow-md shadow-emerald-500/20 mb-5">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Mensajes en 1 toque</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Pulsa "Coche listo", elige el cliente, y WhatsApp se abre con el mensaje escrito. Sin escribir nada. Sin llamar. En menos de 10 segundos.
                </p>
              </div>
            </FadeInItem>
            <FadeInItem>
              <div className="group h-full rounded-3xl bg-white border border-border/50 p-8 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-md shadow-primary/20 mb-5">
                  <CalendarDays className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Citas organizadas</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Fecha, hora y motivo. Ve las de hoy y las próximas de un vistazo.
                </p>
              </div>
            </FadeInItem>
            <FadeInItem>
              <div className="group h-full rounded-3xl bg-white border border-border/50 p-8 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 shadow-md shadow-blue-500/20 mb-5">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Tus clientes a mano</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Nombre, teléfono, vehículo. Añadir, editar o enviar mensaje en segundos.
                </p>
              </div>
            </FadeInItem>
            <FadeInItem className="md:col-span-2">
              <div className="group h-full rounded-3xl bg-white border border-border/50 p-8 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500 shadow-md shadow-violet-500/20 mb-5">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Avisos de revisión e ITV listos para enviar</h3>
                <p className="text-muted-foreground leading-relaxed">
                  El cliente no se acuerda de que le toca revisión. Tú sí. Prepara el aviso en un toque y el trabajo vuelve solo. Más ingresos sin esfuerzo.
                </p>
              </div>
            </FadeInItem>
          </FadeInStagger>
        </div>
      </section>

      {/* ═══ PROBLEMA ═══ */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <FadeIn>
              <div className="space-y-6">
                <p className="text-sm font-bold text-primary">El problema</p>
                <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl leading-tight">
                  Cada llamada te saca de debajo de un coche
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  El teléfono no para. Los clientes preguntan siempre lo mismo. Y tú pierdes horas que deberías estar facturando.
                </p>
              </div>
            </FadeIn>

            <FadeInStagger className="space-y-3">
              {[
                { icon: Phone, color: "bg-red-50 border-red-100 text-red-500", text: '"¿Está listo mi coche?" — La misma pregunta, muchas veces al día.' },
                { icon: CalendarDays, color: "bg-amber-50 border-amber-100 text-amber-600", text: '"¿Tenéis cita?" — Buscas hueco, apuntas a mano. Tiempo que no facturas.' },
                { icon: Clock, color: "bg-blue-50 border-blue-100 text-blue-500", text: '"¿Cuándo me toca revisión?" — El cliente no se acuerda. Esa revisión nunca llega.' },
              ].map((item) => (
                <FadeInItem key={item.text}>
                  <div className={`flex items-start gap-4 rounded-2xl border p-5 ${item.color.split(" ").slice(0, 2).join(" ")}`}>
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed pt-2">{item.text}</p>
                  </div>
                </FadeInItem>
              ))}
            </FadeInStagger>
          </div>
        </div>
      </section>

      {/* ═══ CÓMO FUNCIONA ═══ */}
      <section className="bg-accent text-white overflow-hidden relative">
        <div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[150px]" />
        <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32 relative">
          <FadeIn>
            <div className="text-center space-y-4 mb-16">
              <p className="text-sm font-bold text-primary">Así de fácil</p>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                Funcionando en 3 pasos
              </h2>
            </div>
          </FadeIn>

          <FadeInStagger className="grid gap-6 md:grid-cols-3">
            {[
              { step: "01", title: "Añade tus clientes", desc: "Nombre, teléfono y vehículo. En 30 segundos tienes tu lista preparada." },
              { step: "02", title: "Pulsa un botón", desc: '"Coche listo", "Presupuesto"... Elige la acción y el cliente. Nada más.' },
              { step: "03", title: "WhatsApp listo", desc: "Se abre con el mensaje escrito. Tú solo pulsas enviar. Menos de 10 segundos." },
            ].map((item) => (
              <FadeInItem key={item.step}>
                <div className="rounded-3xl bg-white/[0.07] border border-white/10 p-8 backdrop-blur-sm hover:bg-white/[0.1] transition-all duration-300">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-sm font-extrabold text-white shadow-lg shadow-primary/30 mb-5">{item.step}</span>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-white/60 leading-relaxed">{item.desc}</p>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* ═══ IMAGEN + SIN COMPLICACIONES ═══ */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <ScaleIn>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl shadow-black/[0.08]">
                <Image
                  src="https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=800&q=80"
                  alt="Mecánico usando tablet en taller moderno"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </ScaleIn>

            <FadeIn delay={0.2}>
              <div className="space-y-6">
                <p className="text-sm font-bold text-primary">Sin complicaciones</p>
                <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl leading-tight">
                  Si sabes usar WhatsApp, sabes usar FIXA
                </h2>

                <div className="space-y-3">
                  {[
                    { icon: ShieldCheck, text: "No cambias cómo trabajas" },
                    { icon: Smartphone, text: "Funciona desde el móvil — no necesitas ordenador" },
                    { icon: Zap, text: "Lo dejamos todo montado — no tocas nada técnico" },
                    { icon: CheckCircle2, text: "En menos de 7 días funcionando en tu taller" },
                    { icon: Car, text: "Sin permanencia — si no te convence, lo dejas" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3.5 rounded-2xl bg-white border border-border/50 p-4 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                        <item.icon className="h-4 w-4 text-emerald-600" />
                      </div>
                      <p className="text-sm font-medium">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ QUIÉN ═══ */}
      <section className="bg-muted/30 border-y border-border/50">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center space-y-6">
              <p className="text-sm font-bold text-primary">Quién está detrás</p>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                Creado desde dentro de un taller
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                FIXA no lo ha creado una empresa de informáticos que imagina cómo funciona un taller. Lo ha creado alguien que lleva años gestionando un taller real, atendiendo clientes reales.
              </p>
              <p className="text-2xl font-extrabold tracking-tight">
                Sabemos lo que necesitas porque lo necesitábamos nosotros.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-[400px] w-[500px] rounded-full bg-primary/[0.04] blur-[150px]" />
        <div className="mx-auto max-w-6xl px-6 py-28 lg:py-36">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center space-y-8">
              <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl leading-tight">
                Deja de perder tiempo.
                <br />
                <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
                  Empieza a usar FIXA.
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Te lo enseñamos en 10 minutos y lo tienes funcionando en tu taller en menos de una semana.
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/app/hoy">
                  <Button size="lg" className="bg-accent text-white hover:bg-accent/90 font-bold h-14 px-10 text-base rounded-full shadow-xl shadow-accent/15">
                    Quiero dejar de perder tiempo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground">
                Sin permanencia · Sin complicaciones · Creado por un mecánico para mecánicos
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-border/50 bg-accent text-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15">
                <Wrench className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold">FIXA</span>
              <span className="text-sm text-white/50">Soluciones digitales para talleres</span>
            </div>
            <p className="text-sm text-white/40">FIXA by Ibañez Clima</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
