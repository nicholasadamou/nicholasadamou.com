"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { Note, Project } from "@/lib/contentlayer-data";
import SearchBar from "@/app/notes/components/SearchBar";
import FilterBar from "@/components/common/FilterBar";
import { useSearchAndPagination } from "@/hooks/useSearchAndPagination";
import { ListHeader } from "@/components/common/ListHeader";
import { ContentSection } from "@/components/common/ContentSection";
import { OpenSourceSection } from "@/components/common/OpenSourceSection";
import PinnedProjectList from "@/components/features/projects/PinnedProjectList";
import PinnedNotesList from "@/components/features/notes/PinnedNotesList";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PinIcon } from "lucide-react";
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

  // Check if there are any pinned items
  const hasPinnedItems = useMemo(
    () => content.some((item) => "pinned" in item && item.pinned),
    [content]
  );

  // Check if user is actively searching or filtering
  const isSearchingOrFiltering = useMemo(() => {
    if (searchTerm) return true;
    if (type === "projects") {
      return (
        filters.technologies.length > 0 ||
        filters.pinnedStatus !== "all" ||
        filters.dateRange !== "all" ||
        filters.hasDemo !== "all"
      );
    }
    return false;
  }, [searchTerm, filters, type]);

  return (
    <motion.div
      className="mx-auto mb-16 flex max-w-4xl flex-col gap-8"
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

      {hasPinnedItems && !isSearchingOrFiltering && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.15,
            duration: DURATION.normal,
            ease: EASING.easeOut,
          }}
        >
          <div className="space-y-6">
            <SectionHeader
              title={`Pinned ${type === "projects" ? "Projects" : "Notes"}`}
              icon={<PinIcon className="text-tertiary h-5 w-5" />}
            />
            {type === "projects" ? (
              <PinnedProjectList projects={content as Project[]} />
            ) : (
              <PinnedNotesList notes={content as Note[]} />
            )}
          </div>
        </motion.div>
      )}

      {type === "projects" ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: hasPinnedItems && !isSearchingOrFiltering ? 0.25 : 0.2,
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
            delay: hasPinnedItems && !isSearchingOrFiltering ? 0.25 : 0.2,
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
          delay: hasPinnedItems && !isSearchingOrFiltering ? 0.35 : 0.3,
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
          noPin={true}
        />
      </motion.div>

      {type === "projects" && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{
            delay: hasPinnedItems && !isSearchingOrFiltering ? 0.55 : 0.5,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: hasPinnedItems && !isSearchingOrFiltering ? 0.65 : 0.6,
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
