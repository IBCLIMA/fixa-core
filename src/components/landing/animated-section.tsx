"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import {
  FADE_UP,
  FADE_DOWN,
  FADE_LEFT,
  FADE_RIGHT,
  SCALE_IN,
  FADE_ONLY,
  TRANSITION_DEFAULT,
  STAGGER_CONTAINER,
  STAGGER_CONTAINER_SLOW,
} from "./animation-config";
import { cn } from "@/lib/utils";

const directionVariants = {
  up: FADE_UP,
  down: FADE_DOWN,
  left: FADE_LEFT,
  right: FADE_RIGHT,
  scale: SCALE_IN,
} as const;

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: keyof typeof directionVariants;
  once?: boolean;
  as?: "div" | "section" | "header" | "footer";
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = "up",
  once = true,
  as = "div",
}: AnimatedSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? FADE_ONLY : directionVariants[direction];
  const Component = motion.create(as);

  return (
    <Component
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-100px" }}
      transition={{ ...TRANSITION_DEFAULT, delay }}
      className={className}
    >
      {children}
    </Component>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  slow?: boolean;
  once?: boolean;
  delay?: number;
  as?: "div" | "section" | "ul";
}

export function StaggerContainer({
  children,
  className,
  slow = false,
  once = true,
  delay = 0,
  as = "div",
}: StaggerContainerProps) {
  const container = slow ? STAGGER_CONTAINER_SLOW : STAGGER_CONTAINER;
  const Component = motion.create(as);

  return (
    <Component
      variants={{
        ...container,
        visible: {
          ...container.visible,
          transition: {
            ...(container.visible as Record<string, unknown>).transition as Record<string, unknown>,
            delayChildren: delay,
          },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-100px" }}
      className={className}
    >
      {children}
    </Component>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  direction?: keyof typeof directionVariants;
}

export function StaggerItem({
  children,
  className,
  direction = "up",
}: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? FADE_ONLY : directionVariants[direction];

  return (
    <motion.div
      variants={variants}
      transition={TRANSITION_DEFAULT}
      className={className}
    >
      {children}
    </motion.div>
  );
}
