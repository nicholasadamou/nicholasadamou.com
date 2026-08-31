import { getAllArticles, getArticleBySlug } from "@/lib/content/mdx";
import { projects } from "@/lib/projects/config";
import { getBaseUrl } from "@/lib/og";

export interface SearchResult {
  type: "note" | "project";
  slug: string;
  title: string;
  summary: string;
  href: string;
  url: string;
  tags?: string[];
}

export interface NoteSummary {
  slug: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  href: string;
  url: string;
  pinned: boolean;
}

export interface NoteDetail extends NoteSummary {
  body: string;
}

export interface ProjectSummary {
  name: string;
  slug: string;
  description: string;
  href: string;
  tags: string[];
  featured: boolean;
}

function absoluteUrl(path: string): string {
  const baseUrl = getBaseUrl();
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function searchContent(query: string, limit = 10): SearchResult[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];

  const results: SearchResult[] = [];

  for (const article of getAllArticles()) {
    const matchesTitle = article.title.toLowerCase().includes(lowerQuery);
    const matchesSummary = article.summary?.toLowerCase().includes(lowerQuery);
    const matchesContent = article.body?.raw
      ?.toLowerCase()
      .includes(lowerQuery);

    if (matchesTitle || matchesSummary || matchesContent) {
      const href = `/notes/${article.slug}`;
      results.push({
        type: "note",
        slug: article.slug,
        title: article.title,
        summary: article.summary,
        href,
        url: absoluteUrl(href),
      });
    }
  }

  for (const project of projects) {
    const matchesName = project.name.toLowerCase().includes(lowerQuery);
    const matchesDescription = project.description
      .toLowerCase()
      .includes(lowerQuery);
    const matchesTags = project.tags?.some((tag) =>
      tag.toLowerCase().includes(lowerQuery)
    );

    if (matchesName || matchesDescription || matchesTags) {
      results.push({
        type: "project",
        slug: project.name,
        title: project.name,
        summary: project.description,
        href: project.href,
        url: absoluteUrl(project.href),
        tags: project.tags,
      });
    }
  }

  results.sort((a, b) => {
    const aStartsWith = a.title.toLowerCase().startsWith(lowerQuery);
    const bStartsWith = b.title.toLowerCase().startsWith(lowerQuery);
    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;
    return 0;
  });

  return results.slice(0, limit);
}

export function listNotes(): NoteSummary[] {
  return getAllArticles().map((article) => {
    const href = `/notes/${article.slug}`;
    return {
      slug: article.slug,
      title: article.title,
      summary: article.summary,
      date: article.date,
      readTime: article.readTime,
      href,
      url: absoluteUrl(href),
      pinned: Boolean(article.pinned),
    };
  });
}

export function getNote(slug: string): NoteDetail | null {
  const article = getArticleBySlug(slug);
  if (!article) return null;

  const href = `/notes/${article.slug}`;
  return {
    slug: article.slug,
    title: article.title,
    summary: article.summary,
    date: article.date,
    readTime: article.readTime,
    href,
    url: absoluteUrl(href),
    pinned: Boolean(article.pinned),
    body: article.body.raw,
  };
}

export function listProjects(): ProjectSummary[] {
  return projects.map((project) => ({
    name: project.name,
    slug: project.name,
    description: project.description,
    href: project.href,
    tags: project.tags ?? [],
    featured: Boolean(project.featured),
  }));
}
