"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

const labels: Record<string, string> = {
  "/about": "About",
  "/brand": "Brand resources",
  "/developers": "Developer resources",
  "/clients": "Client work",
  "/projects": "Projects",
  "/notes": "Notes",
  "/gallery": "Gallery",
  "/contact": "Contact",
  "/privacy": "Privacy Policy",
  "/dashboard": "Dashboard",
  "/og-preview": "Social preview",
};

export default function BackNav() {
  const pathname = usePathname();
  const { shouldUseDarkText } = useTheme();
  if (pathname === "/") return null;
  const isArticle = /^\/notes\/[^/]+$/.test(pathname);
  const label = isArticle ? "Notes" : labels[pathname];
  const color = shouldUseDarkText()
    ? "text-stone-950/60 hover:bg-stone-950/5"
    : "text-white/60 hover:bg-white/5";
  const linkClass = `rounded-full px-3 py-2 text-sm backdrop-blur-md transition-colors ${color}`;
  return (
    <nav
      aria-label="Breadcrumb"
      className="fixed top-3 left-2 z-10 flex items-center gap-1.5 sm:top-4 sm:left-3"
    >
      <Link href="/" className={linkClass}>
        Home
      </Link>
      {label && (
        <>
          <span aria-hidden="true" className="text-sm opacity-50">
            /
          </span>
          {isArticle ? (
            <Link href="/notes" className={linkClass}>
              Notes
            </Link>
          ) : (
            <span aria-current="page" className={`px-3 py-2 text-sm ${color}`}>
              {label}
            </span>
          )}
        </>
      )}
    </nav>
  );
}
