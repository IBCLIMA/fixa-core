"use client";

import { Check, X, Minus } from "lucide-react";
import { LandingBadge } from "./landing-badge";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedSection } from "./animated-section";
import { TRANSITION_DEFAULT } from "./animation-config";

const features = [
  { name: "Órdenes de trabajo", paper: false, erp: true, fixa: true },
  { name: "Entrada por matrícula (10 seg)", paper: false, erp: false, fixa: true },
  { name: "WhatsApp integrado", paper: false, erp: false, fixa: true },
  { name: "Portal del cliente online", paper: false, erp: true, fixa: true },
  { name: "Avisos ITV automáticos", paper: false, erp: true, fixa: true },
  { name: "Funciona en PC, tablet y móvil", paper: false, erp: false, fixa: true },
  { name: "Funcionando en 1 semana", paper: true, erp: false, fixa: true },
  { name: "Sin formación necesaria", paper: true, erp: false, fixa: true },
  { name: "Precio", paper: "0€", erp: "150-300€/mes", fixa: "29€/mes + IVA" },
];

function CellIcon({ value }: { value: boolean | string }) {
  if (typeof value === "string") return <span className="text-sm font-bold">{value}</span>;
  if (value) return <Check className="h-5 w-5 text-emerald-500 mx-auto" />;
  return <X className="h-5 w-5 text-stone-300 mx-auto" />;
}

export function ComparisonSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-4xl px-6 py-12 lg:py-16">
        <AnimatedSection className="text-center mb-14">
          <LandingBadge>Comparativa</LandingBadge>
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-5xl">
            ¿Por qué FIXA?
          </h2>
          <p className="text-stone-500 mt-4 text-lg">
            Ni el papel ni los ERPs caros. El punto justo.
          </p>
        </AnimatedSection>

        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={TRANSITION_DEFAULT}
          className="rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-200/50 overflow-hidden"
        >
          {/* Header */}
          <div className="grid grid-cols-4 gap-0 border-b border-stone-200/50">
            <div className="p-4" />
            <div className="p-4 text-center">
              <p className="text-sm font-bold text-stone-400">Papel + Excel</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-sm font-bold text-stone-400">ERP caro</p>
            </div>
            <div className="p-4 text-center bg-brand-50/50 rounded-t-xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full">
                Recomendado
              </div>
              <p className="text-sm font-bold text-brand-600">FIXA</p>
            </div>
          </div>

          {/* Rows */}
          {features.map((f, i) => (
            <motion.div
              key={f.name}
              initial={prefersReducedMotion ? {} : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`grid grid-cols-4 gap-0 ${i < features.length - 1 ? "border-b border-stone-100/80" : ""}`}
            >
              <div className="p-4 flex items-center">
                <span className="text-sm text-stone-700 font-medium">{f.name}</span>
              </div>
              <div className="p-4 flex items-center justify-center">
                <CellIcon value={f.paper} />
              </div>
              <div className="p-4 flex items-center justify-center">
                <CellIcon value={f.erp} />
              </div>
              <div className="p-4 flex items-center justify-center bg-brand-50/30">
                <CellIcon value={f.fixa} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
