"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, MessageSquare, Phone, AlertTriangle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@vercel/analytics";
import { FixaLogo } from "@/components/ui/fixa-logo";
import { motion, useReducedMotion } from "framer-motion";
import { FADE_UP, FADE_RIGHT, FADE_ONLY, TRANSITION_DEFAULT } from "./animation-config";

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? FADE_ONLY : FADE_UP;
  const mockupVariants = prefersReducedMotion ? FADE_ONLY : FADE_RIGHT;

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(249,115,22,0.08),transparent)]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#faf9f7] to-transparent" />

      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-0 relative z-10 w-full">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-10 items-center">
          {/* Text */}
          <div>
            <motion.div
              variants={variants}
              initial="hidden"
              animate="visible"
              transition={{ ...TRANSITION_DEFAULT, delay: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-brand-50/80 backdrop-blur-sm px-4 py-2 mb-8"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500">
                <Zap className="h-3 w-3 text-white" />
              </span>
              <span className="text-xs font-semibold text-brand-700 tracking-wide">
                Nacida en un taller de verdad · 49€/mes + IVA, todo incluido
              </span>
            </motion.div>

            <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 md:text-5xl lg:text-[3.5rem] leading-[1.05]">
              Deja de llevar
              <br />
              el taller
              <br />
              <span className="hero-shimmer bg-gradient-to-r from-brand-500 via-amber-400 to-brand-600 bg-clip-text text-transparent bg-[length:200%_100%]">
                en la cabeza.
              </span>
            </h1>

            <motion.p
              variants={variants}
              initial="hidden"
              animate="visible"
              transition={{ ...TRANSITION_DEFAULT, delay: 0.2 }}
              className="text-lg text-stone-500 mt-6 leading-relaxed max-w-[480px]"
            >
              FIXA recuerda por ti: presupuestos sin contestar, coches
              parados, ITV y clientes esperando noticias. Y tus clientes ven el
              estado de su coche en tiempo real, sin llamarte.
            </motion.p>

            <motion.p
              variants={variants}
              initial="hidden"
              animate="visible"
              transition={{ ...TRANSITION_DEFAULT, delay: 0.25 }}
              className="text-base font-bold text-stone-900 mt-4 max-w-[480px]"
            >
              No te muestra datos. Te dice qué hacer hoy.
            </motion.p>

            <motion.div
              variants={variants}
              initial="hidden"
              animate="visible"
              transition={{ ...TRANSITION_DEFAULT, delay: 0.3 }}
              className="flex flex-col gap-3 mt-10 sm:flex-row"
            >
              <Link href="/sign-up" onClick={() => track("cta_hero")}>
                <Button
                  size="lg"
                  className="rounded-full bg-brand-500 text-white hover:bg-brand-400 font-bold h-14 px-8 text-base shadow-brand hover:shadow-brand-lg transition-shadow cursor-pointer group"
                >
                  Probar gratis
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <a href="#demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full h-14 px-8 text-base font-semibold border-stone-200/80 hover:bg-stone-50 cursor-pointer"
                >
                  Ver cómo funciona
                </Button>
              </a>
            </motion.div>

            <motion.div
              variants={variants}
              initial="hidden"
              animate="visible"
              transition={{ ...TRANSITION_DEFAULT, delay: 0.4 }}
              className="flex items-center gap-6 mt-8 text-sm text-stone-400 flex-wrap"
            >
              {["Sin tarjeta", "Sin permanencia", "Sin descargas — funciona en el navegador"].map((text) => (
                <span key={text} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {text}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Mockup — el briefing de la mañana (FIXA ya ha pensado por él) */}
          <HeroMockupBriefing prefersReducedMotion={prefersReducedMotion} mockupVariants={mockupVariants} />
        </div>
      </div>
    </section>
  );
}

// Lo que el gerente ve al abrir FIXA: no formularios — decisiones que mueven dinero.
// Datos de ejemplo realistas (no inflados): un día normal de taller.
const briefingItems = [
  { icon: Phone, bg: "bg-red-500", titulo: "Llama a Antonio", sub: "Presupuesto de 740 € · 2 días sin responder", accion: "Llamar" },
  { icon: MessageSquare, bg: "bg-amber-500", titulo: "Avisa a María", sub: "Su coche ya está listo y no lo sabe", accion: "WhatsApp" },
  { icon: AlertTriangle, bg: "bg-red-500", titulo: "Peugeot 2008 bloqueado", sub: "Falta la pieza · avísale del retraso", accion: "Avisar" },
  { icon: Calendar, bg: "bg-emerald-500", titulo: "7 ITV este mes", sub: "≈ 840 € que puedes recuperar", accion: "Ver" },
];

function HeroMockupBriefing({ prefersReducedMotion, mockupVariants }: { prefersReducedMotion: boolean | null; mockupVariants: any }) {
  return (
    <motion.div
      variants={mockupVariants}
      initial="hidden"
      animate="visible"
      transition={{ ...TRANSITION_DEFAULT, delay: 0.4, duration: 0.9 }}
      className="hidden lg:block relative"
    >
      <div className="absolute -inset-8 bg-gradient-to-br from-brand-300/20 via-transparent to-blue-300/10 rounded-[2rem] blur-3xl" />

      <motion.div
        animate={prefersReducedMotion ? {} : { y: [-3, 3, -3] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="relative"
      >
        <div className="rounded-2xl bg-white/80 backdrop-blur-xl shadow-2xl shadow-black/[0.08] border border-stone-200/50 overflow-hidden">
          {/* Browser chrome */}
          <div className="flex items-center gap-1.5 px-4 py-3 bg-stone-50/80 border-b border-stone-100/80">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
            <div className="flex-1 mx-6">
              <div className="h-6 bg-stone-100/80 rounded-lg max-w-[200px] mx-auto flex items-center justify-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-emerald-400/60" />
                <span className="text-[10px] text-stone-400 font-medium">fixataller.es</span>
              </div>
            </div>
          </div>

          {/* El briefing */}
          <div className="p-5 min-h-[340px]" style={{ background: "linear-gradient(180deg, #fafaf9 0%, #f5f3f0 100%)" }}>
            <div className="flex items-center justify-between">
              <FixaLogo size="xs" />
              <span className="text-[9px] font-medium text-stone-400">Martes · 8:02</span>
            </div>
            <p className="text-[13px] font-extrabold text-stone-900 mt-3">Buenos días.</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-600 mt-3 mb-2.5">
              Hoy no dejes escapar esto
            </p>

            <div className="space-y-2">
              {briefingItems.map((item, i) => (
                <motion.div
                  key={item.titulo}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.15, duration: 0.4 }}
                  className="flex items-center gap-2.5 rounded-xl bg-white border border-stone-100 p-2.5 shadow-sm"
                >
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${item.bg}`}>
                    <item.icon className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-stone-900 leading-tight">{item.titulo}</p>
                    <p className="text-[9px] text-stone-500 leading-tight truncate">{item.sub}</p>
                  </div>
                  <span className="text-[8px] font-bold text-stone-400 shrink-0">{item.accion} →</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
