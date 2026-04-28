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
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-sm">
              <Wrench className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight">FIXA</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/app/hoy" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Acceder
            </Link>
            <Link href="/app/hoy">
              <Button className="bg-accent text-white hover:bg-accent/90 font-semibold rounded-full px-5 text-sm shadow-sm">
                Solicitar demo
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-20 right-0 h-[600px] w-[600px] rounded-full bg-primary/[0.06] blur-[150px]" />
        <div className="pointer-events-none absolute top-40 -left-20 h-[400px] w-[400px] rounded-full bg-primary/[0.04] blur-[120px]" />

        <div className="mx-auto max-w-6xl px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div className="space-y-8">
              <div>
                <p className="text-sm font-bold text-primary mb-4">Soluciones digitales para talleres</p>
                <h1 className="text-[2.75rem] font-extrabold tracking-tight leading-[1.05] lg:text-[3.5rem]">
                  Menos interrupciones.
                  <br />
                  Más taller.
                </h1>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Responde a tus clientes por WhatsApp en segundos, organiza citas sin coger
                el teléfono, y deja de perder horas repitiendo lo mismo.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link href="/app/hoy">
                  <Button size="lg" className="bg-accent text-white hover:bg-accent/90 font-bold h-14 px-8 text-base rounded-full shadow-lg shadow-accent/20">
                    Solicitar demo gratuita
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Sin permanencia</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Listo en 7 días</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Desde el móvil</span>
              </div>
            </div>

            {/* Hero image */}
            <div className="relative hidden lg:block">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-black/10">
                <Image
                  src="https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=900&q=85"
                  alt="Mecánico profesional trabajando en taller"
                  fill
                  className="object-cover"
                  sizes="50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="rounded-2xl bg-white/95 backdrop-blur-sm p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 shadow-sm">
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Mensaje preparado</p>
                          <p className="text-xs text-gray-500">Antonio García · Coche listo</p>
                        </div>
                      </div>
                      <div className="flex h-8 items-center rounded-full bg-emerald-500 px-3 shadow-sm">
                        <Send className="h-3 w-3 text-white mr-1" />
                        <span className="text-xs text-white font-semibold">WhatsApp</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENTO: QUÉ HACE ── */}
      <section className="bg-secondary/50 border-y border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="text-center space-y-3 mb-14">
            <p className="text-sm font-bold text-primary">Qué hace FIXA</p>
            <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl">Todo lo que necesitas. Nada que sobre.</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MessageSquare, color: "bg-emerald-500", title: "Mensajes rápidos", desc: "Coche listo, presupuesto, cita, revisión. Un toque y WhatsApp se abre con el mensaje escrito." },
              { icon: CalendarDays, color: "bg-primary", title: "Citas organizadas", desc: "Crea citas con fecha, hora y motivo. Ve las de hoy y las próximas de un vistazo." },
              { icon: Users, color: "bg-blue-500", title: "Clientes a mano", desc: "Tu lista con nombre, teléfono y vehículo. Añadir, editar o enviar mensaje en segundos." },
              { icon: Wrench, color: "bg-violet-500", title: "Avisos listos", desc: "Revisión, ITV, mantenimiento. Prepara el aviso y envíalo cuando quieras." },
            ].map((f) => (
              <div key={f.title} className="group rounded-2xl bg-white p-6 shadow-sm border border-border/40 hover:shadow-md hover:border-primary/20 transition-all duration-300">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${f.color} shadow-sm mb-4`}>
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEMA ── */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div className="space-y-6">
              <p className="text-sm font-bold text-primary">El problema</p>
              <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl leading-tight">
                Cada llamada te saca de debajo de un coche
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                El teléfono no para. Los clientes preguntan siempre lo mismo. Y tú pierdes horas que deberías estar facturando.
              </p>

              <div className="space-y-3">
                {[
                  { icon: Phone, text: '"¿Está listo mi coche?" — La misma pregunta, muchas veces al día.' },
                  { icon: CalendarDays, text: '"¿Tenéis cita?" — Buscas hueco, apuntas a mano. Tiempo muerto.' },
                  { icon: Clock, text: '"¿Cuándo me toca revisión?" — No se acuerda. Esa revisión nunca llega.' },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                      <item.icon className="h-4 w-4 text-red-500" />
                    </div>
                    <p className="text-sm text-red-900/70 leading-relaxed pt-1">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative aspect-square overflow-hidden rounded-3xl shadow-xl shadow-black/5 hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80"
                alt="Taller mecánico profesional"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section className="bg-accent text-white">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="text-center space-y-3 mb-14">
            <p className="text-sm font-bold text-white/60">Así de fácil</p>
            <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl">Funcionando en 3 pasos</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { step: "01", title: "Añade tus clientes", desc: "Nombre, teléfono y vehículo. En 30 segundos tienes tu lista." },
              { step: "02", title: "Pulsa un botón", desc: '"Coche listo", "Presupuesto"... Elige la acción y el cliente.' },
              { step: "03", title: "WhatsApp listo", desc: "Se abre con el mensaje escrito. Tú solo pulsas enviar." },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl bg-white/10 border border-white/10 p-7 space-y-4 backdrop-blur-sm">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-sm font-extrabold">{item.step}</span>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SIN COMPLICACIONES ── */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <p className="text-sm font-bold text-primary">Sin complicaciones</p>
              <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl leading-tight">
                Si sabes usar WhatsApp, sabes usar FIXA
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                No tienes que instalar nada, aprender nada, ni cambiar cómo trabajas. Te lo dejamos montado y funciona desde el móvil.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { icon: ShieldCheck, text: "No cambias cómo trabajas" },
                { icon: Smartphone, text: "Funciona desde el móvil — no necesitas ordenador" },
                { icon: Zap, text: "Lo dejamos todo montado — no tocas nada técnico" },
                { icon: CheckCircle2, text: "En menos de 7 días funcionando en tu taller" },
                { icon: Car, text: "Sin permanencia — si no te convence, lo dejas" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-border/40 hover:shadow-md transition-all duration-300">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                    <item.icon className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-sm font-medium">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── QUIÉN ── */}
      <section className="bg-secondary/50 border-y border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="mx-auto max-w-2xl text-center space-y-6">
            <p className="text-sm font-bold text-primary">Quién está detrás</p>
            <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
              Creado desde dentro de un taller
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              FIXA no lo ha creado una empresa de informáticos que imagina cómo funciona un taller. Lo ha creado alguien que lleva años gestionando un taller real, atendiendo clientes reales.
            </p>
            <p className="text-xl font-extrabold">
              Sabemos lo que necesitas porque lo necesitábamos nosotros.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent" />
        <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-2xl text-center space-y-8">
            <h2 className="text-3xl font-extrabold tracking-tight lg:text-[2.8rem] leading-tight">
              Deja de perder tiempo.
              <br />
              Empieza a usar FIXA.
            </h2>
            <p className="text-lg text-muted-foreground">
              Te lo enseñamos en 10 minutos y lo tienes funcionando en tu taller en menos de una semana.
            </p>
            <Link href="/app/hoy">
              <Button size="lg" className="bg-accent text-white hover:bg-accent/90 font-bold h-14 px-10 text-base rounded-full shadow-lg shadow-accent/20">
                Quiero dejar de perder tiempo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              Sin permanencia · Sin complicaciones · Creado por un mecánico para mecánicos
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border/60 bg-accent text-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
                <Wrench className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold">FIXA</span>
              <span className="text-sm text-white/60">Soluciones digitales para talleres</span>
            </div>
            <p className="text-sm text-white/50">FIXA by Ibañez Clima</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
