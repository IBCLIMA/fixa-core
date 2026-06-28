import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { StatsBar } from "@/components/landing/stats-bar";
import { VideoDemoSection } from "@/components/landing/video-demo-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { ObjectionsSection } from "@/components/landing/objections-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FaqSection } from "@/components/landing/faq-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { AboutSection } from "@/components/landing/about-section";
import { CtaSection } from "@/components/landing/cta-section";
import { WebServicesBanner } from "@/components/web-services-banner";
import { Footer } from "@/components/landing/footer";
import { FloatingCta } from "@/components/landing/floating-cta";
import { SOFTWARE_JSONLD } from "@/lib/seo";
import { faqs } from "@/components/landing/faq-data";

export const metadata: Metadata = {
  // absolute evita que el template "%s | FIXA" duplique la marca al final
  title: { absolute: "FIXA | Torre de control para talleres modernos" },
  description:
    "Controla vehículos, presupuestos, avisos y clientes desde una plataforma que te dice qué necesita atención y mantiene informado al cliente en tiempo real.",
  keywords: [
    "torre de control taller", "control de taller mecánico", "gestión taller",
    "estado reparación cliente", "avisos taller", "portal del cliente taller",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "FIXA | Torre de control para talleres modernos",
    description: "FIXA te dice qué coche está bloqueado, qué cliente llamar y qué presupuesto perseguir. Y tus clientes ven el estado de su coche en tiempo real.",
    url: "/",
    siteName: "FIXA",
    type: "website",
    locale: "es_ES",
  },
};

const jsonLd = [
  SOFTWARE_JSONLD,
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

export default function LandingPage() {
  return (
    <div className="min-h-screen antialiased" style={{ background: "linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <HeroSection />
      <StatsBar />
      <VideoDemoSection />
      <ProblemSection />
      <HowItWorksSection />
      <ObjectionsSection />
      <TestimonialsSection />
      <AboutSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <WebServicesBanner />
      <Footer />
      <FloatingCta />
    </div>
  );
}
