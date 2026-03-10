"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { projects } from "@/lib/projects/config";
import { ProjectIcon } from "@/lib/projects/icons";
import FilterBar, { type FilterOptions } from "@/components/projects/FilterBar";
import OpenSourceSection from "@/components/projects/OpenSourceSection";

export default function ProjectList() {
  const {
    getTextColorClass,
    getLinkColorClass,
    getOpacityClass,
    shouldUseDarkText,
    isHydrated,
  } = useTheme();

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    tags: [],
    featuredStatus: "all",
  });

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    projects.forEach((p) => p.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, []);

  const featuredProjects = useMemo(
    () => projects.filter((p) => p.featured),
    []
  );

  const isFiltering =
    search.trim() ||
    filters.tags.length > 0 ||
    filters.featuredStatus !== "all";

  const filtered = useMemo(() => {
    let list = isFiltering ? projects : projects.filter((p) => !p.featured);

    // Tag filter
    if (filters.tags.length > 0) {
      list = list.filter((p) => p.tags?.some((t) => filters.tags.includes(t)));
    }

    // Featured status filter
    if (filters.featuredStatus === "featured") {
      list = list.filter((p) => p.featured);
    } else if (filters.featuredStatus === "notFeatured") {
      list = list.filter((p) => !p.featured);
    }

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    return list;
  }, [search, filters, isFiltering]);

  if (!isHydrated) {
    return <main className="min-h-screen" />;
  }

  const tagBg = shouldUseDarkText()
    ? "bg-stone-950/5 text-stone-950/50"
    : "bg-white/5 text-white/50";

  return (
    <main
      className={`min-h-screen font-sans transition-colors duration-200 ${getTextColorClass()}`}
    >
      <div className="mx-auto max-w-[45rem] px-5 pb-32 pt-24 sm:pb-48 sm:pt-32">
        <div className="animate-fadeInHome1 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-medium sm:text-4xl">Projects</h1>
            <p className={`text-sm ${getOpacityClass()}`}>
              {projects.length} open-source projects and tools.
            </p>
          </div>

          {/* Featured projects */}
          {!isFiltering && featuredProjects.length > 0 && (
            <div className="space-y-4">
              <h2
                className={`text-xs font-medium uppercase tracking-wider ${getOpacityClass()}`}
              >
                Featured
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {featuredProjects.map((project) => (
                  <Link
                    key={project.name}
                    href={project.href}
                    target="_blank"
                    className={`group block space-y-2 rounded-lg p-4 transition-colors ${
                      shouldUseDarkText()
                        ? "bg-stone-950/[0.03] hover:bg-stone-950/[0.06]"
                        : "bg-white/[0.03] hover:bg-white/[0.06]"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 text-sm font-medium !leading-snug transition-opacity group-hover:opacity-60 ${getLinkColorClass()}`}
                    >
                      <ProjectIcon icon={project.icon} name={project.name} />
                      {project.name}
                    </div>
                    <p
                      className={`line-clamp-2 text-sm leading-relaxed ${getOpacityClass()}`}
                    >
                      {project.description}
                    </p>
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`rounded-full px-2 py-0.5 text-[11px] ${tagBg}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <FilterBar
            searchTerm={search}
            setSearchTerm={setSearch}
            filters={filters}
            setFilters={setFilters}
            availableTags={availableTags}
          />

          <div className="animate-fadeInHome2 space-y-6">
            {filtered.map((project) => (
              <Link
                key={project.name}
                href={project.href}
                target="_blank"
                className="group block space-y-1"
              >
                <div
                  className={`flex items-center gap-1.5 text-sm font-medium !leading-snug transition-opacity group-hover:opacity-60 ${getLinkColorClass()}`}
                >
                  <ProjectIcon icon={project.icon} name={project.name} />
                  {project.name}
                </div>
                <p className={`text-sm leading-relaxed ${getOpacityClass()}`}>
                  {project.description}
                </p>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-full px-2 py-0.5 text-[11px] ${tagBg}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}

            {filtered.length === 0 && isFiltering && (
              <p className={`text-sm ${getOpacityClass()}`}>
                No projects found
                {search.trim() ? (
                  <> for &ldquo;{search}&rdquo;</>
                ) : (
                  <> matching the selected filters</>
                )}
                .
              </p>
            )}
          </div>

          <OpenSourceSection />
        </div>
      </div>
    </main>
  );
}
