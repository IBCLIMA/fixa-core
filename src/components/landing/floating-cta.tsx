"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { ArrowRight } from "lucide-react";

export function FloatingCta() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setVisible(v > 500));

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed bottom-6 left-4 right-4 z-50 md:hidden"
    >
      <Link
        href="/sign-up"
        onClick={() => track("cta_flotante")}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-orange-500 text-white font-bold text-sm shadow-2xl shadow-orange-500/30 active:bg-orange-600 transition-colors"
      >
        Probarlo gratis
        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.div>
  );
}
