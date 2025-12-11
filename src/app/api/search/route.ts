import { NextRequest, NextResponse } from "next/server";
import { getAllNotes, getAllProjects } from "@/lib/contentlayer-data";
import type { Note, Project } from "@/lib/contentlayer-data";

interface SearchResult {
  type: "note" | "project";
  slug: string;
  title: string;
  summary: string;
  href: string;
  technologies?: string[];
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
  const notes = getAllNotes();
  notes.forEach((note: Note) => {
    const matchesTitle = note.title.toLowerCase().includes(lowerQuery);
    const matchesSummary = note.summary?.toLowerCase().includes(lowerQuery);
    const matchesContent = note.body?.raw?.toLowerCase().includes(lowerQuery);

    if (matchesTitle || matchesSummary || matchesContent) {
      results.push({
        type: "note",
        slug: note.slug,
        title: note.title,
        summary: note.summary,
        href: `/notes/${note.slug}`,
      });
    }
  });

  // Search projects
  const projects = getAllProjects();
  projects.forEach((project: Project) => {
    const matchesTitle = project.title.toLowerCase().includes(lowerQuery);
    const matchesSummary = project.summary?.toLowerCase().includes(lowerQuery);
    const matchesLongSummary = project.longSummary
      ?.toLowerCase()
      .includes(lowerQuery);
    const matchesTechnologies = project.technologies?.some((tech) =>
      tech.toLowerCase().includes(lowerQuery)
    );

    if (
      matchesTitle ||
      matchesSummary ||
      matchesLongSummary ||
      matchesTechnologies
    ) {
      results.push({
        type: "project",
        slug: project.slug,
        title: project.title,
        summary: project.summary,
        href: `/projects/${project.slug}`,
        technologies: project.technologies,
      });
    }
  });

  // Sort by relevance (title matches first)
  results.sort((a, b) => {
    const aTitle = a.title.toLowerCase();
    const bTitle = b.title.toLowerCase();
    const aStartsWith = aTitle.startsWith(lowerQuery);
    const bStartsWith = bTitle.startsWith(lowerQuery);

    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;
    return 0;
  });

  // Limit to 10 results
  return NextResponse.json({ results: results.slice(0, 10) });
}
