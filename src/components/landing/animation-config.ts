import type { Variants, Transition } from "framer-motion";

// Shared animation variants
export const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const FADE_DOWN: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0 },
};

export const FADE_LEFT: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0 },
};

export const FADE_RIGHT: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0 },
};

export const SCALE_IN: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

// Reduced motion variant (opacity only)
export const FADE_ONLY: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Transitions
export const TRANSITION_DEFAULT: Transition = {
  duration: 0.6,
  ease: [0.22, 1, 0.36, 1],
};

export const TRANSITION_SPRING: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 20,
};

// Stagger containers
export const STAGGER_CONTAINER: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const STAGGER_CONTAINER_SLOW: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};
