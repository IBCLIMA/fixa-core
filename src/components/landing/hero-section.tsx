"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, Send, Search, MessageSquare, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@vercel/analytics";
import { FixaLogo } from "@/components/ui/fixa-logo";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
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
                Nacida en un taller de verdad · desde 29€/mes
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

          {/* Mockup - Auto-cycling demo */}
          <HeroMockupSequence prefersReducedMotion={prefersReducedMotion} mockupVariants={mockupVariants} />
        </div>
      </div>
    </section>
  );
}

const demoSteps = [
  {
    label: "Introduce la matrícula",
    icon: Search,
    color: "bg-brand-500",
    content: (
      <div className="space-y-3">
        <div className="rounded-lg bg-white border border-stone-100 p-3">
          <div className="flex items-center gap-2 mb-3">
            <Search className="h-3.5 w-3.5 text-stone-300" />
            <div className="h-5 flex-1 bg-stone-50 rounded flex items-center px-2">
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-[11px] font-bold text-stone-900 overflow-hidden whitespace-nowrap"
              >
                4523 BCD
              </motion.span>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="rounded-lg bg-brand-50 border border-brand-200/60 p-2.5 flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] font-bold text-stone-900">4523 BCD</span>
              <p className="text-[8px] text-stone-400">Seat León · Juan García</p>
            </div>
            <div className="text-[9px] font-bold text-brand-600 bg-brand-100 px-2 py-0.5 rounded-full">+ Orden</div>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    label: "Orden creada en 10 seg",
    icon: ClipboardList,
    color: "bg-blue-500",
    content: (
      <div className="space-y-2">
        <div className="rounded-lg bg-blue-50 border border-blue-200/60 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-stone-900">4523 BCD · Seat León</span>
            <span className="text-[8px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Recibido</span>
          </div>
          <p className="text-[9px] text-stone-500">Ruido al frenar. Revisar pastillas y discos.</p>
        </div>
        {[
          { m: "5678 DRS", s: "Finalizado", c: "bg-emerald-500" },
          { m: "7891 JNM", s: "En reparación", c: "bg-blue-500" },
        ].map((o) => (
          <div key={o.m} className="flex items-center justify-between rounded-lg bg-white border border-stone-100 p-2.5">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${o.c}`} />
              <span className="text-[10px] font-bold text-stone-900">{o.m}</span>
            </div>
            <span className="text-[8px] text-stone-400 font-medium">{o.s}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: "WhatsApp enviado",
    icon: MessageSquare,
    color: "bg-emerald-500",
    content: (
      <div className="space-y-2">
        <div className="rounded-lg bg-emerald-50 border border-emerald-200/60 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-stone-900">5678 DRS · Peugeot 308</span>
            <span className="text-[8px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Listo</span>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="rounded-lg bg-emerald-500 p-2.5 mt-2 flex items-center justify-center gap-2"
          >
            <Send className="h-3 w-3 text-white" />
            <span className="text-[10px] text-white font-bold">Avisar por WhatsApp</span>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="rounded-lg bg-white border border-emerald-200 p-2.5 flex items-center gap-2"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span className="text-[9px] text-stone-600">Cliente notificado correctamente</span>
        </motion.div>
      </div>
    ),
  },
];

function HeroMockupSequence({ prefersReducedMotion, mockupVariants }: { prefersReducedMotion: boolean | null; mockupVariants: any }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % demoSteps.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [prefersReducedMotion]);

  const current = demoSteps[step];

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

          {/* Animated content */}
          <div className="p-5 min-h-[340px]" style={{ background: "linear-gradient(180deg, #fafaf9 0%, #f5f3f0 100%)" }}>
            <div className="flex items-center justify-between mb-4">
              <FixaLogo size="xs" />
              <div className="flex items-center gap-2">
                <div className={`h-5 w-5 rounded-md ${current.color} flex items-center justify-center`}>
                  <current.icon className="h-3 w-3 text-white" />
                </div>
                <span className="text-[10px] text-stone-500 font-medium">{current.label}</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                {current.content}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {demoSteps.map((s, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === step ? "w-8 bg-brand-500" : "w-2 bg-stone-300 hover:bg-stone-400"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
