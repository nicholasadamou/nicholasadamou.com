"use client";

import type { Project as ProjectType } from "@/lib/contentlayer-data";
import Project from "./Project";
import React, { useRef, useState } from "react";
import { getRelativeCoordinates } from "@/lib/utils/getRelativeCoordinates";
import Pagination from "@/components/common/Pagination";

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
  const [mousePosition, setMousePosition] = useState({
    x: 240,
    y: 0,
  });
  const listRef = useRef(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLUListElement>) => {
    setMousePosition(getRelativeCoordinates(e, listRef.current));
  };

  // Calculate pagination
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = showPagination
    ? projects.slice(startIndex, endIndex)
    : projects;

  return (
    <div>
      <ul
        ref={listRef}
        onMouseMove={(e) => handleMouseMove(e)}
        className="animated-list flex flex-col"
      >
        {currentProjects.length === 0 && (
          <p className="text-secondary">No projects found.</p>
        )}
        {currentProjects.map((project) => (
          <Project
            key={project.slug}
            project={project}
            mousePosition={mousePosition}
          />
        ))}
      </ul>
      {showPagination && totalPages > 1 && onPageChange && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
