import { describe, it, expect } from "vitest";
import { developerResources } from "@/lib/content/about-data";

describe("developerResources", () => {
  it("links to projects and notes as internal routes", () => {
    const projects = developerResources.find((r) => r.label === "Projects");
    const notes = developerResources.find((r) => r.label === "Notes");

    expect(projects).toMatchObject({ href: "/projects", internal: true });
    expect(notes).toMatchObject({ href: "/notes", internal: true });
  });

  it("links to GitHub, llms.txt, and the sitemap", () => {
    const labels = developerResources.map((r) => r.label);
    expect(labels).toContain("GitHub");
    expect(labels).toContain("llms.txt");
    expect(labels).toContain("Sitemap");
  });
});
