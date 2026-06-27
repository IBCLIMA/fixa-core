import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Zap,
  MessageCircle,
  FileCheck,
  BellRing,
  Monitor,
  Smartphone,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { getAllCities, getCityBySlug } from "@/lib/content";
import { MDXContent } from "@/components/mdx-content";
import { AnimatedSection } from "@/components/landing/animated-section";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export async function generateStaticParams() {
  return getAllCities().map((city) => ({ ciudad: city.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ ciudad: string }> }): Promise<Metadata> {
  const { ciudad } = await params;
  const city = getCityBySlug(ciudad);
  if (!city) return {};
  return {
    title: `Software para talleres mecánicos en ${city.city} — FIXA | Desde 29€/mes`,
    description: `Gestiona tu taller mecánico en ${city.city} con FIXA: órdenes de trabajo legales, presupuestos online, citas, WhatsApp y avisos ITV. Desde el móvil. 14 días gratis sin tarjeta.`,
    alternates: { canonical: `${SITE_URL}/taller/${ciudad}` },
    openGraph: {
      title: `Software para talleres en ${city.city} — FIXA`,
      description: `Hecho por gente del sector, no por una startup. Pruébalo 14 días gratis, sin tarjeta.`,
      type: "website",
      url: `${SITE_URL}/taller/${ciudad}`,
    },
  };
}

// Beneficios como transformaciones (tono Isra Bravo). Reales, sin cifras infladas.
const BENEFITS = [
  {
    icon: Zap,
    title: "La orden en 10 segundos",
    body: "Escribes la matrícula y la orden legal está creada. Si el coche ya vino, se autocompleta solo.",
  },
  {
    icon: Smartphone,
    title: "Tu cliente deja de llamarte",
    body: "Le pasas un enlace y ve el estado de su coche, el presupuesto y las fotos cuando quiere.",
  },
  {
    icon: FileCheck,
    title: "El cliente acepta desde el sofá",
    body: "Presupuesto con el IVA desglosado que aprueba con un botón, sin volver al taller.",
  },
  {
    icon: BellRing,
    title: "Trabajo que antes se te escapaba",
    body: "FIXA vigila las ITV y cada mes te dice a quién avisar, con el WhatsApp ya preparado.",
  },
  {
    icon: MessageCircle,
    title: "Un toque y el cliente lo sabe",
    body: "WhatsApp integrado con el mensaje ya escrito. Sin copiar números ni salir de la orden.",
  },
  {
    icon: Monitor,
    title: "Abres el navegador y funciona",
    body: "Sin instalar nada. Desde el PC, la tablet o el móvil, al lado del coche.",
  },
] as const;

export default async function CityPage({ params }: { params: Promise<{ ciudad: string }> }) {
  const { ciudad } = await params;
  const city = getCityBySlug(ciudad);
  if (!city) notFound();

  // Interlinking: primero ciudades de la misma comunidad, luego el resto por población.
  const otherCities = getAllCities()
    .filter((c) => c.slug !== ciudad)
    .sort((a, b) => {
      const sameRegionA = a.region === city.region ? 0 : 1;
      const sameRegionB = b.region === city.region ? 0 : 1;
      if (sameRegionA !== sameRegionB) return sameRegionA - sameRegionB;
      return (b.population ?? 0) - (a.population ?? 0);
    });

  // Service (no LocalBusiness: FIXA no es un negocio físico en la ciudad; es un servicio
  // que damos a talleres de esa área). Honesto y correcto para schema.org.
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Software de gestión para talleres mecánicos",
    name: `${SITE_NAME} — Software para talleres en ${city.city}`,
    description: `Software de gestión para talleres mecánicos en ${city.city}: órdenes de trabajo legales (RD 1457/1986), presupuestos online, citas, WhatsApp y avisos ITV.`,
    areaServed: { "@type": "City", name: city.city, containedInPlace: { "@type": "AdministrativeArea", name: city.region } },
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    offers: {
      "@type": "Offer",
      price: "29",
      priceCurrency: "EUR",
      url: `${SITE_URL}/precios`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Software por ciudad", item: `${SITE_URL}/taller/${ciudad}` },
      { "@type": "ListItem", position: 3, name: city.city, item: `${SITE_URL}/taller/${ciudad}` },
    ],
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-14 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Breadcrumb */}
      <nav aria-label="Migas de pan" className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          Inicio
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className="font-medium text-foreground">Talleres en {city.city}</span>
      </nav>

      {/* Hero */}
      <AnimatedSection className="text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-brand-50/80 px-4 py-1.5 text-xs font-semibold text-brand-700">
          <MapPin className="h-3.5 w-3.5" aria-hidden /> {city.city}, {city.region}
        </div>
        <h1 className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Software para talleres mecánicos
          <br className="hidden sm:block" /> <span className="text-brand-600">en {city.city}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-muted-foreground">
          Llevas el taller en la cabeza, en papeles y en WhatsApp. Funciona hasta que se te escapa una ITV
          o un cliente te llama por quinta vez. FIXA pone orden sin que tengas que ser informático.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/sign-up"
            className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-8 text-base font-bold text-white shadow-brand transition-all duration-200 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:bg-brand-400 hover:shadow-brand-lg sm:w-auto"
          >
            Probar gratis en {city.city}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/precios"
            className="inline-flex h-13 w-full items-center justify-center rounded-full border border-border bg-card px-8 text-base font-semibold text-foreground shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm sm:w-auto"
          >
            Ver precios
          </Link>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">14 días gratis · Sin tarjeta · Sin permanencia</p>

        {/* Contexto local honesto: solo datos verificables (comunidad, población INE) + obligación legal real */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <MapPin className="h-3 w-3" aria-hidden /> {city.region}
          </span>
          {city.population ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              ~{city.population.toLocaleString("es-ES")} habitantes
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="h-3 w-3" aria-hidden /> Órdenes legales · RD 1457/1986
          </span>
        </div>
      </AnimatedSection>

      {/* Contenido local (MDX). El body trae su propio H1: lo degradamos a tamaño H2
          para que el único H1 de la página sea el del hero. */}
      <AnimatedSection
        delay={0.05}
        className="prose prose-stone prose-lg mx-auto mt-16 max-w-3xl prose-headings:tracking-tight prose-h1:text-2xl prose-h1:font-bold prose-h1:md:text-3xl prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline"
      >
        <MDXContent code={city.body} />
      </AnimatedSection>

      {/* Beneficios como transformaciones */}
      <AnimatedSection delay={0.05} className="mt-16">
        <h2 className="text-balance text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Lo que cambia en tu taller de {city.city}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-center text-muted-foreground">
          No son funciones. Es tiempo que recuperas y trabajo que dejas de perder.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {BENEFITS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Prueba social honesta: el origen real, sin cifras infladas */}
      <AnimatedSection delay={0.05} className="mt-16">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm sm:p-10">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Por qué fiarte</p>
          <h2 className="mt-3 text-balance text-2xl font-bold tracking-tight text-foreground">
            FIXA no la hizo una startup de Silicon Valley
          </h2>
          <div className="mt-4 space-y-4 text-muted-foreground">
            <p>
              La hizo <strong className="font-semibold text-foreground">Sergi</strong>, ingeniero industrial y gerente de{" "}
              <strong className="font-semibold text-foreground">Ibañez Clima</strong>, un taller que lleva desde 2010
              dando servicio. FIXA nació dentro de ese taller para resolver lo que nos pasaba a nosotros: presupuestos
              a las nueve de la noche, clientes llamando para saber si el coche estaba listo, ITVs que se escapaban.
            </p>
            <p>
              Lo que usas es lo que usamos nosotros cada día. Y no te vamos a decir que nos usan miles de talleres en{" "}
              {city.city}: te decimos lo que hay. Una herramienta hecha por gente del sector, que pruebas 14 días gratis
              y sin tarjeta. Si no te convence, no la usas.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Interlinking: otras ciudades (misma comunidad primero) */}
      <AnimatedSection delay={0.05} className="mt-16">
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">FIXA también en</p>
        <div className="flex flex-wrap gap-2">
          {otherCities.map((c) => (
            <Link
              key={c.slug}
              href={`/taller/${c.slug}`}
              className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-brand-300 hover:text-brand-600"
            >
              {c.city}
            </Link>
          ))}
        </div>
      </AnimatedSection>

      {/* CTA final */}
      <AnimatedSection delay={0.05} className="mt-16">
        <div className="rounded-2xl bg-stone-900 p-8 text-center shadow-lg sm:p-10 dark:bg-card dark:ring-1 dark:ring-border">
          <h2 className="text-balance text-2xl font-bold text-white sm:text-3xl">
            Pruébalo en tu taller de {city.city}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-stone-400">
            14 días gratis. Sin tarjeta. Si tu equipo sabe usar WhatsApp, sabe usar FIXA.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-8 font-bold text-white shadow-brand transition-all duration-200 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:bg-brand-400 hover:shadow-brand-lg sm:w-auto"
            >
              Empezar gratis
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/demo"
              className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/15 px-8 font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              Ver una demo
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
