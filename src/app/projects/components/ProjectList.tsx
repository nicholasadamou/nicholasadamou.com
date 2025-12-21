"use client";

import type { Project as ProjectType } from "@/lib/content/contentlayer-data";
import Project from "./Project";
import React from "react";
import PaginatedList from "@/components/common/ui/PaginatedList";

type ProjectListProps = {
  projects: ProjectType[];
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
  noPin?: boolean;
};

export default function ProjectList({
  projects,
  currentPage = 1,
  itemsPerPage = 6,
  onPageChange,
  showPagination = false,
  noPin = false,
}: ProjectListProps) {
  return (
    <PaginatedList
      items={projects}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      onPageChange={onPageChange}
      showPagination={showPagination}
      emptyMessage="No projects found."
      renderItem={(project) => (
        <Project project={project} shouldShowPin={!noPin} />
      )}
      getItemKey={(project) => project.slug}
    />
  );
}
