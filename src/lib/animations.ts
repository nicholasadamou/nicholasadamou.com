import { Variants } from "framer-motion";

// Common easing curves
export const EASING = {
  ease: [0.4, 0.0, 0.2, 1],
  easeIn: [0.4, 0.0, 1, 1],
  easeOut: [0.0, 0.0, 0.2, 1],
  easeInOut: [0.4, 0.0, 0.2, 1],
  bouncy: [0.68, -0.55, 0.265, 1.55],
  spring: [0.25, 0.46, 0.45, 0.94],
} as const;

// Common animation durations
export const DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
} as const;

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.slow,
      ease: EASING.easeOut,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: DURATION.normal,
      ease: EASING.easeIn,
    },
  },
};

// Container variants for staggered animations
export const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.08,
    },
  },
};

// Item variants for staggered animations
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

// Card variants with hover effects
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: DURATION.slow,
      ease: EASING.bouncy,
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: DURATION.normal,
      ease: EASING.easeOut,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: DURATION.fast,
      ease: EASING.easeInOut,
    },
  },
};

// Fade variants
export const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASING.easeOut,
    },
  },
};

// Slide up variants
export const slideUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.slow,
      ease: EASING.spring,
    },
  },
};

// Scale variants
export const scaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASING.bouncy,
    },
  },
};

// Button variants
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

// Filter animation variants
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

// Loading skeleton variants
export const skeletonVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: [0.4, 0.8, 0.4],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

// Image hover variants
export const imageHoverVariants: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.1,
    transition: {
      duration: DURATION.normal,
      ease: EASING.easeOut,
    },
  },
};

// Navigation variants
export const navVariants: Variants = {
  hidden: {
    y: -100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

// Search bar variants
export const searchVariants: Variants = {
  hidden: {
    opacity: 0,
    width: 0,
  },
  visible: {
    opacity: 1,
    width: "100%",
    transition: {
      duration: DURATION.normal,
      ease: EASING.easeOut,
    },
  },
};

// Tab variants
export const tabVariants: Variants = {
  inactive: {
    scale: 1,
    opacity: 0.7,
  },
  active: {
    scale: 1.05,
    opacity: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASING.bouncy,
    },
  },
};

// Floating animation variants
export const floatingVariants: Variants = {
  initial: {
    y: 0,
  },
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

// Stagger delay function
export const getStaggerDelay = (index: number, baseDelay = 0.1): number => {
  return baseDelay * index;
};

// Spring presets
export const SPRING_CONFIGS = {
  gentle: { type: "spring", stiffness: 120, damping: 14 },
  bouncy: { type: "spring", stiffness: 200, damping: 10 },
  stiff: { type: "spring", stiffness: 300, damping: 20 },
  soft: { type: "spring", stiffness: 80, damping: 12 },
} as const;
