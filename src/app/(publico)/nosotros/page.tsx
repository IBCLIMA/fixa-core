import { CONTACT_PHONE } from "@/lib/constants";
import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { AboutSection } from "@/components/landing/about-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { WebServicesBanner } from "@/components/web-services-banner";
import { NosotrosHero } from "@/components/funciones/nosotros-hero";
import { NosotrosMilestones } from "@/components/funciones/nosotros-milestones";
import { NosotrosValores } from "@/components/funciones/nosotros-valores";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sobre nosotros — FIXA nació dentro de un taller real (desde 2010)",
  description: "FIXA nace de Ibañez Clima, un taller real desde 2010. Construimos el software que nos hubiera gustado tener: simple, sin formación y sin humo.",
  alternates: { canonical: `${SITE_URL}/nosotros` },
  openGraph: {
    title: "Sobre FIXA — El software del mecánico",
    description: "No somos una multinacional. Somos mecánicos como tú.",
    url: `${SITE_URL}/nosotros`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FIXA",
  url: SITE_URL,
  description: "Software de gestión para talleres mecánicos",
  founder: { "@type": "Organization", name: "Ibañez Clima", foundingDate: "2010" },
  contactPoint: { "@type": "ContactPoint", telephone: `+${CONTACT_PHONE}`, contactType: "customer service", availableLanguage: "Spanish" },
};

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-background antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <NosotrosHero />
      <NosotrosMilestones />
      <AboutSection />
      <NosotrosValores />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
      <WebServicesBanner />
    </div>
  );
}
