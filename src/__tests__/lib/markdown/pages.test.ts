import { describe, it, expect } from "vitest";
import {
  getAboutMarkdown,
  getDevelopersMarkdown,
  getHomeMarkdown,
  getNotFoundMarkdown,
} from "@/lib/markdown/pages";

describe("getAboutMarkdown", () => {
  it("includes a Developer Resources section with absolute links", () => {
    const markdown = getAboutMarkdown();

    expect(markdown).toContain("## Developer Resources");
    expect(markdown).toMatch(/\[Projects\]\(https?:\/\/[^)]+\/projects\)/);
    expect(markdown).toMatch(/\[Notes\]\(https?:\/\/[^)]+\/notes\)/);
    expect(markdown).toContain("[GitHub](https://github.com/nicholasadamou)");
    expect(markdown).toMatch(
      /\[Nicholas Adamou developer resources\]\(https?:\/\/[^)]+\/developers\)/
    );
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

describe("getHomeMarkdown", () => {
  it("includes a nested How to read this site outline", () => {
    const markdown = getHomeMarkdown();

    expect(markdown).toContain("## How to read this site");
    expect(markdown).toContain("### People");
    expect(markdown).toContain("### Agents");
    expect(markdown).toMatch(/\/developers/);
  });
});
