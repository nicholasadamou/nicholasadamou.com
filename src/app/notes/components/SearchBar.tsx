import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  searchVariants,
  buttonVariants,
  DURATION,
  EASING,
} from "@/lib/animation/variants";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  kind: string;
}

export default function SearchBar({
  searchTerm,
  setSearchTerm,
  kind,
  className,
  style,
  ...restProps
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className={className || "w-full"}
      style={style}
      variants={searchVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={`Search ${kind}...`}
        className="border-secondary text-primary w-full rounded-md border px-4 py-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: 1,
          scale: isFocused ? 1.02 : 1,
          borderColor: isFocused ? "rgb(59, 130, 246)" : "var(--gray-3)",
        }}
        transition={{
          duration: DURATION.normal,
          ease: EASING.easeOut,
        }}
        whileFocus={{
          scale: 1.02,
          transition: { duration: DURATION.fast, ease: EASING.easeOut },
        }}
      />

      {searchTerm && (
        <motion.div
          className="text-secondary mt-2 text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: DURATION.normal, ease: EASING.easeOut }}
        >
          Searching for:{" "}
          <span className="text-primary font-medium">{searchTerm}</span>
        </motion.div>
      )}
    </motion.div>
  );
}
