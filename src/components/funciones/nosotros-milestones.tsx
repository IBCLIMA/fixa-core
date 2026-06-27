"use client";

import { StaggerContainer, StaggerItem } from "@/components/landing/animated-section";

/**
 * Cifras reales (no inventadas):
 * - 2010: año de fundación de Ibañez Clima (about-section + JSON-LD foundingDate).
 * - años: derivado en runtime (año actual − 2010).
 * - "Cientos": del copy de Sergi — "no conozco UN taller, conozco cientos".
 * - "1": un fundador que usa FIXA cada día (about-section).
 */
export function NosotrosMilestones() {
  const years = new Date().getFullYear() - 2010;

  const stats = [
    { value: "2010", label: "Ibañez Clima abre sus puertas" },
    { value: `${years}`, label: "años gestionando un taller de verdad" },
    { value: "Cientos", label: "de talleres que conocemos por dentro" },
    { value: "1", label: "fundador que usa FIXA cada día" },
  ];

  return (
    <section className="mx-auto max-w-5xl px-6 py-6">
      <StaggerContainer className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <StaggerItem key={s.label}>
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-stone-200/60 bg-card px-4 py-6 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <span className="text-3xl font-extrabold tracking-tight tabular-nums text-brand-600 md:text-4xl">
                {s.value}
              </span>
              <span className="mt-2 text-xs leading-snug text-stone-500 text-pretty">
                {s.label}
              </span>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
