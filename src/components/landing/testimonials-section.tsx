"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { AnimatedSection } from "./animated-section";

const testimonials = [
  {
    name: "Carlos M.",
    role: "Taller El Maño · Zaragoza",
    text: "Antes perdía 2 horas al día con llamadas de '¿está listo mi coche?'. Ahora los clientes miran el estado solos. Es otra vida.",
    stars: 5,
  },
  {
    name: "Antonio R.",
    role: "Autofast · Valencia",
    text: "Lo mejor es la entrada rápida. Matrícula y listo. Mis mecánicos odian los ordenadores y esto lo usan sin problema.",
    stars: 5,
  },
  {
    name: "María J.",
    role: "Taller Ibérica · Madrid",
    text: "Los avisos de ITV nos generan trabajo que antes perdíamos. El mes pasado entraron 8 coches solo por eso.",
    stars: 5,
  },
  {
    name: "David G.",
    role: "AutoService Pro · Sevilla",
    text: "Probé 3 programas antes. Todos costaban el triple y necesitabas un curso para usarlos. FIXA lo entendí en 10 minutos.",
    stars: 5,
  },
  {
    name: "Laura P.",
    role: "Taller Hermanos Pérez · Bilbao",
    text: "El WhatsApp integrado ha cambiado la relación con nuestros clientes. Nos ven más profesionales.",
    stars: 5,
  },
  {
    name: "Javi S.",
    role: "Neumáticos Rápidos · Málaga",
    text: "29€ al mes por todo esto es un regalo. Antes pagaba 180€ por un programa que no usaba ni la mitad.",
    stars: 5,
  },
];

function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = true,
  duration = 40,
}: {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  duration?: number;
}) {
  return (
    <div className={cn("group flex overflow-hidden [--gap:1rem] gap-[var(--gap)]", className)}>
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex shrink-0 justify-around gap-[var(--gap)]",
            pauseOnHover && "group-hover:[animation-play-state:paused]"
          )}
          style={{
            animation: `marquee ${duration}s linear infinite`,
            animationDirection: reverse ? "reverse" : "normal",
          }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

function TestimonialCard({ name, role, text, stars }: typeof testimonials[0]) {
  return (
    <div className="w-[320px] shrink-0 rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-200/50 p-5 hover:shadow-lg transition-shadow duration-300">
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: stars }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-sm text-stone-700 leading-relaxed mb-4">&ldquo;{text}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs">
          {name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div>
          <p className="text-sm font-bold text-stone-900">{name}</p>
          <p className="text-xs text-stone-500">{role}</p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <AnimatedSection className="text-center mb-12 px-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-amber-50/80 px-4 py-1.5 text-xs font-semibold text-amber-700 mb-4">
          Testimonios
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-5xl">
          Lo que dicen nuestros talleres
        </h2>
      </AnimatedSection>

      <Marquee duration={50} pauseOnHover>
        {testimonials.map((t) => (
          <TestimonialCard key={t.name} {...t} />
        ))}
      </Marquee>
    </section>
  );
}
