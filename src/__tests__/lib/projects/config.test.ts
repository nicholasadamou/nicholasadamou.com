import { describe, it, expect } from "vitest";
import { projects } from "@/lib/projects/config";

describe("projects config", () => {
  it("exports a non-empty array", () => {
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
  });

  it("every project has required fields", () => {
    for (const p of projects) {
      expect(p.name).toBeTruthy();
      expect(p.href).toBeTruthy();
      expect(p.description).toBeTruthy();
      expect(p.icon).toBeDefined();
      expect(p.icon.kind).toMatch(/^(image|emoji|component)$/);
    }
  });

  it("featured projects exist", () => {
    const featured = projects.filter((p) => p.featured);
    expect(featured.length).toBeGreaterThan(0);
  });

  it("all icon kinds are valid", () => {
    for (const p of projects) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (p.icon.kind === "image") expect((p.icon as any).src).toBeTruthy();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (p.icon.kind === "emoji") expect((p.icon as any).emoji).toBeTruthy();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (p.icon.kind === "component") expect((p.icon as any).id).toBeTruthy();
    }
  });

  it("tags are arrays of strings when present", () => {
    for (const p of projects) {
      if (p.tags) {
        expect(Array.isArray(p.tags)).toBe(true);
        p.tags.forEach((t) => expect(typeof t).toBe("string"));
      }
    }
  });
});
