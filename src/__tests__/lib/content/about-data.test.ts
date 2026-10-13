import { describe, it, expect } from "vitest";
import { developerResources, workplaces } from "@/lib/content/about-data";

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

it("records the Onebrief promotion without changing the previous title", () => {
  expect(workplaces.slice(0, 2)).toMatchObject([
    {
      title: "Senior Outcome Engineer",
      company: "Onebrief",
      date: "Oct 2026 – Present",
    },
    {
      title: "Senior Software Engineer",
      company: "Onebrief",
      date: "Feb 2026 – Oct 2026",
    },
  ]);
});
