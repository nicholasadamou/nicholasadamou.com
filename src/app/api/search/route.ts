import type { NextRequest } from "next/server";
import {
  jsonOk,
  methodNotAllowed,
  optionsOk,
  apiLinkHeaders,
} from "@/lib/api/errors";
import { searchContent } from "@/lib/api/v1/content";
import { getBaseUrl } from "@/lib/og";

/**
 * @deprecated Prefer GET /api/v1/search. Kept as a compatibility alias.
 */
export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";
  const results = searchContent(query).map(
    // Preserve the historical shape (no absolute url field; keep relative href).
    ({ type, slug, title, summary, href, tags }) => ({
      type,
      slug,
      title,
      summary,
      href,
      ...(tags ? { tags } : {}),
    })
  );

  const baseUrl = getBaseUrl();
  const linkHeaders = apiLinkHeaders() as Record<string, string>;
  const link = [
    `<${baseUrl}/api/v1/search>; rel="successor-version"`,
    linkHeaders.Link ?? "",
  ]
    .filter(Boolean)
    .join(", ");

  return jsonOk(
    { results },
    {
      headers: {
        ...linkHeaders,
        Deprecation: "true",
        Sunset: "Sat, 01 Aug 2027 00:00:00 GMT",
        Link: link,
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}

export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export function OPTIONS() {
  return optionsOk();
}
