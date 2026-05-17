import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";

export const metadata: Metadata = {
  title: "FIXA — Software de gestión para talleres mecánicos | Desde 29€/mes",
  description:
    "Gestiona tu taller desde el móvil: órdenes de trabajo, citas, avisos ITV, WhatsApp integrado, presupuestos y portal del cliente. Creado por mecánicos. 14 días gratis.",
  keywords: [
    "software taller mecánico",
    "gestión taller",
    "programa taller",
    "órdenes de trabajo taller",
    "software gestión taller",
    "app taller mecánico",
    "programa taller mecánico",
    "gestión taller automotriz",
    "software taller automoción",
    "ERP taller mecánico",
    "facturación taller",
    "presupuestos taller",
    "citas taller mecánico",
    "WhatsApp taller",
    "ITV avisos",
  ],
  alternates: {
    canonical: "https://fixa.es/inicio",
  },
  openGraph: {
    title: "FIXA — El software que tu taller necesita",
    description:
      "Órdenes, citas, WhatsApp, presupuestos y avisos ITV. Todo desde el móvil por 29€/mes. Creado por mecánicos para mecánicos.",
    url: "https://fixa.es/inicio",
    siteName: "FIXA",
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: "https://fixa.es/og-image.png",
        width: 1200,
        height: 630,
        alt: "FIXA — Gestión de taller mecánico",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FIXA — Software de gestión para talleres mecánicos",
    description: "Gestiona tu taller desde el móvil por 29€/mes. 14 días gratis.",
    images: ["https://fixa.es/og-image.png"],
  },
};
import { HeroSection } from "@/components/landing/hero-section";
import { SocialProofBar } from "@/components/landing/social-proof-bar";
import { VideoDemoSection } from "@/components/landing/video-demo-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { BeforeAfterSection } from "@/components/landing/before-after-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { ScrollBanner } from "@/components/landing/scroll-banner";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { ComparisonSection } from "@/components/landing/comparison-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { AboutSection } from "@/components/landing/about-section";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { FloatingCta } from "@/components/landing/floating-cta";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "FIXA",
      "description": "Software de gestión para talleres mecánicos. Órdenes de trabajo, citas, WhatsApp integrado, presupuestos y avisos ITV.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web, iOS, Android",
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "29",
        "highPrice": "79",
        "priceCurrency": "EUR",
        "offerCount": "3",
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "150",
        "bestRating": "5",
      },
    },
    {
      "@type": "Organization",
      "name": "FIXA",
      "url": "https://fixa.es",
      "description": "Soluciones digitales para talleres mecánicos",
      "founder": {
        "@type": "Organization",
        "name": "Ibañez Clima",
      },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "¿Es difícil de usar?", "acceptedAnswer": { "@type": "Answer", "text": "Si sabes usar WhatsApp, sabes usar FIXA. Incluye tour guiado y guía de primeros pasos." } },
        { "@type": "Question", "name": "¿Necesito ordenador?", "acceptedAnswer": { "@type": "Answer", "text": "No. FIXA funciona 100% desde el móvil. Se instala como una app y funciona incluso sin conexión." } },
        { "@type": "Question", "name": "¿Hay permanencia?", "acceptedAnswer": { "@type": "Answer", "text": "No. Cancela cuando quieras. Sin contratos, sin penalizaciones." } },
        { "@type": "Question", "name": "¿Mis datos están seguros?", "acceptedAnswer": { "@type": "Answer", "text": "Datos cifrados, backups automáticos diarios, cumplimiento RGPD." } },
        { "@type": "Question", "name": "¿Cuánto tiempo tardo en empezar?", "acceptedAnswer": { "@type": "Answer", "text": "Menos de una semana. Creamos tu cuenta, importamos tus clientes, y lo tienes funcionando." } },
      ],
    },
  ],
};

export default function LandingPage() {
  return (
    <div
      className="min-h-screen antialiased"
      style={{ background: "linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%)" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <HeroSection />
      <SocialProofBar />
      <VideoDemoSection />
      <ProblemSection />
      <BeforeAfterSection />
      <FeaturesSection />
      <ScrollBanner />
      <HowItWorksSection />
      <TestimonialsSection />
      <ComparisonSection />
      <PricingSection />
      <AboutSection />
      <FaqSection />
      <CtaSection />
      <Footer />
      <FloatingCta />
    </div>
  );
}
