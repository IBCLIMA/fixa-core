"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection, StaggerContainer, StaggerItem } from "./animated-section";
import { cn } from "@/lib/utils";

const faqs = [
  { q: "¿Es difícil de usar?", a: "Si sabes usar WhatsApp, sabes usar FIXA. Incluye tour guiado y guía de primeros pasos. Lo dejamos todo montado.", cat: "general" },
  { q: "¿Necesito ordenador?", a: "No. FIXA funciona 100% desde el móvil. Se instala como una app y funciona incluso sin conexión.", cat: "general" },
  { q: "¿Puedo importar mis datos actuales?", a: "Sí. Sube un CSV con tus clientes y vehículos. Si tienes los datos en Excel, guárdalo como CSV y súbelo.", cat: "datos" },
  { q: "¿Hay permanencia?", a: "No. Cancela cuando quieras. Sin contratos, sin penalizaciones.", cat: "precios" },
  { q: "¿Mis datos están seguros?", a: "Datos cifrados, backups automáticos diarios, cumplimiento RGPD. Descarga tus datos en cualquier momento.", cat: "datos" },
  { q: "¿El WhatsApp se envía solo?", a: "FIXA prepara el mensaje y abre WhatsApp listo para enviar. Tú pulsas enviar. Sin API ni costes extra.", cat: "general" },
  { q: "¿Cuánto tiempo tardo en empezar?", a: "Menos de una semana. Creamos tu cuenta, importamos tus clientes, y lo tienes funcionando.", cat: "general" },
  { q: "¿Y si no me gusta?", a: "14 días gratis sin compromiso. No te pedimos tarjeta de crédito. Si no te convence, no pagas nada.", cat: "precios" },
  { q: "¿Migráis vosotros mis datos?", a: "Sí. Si nos envías un Excel o CSV con tus clientes y vehículos, te los importamos gratis. También podemos configurar el taller por ti.", cat: "datos" },
  { q: "¿Funciona con mi gestoría?", a: "FIXA genera presupuestos y facturas que puedes exportar. Compatible con cualquier flujo de gestoría.", cat: "general" },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-200/50 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full p-5 text-left cursor-pointer"
      >
        <span className="font-bold text-sm text-stone-900 pr-4">{question}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-stone-400 shrink-0 transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 -mt-1">
              <p className="text-sm text-stone-500 leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqSection() {
  const [search, setSearch] = useState("");

  const filtered = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(search.toLowerCase()) ||
      faq.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section id="faq" className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <AnimatedSection className="text-center mb-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-4 py-1.5 text-xs font-semibold text-orange-700 mb-4">
          FAQ
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-5xl">
          ¿Tienes dudas?
        </h2>
      </AnimatedSection>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar pregunta..."
            className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/70 backdrop-blur-sm border border-stone-200/50 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300 transition-all"
          />
        </div>
      </div>

      <StaggerContainer className="max-w-2xl mx-auto space-y-3">
        {filtered.map((faq) => (
          <StaggerItem key={faq.q}>
            <FaqItem question={faq.q} answer={faq.a} />
          </StaggerItem>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-stone-400 text-sm py-8">
            No encontramos esa pregunta. Escríbenos por WhatsApp y te respondemos al momento.
          </p>
        )}
      </StaggerContainer>
    </section>
  );
}
