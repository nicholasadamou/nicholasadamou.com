import { describe, it, expect } from "vitest";
import {
  searchContent,
  listNotes,
  listProjects,
  getNote,
} from "@/lib/api/v1/content";

describe("v1 content helpers", () => {
  it("searches notes and projects", () => {
    const results = searchContent("a");
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty("type");
    expect(results[0]).toHaveProperty("url");
  });

  it("lists notes with absolute urls", () => {
    const notes = listNotes();
    expect(notes.length).toBeGreaterThan(0);
    expect(notes[0].url).toMatch(/^https?:\/\//);
    expect(notes[0].href).toMatch(/^\/notes\//);
  });

  it("returns null for unknown note slugs", () => {
    expect(getNote("this-slug-does-not-exist-xyz")).toBeNull();
  });

  it("lists projects", () => {
    const projects = listProjects();
    expect(projects.length).toBeGreaterThan(0);
    expect(projects[0]).toHaveProperty("name");
    expect(projects[0]).toHaveProperty("tags");
  });
});
