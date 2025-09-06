"use client";

import React from "react";
import { motion } from "framer-motion";
import { DURATION, EASING } from "@/lib/animations";

interface AnimatedMDXWrapperProps {
  children: React.ReactNode;
}

// Simple, smooth animation variants
const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASING.easeOut,
      delayChildren: 0.2,
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASING.easeOut,
    },
  },
};

export const AnimatedMDXWrapper: React.FC<AnimatedMDXWrapperProps> = ({
  children,
}) => {
  return (
    <motion.div
      className="prose prose-neutral max-w-4xl text-pretty"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="space-y-4">
        {children}
      </motion.div>
    </motion.div>
  );
};
