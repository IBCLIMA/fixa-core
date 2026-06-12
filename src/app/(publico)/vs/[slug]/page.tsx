import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllComparisons, getComparisonBySlug } from "@/lib/content";
import { MDXContent } from "@/components/mdx-content";
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: comparison.title, item: `${SITE_URL}/vs/${slug}` },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link href="/" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" /> Volver a FIXA
      </Link>

      <div className="prose prose-stone prose-lg max-w-none prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:font-extrabold prose-h1:tracking-tight">
        <MDXContent code={comparison.body} />
      </div>

      <div className="mt-16 rounded-2xl bg-stone-900 p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Compruébalo tú mismo</h3>
        <p className="text-stone-400 mb-6">14 días gratis. Sin tarjeta de crédito.</p>
        <Link href="/sign-up" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-400 transition-colors">
          Probar FIXA gratis
        </Link>
      </div>
    </article>
  );
}
