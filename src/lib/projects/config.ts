import type { ProjectIconType } from "./icons";

export interface Project {
  name: string;
  href: string;
  description: string;
  icon: ProjectIconType;
  featured?: boolean;
  tags?: string[];
}

export const projects: Project[] = [
  {
    name: "dotbrains.dev",
    href: "https://dotbrains.dev",
    description: "Developer tools and open-source utilities.",
    icon: { kind: "image", src: "/images/projects/dotbrains.png" },
    tags: ["Web App", "Open Source"],
  },
  {
    name: "youbuildit.dev",
    href: "https://youbuildit.dev",
    description:
      "Helping you become a better software engineer through coding challenges that build real applications.",
    icon: { kind: "component", id: "youbuildit" },
    tags: ["Web App", "Education"],
  },
  {
    name: "cloud-tools",
    href: "https://cloud-tools.vercel.app",
    description:
      "An AWS cloud-based service that provides users with a platform to convert or compress files.",
    icon: { kind: "emoji", emoji: "☁️" },
    tags: ["Web App", "AWS", "Cloud"],
  },
  {
    name: "pyreload-cli",
    href: "https://pyreload-cli.vercel.app",
    description:
      "A modern, easy-to-use package to automatically restart Python applications when file changes are detected.",
    icon: { kind: "image", src: "/images/projects/pyreload.svg" },
    tags: ["CLI", "Python"],
  },
  {
    name: "hermes",
    href: "https://hermes-logging.vercel.app",
    description: "Zero-Boilerplate Java Logging.",
    icon: { kind: "image", src: "/images/projects/hermes.svg" },
    tags: ["Library", "Java"],
  },
  {
    name: "transmute-core",
    href: "https://transmute-core.vercel.app",
    description: "Hardware-accelerated pixel rendering engine.",
    icon: { kind: "image", src: "/images/projects/transmute-core.svg" },
    tags: ["Library", "Graphics"],
  },
  {
    name: "learn-git",
    href: "https://learn-git-five.vercel.app",
    description: "A free and open-source platform to learn Git and GitHub.",
    icon: { kind: "component", id: "learn-git" },
    tags: ["Web App", "Education"],
  },
  {
    name: "next-ui",
    href: "https://next-ui-orcin-chi.vercel.app",
    description:
      "A collection of copy-paste interactive components for your projects.",
    icon: { kind: "component", id: "nextjs" },
    tags: ["Web App", "UI", "React"],
  },
  {
    name: "coolregex",
    href: "https://coolregex.vercel.app",
    description:
      "A curated collection of regex patterns for validating various data formats.",
    icon: { kind: "image", src: "/images/projects/coolregex.ico" },
    tags: ["Web App", "Utility"],
  },
  {
    name: "iconforge",
    href: "https://iconforge-gamma.vercel.app",
    description:
      "A modern app for creating beautiful favicons using Font Awesome icons.",
    icon: { kind: "emoji", emoji: "🔥" },
    tags: ["Web App", "Design"],
  },
  {
    name: "prr",
    href: "https://prr-seven.vercel.app",
    description:
      "Run AI-powered code reviews on GitHub pull requests. Outputs structured, human-readable markdown comments for easy copy-paste into GitHub.",
    icon: { kind: "image", src: "/images/projects/prr.svg" },
    featured: true,
    tags: ["CLI", "AI", "Code Review"],
  },
  {
    name: "squash",
    href: "https://squash-omega.vercel.app",
    description: "A browser-based image compression tool using WebAssembly.",
    icon: { kind: "emoji", emoji: "🎨" },
    tags: ["Web App", "WebAssembly"],
  },
  {
    name: "distill",
    href: "https://distill-ochre.vercel.app",
    description:
      "Compact technical books, documentation, and reference material into agent-optimized markdown. Outputs structured context repos that plug directly into Warp, Claude Code, or any agent that reads markdown.",
    icon: { kind: "image", src: "/images/projects/distill.svg" },
    featured: true,
    tags: ["CLI", "AI", "Documentation"],
  },
  {
    name: "sluice",
    href: "https://sluice-tau.vercel.app",
    description:
      "Batched PostgreSQL data backfills with cycle detection, resume-from-interruption, migration interleaving, version collision renumbering, and safe database branch switching.",
    icon: { kind: "image", src: "/images/projects/sluice.svg" },
    featured: true,
    tags: ["CLI", "PostgreSQL", "Migrations"],
  },
  {
    name: "glimpse",
    href: "https://glimpse-black.vercel.app",
    description:
      "Browser-based, GitHub-style diff viewer for git changes. View uncommitted changes, branch comparisons, commit ranges, and GitHub PRs with syntax-highlighted split diffs, inline comments, and AI code review.",
    icon: { kind: "image", src: "/images/projects/glimpse.svg" },
    tags: ["CLI", "Git", "Code Review"],
  },
  {
    name: "aptscout",
    href: "https://aptscout-five.vercel.app",
    description:
      "Scrape apartment availability across multiple properties, store results in SQLite, and browse with a filterable web UI. Track prices, catch deals, never miss a unit.",
    icon: { kind: "image", src: "/images/projects/aptscout.svg" },
    featured: true,
    tags: ["CLI", "Web App", "Scraping"],
  },
  {
    name: "devx",
    href: "https://devx-flame.vercel.app",
    description:
      "A layered, extensible framework for building secure, customizable developer environments using Ansible and Vagrant.",
    icon: { kind: "image", src: "/images/projects/devx.svg" },
    tags: ["Framework", "DevOps", "Ansible"],
  },
];
