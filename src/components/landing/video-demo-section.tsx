"use client";

import { useState, useRef, useEffect } from "react";
import { LandingBadge } from "./landing-badge";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Maximize2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@vercel/analytics";
import { AnimatedSection } from "./animated-section";

export function VideoDemoSection() {
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);

  // El vídeo (3.6MB) solo se descarga y reproduce al entrar en viewport
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!el.src) el.src = el.dataset.src || "";
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const openVideo = () => {
    setIsOpen(true);
    setTimeout(() => videoRef.current?.play(), 300);
  };

  const closeVideo = () => {
    videoRef.current?.pause();
    setIsOpen(false);
  };

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 py-12 lg:py-16">
          <AnimatedSection className="text-center mb-12">
            <LandingBadge>Míralo tú mismo</LandingBadge>
            <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-5xl">
              Vale más verlo que leerlo
            </h2>
            <p className="text-stone-500 mt-4 text-lg">
              30 segundos. Si no te convence, sigues haciendo scroll.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div
              onClick={openVideo}
              className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-2xl shadow-black/10"
            >
              {/* Video preview: lazy via IntersectionObserver (data-src) */}
              <video
                ref={previewRef}
                data-src="/demo/fixa-demo.webm"
                muted
                loop
                playsInline
                preload="none"
                className="w-full rounded-2xl bg-stone-100"
                style={{ aspectRatio: "16/9", objectFit: "cover" }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-2xl shadow-black/20"
                >
                  <Play className="h-8 w-8 text-stone-900 ml-1" fill="currentColor" />
                </motion.div>
              </div>

              {/* Expand hint */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/50 backdrop-blur-sm px-3 py-1.5 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="h-3 w-3" />
                Ver a pantalla completa
              </div>

              {/* Border glow */}
              <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />
            </div>
          </AnimatedSection>

          {/* CTA tras el vídeo: el momento de máxima intención */}
          <AnimatedSection delay={0.3} className="text-center mt-10">
            <p className="text-stone-500 mb-4">Si te ha gustado con datos de ejemplo, imagina con los tuyos.</p>
            <Link href="/sign-up" onClick={() => track("cta_video")}>
              <Button
                size="lg"
                className="rounded-full bg-brand-500 text-white hover:bg-brand-400 font-bold h-12 px-8 shadow-brand cursor-pointer group"
              >
                Empezar 14 días gratis
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <p className="text-xs text-stone-400 mt-3">Sin tarjeta · Sin permanencia</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={closeVideo}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeVideo}
                className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5 text-white" />
              </button>
              <video
                ref={videoRef}
                src="/demo/fixa-demo.webm"
                controls
                autoPlay
                className="w-full rounded-xl shadow-2xl"
                style={{ aspectRatio: "16/9" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
