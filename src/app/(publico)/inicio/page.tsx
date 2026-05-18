import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { VideoDemoSection } from "@/components/landing/video-demo-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { FloatingCta } from "@/components/landing/floating-cta";

export const metadata: Metadata = {
  title: "FIXA — Software de gestión para talleres mecánicos | Desde 29€/mes",
  description:
    "Gestiona tu taller desde el móvil: órdenes de trabajo, citas, avisos ITV, WhatsApp integrado, presupuestos y portal del cliente. Creado por mecánicos. 14 días gratis.",
  keywords: [
    "software taller mecánico", "gestión taller", "programa taller",
    "órdenes de trabajo taller", "app taller mecánico", "ERP taller mecánico",
  ],
  alternates: { canonical: "https://fixa.es/inicio" },
  openGraph: {
    title: "FIXA — El software que tu taller necesita",
    description: "Órdenes, citas, WhatsApp, presupuestos y avisos ITV. Todo desde el móvil por 29€/mes.",
    url: "https://fixa.es/inicio",
    siteName: "FIXA",
    type: "website",
    locale: "es_ES",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "FIXA" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "FIXA",
  description: "Software de gestión para talleres mecánicos.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android",
  offers: { "@type": "AggregateOffer", lowPrice: "29", highPrice: "79", priceCurrency: "EUR", offerCount: "3" },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen antialiased" style={{ background: "linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <HeroSection />
      <VideoDemoSection />
      <ProblemSection />
      <HowItWorksSection />
      <CtaSection />
      <Footer />
      <FloatingCta />
    </div>
  );
}
