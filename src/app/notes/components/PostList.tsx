"use client";

import type { Note as PostType } from "@/lib/contentlayer-data";
import Post from "./Post";
import PostSkeleton from "./PostSkeleton";
import React, { useRef, useState, useEffect, useMemo } from "react";
import { getRelativeCoordinates } from "@/lib/utils/getRelativeCoordinates";
import { motion } from "framer-motion";

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
  const [mousePosition, setMousePosition] = useState({
    x: 240,
    y: 0,
  });
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

  const handleMouseMove = (e: React.MouseEvent<HTMLUListElement>) => {
    setMousePosition(getRelativeCoordinates(e, listRef.current));
  };

  return (
    <ul
      ref={listRef}
      onMouseMove={(e) => handleMouseMove(e)}
      className="animated-list flex flex-col"
    >
      {displayedPosts.length === 0 && (
        <p className="text-secondary">No notes found.</p>
      )}
      {displayedPosts.map((post) => (
        <Post
          key={post.slug}
          post={post}
          mousePosition={mousePosition}
          shouldShowPin={!noPin}
        />
      ))}
      {hasMore && (
        <motion.li
          ref={loadMoreRef}
          {...({ className: "py-2" } as any)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <PostSkeleton />
          {/* Add multiple skeletons for a better loading effect */}
          <PostSkeleton />
        </motion.li>
      )}
    </ul>
  );
}
