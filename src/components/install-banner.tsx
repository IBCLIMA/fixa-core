"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Smartphone, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "fixa-install-banner-dismissed";

/**
 * Banner de instalación PWA: solo en móvil y solo si FIXA no está ya instalada.
 * Android: instalación nativa en un toque (beforeinstallprompt).
 * iPhone: enlace a la guía /instalar.
 */
export function InstallBanner() {
  const [visible, setVisible] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Ya instalada (standalone) o descartada → no molestar
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if ((navigator as { standalone?: boolean }).standalone) return; // iOS standalone
    if (localStorage.getItem(DISMISS_KEY)) return;

    const ua = navigator.userAgent;
    const mobile = /Android|iPhone|iPad|iPod/i.test(ua);
    if (!mobile) return;

    setIsIos(/iPhone|iPad|iPod/i.test(ua));
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

  if (!visible) return null;

  return (
    <div className="relative rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50/60 p-4 no-print">
      <button
        onClick={dismiss}
        className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full text-orange-400 hover:bg-orange-100 transition-colors"
        aria-label="Cerrar"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-center gap-3 pr-8">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 shadow-sm shadow-orange-500/30">
          <Smartphone className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-extrabold text-orange-900">Instala FIXA en tu móvil</p>
          <p className="text-xs text-orange-700 mt-0.5">
            Icono en tu pantalla de inicio y avisos al instante, como una app.
          </p>
        </div>
      </div>
      <div className="mt-3">
        {installEvent ? (
          <Button onClick={instalar} className="w-full rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold h-11">
            Instalar ahora — un toque
          </Button>
        ) : (
          <Link href="/instalar" className="block">
            <Button className="w-full rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold h-11">
              {isIos ? "Ver cómo instalarla (30 segundos)" : "Ver cómo instalarla"}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
