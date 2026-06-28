"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type CookieConsent = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
};

const CONSENT_KEY = "fixa-cookie-consent";

function getConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function setConsent(consent: CookieConsent) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const consent = getConsent();
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    setConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    });
    setVisible(false);
  };

  const rejectAll = () => {
    setConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    });
    setVisible(false);
  };

  const savePreferences = () => {
    setConsent({
      necessary: true,
      analytics,
      marketing,
      timestamp: new Date().toISOString(),
    });
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          role="dialog"
          aria-label="Preferencias de cookies"
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-[60]"
        >
          <div className="rounded-2xl bg-white border border-stone-200/60 shadow-2xl shadow-black/10 p-5 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 shrink-0">
                  <Cookie className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">Cookies</h3>
                  <p className="text-xs text-stone-500">Usamos cookies para mejorar tu experiencia.</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-stone-500 leading-relaxed">
              Utilizamos cookies esenciales para el funcionamiento del sitio y cookies opcionales para analítica.
              Puedes aceptar todas, rechazar las opcionales, o{" "}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-brand-600 font-medium underline underline-offset-2 cursor-pointer"
              >
                personalizar tu elección
              </button>
              . Más info en nuestra{" "}
              <Link href="/cookies" className="text-brand-600 font-medium underline underline-offset-2">
                política de cookies
              </Link>
              .
            </p>

            {/* Detailed preferences */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 pt-2 border-t border-stone-100">
                    {/* Necessary */}
                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-stone-900">Esenciales</span>
                        <p className="text-[10px] text-stone-400">Necesarias para el funcionamiento básico</p>
                      </div>
                      <div className="h-5 w-9 rounded-full bg-brand-500 flex items-center justify-end px-0.5 cursor-not-allowed">
                        <div className="h-4 w-4 rounded-full bg-white" />
                      </div>
                    </label>

                    {/* Analytics */}
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="text-xs font-bold text-stone-900">Analítica</span>
                        <p className="text-[10px] text-stone-400">Nos ayudan a entender cómo usas el sitio</p>
                      </div>
                      <button
                        onClick={() => setAnalytics(!analytics)}
                        className={`h-5 w-9 rounded-full flex items-center px-0.5 transition-colors cursor-pointer ${
                          analytics ? "bg-brand-500 justify-end" : "bg-stone-200 justify-start"
                        }`}
                      >
                        <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
                      </button>
                    </label>

                    {/* Marketing */}
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="text-xs font-bold text-stone-900">Marketing</span>
                        <p className="text-[10px] text-stone-400">Publicidad personalizada</p>
                      </div>
                      <button
                        onClick={() => setMarketing(!marketing)}
                        className={`h-5 w-9 rounded-full flex items-center px-0.5 transition-colors cursor-pointer ${
                          marketing ? "bg-brand-500 justify-end" : "bg-stone-200 justify-start"
                        }`}
                      >
                        <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
                      </button>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={rejectAll}
                variant="outline"
                className="flex-1 rounded-full text-xs h-9 font-semibold cursor-pointer"
              >
                Rechazar
              </Button>
              {showDetails ? (
                <Button
                  onClick={savePreferences}
                  className="flex-1 rounded-full bg-stone-900 text-white hover:bg-stone-800 text-xs h-9 font-semibold cursor-pointer"
                >
                  Guardar preferencias
                </Button>
              ) : (
                <Button
                  onClick={acceptAll}
                  className="flex-1 rounded-full bg-brand-500 text-white hover:bg-brand-600 text-xs h-9 font-semibold cursor-pointer"
                >
                  Aceptar todas
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
