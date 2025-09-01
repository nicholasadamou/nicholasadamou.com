"use client";

import React, { useState } from "react";
import type { Note, Project } from "@/lib/contentlayer-data";
import SearchBar from "@/app/notes/components/SearchBar";
import { useSearchAndPagination } from "@/hooks/useSearchAndPagination";
import { ListHeader } from "@/components/common/ListHeader";
import { ContentSection } from "@/components/common/ContentSection";
import { OpenSourceSection } from "@/components/common/OpenSourceSection";
import { DotBrainsSection } from "@/components/common/DotBrainsSection";

interface ListPageProps {
  content: Array<Note | Project>;
  type: "notes" | "projects";
}

const ListPage: React.FC<ListPageProps> = ({ content, type }) => {
  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    sortedContent,
    itemsPerPage,
  } = useSearchAndPagination({ content, type });

  const [repoSearchTerm, setRepoSearchTerm] = useState("");

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4">
      <ListHeader type={type} />

      <SearchBar
        className="animate-in"
        style={{ "--index": 2 } as React.CSSProperties}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        kind={type}
      />

      <ContentSection
        type={type}
        content={sortedContent}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      {type === "projects" && (
        <>
          <OpenSourceSection
            searchTerm={repoSearchTerm}
            setSearchTerm={setRepoSearchTerm}
            type={type}
          />
          <DotBrainsSection />
        </>
      )}
    </div>
  );
};

export default ListPage;
