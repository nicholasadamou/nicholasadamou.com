"use client";

import type { Project as ProjectType } from "@/lib/contentlayer-data";
import Project from "./Project";
import React, { useRef, useState } from "react";
import { getRelativeCoordinates } from "@/app/utils/getRelativeCoordinates";

type ProjectListProps = {
  projects: ProjectType[];
};

export default function ProjectList({ projects }: ProjectListProps) {
  const [mousePosition, setMousePosition] = useState({
    x: 240,
    y: 0,
  });
  const listRef = useRef(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLUListElement>) => {
    setMousePosition(getRelativeCoordinates(e, listRef.current));
  };

  return (
    <ul
      ref={listRef}
      onMouseMove={(e) => handleMouseMove(e)}
      className="flex flex-col animated-list"
    >
      {projects.length === 0 && <p className="text-secondary">No projects found.</p>}
      {projects.map((project) => (
        <Project key={project.slug} project={project} mousePosition={mousePosition} />
      ))}
    </ul>
  );
}
