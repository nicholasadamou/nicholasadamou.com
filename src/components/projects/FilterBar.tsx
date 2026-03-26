"use client";

import React from "react";
import { ChevronDown, X } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import SearchBar from "@/components/ui/SearchBar";

export interface FilterOptions {
  tags: string[];
  featuredStatus: "all" | "featured" | "notFeatured";
}

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  availableTags: string[];
}

export default function FilterBar({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  availableTags,
}: FilterBarProps) {
  const { shouldUseDarkText } = useTheme();

  const [showFilters, setShowFilters] = React.useState(false);
  const [showTagDropdown, setShowTagDropdown] = React.useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = React.useState(false);

  const dark = shouldUseDarkText();

  const panelBg = dark
    ? "bg-stone-950/[0.03] border-stone-950/10"
    : "bg-white/[0.03] border-white/10";

  const dropdownBg = dark
    ? "bg-white border-stone-200"
    : "bg-stone-900 border-stone-700";

  const dropdownItemHover = dark ? "hover:bg-stone-100" : "hover:bg-stone-800";

  const dropdownText = dark ? "text-stone-900" : "text-white";

  const dropdownMuted = dark ? "text-stone-400" : "text-stone-500";

  const labelText = dark ? "text-stone-950/50" : "text-white/50";

  const chipBg = dark
    ? "bg-stone-950/10 text-stone-950/70"
    : "bg-white/10 text-white/70";

  const chipClose = dark ? "hover:text-stone-950" : "hover:text-white";

  const linkText = dark ? "text-stone-950/70" : "text-white/70";

  const borderColor = dark ? "border-stone-950/10" : "border-white/10";

  const addTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      setFilters({ ...filters, tags: [...filters.tags, tag] });
    }
    setShowTagDropdown(false);
  };

  const removeTag = (tag: string) => {
    setFilters({
      ...filters,
      tags: filters.tags.filter((t) => t !== tag),
    });
  };

  const clearAllFilters = () => {
    setFilters({ tags: [], featuredStatus: "all" });
  };

  const hasActiveFilters =
    filters.tags.length > 0 || filters.featuredStatus !== "all";

  return (
    <div className="w-full space-y-4">
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search projects..."
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {/* Filter Panel */}
      {showFilters && (
        <div className={`space-y-4 rounded-lg border p-4 ${panelBg}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className={`cursor-pointer text-sm ${linkText}`}
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Tags Filter */}
            <div className="relative">
              <label className={`mb-2 block text-sm font-medium ${labelText}`}>
                Tags
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowTagDropdown(!showTagDropdown)}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-left text-sm ${panelBg}`}
                >
                  <span>
                    {filters.tags.length === 0
                      ? "Any tag"
                      : `${filters.tags.length} selected`}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      showTagDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown */}
                {showTagDropdown && (
                  <div
                    className={`absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border shadow-lg ${dropdownBg}`}
                  >
                    <div className="p-1">
                      {availableTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => addTag(tag)}
                          className={`w-full cursor-pointer rounded px-3 py-2 text-left text-sm ${dropdownText} ${dropdownItemHover}`}
                          disabled={filters.tags.includes(tag)}
                        >
                          <span
                            className={
                              filters.tags.includes(tag) ? dropdownMuted : ""
                            }
                          >
                            {tag}
                            {filters.tags.includes(tag) && " ✓"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Tags */}
              {filters.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {filters.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs ${chipBg}`}
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className={`cursor-pointer ${chipClose}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Featured Status Filter */}
            <div className="relative">
              <label className={`mb-2 block text-sm font-medium ${labelText}`}>
                Status
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-left text-sm ${panelBg}`}
                >
                  <span>
                    {filters.featuredStatus === "all" && "All projects"}
                    {filters.featuredStatus === "featured" &&
                      "⭐ Featured only"}
                    {filters.featuredStatus === "notFeatured" &&
                      "Not featured only"}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      showStatusDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown */}
                {showStatusDropdown && (
                  <div
                    className={`absolute top-full right-0 left-0 z-50 mt-1 rounded-md border shadow-lg ${dropdownBg}`}
                  >
                    <div className="p-1">
                      {[
                        { value: "all", label: "All projects" },
                        { value: "featured", label: "⭐ Featured only" },
                        {
                          value: "notFeatured",
                          label: "Not featured only",
                        },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setFilters({
                              ...filters,
                              featuredStatus:
                                option.value as FilterOptions["featuredStatus"],
                            });
                            setShowStatusDropdown(false);
                          }}
                          className={`w-full cursor-pointer rounded px-3 py-2 text-left text-sm ${dropdownItemHover} ${
                            filters.featuredStatus === option.value
                              ? linkText
                              : dropdownText
                          }`}
                        >
                          {option.label}
                          {filters.featuredStatus === option.value && " ✓"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className={`border-t pt-2 ${borderColor}`}>
              <p className={`text-xs ${labelText}`}>
                Showing projects filtered by:{" "}
                {[
                  filters.tags.length > 0 &&
                    `${filters.tags.length} ${filters.tags.length === 1 ? "tag" : "tags"}`,
                  filters.featuredStatus !== "all" &&
                    (filters.featuredStatus === "featured"
                      ? "featured status"
                      : "not featured status"),
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
