import { describe, it, expect } from "vitest";
import {
  getAboutMarkdown,
  getDevelopersMarkdown,
  getNotFoundMarkdown,
} from "@/lib/markdown/pages";

describe("getAboutMarkdown", () => {
  it("keeps developer references on their dedicated page", () => {
    expect(getAboutMarkdown()).not.toContain("## Developer Resources");
    expect(getDevelopersMarkdown()).toContain("/openapi.json");
  });
});

describe("getNotFoundMarkdown", () => {
  it("points agents at sitemap, llms.txt, and developer resources", () => {
    const markdown = getNotFoundMarkdown();

    expect(markdown).toContain("# Page not found");
    expect(markdown).toMatch(/\/sitemap\.xml/);
    expect(markdown).toMatch(/\/llms\.txt/);
    expect(markdown).toMatch(/\/developers/);
    expect(markdown).toMatch(/\/about/);
    expect(markdown).toMatch(/\/projects/);
  });
});

describe("getDevelopersMarkdown", () => {
  it("names Nicholas Adamou developer resources and lists discovery files", () => {
    const markdown = getDevelopersMarkdown();

    expect(markdown).toContain("# Nicholas Adamou developer resources");
    expect(markdown).toContain("nicholasadamou developer resources");
    expect(markdown).toMatch(/\/llms\.txt/);
    expect(markdown).toMatch(/\/openapi\.json/);
    expect(markdown).toMatch(/\/\.well-known\/api-catalog/);
    expect(markdown).toContain("Accept: text/markdown");
    expect(markdown).toMatch(/\/api\/v1\/search/);
    expect(markdown).toContain("application/problem+json");
    expect(markdown).toContain("/mcp");
    expect(markdown).toContain("npx nicholasadamou");
    expect(markdown).toContain("Versioning and deprecation");
  });
});
