import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations/es-ES";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { CookieBanner } from "@/components/cookie-banner";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL, ORGANIZATION_JSONLD } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FIXA | Deja de llevar el taller en la cabeza",
    template: "%s | FIXA",
  },
  description:
    "FIXA te avisa de los coches parados, los presupuestos sin respuesta, los clientes que esperan noticias y las revisiones que puedes recuperar. Y tus clientes ven el estado de su coche en tiempo real, sin llamarte.",
  metadataBase: new URL(SITE_URL),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FIXA",
  },
  // og:image y twitter:image se generan en src/app/opengraph-image.tsx (convención de archivo)
  openGraph: {
    title: "FIXA | Deja de llevar el taller en la cabeza",
    description: "FIXA te dice qué hacer hoy: coches parados, presupuestos sin respuesta, clientes que esperan y revisiones que puedes recuperar. Y tus clientes ven el estado de su coche en tiempo real.",
    siteName: "FIXA",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "FIXA | Deja de llevar el taller en la cabeza",
    description: "FIXA te avisa de lo que cuesta dinero y tus clientes ven su coche en tiempo real. Desde 29€/mes. 14 días gratis.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
};

// Modo app: viewport-fit=cover habilita las safe areas (Dynamic Island / barra de
// inicio en iPhone). maximumScale=1 evita el auto-zoom de iOS al enfocar inputs
// (tic de "esto es web"). themeColor claro = la barra de estado se funde con la app.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#faf9f7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={esES}>
      <html
        lang="es"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <head>
          <link rel="apple-touch-icon" href="/icons/icon-192.png" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSONLD) }}
          />
        </head>
        <body className="min-h-full flex flex-col">
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
          <CookieBanner />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
