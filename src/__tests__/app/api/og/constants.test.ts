import { describe, it, expect } from "vitest";
import { LAYOUT, HEADER_TEXT, DEFAULTS } from "@/app/api/og/constants";

describe("LAYOUT", () => {
  it("has correct container dimensions", () => {
    expect(LAYOUT.container.width).toBe(1200);
    expect(LAYOUT.container.height).toBe(630);
  });

  it("has image dimensions", () => {
    expect(LAYOUT.image.width).toBeGreaterThan(0);
    expect(LAYOUT.image.height).toBeGreaterThan(0);
  });
});

describe("HEADER_TEXT", () => {
  it("maps all OG types", () => {
    expect(HEADER_TEXT.homepage).toBe("Senior outcome engineer");
    expect(HEADER_TEXT.note).toBe("Note");
    expect(HEADER_TEXT.notes).toBe("Notes");
  });
});

describe("DEFAULTS", () => {
  it("has correct defaults", () => {
    expect(DEFAULTS.title).toBe("Nicholas Adamou");
    expect(DEFAULTS.type).toBe("note");
    expect(DEFAULTS.theme).toBe("dark");
  });
});
