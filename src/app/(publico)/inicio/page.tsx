import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { VideoDemoSection } from "@/components/landing/video-demo-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { FloatingCta } from "@/components/landing/floating-cta";
import { SOFTWARE_JSONLD } from "@/lib/seo";

export const metadata: Metadata = {
  title: "FIXA — Software de gestión para talleres mecánicos | Desde 29€/mes",
  description:
    "Gestiona tu taller desde el móvil: órdenes de trabajo, citas, avisos ITV, WhatsApp integrado, presupuestos y portal del cliente. Creado por mecánicos. 14 días gratis.",
  keywords: [
    "software taller mecánico", "gestión taller", "programa taller",
    "órdenes de trabajo taller", "app taller mecánico", "ERP taller mecánico",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "FIXA — El software que tu taller necesita",
    description: "Órdenes, citas, WhatsApp, presupuestos y avisos ITV. Todo desde el móvil por 29€/mes.",
    url: "/",
    siteName: "FIXA",
    type: "website",
    locale: "es_ES",
  },
};

const jsonLd = SOFTWARE_JSONLD;

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
