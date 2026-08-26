import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactElement } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import HomePage from "@/components/home/HomePage";
import AboutPageClient from "@/app/about/AboutPageClient";
import ContactPageClient from "@/app/contact/ContactPageClient";
import PrivacyPageClient from "@/app/privacy/PrivacyPageClient";
import GalleryPageClient from "@/app/gallery/GalleryPageClient";
import DevelopersPageClient from "@/app/developers/DevelopersPageClient";
import ProjectList from "@/components/projects/ProjectList";
import NoteList from "@/components/notes/NoteList";
import ArticlePage from "@/components/notes/ArticlePage";

/**
 * These pages are client components ("use client"), which Next.js still
 * server-renders for the initial HTML sent to crawlers/agents before any
 * JavaScript executes. `renderToStaticMarkup` never runs effects, so it is
 * an accurate stand-in for that no-JS server-rendered payload — the same
 * thing an AI crawler fetching the raw HTML would see.
 */
function textLength(html: string): number {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim().length;
}

function ssrHtml(element: ReactElement): string {
  // Simulate an actual no-JS server render: jsdom exposes a global `window`
  // even under the server renderer, which client-only branches (e.g.
  // portal-rendering components) key off of. Real production SSR runs in
  // plain Node with no `window` at all.
  vi.stubGlobal("window", undefined);
  try {
    return renderToStaticMarkup(<ThemeProvider>{element}</ThemeProvider>);
  } finally {
    vi.unstubAllGlobals();
  }
}

describe("server-rendered content (no JavaScript)", () => {
  it("homepage renders an H1 and substantial text without hydration", () => {
    const html = ssrHtml(<HomePage articles={[]} />);
    expect(html).toContain("<h1");
    expect(textLength(html)).toBeGreaterThan(500);
  });

  it("homepage has a non-flat heading hierarchy (h1 > h2 > h3)", () => {
    const html = ssrHtml(
      <HomePage
        articles={[
          {
            slug: "test-article",
            title: "Test Article Title",
            date: "2025-01-01",
            readTime: "5 min read",
            image: null,
          },
        ]}
      />
    );
    expect(html).toContain("<h1");
    expect(html).toContain("<h2");
    // Featured project names and note titles are real page content, not
    // just chrome — giving them their own h3 keeps the outline from being
    // a flat h1 followed by a run of same-level h2 section labels.
    expect(html).toContain("<h3");
    expect(html).toContain("Test Article Title");
  });

  it("homepage exposes nested h2/h3 text that is not trapped inside links", () => {
    const html = ssrHtml(<HomePage articles={[]} />);
    // is-agentic graders ignore headings whose only text lives inside <a>.
    expect(html).toMatch(/<h2[^>]*>How to read this site<\/h2>/);
    expect(html).toMatch(/<h3[^>]*>People<\/h3>/);
    expect(html).toMatch(/<h3[^>]*>Agents<\/h3>/);
    expect(html).toMatch(/<h3[^>]*>Featured open-source tools<\/h3>/);
    expect(html).toMatch(/<h3[^>]*>Recent writing<\/h3>/);
    expect(html).toMatch(/<h3[^>]*>Photography gallery<\/h3>/);
    expect(html).toContain("nicholasadamou developer resources");
    expect(textLength(html)).toBeGreaterThan(500);
  });

  it("developers page renders a named H1 and substantial text without hydration", () => {
    const html = ssrHtml(<DevelopersPageClient />);
    expect(html).toContain("<h1");
    expect(html).toContain("Nicholas Adamou developer resources");
    expect(html).toContain("nicholasadamou developer resources");
    expect(html).toContain("openapi.json");
    expect(textLength(html)).toBeGreaterThan(500);
  });

  it("about page renders an H1 and substantial text without hydration", () => {
    const html = ssrHtml(<AboutPageClient />);
    expect(html).toContain("<h1");
    expect(textLength(html)).toBeGreaterThan(500);
  });

  it("about page includes a Developer Resources section linking to projects and notes", () => {
    const html = ssrHtml(<AboutPageClient />);
    expect(html).toContain("Developer Resources");
    expect(html).toMatch(/href="\/projects"/);
    expect(html).toMatch(/href="\/notes"/);
  });

  it("contact page renders an H1 and substantial text without hydration", () => {
    const html = ssrHtml(<ContactPageClient />);
    expect(html).toContain("<h1");
    expect(textLength(html)).toBeGreaterThan(500);
  });

  it("privacy page renders an H1 and substantial text without hydration", () => {
    const html = ssrHtml(<PrivacyPageClient />);
    expect(html).toContain("<h1");
    expect(textLength(html)).toBeGreaterThan(500);
  });

  it("gallery page renders an H1 without hydration", () => {
    const html = ssrHtml(<GalleryPageClient />);
    expect(html).toContain("<h1");
    expect(textLength(html)).toBeGreaterThan(0);
  });

  it("projects page renders an H1 and project listing without hydration", () => {
    const html = ssrHtml(<ProjectList />);
    expect(html).toContain("<h1");
    expect(textLength(html)).toBeGreaterThan(500);
  });

  it("notes index renders an H1 and article listing without hydration", () => {
    const html = ssrHtml(
      <NoteList
        articles={[
          {
            slug: "test-article",
            title: "Test Article Title",
            summary:
              "A summary describing the test article in enough detail to count as real content.",
            date: "2025-01-01",
            readTime: "5 min read",
            pinned: false,
            image: null,
          },
        ]}
      />
    );
    expect(html).toContain("<h1");
    expect(html).toContain("Test Article Title");
    // Fixture has a single article; real content has many — just confirm
    // the listing text (not just chrome) survives an unhydrated render.
    expect(textLength(html)).toBeGreaterThan(150);
  });

  it("article page renders an H1 and body content without hydration", () => {
    const html = ssrHtml(
      <ArticlePage
        slug="test-article"
        title="Test Article Title"
        date="2025-01-01"
        readTime="5 min read"
        image={null}
      >
        <p>
          This is the rendered MDX body content for the article, which should be
          present in the raw server-rendered HTML without any JavaScript
          execution so that crawlers and AI agents can read it directly.
        </p>
      </ArticlePage>
    );
    expect(html).toContain("<h1");
    expect(html).toContain("Test Article Title");
    // The real MDX body dwarfs this fixture; confirm the article's own
    // prose (not just page chrome) makes it into the unhydrated render.
    expect(textLength(html)).toBeGreaterThan(300);
  });
});
