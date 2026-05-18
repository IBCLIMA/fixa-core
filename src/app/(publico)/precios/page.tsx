import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { PricingSection } from "@/components/landing/pricing-section";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Precios — FIXA | Software de gestión para talleres desde 29€/mes",
  description: "Planes y precios de FIXA. Básico 29€/mes, Taller 49€/mes, Pro 79€/mes. Sin permanencia, 14 días gratis, setup incluido.",
  alternates: { canonical: "https://fixa.es/precios" },
  openGraph: {
    title: "Precios de FIXA — Desde 29€/mes",
    description: "Planes claros, sin sorpresas. 14 días gratis para tu taller mecánico.",
    url: "https://fixa.es/precios",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "FIXA",
  description: "Software de gestión para talleres mecánicos",
  offers: [
    { "@type": "Offer", name: "Básico", price: "29", priceCurrency: "EUR", billingDuration: "P1M" },
    { "@type": "Offer", name: "Taller", price: "49", priceCurrency: "EUR", billingDuration: "P1M" },
    { "@type": "Offer", name: "Pro", price: "79", priceCurrency: "EUR", billingDuration: "P1M" },
  ],
};

export default function PreciosPage() {
  return (
    <div className="min-h-screen antialiased" style={{ background: "linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <div className="pt-8">
        <PricingSection />
      </div>
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
