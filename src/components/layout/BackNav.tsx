"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

const BREADCRUMBS: Record<string, { label: string; href?: string }> = {
  "/contact": { label: "Contact" },
  "/privacy": { label: "Privacy Policy" },
};

export default function BackNav() {
  const pathname = usePathname();
  const { shouldUseDarkText, isHydrated } = useTheme();

  if (!isHydrated || pathname === "/") return null;

  const light = shouldUseDarkText();
  const backBg = light
    ? "text-stone-950/60 hover:bg-stone-950/5"
    : "text-white/60 hover:bg-white/5";
  const textOnly = backBg.split(" ")[0];

  // /notes/[slug] → Home / Notes breadcrumb
  const isArticle = /^\/notes\/[^/]+$/.test(pathname);

  // Static breadcrumb pages
  const crumb = BREADCRUMBS[pathname];

  if (isArticle) {
    return (
      <div className="animate-fadeInBack fixed left-2 top-3 z-10 flex items-center gap-1.5 sm:left-3 sm:top-4">
        <Link
          href="/"
          className={`rounded-full bg-white/0 px-3 py-2 text-sm backdrop-blur-md ${backBg} transition-colors`}
        >
          Home
        </Link>
        <span className={`text-sm ${textOnly}`}>/</span>
        <Link
          href="/notes"
          className={`rounded-full bg-white/0 px-3 py-2 text-sm backdrop-blur-md ${backBg} transition-colors`}
        >
          Notes
        </Link>
      </div>
    );
  }

  if (crumb) {
    return (
      <div className="animate-fadeInBack fixed left-2 top-3 z-10 flex items-center gap-1.5 sm:left-3 sm:top-4">
        <Link
          href="/"
          className={`rounded-full bg-white/0 px-3 py-2 text-sm backdrop-blur-md ${backBg} transition-colors`}
        >
          Home
        </Link>
        <span className={`text-sm ${textOnly}`}>/</span>
        {crumb.href ? (
          <Link
            href={crumb.href}
            className={`rounded-full bg-white/0 px-3 py-2 text-sm backdrop-blur-md ${backBg} transition-colors`}
          >
            {crumb.label}
          </Link>
        ) : (
          <span
            className={`rounded-full bg-white/0 px-3 py-2 text-sm ${textOnly}`}
          >
            {crumb.label}
          </span>
        )}
      </div>
    );
  }

  // Default: simple Home link
  return (
    <Link
      href="/"
      className={`fixed left-2 top-3 z-10 rounded-full bg-white/0 px-3 py-2 text-sm backdrop-blur-md sm:left-3 sm:top-4 ${backBg} transition-colors`}
    >
      Home
    </Link>
  );
}
