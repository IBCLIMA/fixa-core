"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Smartphone, X, ArrowRight, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "fixa-install-banner-dismissed";

type IosBrowser = "safari" | "chrome" | "other" | null;

/**
 * Banner de instalación PWA: solo en móvil y solo si FIXA no está ya instalada.
 * Android: instalación nativa en un toque (beforeinstallprompt).
 * iPhone+Safari: enlace a la guía /instalar.
 * iPhone+Chrome/otro: en iOS solo Safari instala apps → avisamos y ofrecemos copiar
 * el enlace para abrirlo en Safari (detección por user-agent: CriOS = Chrome, etc.).
 */
export function InstallBanner() {
  const [visible, setVisible] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [iosBrowser, setIosBrowser] = useState<IosBrowser>(null);

  useEffect(() => {
    // Ya instalada (standalone) o descartada → no molestar
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if ((navigator as { standalone?: boolean }).standalone) return; // iOS standalone
    if (localStorage.getItem(DISMISS_KEY)) return;

    const ua = navigator.userAgent;
    const mobile = /Android|iPhone|iPad|iPod/i.test(ua);
    if (!mobile) return;

    const ios = /iPhone|iPad|iPod/i.test(ua);
    setIsIos(ios);
    if (ios) {
      // En iOS todos usan WebKit, pero el UA delata el navegador real.
      if (/CriOS/i.test(ua)) setIosBrowser("chrome");
      else if (/FxiOS|EdgiOS|OPiOS|GSA/i.test(ua)) setIosBrowser("other");
      else setIosBrowser("safari");
    }
    setVisible(true);

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  async function instalar() {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") {
      toast.success("FIXA instalada — búscala en tu pantalla de inicio");
      setVisible(false);
    }
  }

  async function copiarEnlace() {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      toast.success("Enlace copiado — ábrelo en Safari y pégalo en la barra de direcciones");
    } catch {
      toast.error("No se pudo copiar. Escribe fixataller.es en Safari");
    }
  }

  if (!visible) return null;

  // iOS con un navegador que NO es Safari (Chrome/Firefox/Edge…): en iPhone solo
  // Safari puede instalar la app. Aviso a medida + copiar enlace.
  const iosNoSafari = isIos && (iosBrowser === "chrome" || iosBrowser === "other");
  const nombreNav = iosBrowser === "chrome" ? "Chrome" : "este navegador";

  return (
    <div className="relative rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-amber-50/60 p-4 shadow-sm no-print">
      <button
        onClick={dismiss}
        className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full text-brand-400 hover:bg-brand-100 transition-colors"
        aria-label="Cerrar"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-center gap-3 pr-8">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-brand">
          <Smartphone className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-extrabold text-brand-900">Instala FIXA en tu móvil</p>
          <p className="text-xs text-brand-700 mt-0.5">
            {iosNoSafari
              ? `Estás en ${nombreNav}. En iPhone la app solo se instala desde Safari (lo impone Apple).`
              : "Icono en tu pantalla de inicio y avisos al instante, como una app."}
          </p>
        </div>
      </div>
      <div className="mt-3">
        {installEvent ? (
          <Button onClick={instalar} className="w-full rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold h-11 shadow-brand">
            Instalar ahora — un toque
          </Button>
        ) : iosNoSafari ? (
          <div className="flex flex-col gap-2">
            <Button onClick={copiarEnlace} className="w-full rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold h-11 shadow-brand">
              <Copy className="mr-1.5 h-4 w-4" />Copiar enlace para Safari
            </Button>
            <Link href="/instalar" className="block text-center text-xs font-semibold text-brand-700 hover:text-brand-800">
              Ver la guía paso a paso
            </Link>
          </div>
        ) : (
          <Link href="/instalar" className="block">
            <Button className="w-full rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold h-11 shadow-brand">
              {isIos ? "Ver cómo instalarla (30 segundos)" : "Ver cómo instalarla"}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
