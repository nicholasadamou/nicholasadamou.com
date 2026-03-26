"use client";

import { useTheme } from "@/components/ThemeProvider";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const { shouldUseDarkText, getOpacityClass } = useTheme();

  if (totalPages <= 1) return null;

  const btnClass = `cursor-pointer rounded-md px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
    shouldUseDarkText() ? "hover:bg-stone-950/5" : "hover:bg-white/5"
  }`;

  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={btnClass}
      >
        Previous
      </button>
      <span className={`text-xs ${getOpacityClass()}`}>
        {currentPage} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={btnClass}
      >
        Next
      </button>
    </div>
  );
}
