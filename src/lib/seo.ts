/**
 * Única fuente de verdad para el dominio público de FIXA.
 * Dominio principal: fixataller.es (fixataller.com y www redirigen a él).
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fixataller.es";

export const SITE_NAME = "FIXA";

export const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icons/icon-512.png`,
  description:
    "La torre de control para talleres modernos: te dice qué necesita atención y mantiene informado al cliente en tiempo real.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "sergi@ibclima.com",
    availableLanguage: ["es"],
  },
} as const;

export const SOFTWARE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/icons/icon-512.png`,
  description:
    "La torre de control para talleres modernos. Controla vehículos, presupuestos, avisos y clientes desde una plataforma que te dice qué necesita atención y mantiene informado al cliente en tiempo real.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android",
  inLanguage: "es",
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "29",
    highPrice: "79",
    priceCurrency: "EUR",
    offerCount: "3",
  },
  publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
} as const;
