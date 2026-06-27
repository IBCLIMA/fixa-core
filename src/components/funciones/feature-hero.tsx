"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  Search,
  MessageSquare,
  Car,
  CalendarDays,
  Bell,
  Users,
  FileText,
  Megaphone,
  Camera,
  Shield,
  Smartphone,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { track } from "@vercel/analytics";
import { Button } from "@/components/ui/button";
import { LandingBadge } from "@/components/landing/landing-badge";
import { AnimatedSection } from "@/components/landing/animated-section";
import { HexPattern } from "@/components/ui/brand-texture";

/** Mapa nombre de icono (Velite) → componente lucide. Fallback: Wrench. */
const ICONS: Record<string, LucideIcon> = {
  ClipboardList,
  Search,
  MessageSquare,
  Car,
  CalendarDays,
  Bell,
  Users,
  FileText,
  Megaphone,
  Camera,
  Shield,
  Smartphone,
};

export function FeatureHero({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  const Icon = ICONS[icon] ?? Wrench;

  return (
    <section className="relative overflow-hidden">
      <HexPattern opacity={0.025} />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-50/70 via-background to-background" />
      <div
        aria-hidden
        className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[42rem] max-w-full rounded-full bg-brand-200/30 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-10 pb-12 lg:pt-14 lg:pb-16">
        <AnimatedSection>
          <Link
            href="/funciones"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Todas las funciones
          </Link>
        </AnimatedSection>

        <AnimatedSection delay={0.05}>
          <div className="flex items-center gap-3 mb-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-brand">
              <Icon className="h-6 w-6" />
            </span>
            <LandingBadge className="mb-0">Funciones de FIXA</LandingBadge>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-5xl text-balance">
            {title}
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600 text-pretty">
            {description}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/sign-up" onClick={() => track("cta_funcion_hero")}>
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full bg-brand-500 text-white hover:bg-brand-400 font-bold h-13 px-8 text-base shadow-brand hover:shadow-brand-lg transition-all cursor-pointer group"
              >
                Probar gratis
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Link href="/demo" onClick={() => track("cta_funcion_demo")}>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-full h-13 px-8 text-base font-semibold cursor-pointer"
              >
                Ver la demo
              </Button>
            </Link>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.25}>
          <p className="mt-4 text-xs text-muted-foreground">
            Sin tarjeta · Sin permanencia · Sin instalar nada
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
