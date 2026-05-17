"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect, useCallback } from "react";
import { TRANSITION_DEFAULT } from "./animation-config";

function CountUp({
  to,
  from = 0,
  duration = 2,
  separator = ".",
  className = "",
  suffix = "",
  prefix = "",
}: {
  to: number;
  from?: number;
  duration?: number;
  separator?: string;
  className?: string;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(from);
  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);
  const springValue = useSpring(motionValue, { damping, stiffness });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const maxDecimals = Math.max(
    ...[from, to].map((n) => {
      const str = n.toString();
      return str.includes(".") ? str.split(".")[1].length : 0;
    })
  );

  const formatValue = useCallback(
    (latest: number) => {
      const options: Intl.NumberFormatOptions = {
        useGrouping: !!separator,
        minimumFractionDigits: maxDecimals,
        maximumFractionDigits: maxDecimals,
      };
      const formatted = Intl.NumberFormat("en-US", options).format(latest);
      return prefix + (separator ? formatted.replace(/,/g, separator) : formatted) + suffix;
    },
    [maxDecimals, separator, prefix, suffix]
  );

  useEffect(() => {
    if (ref.current) ref.current.textContent = formatValue(from);
  }, [from, formatValue]);

  useEffect(() => {
    if (isInView) motionValue.set(to);
  }, [isInView, motionValue, to]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) ref.current.textContent = formatValue(latest);
    });
    return () => unsubscribe();
  }, [springValue, formatValue]);

  return <span className={className} ref={ref} />;
}

const stats = [
  { value: 150, suffix: "+", label: "Talleres activos" },
  { value: 10000, suffix: "+", label: "Órdenes gestionadas" },
  { value: 10, suffix: "s", prefix: "<", label: "Crear una orden" },
  { value: 4.8, suffix: "/5", label: "Satisfacción" },
];

export function SocialProofBar() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={TRANSITION_DEFAULT}
          className="rounded-2xl border border-stone-200/50 bg-white/60 backdrop-blur-sm p-8 lg:p-10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-stone-200/50">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...TRANSITION_DEFAULT, delay: i * 0.1 }}
                className="flex flex-col items-center text-center lg:px-8"
              >
                <CountUp
                  to={stat.value}
                  duration={2}
                  separator="."
                  suffix={stat.suffix}
                  prefix={stat.prefix ?? ""}
                  className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight tabular-nums"
                />
                <span className="text-sm text-stone-500 mt-1.5 font-medium">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
