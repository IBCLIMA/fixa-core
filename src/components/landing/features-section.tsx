"use client";

import {
  ClipboardList, Search, MessageSquare, Car, CalendarDays, Bell,
  Users, FileText, Megaphone, Camera, Shield, Smartphone,
  ArrowRight, Sparkles,
} from "lucide-react";
import { LandingBadge } from "./landing-badge";
import { motion, useReducedMotion } from "framer-motion";
import { useRef, useCallback } from "react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "./animated-section";
import { TRANSITION_DEFAULT } from "./animation-config";

function SpotlightCard({ children, className = "", spotlightColor = "rgba(249, 115, 22, 0.08)" }: { children: React.ReactNode; className?: string; spotlightColor?: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    divRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    divRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    divRef.current.style.setProperty("--spotlight-color", spotlightColor);
  }, [spotlightColor]);
  return (
    <div ref={divRef} onMouseMove={handleMouseMove} className={`card-spotlight ${className}`}>
      {children}
    </div>
  );
}

const heroFeatures = [
  {
    icon: ClipboardList,
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-500/5",
    border: "hover:border-blue-200",
    title: "Órdenes de trabajo",
    desc: "De un vistazo sabes qué coche está en qué punto. Ninguno se te queda olvidado en un rincón.",
    visual: (
      <div className="mt-4 space-y-2">
        {[
          { plate: "5678 DRS", status: "Finalizado", color: "bg-emerald-500" },
          { plate: "7891 JNM", status: "En reparación", color: "bg-blue-500" },
          { plate: "6789 KMN", status: "Presupuestado", color: "bg-amber-500" },
        ].map((o) => (
          <div key={o.plate} className="flex items-center justify-between rounded-lg bg-white/80 border border-stone-100 p-2.5 text-xs">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${o.color}`} />
              <span className="font-bold text-stone-900">{o.plate}</span>
            </div>
            <span className="text-stone-400 font-medium">{o.status}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Search,
    gradient: "from-brand-500 to-brand-600",
    bg: "bg-brand-500/5",
    border: "hover:border-brand-200",
    title: "Entrada en 10 segundos",
    desc: "Escribes la matrícula y la orden ya está. Sin rellenar diez casillas.",
    visual: (
      <div className="mt-4">
        <div className="rounded-lg bg-white/80 border border-stone-100 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Search className="h-3.5 w-3.5 text-stone-300" />
            <span className="text-xs text-stone-400">Buscar matrícula...</span>
          </div>
          <div className="rounded-lg bg-brand-50 border border-brand-200/60 p-2.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-stone-900">4523 BCD</span>
              <p className="text-[10px] text-stone-400">Seat León · Juan García</p>
            </div>
            <div className="text-[10px] font-bold text-brand-600 bg-brand-100 px-2 py-0.5 rounded-full">+ Orden</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: MessageSquare,
    gradient: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-500/5",
    border: "hover:border-emerald-200",
    title: "WhatsApp integrado",
    desc: "Un toque y el cliente sabe que su coche está listo. El mensaje ya va escrito, tú solo das a enviar.",
    visual: (
      <div className="mt-4 space-y-2">
        {[
          { msg: "Tu coche está listo para recoger", time: "10:32" },
          { msg: "Presupuesto enviado: 450€", time: "09:15" },
        ].map((m) => (
          <div key={m.time} className="rounded-lg bg-emerald-50 border border-emerald-100 p-2.5 flex items-start justify-between">
            <span className="text-[11px] text-stone-700 leading-snug max-w-[75%]">{m.msg}</span>
            <span className="text-[9px] text-stone-400 shrink-0">{m.time}</span>
          </div>
        ))}
      </div>
    ),
  },
];

const smallFeatures = [
  { icon: Car, color: "from-cyan-500 to-cyan-600", title: "Portal del cliente", desc: "Sigue su reparación en tiempo real, tipo Amazon. Sabe lo que pasa sin llamarte." },
  { icon: Sparkles, color: "from-fuchsia-500 to-fuchsia-600", title: "Mensajes claros con IA", desc: "Convierte la jerga técnica en algo que el cliente entiende. Sin que te llame para que se lo traduzcas." },
  { icon: CalendarDays, color: "from-violet-500 to-violet-600", title: "Agenda de citas", desc: "El cliente pide cita online, tú la confirmas. Sin teléfono de por medio." },
  { icon: Bell, color: "from-red-500 to-red-600", title: "Avisos ITV", desc: "FIXA te avisa de las ITV que tocan. Trabajo que antes se te escapaba." },
  { icon: Users, color: "from-indigo-500 to-indigo-600", title: "Clientes y vehículos", desc: "Cada coche con su historia: qué le hiciste, cuándo y por cuánto." },
  { icon: FileText, color: "from-amber-500 to-amber-600", title: "Presupuestos", desc: "Mano de obra y piezas con el IVA ya puesto. El cliente lo acepta desde el sofá." },
  { icon: Megaphone, color: "from-pink-500 to-pink-600", title: "Ofertas a todos", desc: "Mándale una oferta a todos tus clientes de golpe por WhatsApp." },
  { icon: Camera, color: "from-teal-500 to-teal-600", title: "Fotos del coche", desc: "Foto al coche cuando entra. Si luego hay líos, tienes la prueba." },
  { icon: Shield, color: "from-stone-500 to-stone-600", title: "Tus datos a salvo", desc: "Cifrados y con copia cada día. RGPD en regla, sin que tú hagas nada." },
  { icon: Smartphone, color: "from-rose-500 to-rose-600", title: "Sin instalar nada. Desde cualquier sitio.", desc: "Abre el navegador y funciona. PC, tablet o móvil. En el taller, en casa o de vacaciones — tu taller siempre contigo." },
];

export function FeaturesSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="funciones" className="relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(249,115,22,0.06),transparent)]" />

      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16 relative z-10">
        <AnimatedSection className="text-center mb-14">
          <LandingBadge>Tu torre de control</LandingBadge>
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-5xl">
            Todo bajo control. Y FIXA te avisa de lo que no.
          </h2>
          <p className="text-stone-500 mt-4 max-w-lg mx-auto text-lg">
            No es una pantalla más. Es quien vigila tu taller para que no se te escape nada.
          </p>
        </AnimatedSection>

        {/* Hero features - Bento grid */}
        <div className="grid gap-4 md:grid-cols-3 mb-4">
          {heroFeatures.map((f, i) => (
            <motion.div
              key={f.title}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ ...TRANSITION_DEFAULT, delay: i * 0.12 }}
              className={`rounded-2xl ${f.bg} border border-stone-200/50 hover:-translate-y-1 ${f.border} transition-all duration-300 group`}
            >
              <SpotlightCard className={`!rounded-2xl !border-0 !bg-transparent p-6`}>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient} shadow-sm relative z-10`}>
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-stone-900 mt-4 text-lg relative z-10">{f.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed mt-1 relative z-10">{f.desc}</p>
                <div className="relative z-10">{f.visual}</div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        {/* Small features grid */}
        <StaggerContainer className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {smallFeatures.map((f) => (
            <StaggerItem key={f.title}>
              <div className="rounded-xl bg-white/60 backdrop-blur-sm border border-stone-200/50 p-4 hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${f.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <f.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900">{f.title}</h3>
                    <p className="text-xs text-stone-500">{f.desc}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
