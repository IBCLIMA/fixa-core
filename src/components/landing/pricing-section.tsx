"use client";

import { useState } from "react";
import { LandingBadge } from "./landing-badge";
import Link from "next/link";
import { Check, X, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@vercel/analytics";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedSection } from "./animated-section";
import { TRANSITION_DEFAULT } from "./animation-config";
import { cn } from "@/lib/utils";
import { formatMoneyShort } from "@/lib/format";

const precios = [
  {
    nombre: "Básico",
    precio: 29,
    precioAnual: 24,
    desc: "Para arrancar tú solo",
    features: ["1 usuario", "Clientes ilimitados", "Órdenes de trabajo legales (RD 1457/1986)", "Calendario y citas online", "WhatsApp integrado", "Portal del cliente"],
    popular: false,
  },
  {
    nombre: "Taller",
    precio: 49,
    precioAnual: 39,
    desc: "Lo que usa la mayoría",
    features: ["Hasta 5 usuarios", "Todo lo del plan Básico", "Avisos ITV automáticos", "Presupuestos que se aceptan online", "Envío masivo de ofertas", "Importar datos CSV", "Soporte prioritario"],
    popular: true,
  },
  {
    nombre: "Pro",
    precio: 79,
    precioAnual: 65,
    desc: "Para equipos y varios talleres",
    features: ["Usuarios ilimitados", "Todo lo del plan Taller", "Multi-taller", "Informes avanzados", "Personalización", "Soporte dedicado"],
    popular: false,
  },
];

// Tabla de comparación (skill: Comparison Table Focus pattern)
const comparacionFeatures = [
  { feature: "Órdenes de trabajo legales", basico: true, taller: true, pro: true },
  { feature: "Presupuestos online", basico: false, taller: true, pro: true },
  { feature: "WhatsApp integrado", basico: true, taller: true, pro: true },
  { feature: "Portal del cliente", basico: true, taller: true, pro: true },
  { feature: "Calendario y citas online", basico: true, taller: true, pro: true },
  { feature: "Avisos ITV automáticos", basico: false, taller: true, pro: true },
  { feature: "Envío de ofertas masivo", basico: false, taller: true, pro: true },
  { feature: "Importar datos CSV", basico: false, taller: true, pro: true },
  { feature: "Multi-taller", basico: false, taller: false, pro: true },
  { feature: "Informes avanzados", basico: false, taller: false, pro: true },
  { feature: "Usuarios", basico: "1", taller: "5", pro: "Sin límite" },
  { feature: "Soporte", basico: "Email", taller: "Prioritario", pro: "Dedicado" },
];

function CellValue({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="h-4 w-4 text-emerald-500 mx-auto" />;
  if (value === false) return <X className="h-4 w-4 text-stone-300 mx-auto" />;
  return <span className="text-xs font-medium text-stone-600">{value}</span>;
}

export function PricingSection() {
  const prefersReducedMotion = useReducedMotion();
  const [anual, setAnual] = useState(false);

  return (
    <section id="precios" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(249,115,22,0.05),transparent)]" />

      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16 relative z-10">
        <AnimatedSection className="text-center mb-10">
          <LandingBadge>Precios</LandingBadge>
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-5xl">
            Recupera un presupuesto al mes y se paga solo.
          </h2>
          <p className="text-stone-500 mt-4 text-lg max-w-xl mx-auto">
            Una revisión que no se escapa, un cliente que vuelve, un presupuesto que persigues a tiempo. Con eso ya cubres el mes. 14 días gratis en todos los planes.
          </p>
        </AnimatedSection>

        {/* Toggle mensual/anual */}
        <AnimatedSection delay={0.1} className="flex items-center justify-center gap-3 mb-10">
          <span className={cn("text-sm font-medium transition-colors", !anual ? "text-stone-900" : "text-stone-400")}>Mensual</span>
          <button
            onClick={() => setAnual(!anual)}
            className={cn(
              "relative h-7 w-12 rounded-full transition-colors cursor-pointer",
              anual ? "bg-brand-500" : "bg-stone-300"
            )}
            aria-label={anual ? "Cambiar a mensual" : "Cambiar a anual"}
          >
            <div className={cn(
              "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform",
              anual ? "translate-x-5" : "translate-x-0.5"
            )} />
          </button>
          <span className={cn("text-sm font-medium transition-colors", anual ? "text-stone-900" : "text-stone-400")}>
            Anual
          </span>
          {anual && (
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
              Ahorra ~20%
            </span>
          )}
        </AnimatedSection>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          {precios.map((p, i) => {
            const precio = anual ? p.precioAnual : p.precio;
            return (
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
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500/20 via-transparent to-blue-500/10" />
                    <div className="absolute top-0 left-0 right-0 flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-xs font-bold">
                      <Sparkles className="h-3 w-3" />
                      Más popular
                    </div>
                  </>
                )}

                <div className={`p-6 relative ${p.popular ? "pt-12" : ""}`}>
                  <h3 className={`font-bold text-lg ${p.popular ? "text-white" : "text-stone-900"}`}>{p.nombre}</h3>
                  <p className={`text-sm mt-1 ${p.popular ? "text-stone-400" : "text-stone-500"}`}>{p.desc}</p>

                  <div className="flex items-baseline gap-1 mt-6 mb-3">
                    <span className={`text-5xl font-extrabold tracking-tight ${p.popular ? "text-white" : "text-stone-900"}`}>
                      {formatMoneyShort(precio)}
                    </span>
                    <span className={`text-sm ${p.popular ? "text-stone-400" : "text-stone-400"}`}>/mes</span>
                  </div>

                  {anual && (
                    <p className={`text-xs mb-3 ${p.popular ? "text-stone-400" : "text-stone-400"}`}>
                      <span className="line-through">{formatMoneyShort(p.precio)}</span> · Facturado anualmente ({formatMoneyShort(precio * 12)}/año)
                    </p>
                  )}

                  <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold mb-6 ${
                    p.popular ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-50 text-emerald-700"
                  }`}>
                    <Check className="h-3 w-3" />
                    14 días gratis · sin tarjeta
                  </div>

                  <div className="space-y-3 mb-8">
                    {p.features.map((f) => (
                      <div key={f} className="flex items-center gap-2.5 text-sm">
                        <Check className={`h-4 w-4 shrink-0 ${p.popular ? "text-brand-400" : "text-emerald-500"}`} />
                        <span className={p.popular ? "text-stone-300" : "text-stone-600"}>{f}</span>
                      </div>
                    ))}
                  </div>

                  <Link href="/sign-up" onClick={() => track("cta_precios", { plan: p.nombre, ciclo: anual ? "anual" : "mensual" })}>
                    <Button
                      className={`w-full rounded-full font-bold h-12 cursor-pointer group ${
                        p.popular
                          ? "bg-brand-500 text-white hover:bg-brand-400 shadow-brand"
                          : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                      }`}
                    >
                      Empezar gratis
                      <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <AnimatedSection delay={0.3} className="text-center mt-8">
          <p className="text-sm text-stone-400">
            Sin permanencia: cancela el mes que quieras · Precios sin IVA
          </p>
        </AnimatedSection>

        {/* Tabla comparativa (skill: Comparison Table Focus) */}
        <AnimatedSection delay={0.4} className="mt-16">
          <h3 className="text-xl font-extrabold text-stone-900 text-center mb-6">
            Para los que quieren verlo con lupa
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-stone-200/60 bg-white/70 backdrop-blur-sm">
            <table className="w-full min-w-[500px] text-sm">
              <thead>
                <tr className="border-b border-stone-200/60">
                  <th className="text-left py-3 px-4 font-bold text-stone-500 text-xs uppercase tracking-wider">Función</th>
                  <th className="py-3 px-4 font-bold text-stone-500 text-xs uppercase tracking-wider text-center">Básico</th>
                  <th className="py-3 px-4 font-bold text-xs uppercase tracking-wider text-center bg-brand-50/50 text-brand-700">Taller</th>
                  <th className="py-3 px-4 font-bold text-stone-500 text-xs uppercase tracking-wider text-center">Pro</th>
                </tr>
              </thead>
              <tbody>
                {comparacionFeatures.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "" : "bg-stone-50/50"}>
                    <td className="py-2.5 px-4 text-stone-700 font-medium">{row.feature}</td>
                    <td className="py-2.5 px-4 text-center"><CellValue value={row.basico} /></td>
                    <td className="py-2.5 px-4 text-center bg-brand-50/30"><CellValue value={row.taller} /></td>
                    <td className="py-2.5 px-4 text-center"><CellValue value={row.pro} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
