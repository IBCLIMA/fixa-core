"use client";

import { motion, useReducedMotion } from "framer-motion";

// Confeti DISEÑADO (no aleatorio): tiras finas en tonos de marca, repartidas a
// mano para que caiga equilibrado. Sosegado y premium, nada de fiesta infantil.
const CONFETTI = [
  { left: 6, delay: 0.0, drift: 16, rot: 150, color: "#10b981" },
  { left: 14, delay: 0.32, drift: -12, rot: -130, color: "#f59e0b" },
  { left: 22, delay: 0.12, drift: 22, rot: 200, color: "#f97316" },
  { left: 31, delay: 0.46, drift: -8, rot: -90, color: "#34d399" },
  { left: 40, delay: 0.05, drift: 14, rot: 120, color: "#fbbf24" },
  { left: 49, delay: 0.38, drift: -18, rot: -160, color: "#10b981" },
  { left: 58, delay: 0.18, drift: 10, rot: 110, color: "#f97316" },
  { left: 66, delay: 0.5, drift: -14, rot: -140, color: "#34d399" },
  { left: 74, delay: 0.1, drift: 20, rot: 180, color: "#f59e0b" },
  { left: 82, delay: 0.42, drift: -10, rot: -100, color: "#10b981" },
  { left: 90, delay: 0.24, drift: 16, rot: 150, color: "#fbbf24" },
  { left: 95, delay: 0.55, drift: -20, rot: -170, color: "#f97316" },
];

/**
 * Celebración sobria del momento "tu coche está listo" — el pico emocional del
 * cliente. Un destello suave detrás del icono y unas pocas tiras de confeti en
 * tonos de marca que caen UNA vez y se desvanecen. Pensado para ir dentro del
 * hero (que es `relative overflow-hidden`), así el confeti queda recortado a la
 * tarjeta. Respeta prefers-reduced-motion: si está activo, no renderiza nada.
 */
export function CelebracionListo() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Destello suave detrás del icono de estado */}
      <motion.div
        className="absolute left-1/2 top-6 h-44 w-44 -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.28), transparent 70%)" }}
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: [0.4, 1.25, 1], opacity: [0, 0.9, 0.45] }}
        transition={{ duration: 1.3, ease: "easeOut" }}
      />
      {/* Confeti — cae una sola vez */}
      {CONFETTI.map((p, i) => (
        <motion.span
          key={i}
          className="absolute top-0 h-2.5 w-[3px] rounded-[2px]"
          style={{ left: `${p.left}%`, backgroundColor: p.color }}
          initial={{ y: -12, opacity: 0, rotate: 0 }}
          animate={{ y: 420, x: p.drift, rotate: p.rot, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.9, delay: p.delay, ease: [0.4, 0, 0.6, 1] }}
        />
      ))}
    </div>
  );
}
