"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  buttonVariants,
  fadeVariants,
  DURATION,
  EASING,
} from "@/lib/animations";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => (
  <motion.nav
    className="mt-8 flex items-center justify-center"
    aria-label="Pagination"
    variants={fadeVariants}
    initial="hidden"
    animate="visible"
    transition={{ delay: 0.2, duration: DURATION.normal, ease: EASING.easeOut }}
  >
    <motion.div
      className="flex items-center space-x-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3,
        duration: DURATION.normal,
        ease: EASING.easeOut,
      }}
    >
      <motion.div
        variants={buttonVariants}
        initial="initial"
        whileHover={currentPage > 1 ? "hover" : "initial"}
        whileTap={currentPage > 1 ? "tap" : "initial"}
      >
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          className="cursor-pointer p-4 disabled:cursor-not-allowed"
        >
          Previous
        </Button>
      </motion.div>

      <motion.div
        className="flex items-center px-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: 0.4,
          duration: DURATION.normal,
          ease: EASING.bouncy,
        }}
      >
        <span className="text-secondary text-sm">
          {currentPage} of {totalPages}
        </span>
      </motion.div>

      <motion.div
        variants={buttonVariants}
        initial="initial"
        whileHover={currentPage < totalPages ? "hover" : "initial"}
        whileTap={currentPage < totalPages ? "tap" : "initial"}
      >
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          className="cursor-pointer p-4 disabled:cursor-not-allowed"
        >
          Next
        </Button>
      </motion.div>
    </motion.div>
  </motion.nav>
);

export default Pagination;
