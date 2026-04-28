"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
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
  Sparkles,
  PhoneOff,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 } as const,
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemFade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen antialiased overflow-x-hidden" style={{ background: "#fafaf8" }}>

      {/* ═══ NAV ═══ */}
      <nav className="sticky top-0 z-50 bg-[#fafaf8]/80 backdrop-blur-xl border-b border-black/[0.04]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 h-16">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20">
              <Wrench className="h-[18px] w-[18px] text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-stone-900">FIXA</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/app/hoy" className="hidden sm:block text-sm font-semibold text-stone-500 hover:text-stone-900 transition-colors">
              Acceder
            </Link>
            <Link href="/app/hoy">
              <Button className="bg-stone-900 text-white hover:bg-stone-800 font-semibold rounded-full px-6 h-10 shadow-lg shadow-stone-900/10 text-sm">
                Solicitar demo
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden">
        {/* Glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-400/[0.06] rounded-[50%] scale-[2] blur-[100px]" />

        <div className="mx-auto max-w-6xl px-6 pt-20 pb-8 lg:pt-32 lg:pb-16 relative">
          <motion.div
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-3xl text-center space-y-6"
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full border border-orange-200/60 bg-orange-50 px-4 py-2">
              <Sparkles className="h-3.5 w-3.5 text-orange-500" />
              <span className="text-xs font-semibold text-orange-700">Creado por un mecánico para mecánicos</span>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="text-5xl font-extrabold tracking-tight leading-[1.06] text-stone-900 md:text-6xl lg:text-7xl">
              Menos interrupciones.
              <br />
              <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent">
                Más taller.
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="mx-auto max-w-xl text-lg text-stone-500 leading-relaxed md:text-xl">
              Responde a tus clientes por WhatsApp en segundos y organiza citas sin coger el teléfono.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-col items-center gap-4 pt-2 sm:flex-row sm:justify-center">
              <Link href="/app/hoy">
                <Button size="lg" className="bg-stone-900 text-white hover:bg-stone-800 font-bold h-14 px-10 text-base rounded-full shadow-xl shadow-stone-900/15 group">
                  Solicitar demo gratuita
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link href="/app/hoy">
                <Button variant="outline" size="lg" className="h-14 px-8 text-base rounded-full font-semibold border-stone-200 hover:bg-white hover:border-stone-300 text-stone-700">
                  Ver cómo funciona
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} custom={4} className="flex items-center justify-center gap-6 text-sm text-stone-400 pt-2">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Sin permanencia</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Listo en 7 días</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Desde el móvil</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Mockup frame — estilo launch-ui */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-4xl px-6 pb-20 lg:pb-28"
        >
          <div className="relative">
            {/* Glow bajo mockup */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-orange-400/10 rounded-[50%] blur-[80px]" />

            <div className="relative rounded-2xl bg-stone-200/40 p-2 sm:p-3">
              <div className="rounded-xl bg-white shadow-2xl shadow-black/[0.06] border border-stone-200/60 overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-50 border-b border-stone-100">
                  <div className="h-2.5 w-2.5 rounded-full bg-stone-200" />
                  <div className="h-2.5 w-2.5 rounded-full bg-stone-200" />
                  <div className="h-2.5 w-2.5 rounded-full bg-stone-200" />
                  <div className="flex-1 mx-8">
                    <div className="h-5 bg-stone-100 rounded-full max-w-xs mx-auto flex items-center justify-center">
                      <span className="text-[9px] text-stone-400 font-medium">fixa.es/app</span>
                    </div>
                  </div>
                </div>

                {/* App content — simulación real */}
                <div className="p-5 sm:p-8" style={{ background: "linear-gradient(180deg, #f8f7f4 0%, #f1f0ed 100%)" }}>
                  <div className="max-w-sm mx-auto space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-sm">
                          <Wrench className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="text-xs font-extrabold text-stone-900">FIXA</span>
                      </div>
                      <span className="text-[9px] text-stone-400 font-medium">lunes, 28 abril</span>
                    </div>

                    <div>
                      <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Hoy</p>
                      <p className="text-lg font-extrabold text-stone-900 leading-tight">Tu taller hoy</p>
                    </div>

                    {/* KPIs */}
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { n: "12", l: "Clientes" },
                        { n: "3", l: "Citas hoy" },
                        { n: "8", l: "Mensajes" },
                      ].map((k) => (
                        <div key={k.l} className="rounded-xl bg-white p-2.5 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] border border-stone-100">
                          <p className="text-lg font-extrabold text-stone-900 leading-none">{k.n}</p>
                          <p className="text-[8px] font-bold text-stone-400 uppercase tracking-wider mt-0.5">{k.l}</p>
                        </div>
                      ))}
                    </div>

                    {/* Acciones */}
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { l: "Coche listo", c: "from-emerald-500 to-emerald-600", i: CheckCircle2 },
                        { l: "Presupuesto", c: "from-blue-500 to-blue-600", i: Send },
                        { l: "Pide cita", c: "from-orange-500 to-orange-600", i: CalendarDays },
                        { l: "Revisión", c: "from-violet-500 to-violet-600", i: Wrench },
                      ].map((a) => (
                        <div key={a.l} className={`flex items-center gap-2 rounded-xl bg-gradient-to-br ${a.c} p-2.5 text-white shadow-sm`}>
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20">
                            <a.i className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-[10px] font-bold">{a.l}</span>
                        </div>
                      ))}
                    </div>

                    {/* Cita */}
                    <div className="rounded-xl bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] border border-stone-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 flex-col items-center justify-center rounded-lg bg-stone-50">
                          <span className="text-[10px] font-extrabold text-stone-900 leading-none">09</span>
                          <span className="text-[7px] font-bold text-stone-400">:30</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-stone-900">Antonio García</p>
                          <p className="text-[8px] text-stone-400">Revisión de frenos</p>
                        </div>
                      </div>
                      <div className="flex h-6 items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-2 shadow-sm">
                        <Send className="h-2.5 w-2.5 text-white" />
                        <span className="text-[8px] text-white font-bold">Avisar</span>
                      </div>
                    </div>

                    {/* Confirmación */}
                    <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-2.5 flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-[9px] font-semibold text-emerald-700">Mensaje preparado para Antonio</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══ FEATURES — BENTO GRID ═══ */}
      <section className="border-t border-black/[0.04] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <motion.div variants={fadeUp} custom={0} className="text-center space-y-3 mb-16">
              <p className="text-sm font-bold text-orange-600">Qué hace FIXA</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-4xl lg:text-5xl">
                Todo lo que necesitas. Nada que sobre.
              </h2>
              <p className="mx-auto max-w-lg text-stone-500 text-lg">
                Herramientas simples para que te centres en lo que importa: reparar coches.
              </p>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="grid gap-4 md:grid-cols-3">
            {[
              { icon: MessageSquare, color: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/15", title: "Mensajes en 1 toque", desc: 'Pulsa "Coche listo", elige el cliente, y WhatsApp se abre con el mensaje escrito. Sin escribir. Sin llamar.', span: "md:col-span-2" },
              { icon: CalendarDays, color: "from-orange-500 to-orange-600", shadow: "shadow-orange-500/15", title: "Citas organizadas", desc: "Fecha, hora y motivo. Ve las de hoy y las próximas.", span: "" },
              { icon: Users, color: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/15", title: "Clientes a mano", desc: "Nombre, teléfono, vehículo. Todo en segundos.", span: "" },
              { icon: Wrench, color: "from-violet-500 to-violet-600", shadow: "shadow-violet-500/15", title: "Avisos de revisión e ITV", desc: "El cliente no se acuerda. Tú le avisas con un toque y el trabajo vuelve solo.", span: "md:col-span-2" },
            ].map((f) => (
              <motion.div key={f.title} variants={itemFade} className={f.span}>
                <div className="group h-full rounded-3xl bg-[#fafaf8] border border-stone-100 p-8 hover:bg-white hover:shadow-lg hover:border-stone-200/80 transition-all duration-500">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} shadow-lg ${f.shadow} mb-5`}>
                    <f.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-extrabold text-stone-900 mb-2">{f.title}</h3>
                  <p className="text-stone-500 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ PROBLEMA ═══ */}
      <section className="border-t border-black/[0.04]">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div variants={fadeUp} custom={0} className="space-y-6">
              <p className="text-sm font-bold text-orange-600">El problema</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-4xl lg:text-5xl leading-tight">
                Cada llamada te saca de debajo de un coche
              </h2>
              <p className="text-lg text-stone-500 leading-relaxed">
                El teléfono no para. Los clientes preguntan siempre lo mismo. Y tú pierdes horas que deberías estar facturando.
              </p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="space-y-3">
              {[
                { icon: PhoneOff, bg: "bg-red-50 border-red-100", iconColor: "text-red-500", text: '"¿Está listo mi coche?" — La misma pregunta, muchas veces al día.' },
                { icon: Timer, bg: "bg-amber-50 border-amber-100", iconColor: "text-amber-600", text: '"¿Tenéis cita?" — Buscas hueco, apuntas a mano. Tiempo que no facturas.' },
                { icon: Clock, bg: "bg-blue-50 border-blue-100", iconColor: "text-blue-500", text: '"¿Cuándo me toca revisión?" — No se acuerda. Esa revisión nunca llega.' },
              ].map((item) => (
                <motion.div key={item.text} variants={itemFade} className={`flex items-start gap-4 rounded-2xl border p-5 ${item.bg}`}>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ${item.iconColor}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed pt-2">{item.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ CÓMO FUNCIONA ═══ */}
      <section className="bg-stone-900 text-white relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-1/4 h-[400px] w-[500px] rounded-[50%] bg-orange-500/10 blur-[120px]" />
        <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32 relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <motion.div variants={fadeUp} custom={0} className="text-center space-y-3 mb-16">
              <p className="text-sm font-bold text-orange-400">Así de fácil</p>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                Funcionando en 3 pasos
              </h2>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="grid gap-6 md:grid-cols-3">
            {[
              { step: "01", title: "Añade tus clientes", desc: "Nombre, teléfono y vehículo. En 30 segundos tienes tu lista." },
              { step: "02", title: "Pulsa un botón", desc: '"Coche listo", "Presupuesto"... Elige la acción y el cliente.' },
              { step: "03", title: "WhatsApp listo", desc: "Se abre con el mensaje escrito. Tú solo pulsas enviar." },
            ].map((item) => (
              <motion.div key={item.step} variants={itemFade} className="rounded-3xl bg-white/[0.05] border border-white/[0.08] p-8 backdrop-blur-sm hover:bg-white/[0.08] transition-all duration-500">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 mb-6">
                  <span className="text-sm font-extrabold">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-stone-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ SIN COMPLICACIONES ═══ */}
      <section className="border-t border-black/[0.04]">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div variants={fadeUp} custom={0}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl shadow-black/[0.06]">
                <Image
                  src="https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=800&q=80"
                  alt="Mecánico usando tecnología en taller"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </motion.div>

            <motion.div variants={fadeUp} custom={1} className="space-y-6">
              <p className="text-sm font-bold text-orange-600">Sin complicaciones</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-4xl leading-tight">
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
                  <div key={item.text} className="flex items-center gap-3.5 rounded-2xl bg-white border border-stone-100 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-300">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                      <item.icon className="h-4 w-4 text-emerald-600" />
                    </div>
                    <p className="text-sm font-medium text-stone-700">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ QUIÉN ═══ */}
      <section className="bg-white border-y border-black/[0.04]">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <motion.div variants={fadeUp} custom={0} className="mx-auto max-w-2xl text-center space-y-6">
              <p className="text-sm font-bold text-orange-600">Quién está detrás</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-4xl lg:text-5xl">
                Creado desde dentro de un taller
              </h2>
              <p className="text-lg text-stone-500 leading-relaxed">
                FIXA no lo ha creado una empresa de informáticos que imagina cómo funciona un taller. Lo ha creado alguien que lleva años gestionando un taller real.
              </p>
              <p className="text-2xl font-extrabold text-stone-900 tracking-tight">
                Sabemos lo que necesitas porque lo necesitábamos nosotros.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-[400px] w-[600px] rounded-[50%] bg-orange-400/[0.05] blur-[120px]" />
        <div className="mx-auto max-w-6xl px-6 py-28 lg:py-36 relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <motion.div variants={fadeUp} custom={0} className="mx-auto max-w-2xl text-center space-y-8">
              <h2 className="text-4xl font-extrabold tracking-tight text-stone-900 md:text-5xl leading-tight">
                Deja de perder tiempo.
                <br />
                <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent">
                  Empieza a usar FIXA.
                </span>
              </h2>
              <p className="text-lg text-stone-500">
                Te lo enseñamos en 10 minutos y lo tienes funcionando en tu taller en menos de una semana.
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/app/hoy">
                  <Button size="lg" className="bg-stone-900 text-white hover:bg-stone-800 font-bold h-14 px-10 text-base rounded-full shadow-xl shadow-stone-900/15 group">
                    Quiero dejar de perder tiempo
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-stone-400">
                Sin permanencia · Sin complicaciones · Creado por un mecánico para mecánicos
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-black/[0.04] bg-stone-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
                <Wrench className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold">FIXA</span>
              <span className="text-sm text-white/40">Soluciones digitales para talleres</span>
            </div>
            <p className="text-sm text-white/30">FIXA by Ibañez Clima</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
