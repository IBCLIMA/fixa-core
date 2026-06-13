"use client";

import { Wrench, Calendar, Shield, CreditCard } from "lucide-react";
import { AnimatedSection } from "./animated-section";

/**
 * Barra de stats VERIFICABLES — solo datos reales.
 * No "2.400+ talleres" inventados. Nuestros números son honestos
 * y hasta que tengamos clientes de pago, lo que decimos se puede comprobar.
 */
const stats = [
  { icon: Wrench, valor: "Desde 2010", label: "Taller real detrás", color: "text-orange-600" },
  { icon: Calendar, valor: "14 días", label: "Prueba gratis sin tarjeta", color: "text-blue-600" },
  { icon: Shield, valor: "RD 1457/1986", label: "OR conforme a la ley", color: "text-emerald-600" },
  { icon: CreditCard, valor: "29€/mes", label: "Sin permanencia", color: "text-violet-600" },
];

export function StatsBar() {
  return (
    <section className="border-y border-stone-200/60 bg-white/50 backdrop-blur-sm">
      <AnimatedSection className="mx-auto max-w-5xl px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-50 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-extrabold text-stone-900 leading-tight">{s.valor}</p>
                <p className="text-xs text-stone-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}
