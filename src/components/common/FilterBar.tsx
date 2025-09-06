"use client";

import React from "react";
import { createPortal } from "react-dom";
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
} from "@/lib/animations";

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
  const [dropdownPositions, setDropdownPositions] = React.useState({
    tech: { top: 0, left: 0, width: 0 },
    status: { top: 0, left: 0, width: 0 },
    date: { top: 0, left: 0, width: 0 },
    demo: { top: 0, left: 0, width: 0 },
  });
  const dropdownRefs = {
    tech: React.useRef<HTMLDivElement>(null),
    status: React.useRef<HTMLDivElement>(null),
    date: React.useRef<HTMLDivElement>(null),
    demo: React.useRef<HTMLDivElement>(null),
  };
  const buttonRefs = {
    tech: React.useRef<HTMLButtonElement>(null),
    status: React.useRef<HTMLButtonElement>(null),
    date: React.useRef<HTMLButtonElement>(null),
    demo: React.useRef<HTMLButtonElement>(null),
  };

  // Create memoized callbacks to avoid dependencies
  const handleClickOutside = React.useCallback((event: MouseEvent) => {
    const target = event.target as Node;

    // Check tech dropdown
    if (
      dropdownRefs.tech.current &&
      !dropdownRefs.tech.current.contains(target) &&
      buttonRefs.tech.current &&
      !buttonRefs.tech.current.contains(target)
    ) {
      setShowTechDropdown(false);
    }

    // Check status dropdown
    if (
      dropdownRefs.status.current &&
      !dropdownRefs.status.current.contains(target) &&
      buttonRefs.status.current &&
      !buttonRefs.status.current.contains(target)
    ) {
      setShowStatusDropdown(false);
    }

    // Check date dropdown
    if (
      dropdownRefs.date.current &&
      !dropdownRefs.date.current.contains(target) &&
      buttonRefs.date.current &&
      !buttonRefs.date.current.contains(target)
    ) {
      setShowDateDropdown(false);
    }

    // Check demo dropdown
    if (
      dropdownRefs.demo.current &&
      !dropdownRefs.demo.current.contains(target) &&
      buttonRefs.demo.current &&
      !buttonRefs.demo.current.contains(target)
    ) {
      setShowDemoDropdown(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatePositions = React.useCallback(() => {
    setDropdownPositions((prevPositions) => {
      const newPositions = { ...prevPositions };

      if (buttonRefs.tech.current && showTechDropdown) {
        const rect = buttonRefs.tech.current.getBoundingClientRect();
        newPositions.tech = {
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
          width: rect.width,
        };
      }

      if (buttonRefs.status.current && showStatusDropdown) {
        const rect = buttonRefs.status.current.getBoundingClientRect();
        newPositions.status = {
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
          width: rect.width,
        };
      }

      if (buttonRefs.date.current && showDateDropdown) {
        const rect = buttonRefs.date.current.getBoundingClientRect();
        newPositions.date = {
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
          width: rect.width,
        };
      }

      if (buttonRefs.demo.current && showDemoDropdown) {
        const rect = buttonRefs.demo.current.getBoundingClientRect();
        newPositions.demo = {
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
          width: rect.width,
        };
      }

      return newPositions;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    showTechDropdown,
    showStatusDropdown,
    showDateDropdown,
    showDemoDropdown,
  ]);

  // Calculate dropdown positions and close on outside click
  React.useEffect(() => {
    const anyDropdownOpen =
      showTechDropdown ||
      showStatusDropdown ||
      showDateDropdown ||
      showDemoDropdown;

    if (anyDropdownOpen) {
      updatePositions();
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", updatePositions);
      window.addEventListener("resize", updatePositions);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", updatePositions);
      window.removeEventListener("resize", updatePositions);
    };
  }, [
    showTechDropdown,
    showStatusDropdown,
    showDateDropdown,
    showDemoDropdown,
    handleClickOutside,
    updatePositions,
  ]);

  const toggleTechDropdown = () => {
    if (!showTechDropdown && buttonRefs.tech.current) {
      const rect = buttonRefs.tech.current.getBoundingClientRect();
      setDropdownPositions((prev) => ({
        ...prev,
        tech: {
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
          width: rect.width,
        },
      }));
    }
    setShowTechDropdown(!showTechDropdown);
  };

  const toggleStatusDropdown = () => {
    if (!showStatusDropdown && buttonRefs.status.current) {
      const rect = buttonRefs.status.current.getBoundingClientRect();
      setDropdownPositions((prev) => ({
        ...prev,
        status: {
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
          width: rect.width,
        },
      }));
    }
    setShowStatusDropdown(!showStatusDropdown);
  };

  const toggleDateDropdown = () => {
    if (!showDateDropdown && buttonRefs.date.current) {
      const rect = buttonRefs.date.current.getBoundingClientRect();
      setDropdownPositions((prev) => ({
        ...prev,
        date: {
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
          width: rect.width,
        },
      }));
    }
    setShowDateDropdown(!showDateDropdown);
  };

  const toggleDemoDropdown = () => {
    if (!showDemoDropdown && buttonRefs.demo.current) {
      const rect = buttonRefs.demo.current.getBoundingClientRect();
      setDropdownPositions((prev) => ({
        ...prev,
        demo: {
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
          width: rect.width,
        },
      }));
    }
    setShowDemoDropdown(!showDemoDropdown);
  };

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

  // Portal dropdown components
  const TechDropdown = () => {
    if (typeof window === "undefined" || !showTechDropdown) return null;

    return createPortal(
      <div
        ref={dropdownRefs.tech}
        className="bg-primary border-secondary fixed z-50 max-h-60 overflow-auto rounded-md border shadow-lg backdrop-blur-sm"
        style={{
          top: dropdownPositions.tech.top,
          left: dropdownPositions.tech.left,
          width: dropdownPositions.tech.width,
        }}
      >
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
                  filters.technologies.includes(tech) ? "text-tertiary" : ""
                }
              >
                {tech}
                {filters.technologies.includes(tech) && " ✓"}
              </span>
            </button>
          ))}
        </div>
      </div>,
      document.body
    );
  };

  const StatusDropdown = () => {
    if (typeof window === "undefined" || !showStatusDropdown) return null;

    const statusOptions = [
      { value: "all", label: "All projects" },
      { value: "pinned", label: "📌 Pinned only" },
      { value: "unpinned", label: "Unpinned only" },
    ];

    return createPortal(
      <div
        ref={dropdownRefs.status}
        className="bg-primary border-secondary fixed z-50 rounded-md border shadow-lg backdrop-blur-sm"
        style={{
          top: dropdownPositions.status.top,
          left: dropdownPositions.status.left,
          width: dropdownPositions.status.width,
        }}
      >
        <div className="bg-primary p-1">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setFilters({
                  ...filters,
                  pinnedStatus: option.value as FilterOptions["pinnedStatus"],
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
      </div>,
      document.body
    );
  };

  const DateDropdown = () => {
    if (typeof window === "undefined" || !showDateDropdown) return null;

    const dateOptions = [
      { value: "all", label: "Any time" },
      { value: "thisYear", label: "This year" },
      { value: "lastYear", label: "Last year" },
      { value: "older", label: "Older" },
    ];

    return createPortal(
      <div
        ref={dropdownRefs.date}
        className="bg-primary border-secondary fixed z-50 rounded-md border shadow-lg backdrop-blur-sm"
        style={{
          top: dropdownPositions.date.top,
          left: dropdownPositions.date.left,
          width: dropdownPositions.date.width,
        }}
      >
        <div className="bg-primary p-1">
          {dateOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setFilters({
                  ...filters,
                  dateRange: option.value as FilterOptions["dateRange"],
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
      </div>,
      document.body
    );
  };

  const DemoDropdown = () => {
    if (typeof window === "undefined" || !showDemoDropdown) return null;

    const demoOptions = [
      { value: "all", label: "Any" },
      { value: "withDemo", label: "🔗 With demo" },
      { value: "withoutDemo", label: "Without demo" },
    ];

    return createPortal(
      <div
        ref={dropdownRefs.demo}
        className="bg-primary border-secondary fixed z-50 rounded-md border shadow-lg backdrop-blur-sm"
        style={{
          top: dropdownPositions.demo.top,
          left: dropdownPositions.demo.left,
          width: dropdownPositions.demo.width,
        }}
      >
        <div className="bg-primary p-1">
          {demoOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setFilters({
                  ...filters,
                  hasDemo: option.value as FilterOptions["hasDemo"],
                });
                setShowDemoDropdown(false);
              }}
              className={`hover:bg-secondary w-full cursor-pointer rounded px-3 py-2 text-left text-sm ${
                filters.hasDemo === option.value ? "text-link" : "text-primary"
              }`}
            >
              {option.label}
              {filters.hasDemo === option.value && " ✓"}
            </button>
          ))}
        </div>
      </div>,
      document.body
    );
  };

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
                    ref={buttonRefs.tech}
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
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.35 }}
              >
                <label className="text-secondary mb-2 block text-sm font-medium">
                  Status
                </label>
                <motion.button
                  ref={buttonRefs.status}
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
              </motion.div>

              {/* Date Range Filter */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
              >
                <label className="text-secondary mb-2 block text-sm font-medium">
                  Date
                </label>
                <motion.button
                  ref={buttonRefs.date}
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
              </motion.div>

              {/* Demo Availability Filter */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.45 }}
              >
                <label className="text-secondary mb-2 block text-sm font-medium">
                  Demo
                </label>
                <motion.button
                  ref={buttonRefs.demo}
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
      <TechDropdown />
      <StatusDropdown />
      <DateDropdown />
      <DemoDropdown />
    </div>
  );
}
