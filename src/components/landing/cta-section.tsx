"use client";

import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@vercel/analytics";
import BlurText from "@/components/ui/blur-text";
import { AnimatedSection } from "./animated-section";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden min-h-[500px] flex items-center">
      <div className="absolute inset-0 bg-stone-950" />

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-stone-950/40" />

      <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20 text-center relative z-10">
        <BlurText
          text="Mañana abres el taller. ¿A ciegas o con la torre de control?"
          className="text-4xl font-extrabold tracking-tight text-white md:text-6xl leading-[1.1] justify-center"
          delay={40}
          animateBy="words"
          direction="bottom"
        />

        <AnimatedSection delay={0.4}>
          <p className="text-stone-300 mt-6 max-w-lg mx-auto text-lg leading-relaxed">
            FIXA no es una pantalla más. Es quien te avisa de lo que necesita atención. Te registras en 1 minuto, sin tarjeta. Y si no te convence, lo borras todo sin dar explicaciones.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.6}>
          <div className="flex flex-col items-center gap-4 mt-10 sm:flex-row sm:justify-center">
            <Link href="/sign-up" onClick={() => track("cta_final")}>
              <Button
                size="lg"
                className="rounded-full bg-brand-500 text-white hover:bg-brand-400 font-bold h-14 px-10 text-base shadow-brand hover:shadow-brand-lg transition-all cursor-pointer group"
              >
                Empezar gratis
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <a href="https://wa.me/34611433218?text=Hola%2C%20quiero%20información%20sobre%20FIXA" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full h-14 px-8 text-base font-semibold bg-[#25D366] text-white hover:bg-[#1fb959] border-0 cursor-pointer"
              >
                <Phone className="mr-2 h-4 w-4" />
                Hablar por WhatsApp
              </Button>
            </a>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.7}>
          <p className="text-xs text-stone-400 mt-8">
            Sin permanencia · Sin tarjeta · Si no te gusta, lo borras y aquí no ha pasado nada
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
