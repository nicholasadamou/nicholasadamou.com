"use client";

import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import FlipNumber from "@/components/common/FlipNumber";
import { useViews } from "../hooks/useViews";
import { scaleVariants, DURATION, EASING } from "@/lib/animations";

type ViewsProps = {
  slug: string;
};

export default function Views({ slug }: ViewsProps) {
  const viewCount = useViews({ slug });

  return (
    <motion.span
      className="flex items-center gap-1.5"
      variants={scaleVariants}
      initial="hidden"
      animate="visible"
      transition={{
        duration: DURATION.normal,
        ease: EASING.bouncy,
      }}
    >
      <Eye size={14} />
      <motion.span
        key={viewCount}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: DURATION.normal,
          ease: EASING.bouncy,
        }}
      >
        <FlipNumber>{viewCount}</FlipNumber>
      </motion.span>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 0.1,
          duration: DURATION.normal,
          ease: EASING.easeOut,
        }}
      >
        {viewCount === 1 ? " view" : " views"}
      </motion.span>
    </motion.span>
  );
}
