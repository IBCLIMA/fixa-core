"use client";

import Image from "next/image";
import { FixaLogo } from "@/components/ui/fixa-logo";
import { AnimatedSection } from "./animated-section";
import { HexPattern } from "@/components/ui/brand-texture";

export function AboutSection() {
  return (
    <section className="relative overflow-hidden">
      <HexPattern opacity={0.02} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-50/50 to-transparent" />

      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28 relative z-10">
        <AnimatedSection className="text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-4 py-1.5 text-xs font-semibold text-orange-700 mb-4">
            Sobre nosotros
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-5xl">
            No somos una multinacional.
            <br />
            <span className="text-stone-400">Somos mecánicos como tú.</span>
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="max-w-3xl mx-auto rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-200/50 p-8 relative overflow-hidden">
            {/* Accent bar */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500 to-orange-300 rounded-full" />

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

              {/* Historia */}
              <div className="space-y-4 pl-4 md:pl-0">
                <p className="text-stone-600 leading-relaxed">
                  Me llamo Sergi y soy mecánico. Llevo desde 2010 con Ibañez Clima, un taller
                  de automoción donde hacemos de todo: mecánica, diagnosis, climatización, pre-ITV.
                  Un taller de verdad, como el tuyo.
                </p>
                <p className="text-stone-600 leading-relaxed">
                  FIXA nació porque me cansé de perder horas respondiendo llamadas de{" "}
                  <em>&ldquo;¿está listo mi coche?&rdquo;</em>, de hacer presupuestos a las 9 de la noche
                  y de olvidarme de avisar a clientes con la ITV vencida. El papel y el WhatsApp
                  ya no daban más de sí.
                </p>
                <p className="text-stone-600 leading-relaxed">
                  Así que construí el software que me hubiera gustado tener.{" "}
                  <strong className="text-stone-900">
                    Simple, barato y que funciona con las manos manchadas — desde el PC o el móvil.
                  </strong>{" "}
                  Lo uso cada día en mi propio taller. Si algo no funciona ahí, no llega a la app.
                </p>
                <p className="text-stone-900 font-bold text-lg">
                  FIXA es la herramienta del mecánico, hecha por un mecánico.
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-stone-200/50">
                  <div>
                    <p className="font-bold text-stone-900">Sergi Ibañez</p>
                    <p className="text-sm text-stone-500">Fundador de FIXA · Mecánico en Ibañez Clima desde 2010</p>
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
