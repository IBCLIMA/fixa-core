import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";
import Link from "next/link";
import {
  Globe, Smartphone, Search, Zap, MessageSquare,
  ArrowRight, CheckCircle2, Phone,
} from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Webs para talleres mecánicos — hechas por quien conoce el sector",
  description: "Tu competencia ya tiene web. ¿Y tú? Diseñamos webs para talleres: rápidas, visibles en Google y con WhatsApp integrado. Desde 499€.",
  alternates: { canonical: `${SITE_URL}/web-para-talleres` },
  openGraph: {
    title: "Webs para talleres — no somos una agencia, somos del sector",
    description: "Tu competencia ya tiene web. ¿Y tú? Desde 499€.",
    url: `${SITE_URL}/web-para-talleres`,
  },
};

const planes = [
  {
    name: "La Esencial",
    price: "499",
    desc: "Para el taller que necesita estar en Google YA",
    features: [
      "Diseño personalizado (no una plantilla)",
      "3-5 páginas: inicio, servicios, contacto",
      "Se ve bien en móvil, tablet y PC",
      "Apareces en Google (SEO básico)",
      "Botón de WhatsApp enorme",
      "Legal: HTTPS, cookies, privacidad",
      "Google Maps con tu ubicación",
      "Lista en 2 semanas",
    ],
    popular: false,
  },
  {
    name: "La Completa",
    price: "899",
    desc: "Para el taller que quiere llenar la agenda",
    features: [
      "Todo lo de La Esencial",
      "Hasta 10 páginas",
      "Blog (esto es lo que te posiciona de verdad)",
      "Galería de trabajos con fotos",
      "Sistema de reseñas de Google",
      "Google Business optimizado",
      "Formulario de cita online",
      "Soporte 3 meses",
    ],
    popular: true,
  },
  {
    name: "La Definitiva",
    price: "1.199",
    desc: "Web + FIXA: gestión y presencia de golpe",
    features: [
      "Todo lo de La Completa",
      "FIXA plan Taller (1 año incluido)",
      "Portal del cliente integrado en la web",
      "Tu cliente pide cita desde tu propia web",
      "Te lo dejamos todo montado y funcionando",
      "Soporte 6 meses",
      "Actualizaciones 1 año",
    ],
    popular: false,
  },
];

export default function WebParaTalleresPage() {
  return (
    <div className="min-h-screen antialiased" style={{ background: "linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%)" }}>
      <Navbar />

      {/* Hero — tono Isra Bravo: hook + historia + solución */}
      <section className="mx-auto max-w-4xl px-6 pt-16 pb-16">
        <span className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-4 py-1.5 text-xs font-semibold text-orange-700 mb-6">
          <Globe className="h-3 w-3" /> No somos una agencia. Somos del sector.
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.05]">
          Tu competencia ya tiene web.
          <br />
          <span className="text-orange-600">¿Y tú?</span>
        </h1>
        <div className="mt-8 space-y-4 text-lg text-stone-600 leading-relaxed max-w-2xl">
          <p>
            Mira, te voy a contar una cosa. El <strong className="text-stone-900">80% de la gente
            busca talleres en Google antes de ir</strong>. No pregunta al vecino, no
            mira la guía telefónica — escribe &ldquo;taller mecánico cerca de mí&rdquo;
            y elige entre los 3 primeros que salen.
          </p>
          <p>
            Si tú no estás ahí, <strong className="text-stone-900">no existes</strong>.
            Da igual que lleves 20 años en el barrio. Da igual que seas el mejor mecánico
            de tu zona. Si no apareces en Google, el cliente nuevo se va al de al lado
            — que sí tiene web.
          </p>
          <p>
            Y aquí viene la parte buena: nosotros hacemos webs para talleres.
            No somos una agencia de marketing que no sabe lo que es un embrague.
            Somos <strong className="text-stone-900">gente del sector que lleva
            desde 2010 trabajando con talleres</strong>. Sabemos qué necesitas
            porque lo hemos visto en cientos de talleres como el tuyo.
          </p>
        </div>
        <div className="flex flex-col gap-3 mt-10 sm:flex-row">
          <a href="https://wa.me/34611433218?text=Hola%2C%20me%20interesa%20una%20web%20para%20mi%20taller" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="rounded-full bg-orange-500 text-white hover:bg-orange-400 font-bold h-14 px-8 text-base shadow-xl shadow-orange-500/20 cursor-pointer group">
              Cuéntame más por WhatsApp
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </a>
          <a href="#planes">
            <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-base font-semibold border-stone-200 cursor-pointer">
              Ver precios
            </Button>
          </a>
        </div>
      </section>

      {/* Qué incluye — sin tecnicismos */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="text-2xl font-extrabold tracking-tight text-stone-900 mb-2">
          ¿Qué vas a tener?
        </h2>
        <p className="text-stone-500 mb-8">Sin letra pequeña y sin palabrejas de informático.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: Search, title: "Sales en Google", text: "Cuando alguien busque 'taller mecánico' + tu ciudad, ahí estarás. Eso solo se consigue con una web bien hecha." },
            { icon: Smartphone, title: "Se ve perfecta en el móvil", text: "El 70% de tus clientes te buscan desde el móvil. Si la web no se ve bien ahí, es como si no tuvieras." },
            { icon: MessageSquare, title: "Botón de WhatsApp grande", text: "Nada de formularios de contacto que nadie rellena. Un botón gordo de WhatsApp que el cliente pulsa y te habla directo." },
            { icon: Zap, title: "Rápida de verdad", text: "Carga en menos de un segundo. Google penaliza las webs lentas — y tus clientes las abandonan antes de leer nada." },
            { icon: Globe, title: "Tu propio dominio", text: "tunombredetaller.es — tu marca en internet. Que el cliente te busque y te encuentre con tu nombre." },
            { icon: CheckCircle2, title: "Legal y sin dolores de cabeza", text: "HTTPS, aviso de cookies, privacidad, todo lo que pide la ley. Tú no te preocupas de nada de esto." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl bg-white/70 border border-stone-200/50 p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-9 w-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                  <f.icon className="h-4 w-4 text-orange-600" />
                </div>
                <h3 className="font-bold text-stone-900">{f.title}</h3>
              </div>
              <p className="text-sm text-stone-500 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Por qué nosotros — historia real */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <div className="rounded-2xl bg-stone-950 p-8 md:p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(249,115,22,0.08),transparent)]" />
          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl font-extrabold text-white">
              ¿Por qué hacemos webs para talleres y no para dentistas?
            </h2>
            <p className="text-stone-400 leading-relaxed">
              Porque llevamos desde 2010 dando servicio a talleres con Ibañez Clima.
              Hemos visto cómo funciona un taller por dentro, qué busca el cliente cuando
              entra en Google, y qué le hace confiar en un taller o irse al de la esquina.
            </p>
            <p className="text-stone-400 leading-relaxed">
              Una agencia de marketing te va a hacer una web bonita. Nosotros te hacemos
              una web que <strong className="text-white">funciona para un taller</strong>:
              botón de WhatsApp en grande, dirección con mapa, horario visible, reseñas de
              Google integradas y la ITV como gancho de SEO local.
            </p>
            <p className="text-stone-400 leading-relaxed">
              La web que estás viendo ahora mismo está hecha con la misma tecnología.
              La misma velocidad, el mismo SEO, la misma calidad. Pero adaptada a tu taller.
            </p>
          </div>
        </div>
      </section>

      {/* Planes */}
      <section id="planes" className="mx-auto max-w-5xl px-6 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900">
            Tres opciones. Sin mareos.
          </h2>
          <p className="text-stone-500 mt-2">Dime cuál te encaja y hablamos.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {planes.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 ${
                p.popular
                  ? "bg-stone-950 text-white shadow-2xl shadow-stone-900/20 md:scale-[1.03]"
                  : "bg-white/70 backdrop-blur-sm border border-stone-200/50"
              }`}
            >
              {p.popular && (
                <div className="flex items-center justify-center py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-xs font-bold text-white">
                  La que más pedimos
                </div>
              )}
              <div className="p-6">
                <h3 className={`font-bold text-lg ${p.popular ? "text-white" : "text-stone-900"}`}>{p.name}</h3>
                <p className={`text-sm mt-1 ${p.popular ? "text-stone-400" : "text-stone-500"}`}>{p.desc}</p>
                <div className="flex items-baseline gap-1 mt-6 mb-6">
                  <span className={`text-5xl font-extrabold tracking-tight ${p.popular ? "text-white" : "text-stone-900"}`}>{p.price}€</span>
                  <span className={`text-sm ${p.popular ? "text-stone-400" : "text-stone-400"}`}>pago único</span>
                </div>
                <div className="space-y-2.5 mb-8">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${p.popular ? "text-orange-400" : "text-emerald-500"}`} />
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
                    Hablamos por WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-stone-400 mt-6">IVA no incluido. Hosting desde 9€/mes aparte.</p>
      </section>

      {/* CTA final */}
      <section className="bg-stone-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(249,115,22,0.06),transparent)]" />
        <div className="mx-auto max-w-3xl px-6 py-16 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            Oye, que no es tan complicado.
          </h2>
          <p className="text-stone-400 mt-4 max-w-lg mx-auto leading-relaxed">
            Me escribes por WhatsApp, me cuentas cómo es tu taller, y en
            2 semanas tienes una web que funciona. Sin reuniones eternas
            ni contratos de 40 páginas. Así de simple.
          </p>
          <div className="flex flex-col items-center gap-4 mt-8 sm:flex-row sm:justify-center">
            <a href="https://wa.me/34611433218?text=Hola%2C%20quiero%20una%20web%20para%20mi%20taller" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="rounded-full bg-orange-500 text-white hover:bg-orange-400 font-bold h-14 px-10 text-base shadow-xl shadow-orange-500/30 cursor-pointer group">
                Escríbeme por WhatsApp
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </a>
            <a href="tel:+34611433218">
              <Button size="lg" className="rounded-full h-14 px-8 text-base font-semibold bg-[#25D366] hover:bg-[#1fb959] text-white border-0 cursor-pointer">
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
