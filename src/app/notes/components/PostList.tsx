"use client";

import type { Note as PostType } from "@/lib/contentlayer-data";
import Post from "./Post";
import PostSkeleton from "./PostSkeleton";
import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  containerVariants,
  itemVariants,
  skeletonVariants,
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
};

const POSTS_PER_PAGE = 5;

export default function PostList({
  initialPosts,
  searchTerm = "",
  mostRecentFirst = false,
  topNPosts,
  noPin,
}: PostListProps) {
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLUListElement>(null);
  const loadMoreRef = useRef<HTMLLIElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

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

  const displayedPosts = useMemo(() => {
    return sortedAndFilteredPosts.slice(0, page * POSTS_PER_PAGE);
  }, [sortedAndFilteredPosts, page]);

  const hasMore = displayedPosts.length < sortedAndFilteredPosts.length;

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    }, options);

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore]);

  return (
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

      <AnimatePresence>
        {displayedPosts.map((post, index) => (
          <motion.div
            key={post.slug}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{
              delay: getStaggerDelay(index, 0.05),
              duration: DURATION.slow,
              ease: EASING.easeOut,
            }}
            layout
          >
            <Post post={post} shouldShowPin={!noPin} />
          </motion.div>
        ))}
      </AnimatePresence>

      {hasMore && (
        <motion.li
          ref={loadMoreRef}
          {...({ className: "py-2" } as any)}
          variants={skeletonVariants}
          initial="initial"
          animate="animate"
          layout
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.1,
              duration: DURATION.normal,
              ease: EASING.easeOut,
            }}
          >
            <PostSkeleton />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2,
              duration: DURATION.normal,
              ease: EASING.easeOut,
            }}
          >
            <PostSkeleton />
          </motion.div>
        </motion.li>
      )}
    </motion.ul>
  );
}
