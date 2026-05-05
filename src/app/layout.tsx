import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations/es-ES";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
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
  title: "FIXA — Gestión de taller mecánico",
  description:
    "Sistema de gestión para talleres mecánicos. Órdenes de trabajo, clientes, citas, presupuestos y facturación.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FIXA",
  },
  openGraph: {
    title: "FIXA — Gestión de taller mecánico",
    description: "Órdenes, clientes, citas, WhatsApp integrado. Todo desde el móvil. Creado por un mecánico para mecánicos.",
    siteName: "FIXA",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "FIXA — Gestión de taller mecánico",
    description: "Órdenes, clientes, citas, WhatsApp integrado. Todo desde el móvil.",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
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
          <meta name="theme-color" content="#f97316" />
        </head>
        <body className="min-h-full flex flex-col">
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
