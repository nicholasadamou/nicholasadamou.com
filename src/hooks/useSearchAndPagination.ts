import { useState, useEffect, useMemo } from "react";
import type { Note, Project } from "@/lib/contentlayer-data";

interface UseSearchAndPaginationProps {
  content: Array<Note | Project>;
  type: "notes" | "projects";
  itemsPerPage?: number;
}

export function useSearchAndPagination({
  content,
  type,
  itemsPerPage = 6,
}: UseSearchAndPaginationProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter content based on search term
  const filteredContent = useMemo(() => {
    if (type === "notes") {
      return (content as Note[]).filter((note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return (content as Project[]).filter(
      (project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies?.some((tech) =>
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [content, type, searchTerm]);

  // Sort content by date
  const sortedContent = useMemo(() => {
    return filteredContent.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [filteredContent]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    sortedContent,
    itemsPerPage,
  };
}
