import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";
import { Navbar } from "@/components/landing/navbar";
import { FeaturesSection } from "@/components/landing/features-section";
import { ScreenshotsSection } from "@/components/landing/screenshots-section";
import { BeforeAfterSection } from "@/components/landing/before-after-section";
import { ComparisonSection } from "@/components/landing/comparison-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { WebServicesBanner } from "@/components/web-services-banner";

export const metadata: Metadata = {
  title: "Funciones — Órdenes en 10 seg, WhatsApp, ITV y presupuestos online",
  description: "12 funciones para el taller que no tiene tiempo: órdenes por matrícula, presupuestos que se aceptan online, avisos ITV automáticos y el cliente que deja de llamar. Desde 29€/mes.",
  alternates: { canonical: `${SITE_URL}/funciones` },
  openGraph: {
    title: "Funciones de FIXA — Todo lo que tu taller necesita",
    description: "12 funciones para gestionar tu taller desde el móvil. Desde 29€/mes.",
    url: `${SITE_URL}/funciones`,
  },
};

export default function FuncionesPage() {
  return (
    <div className="min-h-screen antialiased" style={{ background: "linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%)" }}>
      <Navbar />
      <div className="pt-8">
        <h1 className="sr-only">Funciones de FIXA: software de gestión para talleres mecánicos</h1>
        <FeaturesSection />
      </div>
      <ScreenshotsSection />
      <BeforeAfterSection />
      <ComparisonSection />
      <CtaSection />
      <Footer />
      <WebServicesBanner />
    </div>
  );
}
