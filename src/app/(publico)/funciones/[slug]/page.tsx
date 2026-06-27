import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllFeatures, getFeatureBySlug } from "@/lib/content";
import { MDXContent } from "@/components/mdx-content";
import { Navbar } from "@/components/landing/navbar";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { WebServicesBanner } from "@/components/web-services-banner";
import { FeatureHero } from "@/components/funciones/feature-hero";
import { FeatureBenefits } from "@/components/funciones/feature-benefits";
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
    <div className="min-h-screen bg-background antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Navbar />

      <FeatureHero title={feature.title} description={feature.description} icon={feature.icon} />

      <main className="mx-auto max-w-3xl px-6 pb-16">
        <FeatureBenefits />

        {/* Cuerpo del artículo (MDX). El H1 del MDX se oculta: el H1 visible es el del hero. */}
        <div className="mt-12 prose prose-stone prose-lg max-w-none text-pretty [&_h1]:hidden prose-headings:tracking-tight prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-12 prose-h2:text-stone-900 prose-h3:text-stone-900 prose-strong:text-stone-900 prose-a:text-brand-700 prose-a:font-medium hover:prose-a:text-brand-600 prose-li:marker:text-brand-500 prose-img:rounded-2xl prose-img:shadow-md">
          <MDXContent code={feature.body} />
        </div>
      </main>

      <CtaSection />
      <Footer />
      <WebServicesBanner />
    </div>
  );
}
