import { NextRequest, NextResponse } from "next/server";
import {
  prefersMarkdown,
  prefersMarkdownRecovery,
} from "@/lib/markdown/negotiate";
import { isRscRequest } from "@/lib/markdown/is-rsc-request";

const MARKDOWN_PATHS: Record<string, string> = {
  "/": "/api/markdown/home",
  "/about": "/api/markdown/about",
  "/contact": "/api/markdown/contact",
  "/privacy": "/api/markdown/privacy",
  "/projects": "/api/markdown/projects",
  "/notes": "/api/markdown/notes",
  "/developers": "/api/markdown/developers",
};

/** Same-origin HTML pages that intentionally have no Markdown variant. */
const HTML_ONLY_PREFIXES = ["/gallery", "/dashboard", "/og-preview"];

function markdownTargetFor(pathname: string): string | null {
  if (MARKDOWN_PATHS[pathname]) return MARKDOWN_PATHS[pathname];
  if (pathname.startsWith("/notes/") && pathname !== "/notes/") {
    return `/api/markdown${pathname}`;
  }
  return null;
}

function isHtmlOnlyPath(pathname: string): boolean {
  return HTML_ONLY_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function appendVaryAccept(response: NextResponse): NextResponse {
  response.headers.append("Vary", "Accept");
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Never negotiate away from Next.js RSC / soft navigations.
  if (isRscRequest(request.headers)) {
    return NextResponse.next();
  }

  // Static files and well-known machine-readable assets keep their own
  // content types — do not rewrite them to Markdown.
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/.well-known/") ||
    pathname === "/llms.txt" ||
    pathname === "/openapi.json" ||
    pathname === "/server.json" ||
    pathname === "/mcp" ||
    pathname.startsWith("/mcp/") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const accept = request.headers.get("accept");

  const target = markdownTargetFor(pathname);
  if (target && prefersMarkdown(accept)) {
    const url = request.nextUrl.clone();
    url.pathname = target;
    return appendVaryAccept(NextResponse.rewrite(url));
  }

  // Known HTML-only pages: leave the HTML response alone even when the
  // client prefers Markdown (they still accept HTML via q-values or we
  // simply have no alternate representation).
  if (isHtmlOnlyPath(pathname)) {
    return appendVaryAccept(NextResponse.next());
  }

  // Nonexistent (or otherwise unmapped) paths: short Markdown recovery
  // body with a real HTTP 404 so agents can find the sitemap / llms.txt.
  // Use relaxed negotiation — many agents curl without Accept: text/markdown.
  if (!target && prefersMarkdownRecovery(accept)) {
    const notFound = request.nextUrl.clone();
    notFound.pathname = "/api/markdown/not-found";
    return appendVaryAccept(NextResponse.rewrite(notFound));
  }

  return appendVaryAccept(NextResponse.next());
}

export const config = {
  matcher: [
    /*
     * Negotiate on document routes. Skip Next internals, API handlers,
     * and files with extensions (images, icons, txt/xml served as static).
     */
    "/((?!api/|_next/|_vercel/|.*\\..*).*)",
    "/",
  ],
};
