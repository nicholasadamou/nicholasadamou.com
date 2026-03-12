"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { ChevronDown } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface Heading {
  id: string;
  text: string;
  level: number;
}

function getHeadings(): Heading[] {
  const article = document.querySelector("article");
  if (!article) return [];
  return Array.from(article.querySelectorAll("h2[id], h3[id]")).map((el) => ({
    id: el.id,
    text: el.textContent || "",
    level: el.tagName === "H2" ? 2 : 3,
  }));
}

function subscribeToHeadings(callback: () => void) {
  // Re-check headings on DOM mutations within the article
  const observer = new MutationObserver(callback);
  const article = document.querySelector("article");
  if (article) observer.observe(article, { childList: true, subtree: true });
  return () => observer.disconnect();
}

const emptyHeadings: Heading[] = [];

export default function TableOfContents() {
  const headings = useSyncExternalStore(
    subscribeToHeadings,
    getHeadings,
    () => emptyHeadings
  );
  const [activeId, setActiveId] = useState<string>("");
  const isClickScrolling = useRef(false);
  const { shouldUseDarkText } = useTheme();
  const light = shouldUseDarkText();

  // Track active heading based on scroll position
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      if (isClickScrolling.current) return;
      const offset = 100;
      let current = headings[0]?.id ?? "";

      for (const { id } of headings) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) {
          current = id;
        }
      }

      setActiveId(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  if (headings.length < 2) return null;

  const mutedColor = light ? "text-stone-400" : "text-white/30";
  const activeColor = light ? "text-stone-900" : "text-white";
  const borderColor = light ? "border-stone-200" : "border-white/10";
  const activeBorder = light ? "border-stone-900" : "border-white";
  const inlineBg = light ? "border-stone-200" : "border-white/10";
  const inlineText = light ? "text-stone-600" : "text-white/60";
  const inlineLink = light
    ? "text-stone-700 hover:text-stone-900"
    : "text-white/50 hover:text-white";
  const inlineDivider = light ? "border-stone-100" : "border-white/5";

  const handleClick = (e: React.MouseEvent, heading: Heading) => {
    e.preventDefault();
    setActiveId(heading.id);
    isClickScrolling.current = true;
    if (heading.id === headings[0]?.id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document
        .getElementById(heading.id)
        ?.scrollIntoView({ behavior: "smooth" });
    }
    setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);
  };

  return (
    <>
      {/* Mobile/tablet: inline collapsible TOC */}
      <details className={`mb-8 rounded-lg border xl:hidden ${inlineBg}`}>
        <summary
          className={`flex cursor-pointer select-none items-center justify-between px-4 py-3 text-sm font-medium ${inlineText}`}
        >
          Sections
          <ChevronDown className="h-4 w-4 transition-transform [[open]>&]:rotate-180" />
        </summary>
        <ul className={`border-t px-4 py-3 ${inlineDivider}`}>
          {headings.map((heading, index) => (
            <li key={heading.id}>
              {index > 0 && <hr className={`my-2 ${inlineDivider}`} />}
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading)}
                className={`block text-sm transition-colors ${
                  heading.level === 3 ? "pl-4 text-xs" : ""
                } ${activeId === heading.id ? activeColor + " font-medium" : inlineLink}`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </details>

      {/* Desktop: fixed sidebar TOC */}
      <nav className="fixed right-8 top-1/2 hidden -translate-y-1/2 xl:block">
        <ul className="space-y-2">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            return (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => handleClick(e, heading)}
                  className={`block border-r-2 pr-4 text-right text-xs transition-all ${
                    isActive
                      ? `${activeColor} ${activeBorder} font-medium`
                      : `${mutedColor} ${borderColor} hover:opacity-70`
                  } ${heading.level === 3 ? "text-[11px]" : ""}`}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
