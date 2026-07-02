"use client";

import { useState } from "react";
import { LandingBadge } from "./landing-badge";
import Link from "next/link";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@vercel/analytics";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedSection } from "./animated-section";
import { TRANSITION_DEFAULT } from "./animation-config";
import { cn } from "@/lib/utils";

// UN solo plan, todo incluido. Decidir entre planes es fricción, y la fricción
// mata ventas a talleres. El precio (49€) viene del estudio de mercado 07/2026:
// la competencia solo da portal+presupuestos online en planes de 99-159€/mes,
// y la franja que ya paga un taller de 2-8 mecánicos es 35-60€/mes.
const PRECIO_MES = 49;
const PRECIO_MES_ANUAL = 41; // 490€/año ≈ 2 meses gratis

const FEATURES = [
  "Portal del cliente en tiempo real (deja de recibir llamadas)",
  "Presupuestos que se aceptan online, con validez legal",
  "Avisos de ITV y mantenimientos automáticos",
  "Órdenes de trabajo legales (RD 1457/1986)",
  "Agenda del taller y citas online",
  "WhatsApp integrado en cada paso",
  "Todo tu equipo, sin pagar por usuario",
  "Tus datos importados y soporte directo",
];

export function PricingSection() {
  const prefersReducedMotion = useReducedMotion();
  const [anual, setAnual] = useState(false);
  const precio = anual ? PRECIO_MES_ANUAL : PRECIO_MES;

  return (
    <section id="precios" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(249,115,22,0.05),transparent)]" />

      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16 relative z-10">
        <AnimatedSection className="text-center mb-10">
          <LandingBadge>Precio</LandingBadge>
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-5xl">
            Un precio. Todo dentro. Sin sorpresas.
          </h2>
          <p className="text-stone-500 mt-4 text-lg max-w-xl mx-auto">
            Nada de planes, ni «funciones premium», ni calculadoras. Recupera un
            presupuesto al mes y FIXA se paga sola.
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
              2 meses gratis
            </span>
          )}
        </AnimatedSection>

        {/* La card única */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={TRANSITION_DEFAULT}
          className="relative mx-auto max-w-lg rounded-2xl overflow-hidden bg-stone-950 text-white shadow-2xl shadow-stone-900/20"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500/20 via-transparent to-blue-500/10" />
          <div className="absolute top-0 left-0 right-0 flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-xs font-bold">
            <Sparkles className="h-3 w-3" />
            Todo incluido
          </div>

          <div className="p-8 pt-14 relative">
            <h3 className="font-bold text-lg text-white">FIXA</h3>
            <p className="text-sm mt-1 text-stone-400">El taller entero bajo control. Sin recortes.</p>

            <div className="flex items-baseline gap-1.5 mt-6 mb-3">
              <span className="text-6xl font-extrabold tracking-tight text-white">{precio}€</span>
              <span className="text-sm text-stone-400">/mes <span className="text-[11px]">+ IVA</span></span>
            </div>

            {anual && (
              <p className="text-xs mb-3 text-stone-400">
                <span className="line-through">{PRECIO_MES}€</span> · Facturado anualmente (490€/año + IVA)
              </p>
            )}

            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold mb-6 bg-emerald-500/15 text-emerald-400">
              <Check className="h-3 w-3" />
              14 días gratis · sin tarjeta
            </div>

            <div className="space-y-3 mb-8">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-brand-400" />
                  <span className="text-stone-300">{f}</span>
                </div>
              ))}
            </div>

            <Link href="/sign-up" onClick={() => track("cta_precios", { plan: "unico", ciclo: anual ? "anual" : "mensual" })}>
              <Button className="w-full rounded-full font-bold h-12 cursor-pointer group bg-brand-500 text-white hover:bg-brand-400 shadow-brand">
                Empezar gratis
                <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <AnimatedSection delay={0.3} className="text-center mt-8">
          <p className="text-sm text-stone-400">
            Sin permanencia: cancela el mes que quieras · Precios sin IVA
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
