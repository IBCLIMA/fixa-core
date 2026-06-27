"use client";

import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import { track } from "@vercel/analytics";
import { Button } from "@/components/ui/button";
import { LandingBadge } from "@/components/landing/landing-badge";
import { AnimatedSection } from "@/components/landing/animated-section";
import { HexPattern } from "@/components/ui/brand-texture";

export function NosotrosHero() {
  return (
    <section className="relative overflow-hidden">
      <HexPattern opacity={0.025} />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-50/70 via-background to-background" />
      <div
        aria-hidden
        className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[42rem] max-w-full rounded-full bg-brand-200/30 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-10 pb-12 text-center lg:pt-14 lg:pb-16">
        <AnimatedSection>
          <LandingBadge>
            <Wrench className="h-3.5 w-3.5" />
            Taller real desde 2010
          </LandingBadge>
        </AnimatedSection>

        <AnimatedSection delay={0.05}>
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-5xl text-balance">
            FIXA no nació en una oficina.{" "}
            <span className="text-brand-600">Nació en un taller.</span>
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-stone-600 text-pretty">
            Lo construimos dentro de Ibañez Clima, un taller de verdad en marcha
            desde 2010. El software que nos hubiera gustado tener: simple, sin
            formación y sin humo.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="mt-8 flex justify-center">
            <Link href="/sign-up" onClick={() => track("cta_nosotros_hero")}>
              <Button
                size="lg"
                className="rounded-full bg-brand-500 text-white hover:bg-brand-400 font-bold h-13 px-8 text-base shadow-brand hover:shadow-brand-lg transition-all cursor-pointer group"
              >
                Probar FIXA gratis
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
