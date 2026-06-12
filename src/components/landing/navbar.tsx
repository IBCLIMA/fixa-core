"use client";

import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@vercel/analytics";
import { FixaLogo } from "@/components/ui/fixa-logo";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-4 left-4 right-4 z-50 transition-all duration-500 rounded-2xl",
          scrolled
            ? "bg-white/70 backdrop-blur-2xl border border-stone-200/50 shadow-lg shadow-black/[0.03]"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 h-14">
          <Link href="/">
            <FixaLogo size="md" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {[
              { label: "Funciones", href: "/funciones" },
              { label: "Precios", href: "/precios" },
              { label: "Blog", href: "/blog" },
              { label: "Nosotros", href: "/nosotros" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors px-4 py-2 rounded-xl hover:bg-stone-100/50"
              >
                {item.label}
              </Link>
            ))}
            <div className="w-px h-6 bg-stone-200 mx-2" />
            <Link
              href="/sign-in"
              className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors px-4 py-2 rounded-xl hover:bg-stone-100/50"
            >
              Acceder
            </Link>
            <Link href="/sign-up" className="ml-1" onClick={() => track("cta_navbar")}>
              <Button className="rounded-full bg-orange-500 text-white hover:bg-orange-400 font-semibold shadow-lg shadow-orange-500/20 text-sm h-9 px-5 cursor-pointer">
                Probar gratis
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden flex h-10 w-10 items-center justify-center rounded-xl hover:bg-stone-100/50 transition-colors cursor-pointer"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileOpen ? <X className="h-5 w-5 text-stone-700" /> : <Menu className="h-5 w-5 text-stone-700" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 z-40 bg-white/90 backdrop-blur-2xl border border-stone-200/60 rounded-2xl shadow-2xl shadow-black/10 sm:hidden overflow-hidden"
          >
            <nav className="flex flex-col p-3">
              {[
                { label: "Funciones", href: "/funciones" },
                { label: "Precios", href: "/precios" },
                { label: "Blog", href: "/blog" },
                { label: "Nosotros", href: "/nosotros" },
                { label: "Acceder", href: "/sign-in" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50 rounded-xl transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="p-2 pt-1">
                <Link href="/sign-up" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full rounded-full bg-stone-900 text-white hover:bg-stone-800 font-semibold shadow-lg h-11 cursor-pointer">
                    Probar gratis
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-20" />
    </>
  );
}
