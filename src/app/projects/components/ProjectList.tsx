"use client";

import type { Project as ProjectType } from "@/lib/contentlayer-data";
import Project from "./Project";
import React from "react";
import PaginatedList from "@/components/common/PaginatedList";

type ProjectListProps = {
  projects: ProjectType[];
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
};

export default function ProjectList({
  projects,
  currentPage = 1,
  itemsPerPage = 6,
  onPageChange,
  showPagination = false,
}: ProjectListProps) {
  return (
    <PaginatedList
      items={projects}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      onPageChange={onPageChange}
      showPagination={showPagination}
      emptyMessage="No projects found."
      renderItem={(project) => <Project project={project} />}
      getItemKey={(project) => project.slug}
    />
  );
}
