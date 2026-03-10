"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  FileText,
  FolderGit2,
  X,
  Home,
  Briefcase,
  Camera,
  User,
  MessageSquare,
  Shield,
  Sun,
  Moon,
  ExternalLink,
  Linkedin,
  Github,
  Building2,
  Mail,
  Star,
  GitFork,
  Image,
  Columns2,
  Rows3,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useHomeLayout, useIsDesktop } from "@/hooks/use-home-layout";

interface SearchResult {
  type: "note" | "project";
  slug: string;
  title: string;
  summary: string;
  href: string;
  tags?: string[];
}

interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
  owner: string;
  ownerType: "user" | "org";
}

interface Action {
  id: string;
  type: "navigation" | "theme" | "social" | "company";
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filteredActions, setFilteredActions] = useState<Action[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [allRepos, setAllRepos] = useState<GitHubRepo[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepo[]>([]);
  const reposFetchedRef = useRef(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { shouldUseDarkText, updateTheme } = useTheme();
  const { layout, toggleLayout } = useHomeLayout();
  const isDesktop = useIsDesktop();

  const light = shouldUseDarkText();

  // Define available actions
  const actions: Action[] = useMemo(
    () => [
      {
        id: "nav-home",
        type: "navigation",
        title: "Home",
        subtitle: "Go to homepage",
        icon: <Home className="h-5 w-5" />,
        action: () => {
          router.push("/");
          onClose();
        },
        keywords: ["home", "homepage", "main"],
      },
      {
        id: "nav-notes",
        type: "navigation",
        title: "Notes",
        subtitle: "Read blog posts",
        icon: <FileText className="h-5 w-5" />,
        action: () => {
          router.push("/notes");
          onClose();
        },
        keywords: ["notes", "blog", "posts", "articles"],
      },
      {
        id: "nav-projects",
        type: "navigation",
        title: "Projects",
        subtitle: "Browse projects",
        icon: <Briefcase className="h-5 w-5" />,
        action: () => {
          router.push("/projects");
          onClose();
        },
        keywords: ["projects", "work", "portfolio"],
      },
      {
        id: "nav-gallery",
        type: "navigation",
        title: "Gallery",
        subtitle: "View photography",
        icon: <Camera className="h-5 w-5" />,
        action: () => {
          router.push("/gallery");
          onClose();
        },
        keywords: ["gallery", "photos", "photography", "vsco", "images"],
      },
      {
        id: "nav-about",
        type: "navigation",
        title: "About",
        subtitle: "Learn more about me",
        icon: <User className="h-5 w-5" />,
        action: () => {
          router.push("/about");
          onClose();
        },
        keywords: ["about", "bio", "me", "story", "work", "experience"],
      },
      {
        id: "nav-contact",
        type: "navigation",
        title: "Contact",
        subtitle: "Get in touch",
        icon: <MessageSquare className="h-5 w-5" />,
        action: () => {
          router.push("/contact");
          onClose();
        },
        keywords: ["contact", "email", "message", "talk"],
      },
      {
        id: "nav-privacy",
        type: "navigation",
        title: "Privacy Policy",
        subtitle: "View privacy policy",
        icon: <Shield className="h-5 w-5" />,
        action: () => {
          router.push("/privacy");
          onClose();
        },
        keywords: ["privacy", "policy", "data"],
      },
      // Dev tools (only in development)
      ...(process.env.NODE_ENV === "development"
        ? [
            {
              id: "nav-og-preview",
              type: "navigation" as const,
              title: "OG Preview",
              subtitle: "Preview Open Graph images",
              // eslint-disable-next-line jsx-a11y/alt-text
              icon: <Image className="h-5 w-5" aria-hidden={true} />,
              action: () => {
                router.push("/og-preview");
                onClose();
              },
              keywords: [
                "og",
                "open graph",
                "preview",
                "social",
                "image",
                "dev",
              ],
            },
          ]
        : []),
      // Layout toggle (desktop only)
      ...(isDesktop
        ? [
            {
              id: "layout-toggle",
              type: "theme" as const,
              title:
                layout === "single"
                  ? "Two-Column Layout"
                  : "Single-Column Layout",
              subtitle:
                layout === "single"
                  ? "Switch homepage to side-by-side layout"
                  : "Switch homepage to stacked layout",
              icon:
                layout === "single" ? (
                  <Columns2 className="h-5 w-5" />
                ) : (
                  <Rows3 className="h-5 w-5" />
                ),
              action: () => {
                toggleLayout();
                onClose();
              },
              keywords: [
                "layout",
                "column",
                "single",
                "two",
                "stacked",
                "side by side",
              ],
            },
          ]
        : []),
      {
        id: "theme-light",
        type: "theme",
        title: "Light Theme",
        subtitle: "Switch to light mode",
        icon: <Sun className="h-5 w-5" />,
        action: () => {
          updateTheme({ mode: "light", color: "#fafaf9" });
          onClose();
        },
        keywords: ["light", "theme", "bright"],
      },
      {
        id: "theme-dark",
        type: "theme",
        title: "Dark Theme",
        subtitle: "Switch to dark mode",
        icon: <Moon className="h-5 w-5" />,
        action: () => {
          updateTheme({ mode: "dark", color: "#0c0a09" });
          onClose();
        },
        keywords: ["dark", "theme", "night"],
      },
      // Social Links
      {
        id: "social-github",
        type: "social",
        title: "GitHub",
        subtitle: "View code on GitHub",
        icon: <Github className="h-5 w-5" />,
        action: () => {
          window.open("https://github.com/nicholasadamou", "_blank");
          onClose();
        },
        keywords: ["github", "code", "repositories", "open source"],
      },
      {
        id: "social-linkedin",
        type: "social",
        title: "LinkedIn",
        subtitle: "Connect on LinkedIn",
        icon: <Linkedin className="h-5 w-5" />,
        action: () => {
          window.open("https://linkedin.com/in/nicholas-adamou", "_blank");
          onClose();
        },
        keywords: ["linkedin", "professional", "network"],
      },
      {
        id: "social-email",
        type: "social",
        title: "Email",
        subtitle: "Send an email",
        icon: <Mail className="h-5 w-5" />,
        action: () => {
          window.open("mailto:nicholasadamou@outlook.com", "_blank");
          onClose();
        },
        keywords: ["email", "mail", "contact"],
      },
      {
        id: "social-resume",
        type: "social",
        title: "Resume",
        subtitle: "View my resume",
        icon: <ExternalLink className="h-5 w-5" />,
        action: () => {
          window.open("https://nicholas-adamou-cv.vercel.app", "_blank");
          onClose();
        },
        keywords: ["resume", "cv", "experience"],
      },
      // Company Links
      {
        id: "company-dotbrains",
        type: "company",
        title: "DotBrains",
        subtitle: "Visit dotbrains.dev",
        icon: <Building2 className="h-5 w-5" />,
        action: () => {
          window.open("https://dotbrains.dev", "_blank");
          onClose();
        },
        keywords: ["dotbrains", "company"],
      },
      {
        id: "company-youbuildit",
        type: "company",
        title: "You Build It",
        subtitle: "Visit youbuildit.dev",
        icon: <Building2 className="h-5 w-5" />,
        action: () => {
          window.open("https://youbuildit.dev", "_blank");
          onClose();
        },
        keywords: ["you build it", "youbuildit"],
      },
    ],
    [router, onClose, updateTheme, layout, toggleLayout, isDesktop]
  );

  // Fetch GitHub repos once when palette opens
  useEffect(() => {
    if (isOpen && !reposFetchedRef.current) {
      reposFetchedRef.current = true;
      fetch("/api/github/repos")
        .then((res) => res.json())
        .then((data) => {
          const sorted = ((data.projects as GitHubRepo[]) || []).sort(
            (a, b) => b.stars - a.stars || b.forks - a.forks
          );
          setAllRepos(sorted);
        })
        .catch(() => setAllRepos([]));
    }
  }, [isOpen]);

  // Filter actions and repos based on query
  const filterActions = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setFilteredActions(actions);
        setFilteredRepos([]);
        return;
      }

      const lowerQuery = searchQuery.toLowerCase();
      const filtered = actions.filter((action) => {
        const matchesTitle = action.title.toLowerCase().includes(lowerQuery);
        const matchesSubtitle = action.subtitle
          ?.toLowerCase()
          .includes(lowerQuery);
        const matchesKeywords = action.keywords?.some((keyword) =>
          keyword.toLowerCase().includes(lowerQuery)
        );
        return matchesTitle || matchesSubtitle || matchesKeywords;
      });
      setFilteredActions(filtered);

      const matchedRepos = allRepos
        .filter(
          (r) =>
            r.name.toLowerCase().includes(lowerQuery) ||
            r.description?.toLowerCase().includes(lowerQuery) ||
            r.owner.toLowerCase().includes(lowerQuery) ||
            r.language?.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 5);
      setFilteredRepos(matchedRepos);
    },
    [actions, allRepos]
  );

  // Search function using API
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        filterActions("");
        return;
      }

      filterActions(searchQuery);

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}`
        );
        const data = await response.json();
        setResults(data.results || []);
        setSelectedIndex(0);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [filterActions]
  );

  const handleResultClick = useCallback(
    (href: string) => {
      // External links (projects) open in new tab
      if (href.startsWith("http")) {
        window.open(href, "_blank");
      } else {
        router.push(href);
      }
      onClose();
    },
    [router, onClose]
  );

  // Handle search input change with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  // Focus input when opened and prevent body scroll
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setFilteredActions(actions);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, actions]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      const totalItems =
        filteredActions.length + results.length + filteredRepos.length;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : prev));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex < filteredActions.length) {
            filteredActions[selectedIndex].action();
          } else if (selectedIndex < filteredActions.length + results.length) {
            const resultIndex = selectedIndex - filteredActions.length;
            if (results[resultIndex]) {
              handleResultClick(results[resultIndex].href);
            }
          } else {
            const repoIndex =
              selectedIndex - filteredActions.length - results.length;
            if (filteredRepos[repoIndex]) {
              handleResultClick(filteredRepos[repoIndex].url);
            }
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isOpen,
    results,
    filteredActions,
    filteredRepos,
    selectedIndex,
    router,
    onClose,
    handleResultClick,
  ]);

  // Theme-aware styles
  const backdropBg = "bg-black/50 backdrop-blur-sm";
  const panelBg = light ? "bg-white" : "bg-stone-900";
  const panelBorder = light ? "border-stone-200" : "border-white/10";
  const inputText = light
    ? "text-stone-900 placeholder:text-stone-400"
    : "text-white placeholder:text-white/30";
  const iconMuted = light ? "text-stone-400" : "text-white/30";
  const textPrimary = light ? "text-stone-900" : "text-white";
  const textMuted = light ? "text-stone-500" : "text-white/50";
  const selectedBg = light ? "bg-stone-100" : "bg-white/10";
  const hoverBg = light ? "hover:bg-stone-50" : "hover:bg-white/5";
  const kbdBg = light
    ? "bg-stone-100 text-stone-500"
    : "bg-white/10 text-white/50";
  const footerBg = light ? "bg-stone-50" : "bg-stone-800";
  const tagBg = light
    ? "bg-stone-100 text-stone-500"
    : "bg-white/10 text-white/50";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 ${backdropBg}`}
            onClick={onClose}
          />

          {/* Command Palette */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className={`mx-4 w-full max-w-2xl overflow-hidden rounded-xl border shadow-2xl ${panelBg} ${panelBorder}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div
                className={`flex items-center gap-3 border-b px-4 py-3 ${panelBorder}`}
              >
                <Search className={`h-5 w-5 ${iconMuted}`} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search or run a command..."
                  className={`flex-1 bg-transparent text-base outline-none ${inputText}`}
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className={`transition-colors ${iconMuted}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <kbd
                  className={`hidden rounded px-2 py-1 text-xs font-semibold sm:inline-block ${kbdBg}`}
                >
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {isLoading && (
                  <div className={`px-4 py-8 text-center text-sm ${textMuted}`}>
                    Searching...
                  </div>
                )}

                {!isLoading &&
                  query &&
                  filteredActions.length === 0 &&
                  results.length === 0 &&
                  filteredRepos.length === 0 && (
                    <div
                      className={`px-4 py-8 text-center text-sm ${textMuted}`}
                    >
                      No results found for &quot;{query}&quot;
                    </div>
                  )}

                {!isLoading && (
                  <div className="py-2">
                    {/* Actions */}
                    {filteredActions.length > 0 && (
                      <>
                        {query && (
                          <div
                            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${textMuted}`}
                          >
                            Actions
                          </div>
                        )}
                        {filteredActions.map((action, index) => (
                          <button
                            key={action.id}
                            onClick={() => action.action()}
                            className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors ${
                              index === selectedIndex ? selectedBg : hoverBg
                            }`}
                          >
                            <div className={`flex-shrink-0 ${iconMuted}`}>
                              {action.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div
                                className={`text-sm font-medium ${textPrimary}`}
                              >
                                {action.title}
                              </div>
                              {action.subtitle && (
                                <div className={`text-xs ${textMuted}`}>
                                  {action.subtitle}
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </>
                    )}

                    {/* Search Results */}
                    {results.length > 0 && (
                      <>
                        {query && filteredActions.length > 0 && (
                          <div
                            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${textMuted}`}
                          >
                            Search Results
                          </div>
                        )}
                        {results.map((result, index) => {
                          const adjustedIndex = index + filteredActions.length;
                          return (
                            <button
                              key={`${result.type}-${result.slug}`}
                              onClick={() => handleResultClick(result.href)}
                              className={`flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition-colors ${
                                adjustedIndex === selectedIndex
                                  ? selectedBg
                                  : hoverBg
                              }`}
                            >
                              <div className="mt-1 flex-shrink-0">
                                {result.type === "note" ? (
                                  <FileText
                                    className={`h-5 w-5 ${iconMuted}`}
                                  />
                                ) : (
                                  <FolderGit2
                                    className={`h-5 w-5 ${iconMuted}`}
                                  />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div
                                  className={`text-sm font-medium ${textPrimary}`}
                                >
                                  {result.title}
                                </div>
                                {result.summary && (
                                  <div
                                    className={`mt-1 line-clamp-1 text-xs ${textMuted}`}
                                  >
                                    {result.summary}
                                  </div>
                                )}
                              </div>
                              <div className="flex-shrink-0">
                                <span
                                  className={`rounded px-2 py-1 text-xs font-medium ${tagBg}`}
                                >
                                  {result.type}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </>
                    )}

                    {/* GitHub Repositories */}
                    {filteredRepos.length > 0 && (
                      <>
                        <div
                          className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${textMuted}`}
                        >
                          GitHub Repositories
                        </div>
                        {filteredRepos.map((repo, index) => {
                          const adjustedIndex =
                            index + filteredActions.length + results.length;
                          return (
                            <button
                              key={`repo-${repo.owner}-${repo.name}`}
                              onClick={() => handleResultClick(repo.url)}
                              className={`flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition-colors ${
                                adjustedIndex === selectedIndex
                                  ? selectedBg
                                  : hoverBg
                              }`}
                            >
                              <div className="mt-1 flex-shrink-0">
                                <Github className={`h-5 w-5 ${iconMuted}`} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div
                                  className={`text-sm font-medium ${textPrimary}`}
                                >
                                  {repo.owner}/{repo.name}
                                </div>
                                {repo.description && (
                                  <div
                                    className={`mt-1 line-clamp-1 text-xs ${textMuted}`}
                                  >
                                    {repo.description}
                                  </div>
                                )}
                                <div
                                  className={`mt-1 flex items-center gap-3 text-xs ${textMuted}`}
                                >
                                  <span className="flex items-center gap-1">
                                    <Star className="h-3 w-3" />
                                    {repo.stars.toLocaleString()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <GitFork className="h-3 w-3" />
                                    {repo.forks.toLocaleString()}
                                  </span>
                                  {repo.language && (
                                    <span>{repo.language}</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex-shrink-0">
                                <span
                                  className={`rounded px-2 py-1 text-xs font-medium ${tagBg}`}
                                >
                                  repo
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </>
                    )}

                    {/* Empty state */}
                    {!query &&
                      filteredActions.length === 0 &&
                      results.length === 0 && (
                        <div
                          className={`px-4 py-8 text-center text-sm ${textMuted}`}
                        >
                          Start typing to search or run commands...
                        </div>
                      )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div
                className={`flex items-center justify-between border-t px-4 py-2 text-xs ${footerBg} ${panelBorder}`}
              >
                <div className={`flex items-center gap-4 ${textMuted}`}>
                  <span className="flex items-center gap-1">
                    <kbd className={`rounded px-1.5 py-0.5 font-mono ${kbdBg}`}>
                      ↑
                    </kbd>
                    <kbd className={`rounded px-1.5 py-0.5 font-mono ${kbdBg}`}>
                      ↓
                    </kbd>
                    <span>Navigate</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className={`rounded px-1.5 py-0.5 font-mono ${kbdBg}`}>
                      ↵
                    </kbd>
                    <span>Open</span>
                  </span>
                </div>
                <div className={textMuted}>
                  {(filteredActions.length > 0 ||
                    results.length > 0 ||
                    filteredRepos.length > 0) && (
                    <span>
                      {filteredActions.length +
                        results.length +
                        filteredRepos.length}{" "}
                      item(s)
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
