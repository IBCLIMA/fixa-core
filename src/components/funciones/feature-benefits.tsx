"use client";

import { Smartphone, ShieldCheck, Wrench, MessageCircle } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/landing/animated-section";

const BENEFITS = [
  {
    icon: Smartphone,
    title: "Sin instalar nada",
    desc: "Funciona en móvil, tablet y PC. Abres el navegador y a trabajar.",
  },
  {
    icon: Wrench,
    title: "Hecho por mecánicos",
    desc: "Probado cada día en un taller real. Si no sirve en el foso, no llega a la app.",
  },
  {
    icon: ShieldCheck,
    title: "Sin tarjeta ni permanencia",
    desc: "Empiezas gratis. Si no te convence, lo borras y aquí no ha pasado nada.",
  },
  {
    icon: MessageCircle,
    title: "Soporte por WhatsApp",
    desc: "Escribes y te responde una persona que conoce el taller. De verdad.",
  },
];

export function FeatureBenefits() {
  return (
    <StaggerContainer className="grid gap-3 sm:grid-cols-2">
      {BENEFITS.map((b) => (
        <StaggerItem key={b.title}>
          <div className="flex h-full items-start gap-3 rounded-2xl border border-stone-200/60 bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <b.icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h3 className="font-semibold text-stone-900">{b.title}</h3>
              <p className="mt-0.5 text-sm leading-relaxed text-stone-500">{b.desc}</p>
            </div>
          </div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
