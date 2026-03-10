import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("fs", () => ({
  default: {
    readFileSync: vi.fn(),
    existsSync: vi.fn(),
    readdirSync: vi.fn(),
  },
  readFileSync: vi.fn(),
  existsSync: vi.fn(),
  readdirSync: vi.fn(),
}));

vi.mock("path", () => ({
  default: {
    join: (...args: string[]) => args.join("/"),
    basename: (p: string, ext: string) => {
      const base = p.split("/").pop()!;
      return ext ? base.replace(ext, "") : base;
    },
  },
  join: (...args: string[]) => args.join("/"),
  basename: (p: string, ext: string) => {
    const base = p.split("/").pop()!;
    return ext ? base.replace(ext, "") : base;
  },
}));

vi.mock("gray-matter", () => ({
  default: (content: string) => {
    // Simple frontmatter parser for tests
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { data: {}, content };
    const data: Record<string, unknown> = {};
    match[1].split("\n").forEach((line) => {
      const [key, ...val] = line.split(": ");
      if (key && val.length) data[key.trim()] = val.join(": ").trim();
    });
    return { data, content: match[2] };
  },
}));

vi.mock("reading-time", () => ({
  default: (text: string) => ({
    text: `${Math.ceil(text.split(/\s+/).length / 200)} min read`,
  }),
}));

vi.mock("js-yaml", () => ({
  default: { load: (s: string) => s },
}));

import fs from "fs";

const MDX_FILE = `---
title: Test Article
summary: A test summary
date: 2024-01-15
image_url: /test.jpg
pinned: true
---
This is test content with some words.`;

describe("getAllArticles", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("returns empty array when directory does not exist", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);

    const { getAllArticles } = await import("@/lib/content/mdx");
    expect(getAllArticles()).toEqual([]);
  });

  it("parses MDX files and returns articles", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(fs.readdirSync).mockReturnValue(["test-article.mdx"] as any);
    vi.mocked(fs.readFileSync).mockReturnValue(MDX_FILE);

    const { getAllArticles } = await import("@/lib/content/mdx");
    const articles = getAllArticles();

    expect(articles).toHaveLength(1);
    expect(articles[0].slug).toBe("test-article");
    expect(articles[0].title).toBe("Test Article");
    expect(articles[0].summary).toBe("A test summary");
  });

  it("filters non-mdx files", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readdirSync).mockReturnValue([
      "a.mdx",
      "b.txt",
      "c.mdx",
    ] as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    vi.mocked(fs.readFileSync).mockReturnValue(MDX_FILE);

    const { getAllArticles } = await import("@/lib/content/mdx");
    expect(getAllArticles()).toHaveLength(2);
  });
});

describe("getArticleBySlug", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("returns null when file does not exist", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);

    const { getArticleBySlug } = await import("@/lib/content/mdx");
    expect(getArticleBySlug("nonexistent")).toBeNull();
  });

  it("returns article when file exists", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(MDX_FILE);

    const { getArticleBySlug } = await import("@/lib/content/mdx");
    const article = getArticleBySlug("test-article");
    expect(article).not.toBeNull();
    expect(article!.title).toBe("Test Article");
  });
});

describe("getAllArticleSlugs", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("returns slugs from all articles", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(fs.readdirSync).mockReturnValue(["one.mdx", "two.mdx"] as any);
    vi.mocked(fs.readFileSync).mockReturnValue(MDX_FILE);

    const { getAllArticleSlugs } = await import("@/lib/content/mdx");
    const slugs = getAllArticleSlugs();
    expect(slugs).toHaveLength(2);
    expect(slugs).toContain("one");
    expect(slugs).toContain("two");
  });
});

describe("getRelatedArticles", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("excludes the given slug", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readdirSync).mockReturnValue([
      "a.mdx",
      "b.mdx",
      "c.mdx",
    ] as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    vi.mocked(fs.readFileSync).mockReturnValue(MDX_FILE);

    const { getRelatedArticles } = await import("@/lib/content/mdx");
    const related = getRelatedArticles("a", 2);
    expect(related.every((a) => a.slug !== "a")).toBe(true);
  });

  it("returns at most `count` articles", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readdirSync).mockReturnValue([
      "a.mdx",
      "b.mdx",
      "c.mdx",
      "d.mdx",
    ] as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    vi.mocked(fs.readFileSync).mockReturnValue(MDX_FILE);

    const { getRelatedArticles } = await import("@/lib/content/mdx");
    const related = getRelatedArticles("a", 2);
    expect(related.length).toBeLessThanOrEqual(2);
  });
});
