"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function SpotlightReveal({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="motion-reduce:!transform-none motion-reduce:!opacity-100"
    >
      {children}
    </motion.div>
  );
}
