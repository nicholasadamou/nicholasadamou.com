import { describe, it, expect } from "vitest";
import { developerResources } from "@/lib/content/about-data";

describe("developerResources", () => {
  it("links to projects and notes as internal routes", () => {
    const projects = developerResources.find((r) => r.label === "Projects");
    const notes = developerResources.find((r) => r.label === "Notes");

    expect(projects).toMatchObject({ href: "/projects", internal: true });
    expect(notes).toMatchObject({ href: "/notes", internal: true });
  });

  it("links to the named developer resources index, GitHub, OpenAPI, MCP, CLI, llms.txt, and the sitemap", () => {
    const labels = developerResources.map((r) => r.label);
    expect(labels).toContain("Nicholas Adamou developer resources");
    expect(labels).toContain("GitHub");
    expect(labels).toContain("OpenAPI");
    expect(labels).toContain("MCP");
    expect(labels).toContain("CLI (npm)");
    expect(labels).toContain("llms.txt");
    expect(labels).toContain("Sitemap");

    const index = developerResources.find(
      (r) => r.label === "Nicholas Adamou developer resources"
    );
    expect(index).toMatchObject({ href: "/developers", internal: true });
  });
});
