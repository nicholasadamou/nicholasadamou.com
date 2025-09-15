"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import type { Note, Project } from "@/lib/contentlayer-data";
import SearchBar from "@/app/notes/components/SearchBar";
import FilterBar from "@/components/common/FilterBar";
import { useSearchAndPagination } from "@/hooks/useSearchAndPagination";
import { ListHeader } from "@/components/common/ListHeader";
import { ContentSection } from "@/components/common/ContentSection";
import { OpenSourceSection } from "@/components/common/OpenSourceSection";
import {
  pageVariants,
  containerVariants,
  DURATION,
  EASING,
} from "@/lib/animations";

interface ListPageProps {
  content: Array<Note | Project>;
  type: "notes" | "projects";
}

const ListPage: React.FC<ListPageProps> = ({ content, type }) => {
  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    availableTechnologies,
    currentPage,
    setCurrentPage,
    sortedContent,
    itemsPerPage,
  } = useSearchAndPagination({ content, type });

  const [repoSearchTerm, setRepoSearchTerm] = useState("");

  return (
    <motion.div
      className="mx-auto flex max-w-4xl flex-col gap-8"
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1,
          duration: DURATION.normal,
          ease: EASING.easeOut,
        }}
      >
        <ListHeader type={type} />
      </motion.div>

      {type === "projects" ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            duration: DURATION.normal,
            ease: EASING.easeOut,
          }}
        >
          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={filters}
            setFilters={setFilters}
            availableTechnologies={availableTechnologies}
            kind={type}
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            duration: DURATION.normal,
            ease: EASING.easeOut,
          }}
        >
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            kind={type}
          />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: DURATION.slow,
          ease: EASING.easeOut,
        }}
      >
        <ContentSection
          type={type}
          content={sortedContent}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </motion.div>

      {type === "projects" && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.6,
              duration: DURATION.slow,
              ease: EASING.easeOut,
            }}
          >
            <OpenSourceSection
              searchTerm={repoSearchTerm}
              setSearchTerm={setRepoSearchTerm}
              type={type}
            />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ListPage;
