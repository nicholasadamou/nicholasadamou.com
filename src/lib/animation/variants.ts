import type { Variants } from "framer-motion";

export const EASING = {
  ease: [0.4, 0.0, 0.2, 1],
  easeIn: [0.4, 0.0, 1, 1],
  easeOut: [0.0, 0.0, 0.2, 1],
  easeInOut: [0.4, 0.0, 0.2, 1],
  bouncy: [0.68, -0.55, 0.265, 1.55],
  spring: [0.25, 0.46, 0.45, 0.94],
} as const;

export const DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
} as const;

export const filterVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    height: "auto",
    scale: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASING.easeOut,
      staggerChildren: 0.05,
    },
  },
};

export const buttonVariants: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: DURATION.fast,
      ease: EASING.easeOut,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: DURATION.fast,
      ease: EASING.easeInOut,
    },
  },
};

export const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: DURATION.slow,
      ease: EASING.easeOut,
    },
  },
};

export const getStaggerDelay = (index: number, baseDelay = 0.1): number => {
  return baseDelay * index;
};
