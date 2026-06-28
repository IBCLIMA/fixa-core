import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { CtaSection } from "@/components/landing/cta-section";
import { AnimatedSection } from "@/components/landing/animated-section";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Demo — Mira cómo funciona FIXA por dentro",
  description:
    "Ve FIXA en acción sin registrarte: cómo se crea una orden en 10 segundos, cómo el cliente ve su coche online y cómo te genera trabajo con los avisos de ITV.",
  alternates: { canonical: `${SITE_URL}/demo` },
};

const pasos = [
  {
    titulo: "El mecánico escribe la matrícula",
    desc: "Abre FIXA, pulsa 'Entrada rápida', escribe la matrícula (o la escanea con la cámara). Si el cliente ya vino antes, se autocompleta todo. Describe la avería y la orden de trabajo está creada — conforme al RD 1457/1986.",
    img: "/demo/screenshots/nueva-orden.webp",
    alt: "Pantalla de entrada rápida de FIXA",
  },
  {
    titulo: "El panel del día te organiza la mañana",
    desc: "Al abrir FIXA ves de un vistazo: citas de hoy, coches listos para entregar, presupuestos sin respuesta y recambios atascados. Cada uno con su botón de WhatsApp preparado. No tienes que buscar nada.",
    img: "/demo/screenshots/dashboard.webp",
    alt: "Panel del día de FIXA",
  },
  {
    titulo: "El estado de cada coche, claro",
    desc: "Lista de órdenes con filtros: en taller, finalizadas, entregadas. Por mecánico si sois varios. El Kanban para los que prefieren arrastrar. Un toque y cambias el estado.",
    img: "/demo/screenshots/ordenes.webp",
    alt: "Lista de órdenes en FIXA",
  },
  {
    titulo: "El cliente NO te llama — mira su coche solo",
    desc: "Cada orden tiene un enlace único. El cliente lo abre y ve: estado actual, presupuesto pendiente de aceptar, fotos y el informe final. Un solo link para todo, sin instalar nada.",
    img: "/demo/screenshots/clientes.webp",
    alt: "Portal del cliente de FIXA",
  },
  {
    titulo: "Las citas se organizan solas",
    desc: "Calendario con citas que los clientes piden online desde su móvil. FIXA te avisa cada tarde de las citas de mañana, con el WhatsApp de recordatorio ya preparado.",
    img: "/demo/screenshots/calendario.webp",
    alt: "Calendario de citas de FIXA",
  },
];

export default function DemoPage() {
  return (
    <div
      className="min-h-screen antialiased"
      style={{ background: "linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%)" }}
    >
      <Navbar />

      <div className="mx-auto max-w-5xl px-6 py-20">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-brand-50/80 px-4 py-1.5 text-xs font-semibold text-brand-700 mb-4">
            <Play className="h-3 w-3" /> Demo
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 md:text-5xl">
            Así funciona FIXA
            <br />
            <span className="text-stone-400">paso a paso</span>
          </h1>
          <p className="text-stone-500 mt-4 text-lg max-w-xl mx-auto">
            Sin registrarte, sin vídeos de 20 minutos. Las pantallas reales que usarás
            cada día, explicadas en 2 minutos de scroll.
          </p>
        </AnimatedSection>

        {/* Pasos con screenshot real */}
        <div className="space-y-20">
          {pasos.map((paso, i) => (
            <AnimatedSection key={paso.titulo} delay={i * 0.05}>
              <div className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center`}>
                {/* Texto */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white text-sm font-extrabold">
                      {i + 1}
                    </span>
                    <h2 className="text-xl font-extrabold text-stone-900">{paso.titulo}</h2>
                  </div>
                  <p className="text-stone-600 leading-relaxed">{paso.desc}</p>
                </div>
                {/* Screenshot */}
                <div className="flex-1 min-w-0">
                  <div className="rounded-2xl overflow-hidden border border-stone-200/60 shadow-xl shadow-stone-900/5 bg-white">
                    <Image
                      src={paso.img}
                      alt={paso.alt}
                      width={700}
                      height={450}
                      className="w-full h-auto"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Lo que no se ve en capturas */}
        <AnimatedSection className="mt-20">
          <div className="rounded-2xl bg-stone-950 text-white p-8 md:p-10">
            <h3 className="text-xl font-extrabold mb-6">Lo que no se ve en capturas</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Presupuesto que el cliente acepta online (con registro legal de fecha e IP)",
                "Avisos de ITV automáticos cada mañana — WhatsApp preparado",
                "Notificación al móvil cuando un cliente acepta un presupuesto",
                "Entrega + cobro + informe + petición de reseña en un solo flujo",
                "Cámara-matrícula: apuntas al coche y FIXA lee la placa",
                "Averías ocultas: foto, precio, y el cliente aprueba desde el sofá",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-brand-400 mt-0.5 shrink-0" />
                  <span className="text-stone-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection className="mt-12 text-center">
          <p className="text-stone-500 mb-5">
            ¿Quieres probarlo con tus propios coches?
          </p>
          <Link href="/sign-up">
            <Button
              size="lg"
              className="rounded-full bg-brand-500 text-white hover:bg-brand-400 font-bold h-14 px-10 text-base shadow-2xl shadow-brand cursor-pointer group"
            >
              Empezar 14 días gratis — sin tarjeta
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
          <p className="text-xs text-stone-400 mt-4">
            Al registrarte encontrarás datos de ejemplo para que veas cómo queda con coches de verdad.
          </p>
        </AnimatedSection>
      </div>

      <CtaSection />
      <Footer />
    </div>
  );
}
