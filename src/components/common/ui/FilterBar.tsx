"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDownIcon,
  XMarkIcon,
  FunnelIcon,
} from "@heroicons/react/20/solid";
import {
  filterVariants,
  buttonVariants,
  fadeVariants,
  itemVariants,
  DURATION,
  EASING,
  getStaggerDelay,
} from "@/lib/animation/variants";

export interface FilterOptions {
  technologies: string[];
  pinnedStatus: "all" | "pinned" | "unpinned";
  dateRange: "all" | "thisYear" | "lastYear" | "older";
  hasDemo: "all" | "withDemo" | "withoutDemo";
}

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  availableTechnologies: string[];
  kind: string;
}

export default function FilterBar({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  availableTechnologies,
  kind,
}: FilterBarProps) {
  const [showFilters, setShowFilters] = React.useState(false);
  const [showTechDropdown, setShowTechDropdown] = React.useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = React.useState(false);
  const [showDateDropdown, setShowDateDropdown] = React.useState(false);
  const [showDemoDropdown, setShowDemoDropdown] = React.useState(false);

  const toggleTechDropdown = () => setShowTechDropdown(!showTechDropdown);
  const toggleStatusDropdown = () => setShowStatusDropdown(!showStatusDropdown);
  const toggleDateDropdown = () => setShowDateDropdown(!showDateDropdown);
  const toggleDemoDropdown = () => setShowDemoDropdown(!showDemoDropdown);

  const addTechnology = (tech: string) => {
    if (!filters.technologies.includes(tech)) {
      setFilters({
        ...filters,
        technologies: [...filters.technologies, tech],
      });
    }
    setShowTechDropdown(false);
  };

  const removeTechnology = (tech: string) => {
    setFilters({
      ...filters,
      technologies: filters.technologies.filter((t) => t !== tech),
    });
  };

  const clearAllFilters = () => {
    setFilters({
      technologies: [],
      pinnedStatus: "all",
      dateRange: "all",
      hasDemo: "all",
    });
  };

  const hasActiveFilters =
    filters.technologies.length > 0 ||
    filters.pinnedStatus !== "all" ||
    filters.dateRange !== "all" ||
    filters.hasDemo !== "all";

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${kind}...`}
          className="border-secondary text-primary bg-primary w-full rounded-md border px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="hover:bg-secondary absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-2"
          title="Toggle filters"
        >
          <FunnelIcon className="text-tertiary h-4 w-4" />
        </button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="bg-secondary border-secondary space-y-4 rounded-lg border p-4"
            variants={filterVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            layout
          >
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1,
                duration: DURATION.normal,
                ease: EASING.easeOut,
              }}
            >
              <h3 className="text-primary font-medium">Filters</h3>
              {hasActiveFilters && (
                <motion.button
                  onClick={clearAllFilters}
                  className="text-link hover:text-primary cursor-pointer text-sm"
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  Clear all
                </motion.button>
              )}
            </motion.div>

            <motion.div
              className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.2,
                duration: DURATION.normal,
                ease: EASING.easeOut,
              }}
            >
              {/* Technologies Filter */}
              <motion.div
                className="relative"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
              >
                <label className="text-secondary mb-2 block text-sm font-medium">
                  Technologies
                </label>
                <div className="relative">
                  <motion.button
                    onClick={toggleTechDropdown}
                    className="border-secondary bg-primary text-primary hover:bg-secondary flex w-full cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-left text-sm"
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <span>
                      {filters.technologies.length === 0
                        ? "Any technology"
                        : `${filters.technologies.length} selected`}
                    </span>
                    <motion.div
                      animate={{ rotate: showTechDropdown ? 180 : 0 }}
                      transition={{
                        duration: DURATION.fast,
                        ease: EASING.easeOut,
                      }}
                    >
                      <ChevronDownIcon className="h-4 w-4" />
                    </motion.div>
                  </motion.button>

                  {/* Dropdown */}
                  {showTechDropdown && (
                    <div className="bg-primary border-secondary absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-md border shadow-lg">
                      <div className="bg-primary p-1">
                        {availableTechnologies.map((tech) => (
                          <button
                            key={tech}
                            onClick={() => addTechnology(tech)}
                            className="hover:bg-secondary text-primary w-full cursor-pointer rounded px-3 py-2 text-left text-sm"
                            disabled={filters.technologies.includes(tech)}
                          >
                            <span
                              className={
                                filters.technologies.includes(tech)
                                  ? "text-tertiary"
                                  : ""
                              }
                            >
                              {tech}
                              {filters.technologies.includes(tech) && " ✓"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Technologies Tags */}
                <AnimatePresence>
                  {filters.technologies.length > 0 && (
                    <motion.div
                      className="mt-2 flex flex-wrap gap-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{
                        duration: DURATION.normal,
                        ease: EASING.easeOut,
                      }}
                    >
                      {filters.technologies.map((tech, index) => (
                        <motion.span
                          key={tech}
                          className="bg-tertiary text-primary flex items-center gap-1 rounded-md px-2 py-1 text-xs"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{
                            delay: getStaggerDelay(index, 0.05),
                            duration: DURATION.normal,
                            ease: EASING.bouncy,
                          }}
                          layout
                        >
                          {tech}
                          <motion.button
                            onClick={() => removeTechnology(tech)}
                            className="hover:text-secondary cursor-pointer"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </motion.button>
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Pinned Status Filter */}
              <motion.div
                className="relative"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.35 }}
              >
                <label className="text-secondary mb-2 block text-sm font-medium">
                  Status
                </label>
                <div className="relative">
                  <motion.button
                    onClick={toggleStatusDropdown}
                    className="border-secondary bg-primary text-primary hover:bg-secondary flex w-full cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-left text-sm"
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <span>
                      {filters.pinnedStatus === "all" && "All projects"}
                      {filters.pinnedStatus === "pinned" && "📌 Pinned only"}
                      {filters.pinnedStatus === "unpinned" && "Unpinned only"}
                    </span>
                    <motion.div
                      animate={{ rotate: showStatusDropdown ? 180 : 0 }}
                      transition={{
                        duration: DURATION.fast,
                        ease: EASING.easeOut,
                      }}
                    >
                      <ChevronDownIcon className="h-4 w-4" />
                    </motion.div>
                  </motion.button>

                  {/* Dropdown */}
                  {showStatusDropdown && (
                    <div className="bg-primary border-secondary absolute left-0 right-0 top-full z-50 mt-1 rounded-md border shadow-lg">
                      <div className="bg-primary p-1">
                        {[
                          { value: "all", label: "All projects" },
                          { value: "pinned", label: "📌 Pinned only" },
                          { value: "unpinned", label: "Unpinned only" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setFilters({
                                ...filters,
                                pinnedStatus:
                                  option.value as FilterOptions["pinnedStatus"],
                              });
                              setShowStatusDropdown(false);
                            }}
                            className={`hover:bg-secondary w-full cursor-pointer rounded px-3 py-2 text-left text-sm ${
                              filters.pinnedStatus === option.value
                                ? "text-link"
                                : "text-primary"
                            }`}
                          >
                            {option.label}
                            {filters.pinnedStatus === option.value && " ✓"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Date Range Filter */}
              <motion.div
                className="relative"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
              >
                <label className="text-secondary mb-2 block text-sm font-medium">
                  Date
                </label>
                <div className="relative">
                  <motion.button
                    onClick={toggleDateDropdown}
                    className="border-secondary bg-primary text-primary hover:bg-secondary flex w-full cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-left text-sm"
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <span>
                      {filters.dateRange === "all" && "Any time"}
                      {filters.dateRange === "thisYear" && "This year"}
                      {filters.dateRange === "lastYear" && "Last year"}
                      {filters.dateRange === "older" && "Older"}
                    </span>
                    <motion.div
                      animate={{ rotate: showDateDropdown ? 180 : 0 }}
                      transition={{
                        duration: DURATION.fast,
                        ease: EASING.easeOut,
                      }}
                    >
                      <ChevronDownIcon className="h-4 w-4" />
                    </motion.div>
                  </motion.button>

                  {/* Dropdown */}
                  {showDateDropdown && (
                    <div className="bg-primary border-secondary absolute left-0 right-0 top-full z-50 mt-1 rounded-md border shadow-lg">
                      <div className="bg-primary p-1">
                        {[
                          { value: "all", label: "Any time" },
                          { value: "thisYear", label: "This year" },
                          { value: "lastYear", label: "Last year" },
                          { value: "older", label: "Older" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setFilters({
                                ...filters,
                                dateRange:
                                  option.value as FilterOptions["dateRange"],
                              });
                              setShowDateDropdown(false);
                            }}
                            className={`hover:bg-secondary w-full cursor-pointer rounded px-3 py-2 text-left text-sm ${
                              filters.dateRange === option.value
                                ? "text-link"
                                : "text-primary"
                            }`}
                          >
                            {option.label}
                            {filters.dateRange === option.value && " ✓"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Demo Availability Filter */}
              <motion.div
                className="relative"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.45 }}
              >
                <label className="text-secondary mb-2 block text-sm font-medium">
                  Demo
                </label>
                <div className="relative">
                  <motion.button
                    onClick={toggleDemoDropdown}
                    className="border-secondary bg-primary text-primary hover:bg-secondary flex w-full cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-left text-sm"
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <span>
                      {filters.hasDemo === "all" && "Any"}
                      {filters.hasDemo === "withDemo" && "🔗 With demo"}
                      {filters.hasDemo === "withoutDemo" && "Without demo"}
                    </span>
                    <motion.div
                      animate={{ rotate: showDemoDropdown ? 180 : 0 }}
                      transition={{
                        duration: DURATION.fast,
                        ease: EASING.easeOut,
                      }}
                    >
                      <ChevronDownIcon className="h-4 w-4" />
                    </motion.div>
                  </motion.button>

                  {/* Dropdown */}
                  {showDemoDropdown && (
                    <div className="bg-primary border-secondary absolute left-0 right-0 top-full z-50 mt-1 rounded-md border shadow-lg">
                      <div className="bg-primary p-1">
                        {[
                          { value: "all", label: "Any" },
                          { value: "withDemo", label: "🔗 With demo" },
                          { value: "withoutDemo", label: "Without demo" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setFilters({
                                ...filters,
                                hasDemo:
                                  option.value as FilterOptions["hasDemo"],
                              });
                              setShowDemoDropdown(false);
                            }}
                            className={`hover:bg-secondary w-full cursor-pointer rounded px-3 py-2 text-left text-sm ${
                              filters.hasDemo === option.value
                                ? "text-link"
                                : "text-primary"
                            }`}
                          >
                            {option.label}
                            {filters.hasDemo === option.value && " ✓"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
            {/* Active Filters Summary */}
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.div
                  className="border-secondary border-t pt-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{
                    delay: 0.5,
                    duration: DURATION.normal,
                    ease: EASING.easeOut,
                  }}
                >
                  <motion.p
                    className="text-tertiary text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: 0.6,
                      duration: DURATION.normal,
                      ease: EASING.easeOut,
                    }}
                  >
                    Showing projects filtered by:{" "}
                    {[
                      filters.technologies.length > 0 &&
                        `${filters.technologies.length} ${filters.technologies.length === 1 ? "technology" : "technologies"}`,
                      filters.pinnedStatus !== "all" &&
                        (filters.pinnedStatus === "pinned"
                          ? "pinned status"
                          : "unpinned status"),
                      filters.dateRange !== "all" &&
                        (filters.dateRange === "thisYear"
                          ? "this year"
                          : filters.dateRange === "lastYear"
                            ? "last year"
                            : filters.dateRange === "older"
                              ? "older projects"
                              : filters.dateRange),
                      filters.hasDemo !== "all" &&
                        (filters.hasDemo === "withDemo"
                          ? "with demo"
                          : "without demo"),
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
