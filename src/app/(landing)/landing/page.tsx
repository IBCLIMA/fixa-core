import Link from "next/link";
import Image from "next/image";
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
  Phone,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function Section({
  children,
  className = "",
  muted = false,
}: {
  children: React.ReactNode;
  className?: string;
  muted?: boolean;
}) {
  return (
    <section
      className={`${muted ? "bg-card/40 border-y border-border/40" : ""} ${className}`}
    >
      <div className="mx-auto max-w-5xl px-6 py-20 lg:py-28">{children}</div>
    </section>
  );
}

function SectionHeader({
  tag,
  title,
  subtitle,
}: {
  tag: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center space-y-4 mb-14">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-foreground">
        {tag}
      </p>
      <h2 className="text-3xl font-extrabold tracking-tight leading-tight lg:text-[2.5rem]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Wrench className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-extrabold tracking-tight">FIXA</span>
          </div>
          <Link href="/app/hoy">
            <Button className="bg-primary text-white hover:bg-primary/90 font-semibold rounded-full px-5">
              Probar ahora
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[600px] rounded-full bg-amber-100/40 blur-[120px]" />

        <div className="mx-auto max-w-5xl px-6 pb-20 pt-16 lg:pt-24 lg:pb-28">
          <div className="grid gap-16 lg:grid-cols-[1fr,0.9fr] lg:items-center">
            {/* Copy */}
            <div className="space-y-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
                Soluciones digitales para talleres
              </p>

              <h1 className="text-[2.5rem] font-extrabold tracking-tight leading-[1.06] lg:text-[3.4rem]">
                Menos interrupciones.
                <br />
                <span className="text-amber-600">Más taller.</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                FIXA te permite responder a tus clientes por WhatsApp en
                segundos y organizar citas sin coger el teléfono. Desde el
                móvil, sin complicaciones.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link href="/app/hoy">
                  <Button
                    size="lg"
                    className="bg-foreground text-background hover:bg-foreground/90 font-semibold h-13 px-8 text-base rounded-full shadow-lg shadow-foreground/10"
                  >
                    Solicitar demo gratuita
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Sin permanencia
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Listo en 7 días
                </span>
              </div>
            </div>

            {/* Mockup — producto real, sobrio */}
            <div className="relative hidden lg:block">
              <div className="rounded-2xl border border-border bg-white p-4 shadow-xl shadow-black/[0.03]">
                {/* App header */}
                <div className="flex items-center gap-2 border-b border-border/60 pb-3 mb-4">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500">
                    <Wrench className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-xs font-extrabold tracking-tight">FIXA</span>
                </div>

                {/* Cita simulada */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Citas de hoy</p>
                  <div className="rounded-xl border border-border/60 p-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">09:30</span>
                        <span className="text-xs font-semibold">Antonio García</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Revisión de frenos</p>
                    </div>
                    <div className="flex h-7 items-center gap-1 rounded-full bg-green-600 px-2.5">
                      <Send className="h-2.5 w-2.5 text-white" />
                      <span className="text-[10px] text-white font-semibold">Avisar</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-border/60 p-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">11:00</span>
                        <span className="text-xs font-semibold">María López</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Cambio aceite y filtros</p>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                  </div>

                  {/* Confirmación */}
                  <div className="rounded-xl border border-green-200 bg-green-50 p-3 flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-[10px] text-green-700 font-medium">
                      Mensaje preparado para Antonio
                    </span>
                  </div>
                </div>

                {/* Bottom nav simulado */}
                <div className="mt-4 flex border-t border-border/60 pt-3">
                  <div className="flex flex-1 flex-col items-center gap-0.5">
                    <CalendarDays className="h-3.5 w-3.5 text-amber-600" />
                    <span className="text-[9px] font-semibold text-amber-600">Hoy</span>
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-0.5">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[9px] text-muted-foreground">Clientes</span>
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-0.5">
                    <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[9px] text-muted-foreground">Mensajes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEMA ── */}
      <Section>
        <div className="mb-14 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-foreground">
              El problema
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight lg:text-[2.5rem]">
              Cada llamada te saca de debajo de un coche
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              El teléfono no para. Los clientes preguntan siempre lo mismo. Y tú pierdes horas que deberías estar facturando.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80"
              alt="Mecánico trabajando en un taller"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            {
              icon: Phone,
              title: '"¿Está listo mi coche?"',
              desc: "La misma pregunta, muchas veces al día. Cada llamada es una interrupción.",
            },
            {
              icon: CalendarDays,
              title: '"¿Tenéis cita?"',
              desc: "Buscas hueco, apuntas a mano, confirmas por teléfono. Tiempo que no facturas.",
            },
            {
              icon: Clock,
              title: '"¿Cuándo me toca revisión?"',
              desc: "El cliente no se acuerda. Tú tampoco. Y esa revisión nunca llega.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-border/60 bg-card p-7 space-y-4 transition-all hover:border-red-500/20 hover:bg-red-500/[0.02]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 transition-colors group-hover:bg-red-500/15">
                <item.icon className="h-5 w-5 text-red-400" />
              </div>
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── SOLUCIÓN ── */}
      <Section muted>
        <SectionHeader
          tag="La solución"
          title="FIXA te quita trabajo de encima"
          subtitle="No es un software complejo. Es una herramienta rápida que se usa desde el móvil."
        />
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            {
              icon: MessageSquare,
              color: "bg-green-500/10 text-green-500 group-hover:bg-green-500/15",
              border: "hover:border-green-500/20",
              title: "Mensajes en 1 toque",
              desc: 'Pulsa "Coche listo", elige el cliente, y WhatsApp se abre con el mensaje escrito. Tú solo pulsas enviar.',
            },
            {
              icon: CalendarDays,
              color: "bg-amber-500/10 text-amber-600 group-hover:bg-amber-500/15",
              border: "hover:border-amber-500/30",
              title: "Citas organizadas",
              desc: "Crea citas con fecha, hora y motivo. Ve las de hoy y las próximas de un vistazo.",
            },
            {
              icon: Users,
              color: "bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/15",
              border: "hover:border-blue-500/20",
              title: "Tus clientes a mano",
              desc: "Lista de clientes con nombre, teléfono y vehículo. Añadir, editar o enviar mensaje en segundos.",
            },
            {
              icon: Wrench,
              color: "bg-purple-500/10 text-purple-500 group-hover:bg-purple-500/15",
              border: "hover:border-purple-500/20",
              title: "Avisos listos para enviar",
              desc: "Prepara avisos de revisión o ITV para tus clientes. Un toque y el mensaje está listo.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className={`group rounded-2xl border border-border/60 bg-background p-7 space-y-4 transition-all ${f.border}`}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${f.color}`}
              >
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── CÓMO FUNCIONA ── */}
      <Section>
        <SectionHeader
          tag="Así de fácil"
          title="Funcionando en 3 pasos"
        />
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            {
              step: "01",
              title: "Añade tus clientes",
              desc: "Nombre, teléfono y vehículo. En 30 segundos tienes tu lista.",
            },
            {
              step: "02",
              title: "Pulsa un botón",
              desc: '"Coche listo", "Presupuesto preparado"... Elige la acción y el cliente.',
            },
            {
              step: "03",
              title: "WhatsApp listo",
              desc: "Se abre WhatsApp con el mensaje escrito. Tú solo pulsas enviar.",
            },
          ].map((item) => (
            <div key={item.step} className="space-y-4">
              <span className="text-6xl font-extrabold text-amber-500/20 leading-none">
                {item.step}
              </span>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── SIN COMPLICACIONES ── */}
      <Section muted>
        <SectionHeader
          tag="Sin complicaciones"
          title="No tienes que aprender nada"
          subtitle="Si sabes usar WhatsApp, sabes usar FIXA."
        />
        <div className="mx-auto max-w-xl space-y-3">
          {[
            { icon: ShieldCheck, text: "No cambias cómo trabajas" },
            { icon: Smartphone, text: "Funciona desde el móvil — no necesitas ordenador" },
            { icon: Zap, text: "Lo dejamos todo montado — no tocas nada técnico" },
            { icon: CheckCircle2, text: "En menos de 7 días funcionando en tu taller" },
            { icon: Car, text: "Sin permanencia — si no te convence, lo dejas" },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-4 rounded-xl border border-border/60 bg-background p-4"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                <item.icon className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-sm font-medium">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── QUIÉN ── */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl order-2 lg:order-1">
            <Image
              src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80"
              alt="Interior de un taller mecánico profesional"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-foreground">
              Quién está detrás
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight lg:text-[2.5rem]">
              Creado desde dentro de un taller
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                FIXA no lo ha creado una empresa de informáticos que imagina cómo
                funciona un taller. Lo ha creado alguien que lleva años gestionando
                un taller real, atendiendo clientes reales, y que estaba harto de
                perder tiempo con el teléfono.
              </p>
              <p className="font-medium text-foreground text-lg">
                Sabemos lo que necesitas porque lo necesitábamos nosotros.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden border-t border-border/40">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="mx-auto max-w-5xl px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-2xl text-center space-y-8">
            <h2 className="text-3xl font-extrabold tracking-tight lg:text-[2.5rem] leading-tight">
              Deja de perder tiempo.{" "}
              <span className="text-amber-600">Empieza a usar FIXA.</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Te lo enseñamos en 10 minutos y lo tienes funcionando en tu taller
              en menos de una semana.
            </p>
            <Link href="/app/hoy">
              <Button
                size="lg"
                className="bg-primary text-white hover:bg-primary/90 font-semibold h-13 px-8 text-base rounded-full"
              >
                Quiero dejar de perder tiempo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground">
              Sin permanencia · Sin complicaciones · Creado por un mecánico para
              mecánicos
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border/40 bg-card/40">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                <Wrench className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
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
