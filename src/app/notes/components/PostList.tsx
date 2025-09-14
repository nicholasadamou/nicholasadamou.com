"use client";

import type { Note as PostType } from "@/lib/contentlayer-data";
import Post from "./Post";
import React, { useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Pagination from "@/components/common/Pagination";
import {
  containerVariants,
  itemVariants,
  fadeVariants,
  pageTransitionVariants,
  pageTransitionItemVariants,
  getStaggerDelay,
  DURATION,
  EASING,
} from "@/lib/animations";

type PostListProps = {
  initialPosts: PostType[];
  searchTerm?: string;
  mostRecentFirst?: boolean;
  topNPosts?: number;
  noPin?: boolean;
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
};

export default function PostList({
  initialPosts,
  searchTerm = "",
  mostRecentFirst = false,
  topNPosts,
  noPin,
  currentPage = 1,
  itemsPerPage = 6,
  onPageChange,
  showPagination = false,
}: PostListProps) {
  const listRef = useRef<HTMLUListElement>(null);

  // Sorting and filtering logic
  const sortedAndFilteredPosts = useMemo(() => {
    let posts = [...initialPosts];

    // Sort posts if mostRecentFirst is true
    if (mostRecentFirst) {
      posts.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      if (topNPosts) {
        posts = posts.slice(0, topNPosts);
      }

      return posts;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const pinnedPosts = posts.filter((post) => post.pinned);
    const nonPinnedPosts = posts.filter((post) => !post.pinned);

    const filteredPinnedPosts = pinnedPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        post.body.raw.toLowerCase().includes(lowerCaseSearchTerm)
    );

    const filteredNonPinnedPosts = nonPinnedPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        post.body.raw.toLowerCase().includes(lowerCaseSearchTerm)
    );

    return [...filteredPinnedPosts, ...filteredNonPinnedPosts];
  }, [topNPosts, initialPosts, searchTerm, mostRecentFirst]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedAndFilteredPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedPosts = showPagination
    ? sortedAndFilteredPosts.slice(startIndex, endIndex)
    : sortedAndFilteredPosts;

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
          {displayedPosts.length === 0 && (
            <motion.div
              key="no-posts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: DURATION.normal, ease: EASING.easeOut }}
            >
              <p className="text-secondary">No notes found.</p>
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
            {displayedPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                variants={pageTransitionItemVariants}
                className="w-full"
              >
                <Post post={post} shouldShowPin={!noPin} />
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
