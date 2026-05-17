"use client";

import { motion, useReducedMotion } from "framer-motion";
import Aurora from "@/components/ui/aurora";
import { AnimatedSection } from "./animated-section";
import { TRANSITION_DEFAULT } from "./animation-config";

const steps = [
  {
    step: "01",
    title: "Importa tus clientes",
    desc: "Sube un CSV con tu base de datos o créalos uno a uno. En 30 minutos todo migrado.",
  },
  {
    step: "02",
    title: "Entra un coche → matrícula",
    desc: "Escribe la matrícula, describe qué le pasa, crea la orden. 10 segundos.",
  },
  {
    step: "03",
    title: "Trabaja sin interrupciones",
    desc: "El cliente ve el estado online. Tú solo cambias el estado y avisas con un toque.",
  },
];

export function HowItWorksSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      {/* Aurora WebGL background */}
      <div className="absolute inset-0 bg-stone-950">
        <Aurora
          colorStops={["#F97316", "#8B5CF6", "#F97316"]}
          amplitude={0.8}
          blend={0.7}
          speed={0.6}
          className="opacity-40"
        />
      </div>
      <div className="absolute inset-0 bg-stone-950/30" />

      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-400 mb-4">
            Así de fácil
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Funcionando en 3 pasos
          </h2>
        </AnimatedSection>

        <div className="relative max-w-3xl mx-auto">
          {/* Connector line */}
          <div className="hidden md:block absolute top-0 bottom-0 left-[28px] w-px">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-px bg-gradient-to-b from-orange-500/60 via-orange-500/20 to-transparent origin-top"
            />
          </div>

          <div className="space-y-8 md:space-y-12">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ ...TRANSITION_DEFAULT, delay: i * 0.15 }}
                className="flex gap-6 items-start"
              >
                <motion.div
                  initial={prefersReducedMotion ? {} : { scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.3 + i * 0.15,
                  }}
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20 relative z-10"
                >
                  <span className="text-lg font-extrabold text-white">{s.step}</span>
                </motion.div>

                <div className="pt-2">
                  <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-stone-400 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
