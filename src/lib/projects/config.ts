import type { ProjectIconType } from "./icons";

/**
 * Single source of truth for the You Build It live URL.
 * Consumed by the project card below and the command palette so the link
 * never drifts across the two surfaces.
 */
export const YOUBUILDIT_URL = "https://youbuildit.vercel.app";

export interface Project {
  name: string;
  href: string;
  description: string;
  icon: ProjectIconType;
  featured?: boolean;
  preview?: string;
  tags?: string[];
}

/** Derive preview image path from project name. */
function withPreviews(list: Project[]): Project[] {
  return list.map((p) => ({
    ...p,
    preview: p.preview ?? `/images/projects/previews/${p.name}.png`,
  }));
}

export const projects: Project[] = withPreviews([
  {
    // `name` stays "youbuildit.dev" intentionally: it's the brand label and
    // uses an explicit versioned preview asset. The live site is
    // currently served from YOUBUILDIT_URL — don't "fix" this to match.
    name: "youbuildit.dev",
    preview: "/images/projects/previews/youbuildit-2026.png",
    href: YOUBUILDIT_URL,
    description:
      "Helping you become a better software engineer through coding challenges that build real applications.",
    icon: { kind: "image", src: "/images/projects/youbuildit-2026.svg" },
    tags: ["Web App", "Education"],
  },
  {
    name: "cloud-tools",
    preview: "/images/projects/previews/cloud-tools-2026.png",
    href: "https://cloud-tools.vercel.app",
    description:
      "Convert images, audio, video, and eBooks. Compress images and PDFs with a self-hostable file toolbox.",
    icon: { kind: "image", src: "/images/projects/cloud-tools-2026.svg" },
    tags: ["Web App", "AWS", "Cloud"],
  },
  {
    name: "pyreload-cli",
    preview: "/images/projects/previews/pyreload-cli-2026.png",
    href: "https://pyreload-cli.vercel.app",
    description:
      "Automatically restart Python applications when files change, with polling support for mounted filesystems.",
    icon: { kind: "image", src: "/images/projects/pyreload-2026.svg" },
    tags: ["CLI", "Python"],
  },
  {
    name: "hermes",
    preview: "/images/projects/previews/hermes-2026.png",
    href: "https://hermes-logging.vercel.app",
    description:
      "Java logging with less setup. Write the message; Hermes handles delivery.",
    icon: { kind: "image", src: "/images/projects/hermes.svg" },
    tags: ["Library", "Java"],
  },
  {
    name: "transmute-core",
    preview: "/images/projects/previews/transmute-core-2026.png",
    href: "https://transmute-core.vercel.app",
    description:
      "A Java pixel game engine for building 2D worlds, with headless testing and no runtime dependencies.",
    icon: { kind: "image", src: "/images/projects/transmute-core-2026.svg" },
    tags: ["Library", "Graphics"],
  },
  {
    name: "learn-git",
    preview: "/images/projects/previews/learn-git-2026.png",
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
    preview: "/images/projects/previews/iconforge-2026.png",
    href: "https://iconforge-gamma.vercel.app",
    description:
      "Create favicons with Font Awesome icons, live styling, and layers. Export PNG and ICO files right in your browser.",
    icon: { kind: "image", src: "/images/projects/iconforge-2026.svg" },
    tags: ["Web App", "Design"],
  },
  {
    name: "prr",
    preview: "/images/projects/previews/prr-2026.png",
    href: "https://prr-seven.vercel.app",
    description:
      "Review GitHub pull requests and local branches with AI agents. Verify findings, browse saved reviews, and publish to GitHub when ready.",
    icon: { kind: "image", src: "/images/projects/prr-2026.svg" },
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
    preview: "/images/projects/previews/distill-2026.png",
    href: "https://distill-ochre.vercel.app",
    description:
      "Compact local Markdown into focused context for AI agents, using templates and your preferred CLI or API provider.",
    icon: { kind: "image", src: "/images/projects/distill-2026.svg" },
    featured: true,
    tags: ["CLI", "AI", "Documentation"],
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
    preview: "/images/projects/previews/aptscout-2026.png",
    href: "https://aptscout-five.vercel.app",
    description:
      "Collect apartment availability, filter by budget and bedrooms, and track rent changes locally with a Go CLI and browser UI.",
    icon: { kind: "image", src: "/images/projects/aptscout-2026.svg" },
    tags: ["CLI", "Web App", "Scraping"],
  },
  {
    name: "fugue",
    href: "https://fugue-lyart.vercel.app",
    description:
      "Incognito mode for AI coding agents. Runs Claude, Codex, Gemini, and more in ephemeral, isolated environments \u2014 no credentials, caches, telemetry, or transcripts persist after the session.",
    icon: { kind: "image", src: "/images/projects/fugue.svg" },
    featured: true,
    tags: ["CLI", "AI", "Security"],
  },
  {
    name: "airlock",
    href: "https://airlock-api.vercel.app",
    description:
      "Disposable browser isolation on your own machine. Open links in short-lived, containerized browser sessions via a web dashboard or browser extension — no cloud services.",
    icon: { kind: "image", src: "/images/projects/airlock.svg" },
    featured: true,
    tags: ["Web App", "Security", "Docker"],
  },
]);
