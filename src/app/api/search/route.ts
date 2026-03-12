import { NextRequest, NextResponse } from "next/server";
import { getAllArticles } from "@/lib/content/mdx";
import { projects } from "@/lib/projects/config";
import type { ProjectIconType } from "@/lib/projects/icons";

interface SearchResult {
  type: "note" | "project";
  slug: string;
  title: string;
  summary: string;
  href: string;
  tags?: string[];
  icon?: ProjectIconType;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ results: [] });
  }

  const lowerQuery = query.toLowerCase();
  const results: SearchResult[] = [];

  // Search notes
  const articles = getAllArticles();
  for (const article of articles) {
    const matchesTitle = article.title.toLowerCase().includes(lowerQuery);
    const matchesSummary = article.summary?.toLowerCase().includes(lowerQuery);
    const matchesContent = article.body?.raw
      ?.toLowerCase()
      .includes(lowerQuery);

    if (matchesTitle || matchesSummary || matchesContent) {
      results.push({
        type: "note",
        slug: article.slug,
        title: article.title,
        summary: article.summary,
        href: `/notes/${article.slug}`,
      });
    }
  }

  // Search projects
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
        tags: project.tags,
        icon: project.icon,
      });
    }
  }

  // Sort by relevance (title matches first)
  results.sort((a, b) => {
    const aStartsWith = a.title.toLowerCase().startsWith(lowerQuery);
    const bStartsWith = b.title.toLowerCase().startsWith(lowerQuery);

    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;
    return 0;
  });

  return NextResponse.json({ results: results.slice(0, 10) });
}
