import { describe, it, expect } from "vitest";
import {
  buildProblemDetails,
  problemResponse,
  methodNotAllowed,
} from "@/lib/api/errors";

describe("RFC 9457 problem details", () => {
  it("builds a typed problem object with resolution hint", () => {
    const problem = buildProblemDetails({
      code: "invalid_query",
      detail: 'Missing required query parameter "q".',
      resolution: "Pass q as a query parameter.",
      instance: "/api/v1/search",
    });

    expect(problem.status).toBe(400);
    expect(problem.code).toBe("invalid_query");
    expect(problem.title).toBe("Invalid query");
    expect(problem.resolution).toContain("Pass q");
    expect(problem.type).toMatch(/\/developers#invalid-query$/);
    expect(problem.documentation_url).toMatch(/\/developers#errors$/);
    expect(problem.instance).toMatch(/\/api\/v1\/search$/);
  });

  it("returns application/problem+json responses", async () => {
    const response = problemResponse({
      code: "api_route_not_found",
      detail: "No route",
      resolution: "Use OpenAPI",
      instance: "/api/v1/missing",
    });

    expect(response.status).toBe(404);
    expect(response.headers.get("Content-Type")).toContain(
      "application/problem+json"
    );
    const body = await response.json();
    expect(body.code).toBe("api_route_not_found");
  });

  it("returns 405 for unsupported methods with Allow header", async () => {
    const response = methodNotAllowed(
      new Request("https://nicholasadamou.com/api/v1/search", {
        method: "POST",
      })
    );

    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toContain("GET");
    const body = await response.json();
    expect(body.code).toBe("method_not_allowed");
  });
});
