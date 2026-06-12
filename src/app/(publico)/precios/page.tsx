import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { PricingSection } from "@/components/landing/pricing-section";
import { FaqSection } from "@/components/landing/faq-section";
import { faqs } from "@/components/landing/faq-data";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Precios — Software para talleres desde 29€/mes, sin permanencia",
  description: "Planes y precios de FIXA: Básico 29€, Taller 49€ y Pro 79€ al mes. 14 días gratis sin tarjeta, sin permanencia y con el setup incluido.",
  alternates: { canonical: `${SITE_URL}/precios` },
  openGraph: {
    title: "Precios de FIXA — Desde 29€/mes, sin permanencia",
    description: "Planes claros, sin sorpresas. 14 días gratis para tu taller mecánico.",
    url: `${SITE_URL}/precios`,
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "FIXA",
    description: "Software de gestión para talleres mecánicos",
    offers: [
      { "@type": "Offer", name: "Básico", price: "29", priceCurrency: "EUR", billingDuration: "P1M" },
      { "@type": "Offer", name: "Taller", price: "49", priceCurrency: "EUR", billingDuration: "P1M" },
      { "@type": "Offer", name: "Pro", price: "79", priceCurrency: "EUR", billingDuration: "P1M" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
];

export default function PreciosPage() {
  return (
    <div className="min-h-screen antialiased" style={{ background: "linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <div className="pt-12">
        <h1 className="sr-only">Precios de FIXA: software de gestión para talleres mecánicos desde 29€/mes</h1>
        <PricingSection />
      </div>
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
