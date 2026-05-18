import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { AboutSection } from "@/components/landing/about-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { WebServicesBanner } from "@/components/web-services-banner";

export const metadata: Metadata = {
  title: "Sobre nosotros — FIXA | Creado por mecánicos para mecánicos",
  description: "FIXA nace de un taller real. Ibañez Clima, taller mecánico desde 2010. Creamos el software que nos hubiera gustado tener.",
  alternates: { canonical: "https://fixa.es/nosotros" },
  openGraph: {
    title: "Sobre FIXA — El partner del taller pequeño",
    description: "No somos una multinacional. Somos mecánicos como tú.",
    url: "https://fixa.es/nosotros",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FIXA",
  url: "https://fixa.es",
  description: "Software de gestión para talleres mecánicos",
  founder: { "@type": "Organization", name: "Ibañez Clima", foundingDate: "2010" },
  contactPoint: { "@type": "ContactPoint", telephone: "+34611433218", contactType: "customer service", availableLanguage: "Spanish" },
};

export default function NosotrosPage() {
  return (
    <div className="min-h-screen antialiased" style={{ background: "linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <div className="pt-8">
        <AboutSection />
      </div>
      <TestimonialsSection />
      <CtaSection />
      <Footer />
      <WebServicesBanner />
    </div>
  );
}
