"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatedSection } from "./animated-section";
import { cn } from "@/lib/utils";

/**
 * Capturas REALES del producto — no mockups dibujados.
 * "Así es FIXA por dentro" genera más confianza que cualquier texto.
 */

const pantallas = [
  { id: "dashboard", src: "/demo/screenshots/dashboard.webp", label: "Panel del día", desc: "Lo que entra, lo que sale y lo que está pendiente — de un vistazo" },
  { id: "nueva-orden", src: "/demo/screenshots/nueva-orden.webp", label: "Entrada rápida", desc: "Matrícula, qué le pasa, y orden creada en 10 segundos" },
  { id: "ordenes", src: "/demo/screenshots/ordenes.webp", label: "Órdenes", desc: "Cada coche con su estado, sin papeles ni pizarras" },
  { id: "calendario", src: "/demo/screenshots/calendario.webp", label: "Citas", desc: "La agenda del taller, con citas online de tus clientes" },
  { id: "clientes", src: "/demo/screenshots/clientes.webp", label: "Clientes", desc: "Historial completo por matrícula: qué, cuándo y por cuánto" },
];

export function ScreenshotsSection() {
  const [active, setActive] = useState(pantallas[0]);

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <AnimatedSection className="text-center mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-4 py-1.5 text-xs font-semibold text-orange-700 mb-4">
            Capturas reales
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-5xl">
            Así es FIXA por dentro
          </h2>
          <p className="text-stone-500 mt-4 text-lg">
            Sin retoques: estas son las pantallas que usarás cada día.
          </p>
        </AnimatedSection>

        {/* Selector */}
        <AnimatedSection delay={0.1}>
          <div className="flex gap-2 justify-center flex-wrap mb-8">
            {pantallas.map((p) => (
              <button
                key={p.id}
                onClick={() => setActive(p)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-bold transition-all cursor-pointer",
                  active.id === p.id
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                    : "bg-white/70 text-stone-600 border border-stone-200/60 hover:border-orange-300"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Screenshot */}
        <AnimatedSection delay={0.2}>
          <div className="relative rounded-2xl overflow-hidden border border-stone-200/60 shadow-2xl shadow-stone-900/10 bg-white max-w-4xl mx-auto">
            <Image
              key={active.id}
              src={active.src}
              alt={`Pantalla de ${active.label} en FIXA`}
              width={1400}
              height={900}
              className="w-full h-auto"
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>
          <p className="text-center text-sm text-stone-500 mt-4">{active.desc}</p>
        </AnimatedSection>
      </div>
    </section>
  );
}
