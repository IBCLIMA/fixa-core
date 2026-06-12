"use client";

import { PhoneOff, Clock, Timer } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { TRANSITION_DEFAULT } from "./animation-config";
import { AnimatedSection } from "./animated-section";

const problems = [
  {
    icon: PhoneOff,
    color: "text-red-500",
    bg: "bg-red-500/10",
    accent: "border-red-200/50",
    title: "El teléfono no para",
    desc: '"¿Está listo mi coche?" — la misma pregunta 20 veces al día. Te saca de debajo del coche constantemente.',
  },
  {
    icon: Timer,
    color: "text-amber-600",
    bg: "bg-amber-500/10",
    accent: "border-amber-200/50",
    title: "Excel, papel y WhatsApp",
    desc: "Presupuestos a mano, citas en la cabeza, facturas al final del día. Horas que no cobras.",
  },
  {
    icon: Clock,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    accent: "border-blue-200/50",
    title: "Clientes que desaparecen",
    desc: "No les avisas de la ITV, no les recuerdas la revisión. Se van al taller de al lado.",
  },
];

export function ProblemSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-100/50 to-transparent" />

      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28 relative z-10">
        <AnimatedSection className="text-center mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-4 py-1.5 text-xs font-semibold text-orange-700 mb-4">
            El problema
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-5xl">
            El papel ya no funciona.
            <br />
            <span className="text-stone-400">Los ERPs cuestan una pasta.</span>
          </h2>
        </AnimatedSection>

        <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ ...TRANSITION_DEFAULT, delay: i * 0.12 }}
              className={`rounded-2xl bg-white/70 backdrop-blur-sm border ${p.accent} p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${p.bg} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <p.icon className={`h-6 w-6 ${p.color}`} />
              </div>
              <h3 className="font-bold text-stone-900 text-lg mb-2">{p.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
