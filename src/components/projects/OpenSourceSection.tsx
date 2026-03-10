"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Star,
  GitFork,
  ArrowUpRight,
  User,
  Building2,
  Filter,
  ChevronDown,
  X,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface Repo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
  owner: string;
  ownerType: "user" | "org";
}

const ITEMS_PER_PAGE = 6;

const ORGS = [
  "dotbrains",
  "transmute-games",
  "daily-coding-problem",
  "youbuildit",
  "privydns",
];

export default function OpenSourceSection() {
  const { shouldUseDarkText, getOpacityClass, getLinkColorClass } = useTheme();

  const [repos, setRepos] = useState<Repo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showOwnerDropdown, setShowOwnerDropdown] = useState(false);

  const dark = shouldUseDarkText();

  const inputBg = dark
    ? "bg-stone-950/5 placeholder:text-stone-950/30 focus:ring-stone-950/10"
    : "bg-white/5 placeholder:text-white/30 focus:ring-white/10";

  const cardBg = dark
    ? "bg-stone-950/[0.03] hover:bg-stone-950/[0.06]"
    : "bg-white/[0.03] hover:bg-white/[0.06]";

  const tagBg = dark
    ? "bg-stone-950/5 text-stone-950/50"
    : "bg-white/5 text-white/50";

  const skeletonBg = dark ? "bg-stone-950/10" : "bg-white/10";

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
  const funnelBg = dark ? "hover:bg-stone-950/5" : "hover:bg-white/5";
  const borderColor = dark ? "border-stone-950/10" : "border-white/10";

  const fetchRepos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/github/repos");
      if (!res.ok) throw new Error("Failed to fetch repositories");
      const data = await res.json();
      const sorted = (data.projects as Repo[]).sort((a, b) => {
        if (b.stars !== a.stars) return b.stars - a.stars;
        return b.forks - a.forks;
      });
      setRepos(sorted);
    } catch {
      setError("Error fetching repositories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedLanguages, selectedOwners]);

  const availableLanguages = useMemo(
    () =>
      [
        ...new Set(repos.map((r) => r.language).filter(Boolean) as string[]),
      ].sort(),
    [repos]
  );

  const availableOwners = useMemo(
    () => [...new Set(repos.map((r) => r.owner))].sort(),
    [repos]
  );

  const hasActiveFilters =
    selectedLanguages.length > 0 || selectedOwners.length > 0;

  const clearAllFilters = () => {
    setSelectedLanguages([]);
    setSelectedOwners([]);
  };

  const filtered = useMemo(() => {
    let list = repos;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.owner.toLowerCase().includes(q)
      );
    }
    if (selectedLanguages.length > 0) {
      list = list.filter(
        (r) => r.language && selectedLanguages.includes(r.language)
      );
    }
    if (selectedOwners.length > 0) {
      list = list.filter((r) => selectedOwners.includes(r.owner));
    }
    return list;
  }, [repos, search, selectedLanguages, selectedOwners]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentRepos = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-medium">Open Source</h2>
        <p className={`text-sm ${getOpacityClass()}`}>
          All of my projects can be found on my{" "}
          <a
            href="https://github.com/nicholasadamou"
            target="_blank"
            rel="noopener noreferrer"
            className={`underline transition-opacity hover:opacity-60 ${getLinkColorClass()}`}
          >
            GitHub
          </a>{" "}
          and across{" "}
          {ORGS.map((org, i) => (
            <span key={org}>
              <a
                href={`https://github.com/${org}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`underline transition-opacity hover:opacity-60 ${getLinkColorClass()}`}
              >
                {org}
              </a>
              {i < ORGS.length - 2 && ", "}
              {i === ORGS.length - 2 && ", and "}
            </span>
          ))}{" "}
          organization pages.
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search repositories..."
            className={`w-full rounded-lg border-none px-4 py-2.5 pr-12 text-sm outline-none transition-colors focus:ring-1 ${inputBg}`}
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-2 ${funnelBg}`}
            title="Toggle filters"
          >
            <Filter className={`h-4 w-4 ${labelText}`} />
          </button>
        </div>

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
              {/* Language filter */}
              <div className="relative">
                <label
                  className={`mb-2 block text-sm font-medium ${labelText}`}
                >
                  Language
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowLangDropdown(!showLangDropdown)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-left text-sm ${panelBg}`}
                  >
                    <span>
                      {selectedLanguages.length === 0
                        ? "Any language"
                        : `${selectedLanguages.length} selected`}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        showLangDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showLangDropdown && (
                    <div
                      className={`absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-md border shadow-lg ${dropdownBg}`}
                    >
                      <div className="p-1">
                        {availableLanguages.map((lang) => (
                          <button
                            key={lang}
                            onClick={() => {
                              if (!selectedLanguages.includes(lang)) {
                                setSelectedLanguages([
                                  ...selectedLanguages,
                                  lang,
                                ]);
                              }
                              setShowLangDropdown(false);
                            }}
                            disabled={selectedLanguages.includes(lang)}
                            className={`w-full cursor-pointer rounded px-3 py-2 text-left text-sm ${dropdownText} ${dropdownItemHover}`}
                          >
                            <span
                              className={
                                selectedLanguages.includes(lang)
                                  ? dropdownMuted
                                  : ""
                              }
                            >
                              {lang}
                              {selectedLanguages.includes(lang) && " ✓"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {selectedLanguages.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedLanguages.map((lang) => (
                      <span
                        key={lang}
                        className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs ${chipBg}`}
                      >
                        {lang}
                        <button
                          onClick={() =>
                            setSelectedLanguages(
                              selectedLanguages.filter((l) => l !== lang)
                            )
                          }
                          className={`cursor-pointer ${chipClose}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Owner filter */}
              <div className="relative">
                <label
                  className={`mb-2 block text-sm font-medium ${labelText}`}
                >
                  Owner
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowOwnerDropdown(!showOwnerDropdown)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-left text-sm ${panelBg}`}
                  >
                    <span>
                      {selectedOwners.length === 0
                        ? "Any owner"
                        : `${selectedOwners.length} selected`}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        showOwnerDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showOwnerDropdown && (
                    <div
                      className={`absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-md border shadow-lg ${dropdownBg}`}
                    >
                      <div className="p-1">
                        {availableOwners.map((owner) => (
                          <button
                            key={owner}
                            onClick={() => {
                              if (!selectedOwners.includes(owner)) {
                                setSelectedOwners([...selectedOwners, owner]);
                              }
                              setShowOwnerDropdown(false);
                            }}
                            disabled={selectedOwners.includes(owner)}
                            className={`w-full cursor-pointer rounded px-3 py-2 text-left text-sm ${dropdownText} ${dropdownItemHover}`}
                          >
                            <span
                              className={
                                selectedOwners.includes(owner)
                                  ? dropdownMuted
                                  : ""
                              }
                            >
                              {owner}
                              {selectedOwners.includes(owner) && " ✓"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {selectedOwners.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedOwners.map((owner) => (
                      <span
                        key={owner}
                        className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs ${chipBg}`}
                      >
                        {owner}
                        <button
                          onClick={() =>
                            setSelectedOwners(
                              selectedOwners.filter((o) => o !== owner)
                            )
                          }
                          className={`cursor-pointer ${chipClose}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {hasActiveFilters && (
              <div className={`border-t pt-2 ${borderColor}`}>
                <p className={`text-xs ${labelText}`}>
                  Showing repositories filtered by:{" "}
                  {[
                    selectedLanguages.length > 0 &&
                      `${selectedLanguages.length} ${selectedLanguages.length === 1 ? "language" : "languages"}`,
                    selectedOwners.length > 0 &&
                      `${selectedOwners.length} ${selectedOwners.length === 1 ? "owner" : "owners"}`,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <div key={i} className={`space-y-3 rounded-lg p-4 ${cardBg}`}>
              <div
                className={`h-5 w-3/4 animate-pulse rounded ${skeletonBg}`}
              />
              <div
                className={`h-4 w-full animate-pulse rounded ${skeletonBg}`}
              />
              <div
                className={`h-4 w-5/6 animate-pulse rounded ${skeletonBg}`}
              />
              <div className="flex gap-3 pt-1">
                <div
                  className={`h-4 w-10 animate-pulse rounded ${skeletonBg}`}
                />
                <div
                  className={`h-4 w-10 animate-pulse rounded ${skeletonBg}`}
                />
                <div
                  className={`h-5 w-14 animate-pulse rounded-full ${skeletonBg}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className={`text-sm ${getOpacityClass()}`}>{error}</p>}

      {!isLoading && !error && filtered.length === 0 && (
        <p className={`text-sm ${getOpacityClass()}`}>
          No repositories found matching the selected filters.
        </p>
      )}

      {!isLoading && !error && currentRepos.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {currentRepos.map((repo) => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group block space-y-2 rounded-lg p-4 transition-colors ${cardBg}`}
              >
                <div
                  className={`flex items-center gap-1 text-sm font-medium transition-opacity group-hover:opacity-60 ${getLinkColorClass()}`}
                >
                  {repo.name}
                  <ArrowUpRight className="h-3 w-3" />
                </div>
                {repo.description && (
                  <p
                    className={`line-clamp-2 text-sm leading-relaxed ${getOpacityClass()}`}
                  >
                    {repo.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div
                    className={`flex items-center gap-1 text-xs ${getOpacityClass()}`}
                  >
                    {repo.ownerType === "org" ? (
                      <Building2 className="h-3.5 w-3.5" />
                    ) : (
                      <User className="h-3.5 w-3.5" />
                    )}
                    {repo.owner}
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs ${getOpacityClass()}`}
                  >
                    <Star className="h-3.5 w-3.5" />
                    {repo.stars.toLocaleString()}
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs ${getOpacityClass()}`}
                  >
                    <GitFork className="h-3.5 w-3.5" />
                    {repo.forks.toLocaleString()}
                  </div>
                  {repo.language && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] ${tagBg}`}
                    >
                      {repo.language}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`cursor-pointer rounded-md px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                  dark ? "hover:bg-stone-950/5" : "hover:bg-white/5"
                }`}
              >
                Previous
              </button>
              <span className={`text-xs ${getOpacityClass()}`}>
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className={`cursor-pointer rounded-md px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                  dark ? "hover:bg-stone-950/5" : "hover:bg-white/5"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
