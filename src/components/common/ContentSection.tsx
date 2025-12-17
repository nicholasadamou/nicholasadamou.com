import React from "react";
import type { Note, Project } from "@/lib/contentlayer-data";
import PostList from "@/app/notes/components/PostList";
import ProjectList from "@/app/projects/components/ProjectList";

interface ContentSectionProps {
  type: "notes" | "projects";
  content: Array<Note | Project>;
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  noPin?: boolean;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  type,
  content,
  currentPage = 1,
  itemsPerPage = 6,
  onPageChange,
  noPin = false,
}) => (
  <div className="animate-in" style={{ "--index": 3 } as React.CSSProperties}>
    {type === "notes" ? (
      <PostList
        initialPosts={content as Note[]}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        showPagination={true}
        noPin={noPin}
      />
    ) : (
      <ProjectList
        projects={content as Project[]}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        showPagination={true}
        noPin={noPin}
      />
    )}
  </div>
);
