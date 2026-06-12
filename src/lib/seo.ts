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
    "Software de gestión para talleres mecánicos pequeños: órdenes de trabajo, presupuestos, citas, WhatsApp y avisos ITV.",
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
    "Software de gestión para talleres mecánicos: órdenes de trabajo legales (RD 1457/1986), presupuestos que el cliente acepta online, citas, WhatsApp y avisos ITV. Desde el móvil, sin formación.",
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
