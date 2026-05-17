"use client";

import Link from "next/link";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedSection } from "./animated-section";
import { TRANSITION_DEFAULT } from "./animation-config";

const precios = [
  {
    nombre: "Básico",
    precio: "29",
    desc: "Para talleres pequeños",
    features: ["1 usuario", "Clientes ilimitados", "Órdenes de trabajo", "Calendario", "WhatsApp básico", "Portal del cliente"],
    popular: false,
  },
  {
    nombre: "Taller",
    precio: "49",
    desc: "Todo lo que necesitas",
    features: ["Hasta 5 usuarios", "Todo lo del plan Básico", "Avisos ITV automáticos", "Ofertas masivas", "Presupuestos", "Importar datos CSV", "Soporte prioritario"],
    popular: true,
  },
  {
    nombre: "Pro",
    precio: "79",
    desc: "Para talleres grandes",
    features: ["Usuarios ilimitados", "Todo lo del plan Taller", "Multi-taller", "Informes avanzados", "Personalización", "Soporte dedicado"],
    popular: false,
  },
];

export function PricingSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="precios" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(249,115,22,0.05),transparent)]" />

      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28 relative z-10">
        <AnimatedSection className="text-center mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-4 py-1.5 text-xs font-semibold text-orange-700 mb-4">
            Precios
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-5xl">
            Sin sorpresas. Sin permanencia.
          </h2>
          <p className="text-stone-500 mt-4 text-lg">14 días gratis en todos los planes</p>
        </AnimatedSection>

        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          {precios.map((p, i) => (
            <motion.div
              key={p.nombre}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ ...TRANSITION_DEFAULT, delay: i * 0.1 }}
              className={`relative rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 ${
                p.popular
                  ? "bg-stone-950 text-white shadow-2xl shadow-stone-900/20 md:scale-[1.03]"
                  : "bg-white/70 backdrop-blur-sm border border-stone-200/50 shadow-sm"
              }`}
            >
              {p.popular && (
                <>
                  {/* Gradient border glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/20 via-transparent to-blue-500/10" />
                  <div className="absolute top-0 left-0 right-0 flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-xs font-bold">
                    <Sparkles className="h-3 w-3" />
                    Más popular
                  </div>
                </>
              )}

              <div className={`p-6 relative ${p.popular ? "pt-12" : ""}`}>
                <h3 className={`font-bold text-lg ${p.popular ? "text-white" : "text-stone-900"}`}>{p.nombre}</h3>
                <p className={`text-sm mt-1 ${p.popular ? "text-stone-400" : "text-stone-500"}`}>{p.desc}</p>

                <div className="flex items-baseline gap-1 mt-6 mb-8">
                  <span className={`text-5xl font-extrabold tracking-tight ${p.popular ? "text-white" : "text-stone-900"}`}>
                    {p.precio}€
                  </span>
                  <span className={`text-sm ${p.popular ? "text-stone-400" : "text-stone-400"}`}>/mes</span>
                </div>

                <div className="space-y-3 mb-8">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5 text-sm">
                      <Check className={`h-4 w-4 shrink-0 ${p.popular ? "text-orange-400" : "text-emerald-500"}`} />
                      <span className={p.popular ? "text-stone-300" : "text-stone-600"}>{f}</span>
                    </div>
                  ))}
                </div>

                <Link href="/sign-up">
                  <Button
                    className={`w-full rounded-full font-bold h-12 cursor-pointer group ${
                      p.popular
                        ? "bg-orange-500 text-white hover:bg-orange-400 shadow-lg shadow-orange-500/20"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    Empezar gratis
                    <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatedSection delay={0.3} className="text-center mt-8">
          <p className="text-sm text-stone-400">
            IVA no incluido · Facturación mensual · Cancela cuando quieras
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
