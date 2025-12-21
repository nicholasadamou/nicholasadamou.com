import { useState, useEffect, useMemo } from "react";
import type { Note, Project } from "@/lib/content/contentlayer-data";
import type { FilterOptions } from "@/components/common/ui/FilterBar";

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
  const [filters, setFilters] = useState<FilterOptions>({
    technologies: [],
    pinnedStatus: "all",
    dateRange: "all",
    hasDemo: "all",
  });

  // Get all available technologies for filter options
  const availableTechnologies = useMemo(() => {
    if (type !== "projects") return [];

    const techSet = new Set<string>();
    (content as Project[]).forEach((project) => {
      project.technologies?.forEach((tech) => techSet.add(tech));
    });

    return Array.from(techSet).sort();
  }, [content, type]);

  // Filter content based on search term and filters
  const filteredContent = useMemo(() => {
    if (type === "notes") {
      // For notes, only apply search term filtering
      return (content as Note[]).filter((note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // For projects, apply all filters
    return (content as Project[]).filter((project) => {
      // Search term filter
      const matchesSearch =
        !searchTerm ||
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies?.some((tech) =>
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        );

      if (!matchesSearch) return false;

      // Technology filter
      const matchesTechnology =
        filters.technologies.length === 0 ||
        project.technologies?.some((tech) =>
          filters.technologies.includes(tech)
        );

      if (!matchesTechnology) return false;

      // Pinned status filter
      const matchesPinnedStatus =
        filters.pinnedStatus === "all" ||
        (filters.pinnedStatus === "pinned" && project.pinned) ||
        (filters.pinnedStatus === "unpinned" && !project.pinned);

      if (!matchesPinnedStatus) return false;

      // Date range filter
      const projectYear = new Date(project.date).getFullYear();
      const currentYear = new Date().getFullYear();
      const matchesDateRange =
        filters.dateRange === "all" ||
        (filters.dateRange === "thisYear" && projectYear === currentYear) ||
        (filters.dateRange === "lastYear" && projectYear === currentYear - 1) ||
        (filters.dateRange === "older" && projectYear < currentYear - 1);

      if (!matchesDateRange) return false;

      // Demo availability filter
      const hasDemo = project.demoUrl && project.demoUrl.trim() !== "";
      const matchesDemo =
        filters.hasDemo === "all" ||
        (filters.hasDemo === "withDemo" && hasDemo) ||
        (filters.hasDemo === "withoutDemo" && !hasDemo);

      return matchesDemo;
    });
  }, [content, type, searchTerm, filters]);

  // Sort content by date only (newest first)
  const sortedContent = useMemo(() => {
    return filteredContent.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [filteredContent]);

  // Reset to page 1 when search term or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    availableTechnologies,
    currentPage,
    setCurrentPage,
    sortedContent,
    itemsPerPage,
  };
}
