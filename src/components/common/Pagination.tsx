"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => (
  <nav
    className="mt-8 flex items-center justify-center"
    aria-label="Pagination"
  >
    <div className="flex items-center space-x-2">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        className="light:bg-black light:text-white p-4 disabled:cursor-not-allowed dark:bg-white dark:text-black"
      >
        Previous
      </Button>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        className="light:bg-black light:text-white p-4 dark:bg-white dark:text-black"
      >
        Next
      </Button>
    </div>
  </nav>
);

export default Pagination;
