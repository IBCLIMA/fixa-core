"use client";

import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Aurora from "@/components/ui/aurora";
import BlurText from "@/components/ui/blur-text";
import { AnimatedSection } from "./animated-section";
import { useReducedMotion } from "framer-motion";

export function CtaSection() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <section className="relative overflow-hidden min-h-[500px] flex items-center">
      {/* Aurora WebGL background (off si reduced motion) */}
      <div className="absolute inset-0 bg-stone-950">
        {!prefersReducedMotion && (
          <Aurora
            colorStops={["#F97316", "#3B82F6", "#F97316"]}
            amplitude={1.2}
            blend={0.6}
            speed={0.8}
            className="opacity-60"
          />
        )}
      </div>

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-stone-950/40" />

      <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32 text-center relative z-10">
        <BlurText
          text="Tu taller merece mejores herramientas."
          className="text-4xl font-extrabold tracking-tight text-white md:text-6xl leading-[1.1] justify-center"
          delay={40}
          animateBy="words"
          direction="bottom"
        />

        <AnimatedSection delay={0.4}>
          <p className="text-stone-300 mt-6 max-w-md mx-auto text-lg leading-relaxed">
            14 días gratis. Te lo dejamos montado. Importa tus clientes y empieza a trabajar sin papel.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.6}>
          <div className="flex flex-col items-center gap-4 mt-10 sm:flex-row sm:justify-center">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="rounded-full bg-orange-500 text-white hover:bg-orange-400 font-bold h-14 px-10 text-base shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/40 transition-all cursor-pointer group"
              >
                Empezar gratis
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <a href="https://wa.me/34611433218?text=Hola%2C%20quiero%20información%20sobre%20FIXA" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full h-14 px-8 text-base font-semibold border-white/30 text-white hover:bg-white/10 cursor-pointer"
              >
                <Phone className="mr-2 h-4 w-4" />
                Hablar por WhatsApp
              </Button>
            </a>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.7}>
          <p className="text-xs text-stone-400 mt-8">
            Sin permanencia · Sin tarjeta de crédito · Setup gratuito
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
