import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies used by params.ts
vi.mock("fs", () => ({
  default: { readFileSync: vi.fn() },
  readFileSync: vi.fn(),
}));
vi.mock("path", () => ({
  default: { join: (...args: string[]) => args.join("/") },
  join: (...args: string[]) => args.join("/"),
}));
vi.mock("@/app/api/og/avatar-data", () => ({
  AVATAR_BASE64: "data:image/png;base64,avatar",
}));

import {
  cleanSearchParams,
  extractOGParams,
  processOGParams,
} from "@/app/api/og/utils/params";
import { DEFAULTS } from "@/app/api/og/constants";

describe("cleanSearchParams", () => {
  it("removes amp; prefix from keys", () => {
    const params = new URLSearchParams();
    params.set("amp;title", "Hello");
    params.set("amp;type", "note");

    cleanSearchParams(params);

    expect(params.get("title")).toBe("Hello");
    expect(params.get("type")).toBe("note");
    expect(params.has("amp;title")).toBe(false);
  });

  it("does nothing when no amp; keys", () => {
    const params = new URLSearchParams();
    params.set("title", "Hello");

    cleanSearchParams(params);

    expect(params.get("title")).toBe("Hello");
  });
});

describe("extractOGParams", () => {
  it("extracts all params", () => {
    const params = new URLSearchParams({
      title: "My Title",
      description: "My Desc",
      type: "homepage",
      theme: "light",
      image: "/img.jpg",
    });

    const result = extractOGParams(params);

    expect(result.title).toBe("My Title");
    expect(result.description).toBe("My Desc");
    expect(result.type).toBe("homepage");
    expect(result.theme).toBe("light");
    expect(result.image).toBe("/img.jpg");
  });

  it("uses defaults for missing params", () => {
    const params = new URLSearchParams();
    const result = extractOGParams(params);

    expect(result.title).toBe(DEFAULTS.title);
    expect(result.type).toBe(DEFAULTS.type);
    expect(result.theme).toBe(DEFAULTS.theme);
    expect(result.description).toBeUndefined();
    expect(result.image).toBeUndefined();
  });

  it("falls back to default for invalid type", () => {
    const params = new URLSearchParams({ type: "invalid" });
    const result = extractOGParams(params);
    expect(result.type).toBe(DEFAULTS.type);
  });

  it("falls back to default for invalid theme", () => {
    const params = new URLSearchParams({ theme: "invalid" });
    const result = extractOGParams(params);
    expect(result.theme).toBe(DEFAULTS.theme);
  });
});

describe("processOGParams", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses embedded avatar for homepage without image", async () => {
    const result = await processOGParams({
      title: "Test",
      type: "homepage",
      theme: "dark",
    });

    expect(result.processedImage).toBe("data:image/png;base64,avatar");
    expect(result.headerText).toBe("Software Engineer");
  });

  it("sets headerText based on type", async () => {
    const note = await processOGParams({
      title: "T",
      type: "note",
      theme: "dark",
    });
    expect(note.headerText).toBe("Note");

    const notes = await processOGParams({
      title: "T",
      type: "notes",
      theme: "dark",
    });
    expect(notes.headerText).toBe("Notes");
  });

  it("returns undefined processedImage for note without image", async () => {
    const result = await processOGParams({
      title: "Test",
      type: "note",
      theme: "dark",
    });

    expect(result.processedImage).toBeUndefined();
  });

  it("skips invalid image paths", async () => {
    const result = await processOGParams({
      title: "Test",
      type: "note",
      theme: "dark",
      image: "/file.txt",
    });

    expect(result.processedImage).toBeUndefined();
  });

  it("uses VERCEL_URL when available", async () => {
    const original = process.env.VERCEL_URL;
    process.env.VERCEL_URL = "my-deploy.vercel.app";

    const result = await processOGParams({
      title: "Test",
      type: "note",
      theme: "dark",
    });

    expect(result.headerText).toBe("Note");
    process.env.VERCEL_URL = original;
  });
});
