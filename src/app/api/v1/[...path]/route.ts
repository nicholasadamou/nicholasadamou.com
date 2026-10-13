import type { NextRequest } from "next/server";
import { methodNotAllowed, optionsOk, problemResponse } from "@/lib/api/errors";

/**
 * Catch-all for unknown /api/v1/* paths so agents receive RFC 9457 JSON
 * instead of an HTML 404 page.
 */
export function GET(request: NextRequest) {
  return problemResponse({
    code: "api_route_not_found",
    detail: `No public API route matches ${request.nextUrl.pathname}.`,
    resolution:
      "Use OpenAPI at /openapi.json or the RFC 9727 catalog at /.well-known/api-catalog to discover supported /api/v1 endpoints.",
    instance: request.nextUrl.pathname + request.nextUrl.search,
  });
}

export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export function OPTIONS() {
  return optionsOk();
}
