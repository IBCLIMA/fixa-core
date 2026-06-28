"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedSection } from "./animated-section";
import { TRANSITION_DEFAULT } from "./animation-config";

const steps = [
  {
    step: "01",
    title: "Abres FIXA y ves qué necesita atención",
    desc: "Lo primero del día, de un vistazo: qué coche está bloqueado esperando una pieza, qué cliente lleva dos días sin respuesta, qué entrega toca hoy. Sin buscar nada.",
  },
  {
    step: "02",
    title: "Te avisa de lo que se te escaparía",
    desc: "Un presupuesto sin aceptar que se enfría. Una ITV que vence este mes. Un coche que lleva parado demasiado. FIXA lo levanta antes de que se convierta en un problema.",
  },
  {
    step: "03",
    title: "El cliente se entera solo, sin llamarte",
    desc: "Cada cliente ve el estado de su coche en tiempo real desde un enlace. Cuando hay novedad, le llega por WhatsApp. Se acabó el '¿ya está listo?' veinte veces al día.",
  },
  {
    step: "04",
    title: "Cierras el día sabiendo que no se quedó nada fuera",
    desc: "Entregas, cobras y pides reseña en un solo WhatsApp. Y cuando apagas la luz del taller, nada importante se ha quedado olvidado en un rincón.",
  },
];

export function HowItWorksSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-stone-950" />
      <div className="absolute inset-0 bg-stone-950/30" />

      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-400 mb-4">
            Tu día, ya ordenado
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            FIXA te dice
            <br />
            <span className="text-stone-500">qué hacer hoy.</span>
          </h2>
          <p className="text-stone-400 mt-5 text-lg max-w-xl mx-auto">
            No te muestra datos para que los interpretes tú. Cada mañana sabes qué necesita atención, sin buscar nada.
          </p>
        </AnimatedSection>

        <div className="relative max-w-3xl mx-auto">
          {/* Connector line */}
          <div className="hidden md:block absolute top-0 bottom-0 left-[28px] w-px">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-px bg-gradient-to-b from-brand-500/60 via-brand-500/20 to-transparent origin-top"
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
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-brand relative z-10"
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
