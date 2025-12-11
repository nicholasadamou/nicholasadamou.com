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
  User,
  Camera,
  Briefcase,
  Mail,
  Moon,
  Sun,
  Monitor,
  Command,
  ExternalLink,
  Linkedin,
  Github,
  Code2,
  Building2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils/utils";

interface SearchResult {
  type: "note" | "project";
  slug: string;
  title: string;
  summary: string;
  href: string;
  technologies?: string[];
}

interface Action {
  id: string;
  type: "navigation" | "theme" | "social" | "company" | "action";
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
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { setTheme } = useTheme();

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
        id: "nav-about",
        type: "navigation",
        title: "About",
        subtitle: "Learn more about me",
        icon: <User className="h-5 w-5" />,
        action: () => {
          router.push("/about");
          onClose();
        },
        keywords: ["about", "bio", "me"],
      },
      {
        id: "nav-gallery",
        type: "navigation",
        title: "Gallery",
        subtitle: "View photos",
        icon: <Camera className="h-5 w-5" />,
        action: () => {
          router.push("/gallery");
          onClose();
        },
        keywords: ["gallery", "photos", "images", "pictures"],
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
        id: "nav-contact",
        type: "navigation",
        title: "Contact",
        subtitle: "Get in touch",
        icon: <Mail className="h-5 w-5" />,
        action: () => {
          router.push("/contact");
          onClose();
        },
        keywords: ["contact", "email", "reach out"],
      },
      {
        id: "theme-light",
        type: "theme",
        title: "Light Theme",
        subtitle: "Switch to light mode",
        icon: <Sun className="h-5 w-5" />,
        action: () => {
          setTheme("light");
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
          setTheme("dark");
          onClose();
        },
        keywords: ["dark", "theme", "night"],
      },
      {
        id: "theme-system",
        type: "theme",
        title: "System Theme",
        subtitle: "Use system preference",
        icon: <Monitor className="h-5 w-5" />,
        action: () => {
          setTheme("system");
          onClose();
        },
        keywords: ["system", "theme", "auto"],
      },
      // Social Links
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
        keywords: ["resume", "cv", "curriculum vitae", "experience"],
      },
      {
        id: "social-linkedin",
        type: "social",
        title: "LinkedIn",
        subtitle: "Connect on LinkedIn",
        icon: <Linkedin className="h-5 w-5" />,
        action: () => {
          window.open("https://www.linkedin.com/in/nicholas-adamou", "_blank");
          onClose();
        },
        keywords: ["linkedin", "social", "professional", "network"],
      },
      {
        id: "social-github",
        type: "social",
        title: "GitHub",
        subtitle: "View my code on GitHub",
        icon: <Github className="h-5 w-5" />,
        action: () => {
          window.open("https://github.com/nicholasadamou", "_blank");
          onClose();
        },
        keywords: ["github", "social", "code", "repositories", "open source"],
      },
      {
        id: "social-leetcode",
        type: "social",
        title: "LeetCode",
        subtitle: "See my coding solutions",
        icon: <Code2 className="h-5 w-5" />,
        action: () => {
          window.open("https://leetcode.com/nicholasadamou", "_blank");
          onClose();
        },
        keywords: ["leetcode", "social", "coding", "algorithms", "practice"],
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
        keywords: ["dotbrains", "company", "agency", "development"],
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
        keywords: ["you build it", "youbuildit", "company", "platform"],
      },
    ],
    [router, onClose, setTheme]
  );

  // Filter actions based on query
  const filterActions = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        // Show all actions when no query
        setFilteredActions(actions);
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
    },
    [actions]
  );

  // Search function using API
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        filterActions("");
        return;
      }

      // Filter actions
      filterActions(searchQuery);

      // Search content
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}`
        );
        const data = await response.json();
        setResults(data.results || []);
        setSelectedIndex(0);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [filterActions]
  );

  // Handle search input change with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  // Focus input when opened and prevent body scroll
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setFilteredActions(actions);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      // Restore body scroll
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

      const totalItems = filteredActions.length + results.length;

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
          // Check if selected item is an action
          if (selectedIndex < filteredActions.length) {
            filteredActions[selectedIndex].action();
          }
          // Check if selected item is a search result
          else if (selectedIndex < totalItems) {
            const resultIndex = selectedIndex - filteredActions.length;
            if (results[resultIndex]) {
              router.push(results[resultIndex].href);
              onClose();
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
  }, [isOpen, results, filteredActions, selectedIndex, router, onClose]);

  const handleResultClick = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Command Palette */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-contrast border-secondary mx-4 w-full max-w-2xl overflow-hidden rounded-xl border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="border-secondary flex items-center gap-3 border-b px-4 py-3">
                <Search className="text-tertiary h-5 w-5" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search or run a command..."
                  className="text-primary placeholder:text-tertiary flex-1 bg-transparent text-base outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="text-tertiary hover:text-secondary transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <kbd className="bg-secondary text-tertiary hidden rounded px-2 py-1 text-xs font-semibold sm:inline-block">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {isLoading && (
                  <div className="text-tertiary px-4 py-8 text-center text-sm">
                    Searching...
                  </div>
                )}

                {!isLoading &&
                  query &&
                  filteredActions.length === 0 &&
                  results.length === 0 && (
                    <div className="text-tertiary px-4 py-8 text-center text-sm">
                      No results found for &quot;{query}&quot;
                    </div>
                  )}

                {!isLoading && (
                  <div className="py-2">
                    {/* Actions */}
                    {filteredActions.length > 0 && (
                      <>
                        {query && (
                          <div className="text-tertiary px-4 py-2 text-xs font-semibold uppercase tracking-wider">
                            Actions
                          </div>
                        )}
                        {filteredActions.map((action, index) => (
                          <button
                            key={action.id}
                            onClick={() => action.action()}
                            className={cn(
                              "flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors",
                              index === selectedIndex
                                ? "bg-secondary"
                                : "hover:bg-tertiary"
                            )}
                          >
                            <div className="text-tertiary flex-shrink-0">
                              {action.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-primary text-sm font-medium">
                                {action.title}
                              </div>
                              {action.subtitle && (
                                <div className="text-tertiary text-xs">
                                  {action.subtitle}
                                </div>
                              )}
                            </div>
                            <div className="text-tertiary flex-shrink-0">
                              <Command className="h-3 w-3" />
                            </div>
                          </button>
                        ))}
                      </>
                    )}

                    {/* Search Results */}
                    {results.length > 0 && (
                      <>
                        {query && filteredActions.length > 0 && (
                          <div className="text-tertiary px-4 py-2 text-xs font-semibold uppercase tracking-wider">
                            Search Results
                          </div>
                        )}
                        {results.map((result, index) => {
                          const adjustedIndex = index + filteredActions.length;
                          return (
                            <button
                              key={`${result.type}-${result.slug}`}
                              onClick={() => handleResultClick(result.href)}
                              className={cn(
                                "flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition-colors",
                                adjustedIndex === selectedIndex
                                  ? "bg-secondary"
                                  : "hover:bg-tertiary"
                              )}
                            >
                              <div className="mt-1 flex-shrink-0">
                                {result.type === "note" ? (
                                  <FileText className="text-tertiary h-5 w-5" />
                                ) : (
                                  <FolderGit2 className="text-tertiary h-5 w-5" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-primary text-sm font-medium">
                                  {result.title}
                                </div>
                                {result.summary && (
                                  <div className="text-tertiary mt-1 line-clamp-1 text-xs">
                                    {result.summary}
                                  </div>
                                )}
                              </div>
                              <div className="flex-shrink-0">
                                <span className="bg-tertiary text-tertiary rounded px-2 py-1 text-xs font-medium">
                                  {result.type}
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
                        <div className="text-tertiary px-4 py-8 text-center text-sm">
                          Start typing to search or run commands...
                        </div>
                      )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-tertiary border-secondary flex items-center justify-between border-t px-4 py-2 text-xs">
                <div className="text-tertiary flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="bg-secondary rounded px-1.5 py-0.5 font-mono">
                      ↑
                    </kbd>
                    <kbd className="bg-secondary rounded px-1.5 py-0.5 font-mono">
                      ↓
                    </kbd>
                    <span>Navigate</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="bg-secondary rounded px-1.5 py-0.5 font-mono">
                      ↵
                    </kbd>
                    <span>Open</span>
                  </span>
                </div>
                <div className="text-tertiary">
                  {(filteredActions.length > 0 || results.length > 0) && (
                    <span>
                      {filteredActions.length + results.length} item(s)
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
