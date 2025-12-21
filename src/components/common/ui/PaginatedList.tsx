"use client";

import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Pagination from "@/components/common/ui/Pagination";
import {
  containerVariants,
  fadeVariants,
  pageTransitionVariants,
  pageTransitionItemVariants,
  DURATION,
  EASING,
} from "@/lib/animations";

interface PaginatedListProps<T> {
  items: T[];
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
  emptyMessage: string;
  renderItem: (item: T, index: number) => React.ReactNode;
  getItemKey: (item: T) => string;
}

export default function PaginatedList<T>({
  items,
  currentPage = 1,
  itemsPerPage = 6,
  onPageChange,
  showPagination = false,
  emptyMessage,
  renderItem,
  getItemKey,
}: PaginatedListProps<T>) {
  const listRef = useRef<HTMLUListElement>(null);

  // Calculate pagination
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = showPagination
    ? items.slice(startIndex, endIndex)
    : items;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.ul
        ref={listRef}
        className="animated-list flex flex-col"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">
          {currentItems.length === 0 && (
            <motion.div
              key="no-items"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: DURATION.normal, ease: EASING.easeOut }}
            >
              <p className="text-secondary">{emptyMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`page-${currentPage}`}
            variants={pageTransitionVariants}
            initial="exit"
            animate="enter"
            exit="exit"
            className="flex flex-col"
          >
            {currentItems.map((item, index) => (
              <motion.div
                key={getItemKey(item)}
                variants={pageTransitionItemVariants}
                className="w-full"
              >
                {renderItem(item, index)}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.ul>

      {showPagination && totalPages > 1 && onPageChange && (
        <motion.div
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          transition={{
            delay: 0.5,
            duration: DURATION.normal,
            ease: EASING.easeOut,
          }}
        >
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
