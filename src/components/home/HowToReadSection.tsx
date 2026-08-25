"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";

/**
 * Nested outline for no-JS crawlers. Headings here must not wrap links —
 * is-agentic graders ignore H2/H3 text that only appears inside anchors.
 */
export default function HowToReadSection() {
  const { getOpacityClass, getLinkColorClass, getHrColorClass } = useTheme();
  const hr = `border-dashed ${getOpacityClass()} ${getHrColorClass()}`;
  const link = `underline transition-opacity hover:opacity-60 ${getLinkColorClass()}`;

  return (
    <section className="space-y-4 sm:space-y-3" aria-labelledby="how-to-read">
      <h2 id="how-to-read" className={`${getOpacityClass()} text-sm`}>
        How to read this site
      </h2>
      <p className={`leading-relaxed ${getOpacityClass()}`}>
        Nicholas Adamou&apos;s personal site is organized for both people and
        agents. The sections below explain where to look for biography,
        open-source work, and machine-readable entry points without needing
        JavaScript.
      </p>
      <div className="space-y-3">
        <div className="space-y-1">
          <h3 className="text-sm font-medium">People</h3>
          <p className={`leading-relaxed ${getOpacityClass()}`}>
            Start with the bio on this page, then continue to{" "}
            <Link href="/about" className={link}>
              About
            </Link>{" "}
            for work history,{" "}
            <Link href="/projects" className={link}>
              Projects
            </Link>{" "}
            for open-source tools, and{" "}
            <Link href="/notes" className={link}>
              Notes
            </Link>{" "}
            for technical writing. Use{" "}
            <Link href="/contact" className={link}>
              Contact
            </Link>{" "}
            for freelance or consulting inquiries.
          </p>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium">Agents</h3>
          <p className={`leading-relaxed ${getOpacityClass()}`}>
            Prefer{" "}
            <a href="/llms.txt" className={link}>
              llms.txt
            </a>{" "}
            and the{" "}
            <Link href="/developers" className={link}>
              Nicholas Adamou developer resources
            </Link>{" "}
            page. Pages also serve Markdown when requested with{" "}
            <code className="text-[0.85em]">Accept: text/markdown</code>. The{" "}
            <a href="/sitemap.xml" className={link}>
              sitemap
            </a>{" "}
            lists every indexable URL.
          </p>
        </div>
      </div>
      <hr className={hr} />
    </section>
  );
}
