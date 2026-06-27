"use client";

import { Wrench, Hand, ShieldOff, HeartHandshake } from "lucide-react";
import { LandingBadge } from "@/components/landing/landing-badge";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/landing/animated-section";

/** Valores extraídos del copy real de Sergi / metadata de la página. Nada inventado. */
const VALORES = [
  {
    icon: Wrench,
    title: "Si no funciona en el taller, no llega a la app",
    desc: "Cada función se prueba con las manos manchadas antes de salir. Nada de pantallas bonitas que estorban en el foso.",
  },
  {
    icon: Hand,
    title: "Tan simple que se usa en 2 toques",
    desc: "Pensado para un mecánico ocupado, no para un informático. Si necesitas un manual, lo hemos hecho mal.",
  },
  {
    icon: ShieldOff,
    title: "Sin formación y sin humo",
    desc: "Te registras y empiezas. Sin cursos, sin comerciales, sin promesas que luego no se cumplen.",
  },
  {
    icon: HeartHandshake,
    title: "Entre compresores, no en una oficina",
    desc: "FIXA nació en Ibañez Clima, entre elevadores y recambios. Lo usamos cada día con talleres reales.",
  },
];

export function NosotrosValores() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
        <AnimatedSection className="text-center mb-10">
          <LandingBadge>Cómo trabajamos</LandingBadge>
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-4xl text-balance">
            Las reglas que no nos saltamos
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-stone-500 text-pretty">
            No es marketing. Es la forma en la que está hecho cada botón.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid gap-4 md:grid-cols-2">
          {VALORES.map((v) => (
            <StaggerItem key={v.title}>
              <div className="flex h-full items-start gap-4 rounded-2xl border border-stone-200/60 bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-brand">
                  <v.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold text-stone-900 text-balance">{v.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-stone-500 text-pretty">
                    {v.desc}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
