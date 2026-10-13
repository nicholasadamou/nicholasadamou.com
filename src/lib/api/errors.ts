import { getBaseUrl } from "@/lib/og";

/**
 * RFC 9457 Problem Details for HTTP APIs
 * https://www.rfc-editor.org/rfc/rfc9457.html
 */

export type ProblemCode =
  | "invalid_query"
  | "note_not_found"
  | "method_not_allowed"
  | "api_route_not_found"
  | "internal_error";

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  code: ProblemCode;
  resolution: string;
  documentation_url: string;
}

const PROBLEM_META: Record<
  ProblemCode,
  { title: string; status: number; typeSlug: string }
> = {
  invalid_query: {
    title: "Invalid query",
    status: 400,
    typeSlug: "invalid-query",
  },
  note_not_found: {
    title: "Note not found",
    status: 404,
    typeSlug: "note-not-found",
  },
  method_not_allowed: {
    title: "Method not allowed",
    status: 405,
    typeSlug: "method-not-allowed",
  },
  api_route_not_found: {
    title: "API route not found",
    status: 404,
    typeSlug: "api-route-not-found",
  },
  internal_error: {
    title: "Internal error",
    status: 500,
    typeSlug: "internal-error",
  },
};

export function buildProblemDetails(options: {
  code: ProblemCode;
  detail: string;
  resolution: string;
  instance: string;
  status?: number;
}): ProblemDetails {
  const baseUrl = getBaseUrl();
  const meta = PROBLEM_META[options.code];

  return {
    type: `${baseUrl}/developers#${meta.typeSlug}`,
    title: meta.title,
    status: options.status ?? meta.status,
    detail: options.detail,
    instance: options.instance.startsWith("http")
      ? options.instance
      : `${baseUrl}${options.instance}`,
    code: options.code,
    resolution: options.resolution,
    documentation_url: `${baseUrl}/developers#errors`,
  };
}

export function problemResponse(
  options: {
    code: ProblemCode;
    detail: string;
    resolution: string;
    instance: string;
    status?: number;
  },
  extraHeaders?: HeadersInit
): Response {
  const problem = buildProblemDetails(options);
  const headers = new Headers(extraHeaders);
  headers.set("Content-Type", "application/problem+json; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  if (!headers.has("Access-Control-Allow-Origin")) {
    headers.set("Access-Control-Allow-Origin", "*");
  }

  if (problem.status === 405 && !headers.has("Allow")) {
    headers.set("Allow", "GET, HEAD, OPTIONS");
  }

  return Response.json(problem, { status: problem.status, headers });
}

/** Shared handlers for read-only JSON API routes. */
export function methodNotAllowed(request: Request): Response {
  const url = new URL(request.url);
  return problemResponse(
    {
      code: "method_not_allowed",
      detail:
        "This Nicholas Adamou developer API endpoint is read-only and accepts GET requests only.",
      resolution: "Use GET with the documented query or path parameters.",
      instance: url.pathname + url.search,
    },
    apiLinkHeaders()
  );
}

export function optionsOk(methods = "GET, HEAD, OPTIONS"): Response {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: methods,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": methods,
      "Access-Control-Allow-Headers": "Accept, Content-Type",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

export function apiLinkHeaders(): HeadersInit {
  const baseUrl = getBaseUrl();
  return {
    Link: [
      `<${baseUrl}/openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json"`,
      `<${baseUrl}/.well-known/api-catalog>; rel="api-catalog"`,
      `<${baseUrl}/developers>; rel="service-doc"; type="text/html"`,
      `<${baseUrl}/developers#versioning-and-deprecation>; rel="deprecation"; type="text/html"`,
    ].join(", "),
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Allow-Headers": "Accept, Content-Type",
  };
}

export function jsonOk(body: unknown, init?: ResponseInit): Response {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  for (const [key, value] of Object.entries(apiLinkHeaders())) {
    if (!headers.has(key)) headers.set(key, value);
  }
  return Response.json(body, { ...init, headers });
}
