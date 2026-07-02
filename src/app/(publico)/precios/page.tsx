import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { PricingSection } from "@/components/landing/pricing-section";
import { FaqSection } from "@/components/landing/faq-section";
import { faqs } from "@/components/landing/faq-data";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Precio — Software para talleres: 49€/mes todo incluido, sin permanencia",
  description: "FIXA cuesta 49€/mes + IVA, todo incluido: portal del cliente, presupuestos online, avisos ITV. 14 días gratis sin tarjeta y sin permanencia.",
  alternates: { canonical: `${SITE_URL}/precios` },
  openGraph: {
    title: "Precio de FIXA — 49€/mes todo incluido, sin permanencia",
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
      { "@type": "Offer", name: "FIXA", price: "49", priceCurrency: "EUR", billingDuration: "P1M" },
      { "@type": "Offer", name: "FIXA Anual", price: "490", priceCurrency: "EUR", billingDuration: "P1Y" },
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
        <h1 className="sr-only">Precios de FIXA: software para talleres mecánicos: 49€/mes todo incluido</h1>
        <PricingSection />
      </div>
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
