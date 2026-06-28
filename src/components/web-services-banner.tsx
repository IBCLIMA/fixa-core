"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function WebServicesBanner() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("web-banner-dismissed")) {
      setDismissed(true);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 600) {
        setVisible(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    setVisible(false);
    sessionStorage.setItem("web-banner-dismissed", "1");
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-6 right-6 z-50 hidden md:block max-w-sm"
        >
          <div className="rounded-2xl bg-stone-950 border border-stone-800 shadow-2xl shadow-black/30 p-5 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-500/10 to-transparent rounded-bl-full" />

            {/* Close button */}
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 h-7 w-7 flex items-center justify-center rounded-full bg-stone-800 hover:bg-stone-700 transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5 text-stone-400" />
            </button>

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-white">¿Te gusta esta web?</p>
                    <Sparkles className="h-3.5 w-3.5 text-brand-400" />
                  </div>
                  <p className="text-[11px] text-stone-400">Creamos webs para talleres</p>
                </div>
              </div>

              <p className="text-xs text-stone-400 leading-relaxed mb-4">
                Diseñamos webs profesionales para talleres mecánicos. Moderna, rápida, optimizada para Google. Como esta, pero para tu taller.
              </p>

              <Link
                href="/web-para-talleres"
                onClick={dismiss}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-bold transition-colors cursor-pointer group"
              >
                Saber más
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
