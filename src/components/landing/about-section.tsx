"use client";

import Image from "next/image";
import { LandingBadge } from "./landing-badge";
import { FixaLogo } from "@/components/ui/fixa-logo";
import { AnimatedSection } from "./animated-section";
import { HexPattern } from "@/components/ui/brand-texture";

export function AboutSection() {
  return (
    <section className="relative overflow-hidden">
      <HexPattern opacity={0.02} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-50/50 to-transparent" />

      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16 relative z-10">
        <AnimatedSection className="text-center mb-12">
          <LandingBadge>Sobre nosotros</LandingBadge>
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-5xl">
            ¿Quién ha hecho esto?
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="max-w-3xl mx-auto rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-200/50 p-8 relative overflow-hidden">
            {/* Accent bar */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-brand-500 to-brand-300 rounded-full" />

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Foto real */}
              <div className="shrink-0 mx-auto md:mx-0">
                <div className="relative">
                  <Image
                    src="/equipo/sergi.jpg"
                    alt="Sergi Ibañez — fundador de FIXA e Ibañez Clima"
                    width={180}
                    height={180}
                    className="rounded-2xl object-cover shadow-lg"
                  />
                  {/* Badge taller */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-stone-900 px-3 py-1 text-[11px] font-bold text-white shadow-lg whitespace-nowrap">
                    <FixaLogo size="xs" variant="icon" />
                    Ibañez Clima
                  </div>
                </div>
              </div>

              {/* Historia — tono cercano, divertido, real */}
              <div className="space-y-4 pl-4 md:pl-0">
                <p className="text-stone-600 leading-relaxed">
                  Buenas, soy Sergi 👋 Ingeniero Industrial Mecánico, aunque lo
                  que de verdad me define es que llevo desde 2010 al frente de{" "}
                  <strong className="text-stone-900">Ibañez Clima</strong>, una empresa
                  que da servicio a talleres mecánicos.
                </p>
                <p className="text-stone-600 leading-relaxed">
                  Eso significa que no conozco UN taller — conozco cientos.
                  Y en todos he visto los mismos problemas: el teléfono que
                  no para, los presupuestos a las 9 de la noche, las ITVs
                  que se escapan y el papel que nunca aparece cuando hace falta.
                </p>
                <p className="text-stone-600 leading-relaxed">
                  Un día me harté y dije:{" "}
                  <em className="text-stone-900">&ldquo;si ningún software del mercado
                  funciona para un mecánico con las manos manchadas, lo hago yo.&rdquo;</em>{" "}
                  Y lo hice. FIXA nació así: no en una oficina bonita, sino entre
                  compresores, elevadores y recambios.
                </p>
                <p className="text-stone-600 leading-relaxed">
                  Hoy la uso cada día con talleres reales. Si algo no funciona
                  en el taller, no llega a la app.{" "}
                  <strong className="text-stone-900">
                    Así de simple. Así de real.
                  </strong>
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-stone-200/50">
                  <div>
                    <p className="font-bold text-stone-900">Sergi Ibañez</p>
                    <p className="text-sm text-stone-500">Ingeniero Industrial Mecánico · Gerente de Ibañez Clima desde 2010 · Fundador de FIXA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
