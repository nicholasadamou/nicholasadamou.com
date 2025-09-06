"use client";

import type { Project as ProjectType } from "@/lib/contentlayer-data";
import Project from "./Project";
import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Pagination from "@/components/common/Pagination";
import {
  containerVariants,
  itemVariants,
  fadeVariants,
  getStaggerDelay,
  DURATION,
  EASING,
} from "@/lib/animations";

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
  const listRef = useRef(null);

  // Calculate pagination
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = showPagination
    ? projects.slice(startIndex, endIndex)
    : projects;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.ul
        ref={listRef}
        className="animated-list flex flex-col"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">
          {currentProjects.length === 0 && (
            <motion.div
              key="no-projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: DURATION.normal, ease: EASING.easeOut }}
            >
              <p className="text-secondary">No projects found.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {currentProjects.map((project, index) => (
            <motion.div
              key={project.slug}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{
                delay: getStaggerDelay(index, 0.08),
                duration: DURATION.slow,
                ease: EASING.easeOut,
              }}
              layout
            >
              <Project project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.ul>

      {showPagination && totalPages > 1 && onPageChange && (
        <motion.div
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          transition={{
            delay: 0.5,
            duration: DURATION.normal,
            ease: EASING.easeOut,
          }}
        >
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
