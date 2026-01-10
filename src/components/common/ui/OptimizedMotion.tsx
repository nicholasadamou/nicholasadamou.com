"use client";

import { motion, LazyMotion, domAnimation, m } from "framer-motion";

/**
 * Optimized motion component using LazyMotion for better performance
 * Use this instead of direct motion.div when possible
 */
export function OptimizedMotionDiv({
  children,
  ...props
}: React.ComponentProps<typeof m.div>) {
  return (
    <LazyMotion features={domAnimation} strict>
      <m.div {...props}>{children}</m.div>
    </LazyMotion>
  );
}

export { motion };
