import { describe, it, expect } from "vitest";
import { getOpenApiDocument } from "@/lib/openapi";

describe("getOpenApiDocument", () => {
  it("describes Nicholas Adamou developer resources", () => {
    const doc = getOpenApiDocument();

    expect(doc.openapi).toBe("3.1.0");
    expect(doc.info.title).toBe("Nicholas Adamou developer resources");
    expect(doc.paths["/developers"]).toBeDefined();
    expect(doc.paths["/llms.txt"]).toBeDefined();
    expect(doc.paths["/openapi.json"]).toBeDefined();
    expect(doc.paths["/api/search"]).toBeDefined();
  });
});
