import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllFeatures, getFeatureBySlug } from "@/lib/content";
import { MDXContent } from "@/components/mdx-content";
import { SITE_URL } from "@/lib/seo";

export async function generateStaticParams() {
  return getAllFeatures().map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeatureBySlug(slug);
  if (!feature) return {};
  return {
    title: feature.title,
    description: feature.description,
    alternates: { canonical: `${SITE_URL}/funciones/${slug}` },
    openGraph: {
      title: feature.title,
      description: feature.description,
      type: "website",
      url: `${SITE_URL}/funciones/${slug}`,
    },
  };
}

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const feature = getFeatureBySlug(slug);
  if (!feature) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Funciones", item: `${SITE_URL}/funciones` },
      { "@type": "ListItem", position: 3, name: feature.title, item: `${SITE_URL}/funciones/${slug}` },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link href="/funciones" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" /> Todas las funciones
      </Link>

      <div className="prose prose-stone prose-lg max-w-none prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:font-extrabold prose-h1:tracking-tight">
        <MDXContent code={feature.body} />
      </div>

      <div className="mt-16 rounded-2xl bg-stone-900 p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Pruébalo en tu taller</h3>
        <p className="text-stone-400 mb-6">14 días gratis. Sin tarjeta de crédito.</p>
        <Link href="/sign-up" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-400 transition-colors">
          Probar FIXA gratis
        </Link>
      </div>
    </article>
  );
}
