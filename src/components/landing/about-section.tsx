"use client";

import { FixaLogo } from "@/components/ui/fixa-logo";
import { AnimatedSection } from "./animated-section";

export function AboutSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-50/50 to-transparent" />

      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <AnimatedSection>
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-4 py-1.5 text-xs font-semibold text-orange-700 mb-4">
              Sobre nosotros
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-5xl mb-8">
              No somos una multinacional.
              <br />
              <span className="text-stone-400">Somos mecánicos como tú.</span>
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-200/50 p-8 text-left space-y-4 relative overflow-hidden">
              {/* Accent bar */}
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500 to-orange-300 rounded-full" />

              <p className="text-stone-600 leading-relaxed pl-4">
                FIXA nace de un taller real. Sabemos lo que es atender el teléfono con las manos llenas de grasa, hacer presupuestos a las 9 de la noche, y perder clientes porque no les avisaste de la ITV.
              </p>
              <p className="text-stone-600 leading-relaxed pl-4">
                Por eso hemos creado el software que nos hubiera gustado tener.{" "}
                <strong className="text-stone-900">Simple, barato, y que funciona desde el móvil.</strong> Sin formación. Sin contratos. Sin letra pequeña.
              </p>
              <p className="text-stone-900 font-bold text-lg pl-4">
                Ponemos la tecnología al alcance del taller de barrio.
              </p>

              <div className="flex items-center gap-3 mt-2 pt-5 border-t border-stone-200/50 pl-4">
                <FixaLogo size="sm" variant="icon" />
                <div>
                  <p className="font-bold text-stone-900">Ibañez Clima</p>
                  <p className="text-sm text-stone-500">Taller mecánico · Automoción · Desde 2010</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
