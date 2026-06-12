import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";
import Link from "next/link";
import {
  Globe, Smartphone, Search, Zap, Shield, MessageSquare,
  ArrowRight, CheckCircle2, Phone, Star,
} from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Webs profesionales para talleres mecánicos — FIXA",
  description: "Diseñamos webs profesionales para talleres mecánicos. Moderna, rápida, optimizada para Google. Tu taller visible en internet desde 499€.",
  alternates: { canonical: `${SITE_URL}/web-para-talleres` },
  openGraph: {
    title: "Webs profesionales para talleres — FIXA",
    description: "Tu taller merece una web profesional. Desde 499€.",
    url: `${SITE_URL}/web-para-talleres`,
  },
};

const features = [
  { icon: Smartphone, title: "100% responsive", desc: "Se ve perfecta en móvil, tablet y PC. El 70% de tus clientes te buscarán desde el móvil." },
  { icon: Search, title: "Optimizada para Google", desc: "SEO técnico para que aparezcas cuando busquen 'taller mecánico + tu ciudad'." },
  { icon: Zap, title: "Carga en <1 segundo", desc: "Velocidad máxima. Google penaliza las webs lentas y tus clientes las abandonan." },
  { icon: MessageSquare, title: "WhatsApp integrado", desc: "Botón de WhatsApp para que te contacten al momento. Sin formularios complicados." },
  { icon: Shield, title: "HTTPS y RGPD", desc: "Certificado SSL, aviso de cookies, política de privacidad. Todo legal." },
  { icon: Globe, title: "Dominio propio", desc: "tunombre.es o tunombre.com. Tu marca en internet." },
];

const plans = [
  {
    name: "Web Básica",
    price: "499",
    desc: "Tu presencia online profesional",
    features: [
      "Diseño personalizado",
      "3-5 páginas (Inicio, Servicios, Contacto...)",
      "Responsive (móvil + PC)",
      "SEO básico",
      "WhatsApp integrado",
      "HTTPS + RGPD",
      "Google Maps",
      "Entrega en 2 semanas",
    ],
    popular: false,
  },
  {
    name: "Web Profesional",
    price: "899",
    desc: "Todo lo que tu taller necesita",
    features: [
      "Todo lo de Web Básica",
      "Hasta 10 páginas",
      "Blog integrado (SEO potente)",
      "Galería de trabajos",
      "Sistema de reseñas",
      "Google Business optimizado",
      "Formulario de cita online",
      "Soporte 3 meses incluido",
    ],
    popular: true,
  },
  {
    name: "Web + FIXA",
    price: "1.199",
    desc: "La combinación ganadora",
    features: [
      "Todo lo de Web Profesional",
      "FIXA plan Taller (1 año incluido)",
      "Portal del cliente integrado",
      "Enlace directo web → gestión",
      "Formación personalizada",
      "Soporte 6 meses incluido",
      "Actualizaciones 1 año",
    ],
    popular: false,
  },
];

export default function WebParaTalleresPage() {
  return (
    <div className="min-h-screen antialiased" style={{ background: "linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%)" }}>
      <Navbar />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-4 py-1.5 text-xs font-semibold text-orange-700 mb-6">
          <Globe className="h-3 w-3" /> Servicio de diseño web
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.05]">
          Tu taller merece una web
          <br />
          <span className="text-orange-600">tan profesional como tu trabajo.</span>
        </h1>
        <p className="text-lg text-stone-500 mt-6 max-w-xl mx-auto">
          Diseñamos webs para talleres mecánicos. Moderna, rápida, optimizada para Google.
          Que tus clientes te encuentren antes que a la competencia.
        </p>
        <div className="flex flex-col items-center gap-3 mt-8 sm:flex-row sm:justify-center">
          <a href="https://wa.me/34611433218?text=Hola%2C%20me%20interesa%20una%20web%20para%20mi%20taller" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="rounded-full bg-stone-900 text-white hover:bg-stone-800 font-bold h-14 px-8 text-base shadow-xl cursor-pointer group">
              Pedir presupuesto gratis
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </a>
          <a href="#planes">
            <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-base font-semibold border-stone-200 cursor-pointer">
              Ver planes
            </Button>
          </a>
        </div>
      </section>

      {/* Social proof - esta web */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="rounded-2xl bg-stone-950 p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(249,115,22,0.1),transparent)]" />
          <div className="relative z-10">
            <p className="text-sm text-orange-400 font-semibold mb-3">Esta web está hecha con la misma tecnología</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              La web que estás viendo ahora mismo
            </h2>
            <p className="text-stone-400 max-w-lg mx-auto">
              Next.js, Tailwind CSS, animaciones WebGL, SEO optimizado, velocidad máxima.
              La misma calidad para tu taller.
            </p>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-stone-500">
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-orange-400 fill-orange-400" /> 100/100 Lighthouse</span>
              <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-orange-400" /> Carga en &lt;1s</span>
              <span className="flex items-center gap-1.5"><Search className="h-4 w-4 text-orange-400" /> SEO máximo</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-4xl">
            ¿Qué incluye tu web?
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-200/50 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="font-bold text-stone-900 mb-2">{f.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="planes" className="mx-auto max-w-5xl px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-4xl">
            Planes claros. Sin sorpresas.
          </h2>
          <p className="text-stone-500 mt-3">Pago único + hosting desde 9€/mes</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 ${
                p.popular
                  ? "bg-stone-950 text-white shadow-2xl shadow-stone-900/20 md:scale-[1.03]"
                  : "bg-white/70 backdrop-blur-sm border border-stone-200/50"
              }`}
            >
              {p.popular && (
                <div className="flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-xs font-bold text-white">
                  Más popular
                </div>
              )}
              <div className={`p-6 ${p.popular ? "" : ""}`}>
                <h3 className={`font-bold text-lg ${p.popular ? "text-white" : "text-stone-900"}`}>{p.name}</h3>
                <p className={`text-sm mt-1 ${p.popular ? "text-stone-400" : "text-stone-500"}`}>{p.desc}</p>
                <div className="flex items-baseline gap-1 mt-6 mb-8">
                  <span className={`text-5xl font-extrabold tracking-tight ${p.popular ? "text-white" : "text-stone-900"}`}>{p.price}€</span>
                  <span className={`text-sm ${p.popular ? "text-stone-400" : "text-stone-400"}`}>pago único</span>
                </div>
                <div className="space-y-3 mb-8">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2 className={`h-4 w-4 shrink-0 ${p.popular ? "text-orange-400" : "text-emerald-500"}`} />
                      <span className={p.popular ? "text-stone-300" : "text-stone-600"}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href="https://wa.me/34611433218?text=Hola%2C%20me%20interesa%20el%20plan%20de%20web%20para%20talleres" target="_blank" rel="noopener noreferrer">
                  <Button className={`w-full rounded-full font-bold h-12 cursor-pointer ${
                    p.popular
                      ? "bg-orange-500 text-white hover:bg-orange-400 shadow-lg shadow-orange-500/20"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}>
                    Pedir presupuesto
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-stone-400 mt-6">IVA no incluido. Hosting y mantenimiento aparte (desde 9€/mes).</p>
      </section>

      {/* CTA */}
      <section className="bg-stone-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(249,115,22,0.08),transparent)]" />
        <div className="mx-auto max-w-4xl px-6 py-20 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Tu competencia ya tiene web.
            <br />
            <span className="text-orange-400">¿Y tú?</span>
          </h2>
          <p className="text-stone-400 mt-4 max-w-md mx-auto">
            El 80% de los clientes buscan talleres en Google antes de ir. Si no estás, no existes.
          </p>
          <div className="flex flex-col items-center gap-4 mt-8 sm:flex-row sm:justify-center">
            <a href="https://wa.me/34611433218?text=Hola%2C%20quiero%20una%20web%20para%20mi%20taller" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="rounded-full bg-orange-500 text-white hover:bg-orange-400 font-bold h-14 px-10 text-base shadow-xl shadow-orange-500/30 cursor-pointer group">
                Pedir presupuesto gratis
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </a>
            <a href="tel:+34611433218">
              <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-base font-semibold border-white/15 text-white hover:bg-white/5 cursor-pointer">
                <Phone className="mr-2 h-4 w-4" />
                611 433 218
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
