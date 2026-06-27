import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllComparisons, getComparisonBySlug } from "@/lib/content";
import { MDXContent } from "@/components/mdx-content";
import { ComparisonHero } from "@/components/comparativa/comparison-hero";
import { ComparisonTable } from "@/components/comparativa/comparison-table";
import { getComparisonRows } from "@/components/comparativa/comparison-data";
import { SITE_URL } from "@/lib/seo";

export async function generateStaticParams() {
  return getAllComparisons().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);
  if (!comparison) return {};
  return {
    title: comparison.title,
    description: comparison.description,
    alternates: { canonical: `${SITE_URL}/vs/${slug}` },
    openGraph: {
      title: comparison.title,
      description: comparison.description,
      type: "website",
      url: `${SITE_URL}/vs/${slug}`,
    },
  };
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);
  if (!comparison) notFound();

  const rows = getComparisonRows(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: comparison.title, item: `${SITE_URL}/vs/${slug}` },
    ],
  };

  return (
    <article className="mx-auto max-w-4xl px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a FIXA
      </Link>

      <div className="mt-8">
        <ComparisonHero competitor={comparison.competitor} subtitle={comparison.description} />
      </div>

      <section className="mt-12" aria-label={`Comparativa FIXA frente a ${comparison.competitor}`}>
        <ComparisonTable competitor={comparison.competitor} rows={rows} />
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Datos de {comparison.competitor} según su información pública (junio 2026). &ldquo;Depende&rdquo; = varía según
          el plan o no está verificado. Verifica siempre los detalles antes de decidir.
        </p>
      </section>

      {/*
        Prosa MDX original intacta. El cuerpo arranca con su propio H1 (el título);
        lo degradamos visualmente a tamaño de H2 con `prose-h1:*` para que el ÚNICO
        H1 semántico/visual de la página sea el del hero y no haya título duplicado.
      */}
      <div className="prose prose-stone prose-lg mx-auto mt-16 max-w-3xl prose-h1:text-2xl prose-h1:font-bold prose-h1:tracking-tight prose-h1:md:text-3xl">
        <MDXContent code={comparison.body} />
      </div>

      <div className="mx-auto mt-16 max-w-3xl rounded-2xl bg-stone-900 p-8 text-center shadow-lg dark:bg-card dark:ring-1 dark:ring-border">
        <h2 className="mb-2 text-2xl font-bold text-white">Compruébalo en tu taller</h2>
        <p className="mb-6 text-stone-400">14 días gratis. Sin tarjeta de crédito. Cancela cuando quieras.</p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/sign-up"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-500 px-8 font-bold text-white shadow-brand transition-all duration-200 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:bg-brand-400 hover:shadow-brand-lg sm:w-auto"
          >
            Probar FIXA gratis
          </Link>
          <Link
            href="/precios"
            className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/15 px-8 font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
          >
            Ver precios
          </Link>
        </div>
      </div>
    </article>
  );
}
