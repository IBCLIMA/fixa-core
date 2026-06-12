import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, MapPin, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllCities, getCityBySlug } from "@/lib/content";
import { MDXContent } from "@/components/mdx-content";
import { AnimatedSection } from "@/components/landing/animated-section";
import { SITE_URL } from "@/lib/seo";

export async function generateStaticParams() {
  return getAllCities().map((city) => ({ ciudad: city.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ ciudad: string }> }): Promise<Metadata> {
  const { ciudad } = await params;
  const city = getCityBySlug(ciudad);
  if (!city) return {};
  return {
    title: `Software taller mecánico ${city.city} — FIXA | Desde 29€/mes`,
    description: `Gestiona tu taller mecánico en ${city.city} con FIXA. Órdenes de trabajo, citas, WhatsApp integrado y avisos ITV. 14 días gratis.`,
    alternates: { canonical: `${SITE_URL}/taller/${ciudad}` },
    openGraph: {
      title: `Software para talleres en ${city.city} — FIXA`,
      description: `El software de gestión que usan los talleres de ${city.city}. Desde 29€/mes.`,
      url: `${SITE_URL}/taller/${ciudad}`,
    },
  };
}

export default async function CityPage({ params }: { params: Promise<{ ciudad: string }> }) {
  const { ciudad } = await params;
  const city = getCityBySlug(ciudad);
  if (!city) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `FIXA — Software para talleres en ${city.city}`,
    description: `Software de gestión para talleres mecánicos en ${city.city}`,
    areaServed: { "@type": "City", name: city.city },
    priceRange: "29€ - 79€/mes",
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <AnimatedSection className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-4 py-1.5 text-xs font-semibold text-orange-700 mb-6">
          <MapPin className="h-3 w-3" /> {city.city}, {city.region}
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-stone-900">
          Software para talleres
          <br />
          <span className="text-orange-600">en {city.city}</span>
        </h1>
        <p className="text-stone-500 mt-4 text-lg max-w-lg mx-auto">
          Más de {city.talleres?.toLocaleString("es-ES")} talleres en {city.city}. Los que crecen son los que se profesionalizan.
        </p>
      </AnimatedSection>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-12 max-w-md mx-auto">
        <div className="rounded-xl bg-white/70 border border-stone-200/50 p-4 text-center">
          <Users className="h-5 w-5 text-orange-500 mx-auto mb-2" />
          <div className="text-2xl font-extrabold text-stone-900">{city.population?.toLocaleString("es-ES")}</div>
          <div className="text-xs text-stone-500">Habitantes</div>
        </div>
        <div className="rounded-xl bg-white/70 border border-stone-200/50 p-4 text-center">
          <MapPin className="h-5 w-5 text-orange-500 mx-auto mb-2" />
          <div className="text-2xl font-extrabold text-stone-900">{city.talleres?.toLocaleString("es-ES")}+</div>
          <div className="text-xs text-stone-500">Talleres</div>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-stone prose-lg max-w-none mb-12">
        <MDXContent code={city.body} />
      </div>

      {/* Features checklist */}
      <div className="rounded-2xl bg-white/70 border border-stone-200/50 p-8 mb-12">
        <h2 className="text-xl font-bold text-stone-900 mb-6">Lo que incluye FIXA para tu taller en {city.city}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            "Órdenes de trabajo", "Entrada rápida por matrícula", "WhatsApp integrado",
            "Portal del cliente", "Avisos ITV automáticos", "Presupuestos con IVA",
            "Calendario de citas", "Fotos del vehículo", "Multi-usuario",
          ].map((f) => (
            <div key={f} className="flex items-center gap-2.5 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span className="text-stone-700">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link href="/sign-up">
          <Button size="lg" className="rounded-full bg-orange-500 text-white hover:bg-orange-400 font-bold h-14 px-10 text-base shadow-xl cursor-pointer">
            Probar gratis en {city.city}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <p className="text-xs text-stone-400 mt-4">14 días gratis · Sin permanencia · Setup gratuito</p>
      </div>
    </div>
  );
}
