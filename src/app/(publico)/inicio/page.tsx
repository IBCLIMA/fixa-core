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
  title: { absolute: "FIXA | Tu taller deja de depender de tu memoria" },
  description:
    "FIXA te avisa de los coches parados, los presupuestos sin respuesta, los clientes que esperan noticias y las revisiones que puedes recuperar. Y tus clientes ven el estado de su coche en tiempo real, sin llamarte.",
  keywords: [
    "gestión taller mecánico", "control de taller mecánico", "avisos ITV taller",
    "estado reparación cliente", "presupuestos taller", "portal del cliente taller",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "FIXA | Tu taller deja de depender de tu memoria",
    description: "FIXA te dice qué hacer hoy: coches parados, presupuestos sin respuesta, clientes que esperan y revisiones que puedes recuperar. Y tus clientes ven el estado de su coche en tiempo real.",
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
