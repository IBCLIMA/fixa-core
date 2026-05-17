"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  stepDuration?: number;
}

export default function BlurText({
  text = "",
  delay = 100,
  className = "",
  animateBy = "words",
  direction = "bottom",
  threshold = 0.1,
  rootMargin = "0px",
  stepDuration = 0.35,
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom = useMemo(
    () =>
      direction === "top"
        ? { filter: "blur(10px)", opacity: 0, y: -30 }
        : { filter: "blur(10px)", opacity: 0, y: 30 },
    [direction]
  );

  const animateKeyframes = useMemo(
    () => ({
      filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
      opacity: [0, 0.5, 1],
      y: [direction === "top" ? -30 : 30, direction === "top" ? 3 : -3, 0],
    }),
    [direction]
  );

  return (
    <p ref={ref} className={className} style={{ display: "flex", flexWrap: "wrap", justifyContent: "inherit" }}>
      {elements.map((segment, index) => (
        <motion.span
          className="inline-block will-change-[transform,filter,opacity]"
          key={index}
          initial={defaultFrom}
          animate={inView ? animateKeyframes : defaultFrom}
          transition={{
            duration: stepDuration * 2,
            times: [0, 0.5, 1],
            delay: (index * delay) / 1000,
          }}
        >
          {segment === " " ? "\u00A0" : segment}
          {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </p>
  );
}
