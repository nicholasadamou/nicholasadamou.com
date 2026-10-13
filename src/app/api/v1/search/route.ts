import type { NextRequest } from "next/server";
import {
  jsonOk,
  methodNotAllowed,
  optionsOk,
  problemResponse,
} from "@/lib/api/errors";
import { searchContent } from "@/lib/api/v1/content";

export function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (q === null) {
    return problemResponse({
      code: "invalid_query",
      detail: 'Missing required query parameter "q".',
      resolution:
        "Pass a non-empty search string as the q query parameter, for example /api/v1/search?q=nextjs.",
      instance: request.nextUrl.pathname + request.nextUrl.search,
    });
  }

  const results = searchContent(q);
  return jsonOk(
    { results, query: q.trim(), count: results.length },
    {
      headers: {
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
