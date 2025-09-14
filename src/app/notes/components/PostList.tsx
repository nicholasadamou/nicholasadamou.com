"use client";

import type { Note as PostType } from "@/lib/contentlayer-data";
import Post from "./Post";
import React, { useMemo } from "react";
import PaginatedList from "@/components/common/PaginatedList";

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

  return (
    <PaginatedList
      items={sortedAndFilteredPosts}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      onPageChange={onPageChange}
      showPagination={showPagination}
      emptyMessage="No notes found."
      renderItem={(post) => <Post post={post} shouldShowPin={!noPin} />}
      getItemKey={(post) => post.slug}
    />
  );
}
