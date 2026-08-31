import { describe, it, expect } from "vitest";
import { getOpenApiDocument } from "@/lib/openapi";

describe("getOpenApiDocument", () => {
  it("describes Nicholas Adamou developer resources with typed v1 schemas", () => {
    const doc = getOpenApiDocument();

    expect(doc.openapi).toBe("3.1.0");
    expect(doc.info.title).toBe("Nicholas Adamou developer resources");
    expect(doc.info.description).toMatch(/\/api\/v1/);
    expect(doc.info.description).toMatch(/problem\+json|RFC 9457/i);
    expect(doc.info.description).toMatch(/Sunset|Deprecation/i);

    expect(doc.paths["/api/v1/search"]).toBeDefined();
    expect(doc.paths["/api/v1/notes"]).toBeDefined();
    expect(doc.paths["/api/v1/notes/{slug}"]).toBeDefined();
    expect(doc.paths["/api/v1/projects"]).toBeDefined();
    expect(doc.paths["/openapi.json"]).toBeDefined();
    expect(doc.paths["/server.json"]).toBeDefined();

    expect(doc.components.schemas.ProblemDetails).toBeDefined();
    expect(doc.components.schemas.SearchResponse).toBeDefined();
    expect(doc.components.schemas.NoteDetail).toBeDefined();

    const search = doc.paths["/api/v1/search"].get;
    expect(search.operationId).toBe("searchContentV1");
    expect(
      search.responses["200"].content["application/json"].schema.$ref
    ).toBe("#/components/schemas/SearchResponse");
    expect(
      search.responses["400"].content["application/problem+json"].schema.$ref
    ).toBe("#/components/schemas/ProblemDetails");

    const ops = Object.values(doc.paths).flatMap((pathItem) =>
      Object.values(pathItem as Record<string, { operationId?: string }>)
    );
    const operationIds = ops.map((op) => op.operationId).filter(Boolean);
    expect(new Set(operationIds).size).toBe(operationIds.length);
  });
});
