"use client";

import { PhoneOff, Clock, FileX, CheckCircle2, Smartphone, Bell, MessageSquare, ClipboardList } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedSection } from "./animated-section";
import { TRANSITION_DEFAULT } from "./animation-config";

const before = [
  { icon: PhoneOff, text: "20 llamadas al día: ¿está listo?" },
  { icon: Clock, text: "Presupuestos a las 9 de la noche" },
  { icon: FileX, text: "Citas apuntadas en post-its" },
  { icon: PhoneOff, text: "Clientes que se van sin avisar" },
];

const after = [
  { icon: Smartphone, text: "El cliente ve el estado online" },
  { icon: ClipboardList, text: "Presupuesto en 2 toques desde la orden" },
  { icon: Bell, text: "Avisos ITV automáticos que generan trabajo" },
  { icon: MessageSquare, text: "WhatsApp listo con un clic" },
];

export function BeforeAfterSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-50/50 to-transparent" />

      <div className="mx-auto max-w-5xl px-6 py-20 lg:py-28 relative z-10">
        <AnimatedSection className="text-center mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-4 py-1.5 text-xs font-semibold text-orange-700 mb-4">
            El cambio
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-5xl">
            Un día en tu taller
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Before */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={TRANSITION_DEFAULT}
            className="rounded-2xl bg-red-50/50 border border-red-200/30 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
                <span className="text-lg">😤</span>
              </div>
              <div>
                <h3 className="font-bold text-stone-900">Sin FIXA</h3>
                <p className="text-xs text-stone-500">El caos de siempre</p>
              </div>
            </div>
            <div className="space-y-3">
              {before.map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...TRANSITION_DEFAULT, delay: i * 0.1 }}
                  className="flex items-center gap-3 rounded-xl bg-white/60 p-3"
                >
                  <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                    <item.icon className="h-4 w-4 text-red-500" />
                  </div>
                  <span className="text-sm text-stone-700">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ ...TRANSITION_DEFAULT, delay: 0.15 }}
            className="rounded-2xl bg-emerald-50/50 border border-emerald-200/30 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <span className="text-lg">😎</span>
              </div>
              <div>
                <h3 className="font-bold text-stone-900">Con FIXA</h3>
                <p className="text-xs text-stone-500">Todo bajo control</p>
              </div>
            </div>
            <div className="space-y-3">
              {after.map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={prefersReducedMotion ? {} : { opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...TRANSITION_DEFAULT, delay: 0.15 + i * 0.1 }}
                  className="flex items-center gap-3 rounded-xl bg-white/60 p-3"
                >
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                    <item.icon className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span className="text-sm text-stone-700">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
