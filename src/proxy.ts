import { NextRequest, NextResponse } from "next/server";
import { prefersMarkdown } from "@/lib/markdown/negotiate";

const MARKDOWN_PATHS: Record<string, string> = {
  "/": "/api/markdown/home",
  "/about": "/api/markdown/about",
  "/contact": "/api/markdown/contact",
  "/privacy": "/api/markdown/privacy",
  "/projects": "/api/markdown/projects",
  "/notes": "/api/markdown/notes",
};

function markdownTargetFor(pathname: string): string | null {
  if (MARKDOWN_PATHS[pathname]) return MARKDOWN_PATHS[pathname];
  if (pathname.startsWith("/notes/") && pathname !== "/notes/") {
    return `/api/markdown${pathname}`;
  }
  return null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const target = markdownTargetFor(pathname);

  if (!target) {
    return NextResponse.next();
  }

  const accept = request.headers.get("accept");

  if (prefersMarkdown(accept)) {
    const url = request.nextUrl.clone();
    url.pathname = target;
    const response = NextResponse.rewrite(url);
    response.headers.append("Vary", "Accept");
    return response;
  }

  const response = NextResponse.next();
  response.headers.append("Vary", "Accept");
  return response;
}

export const config = {
  matcher: [
    "/",
    "/about",
    "/contact",
    "/privacy",
    "/projects",
    "/notes",
    "/notes/:slug*",
  ],
};
