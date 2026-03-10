import { describe, it, expect } from "vitest";
import {
  LAYOUT,
  COLORS,
  TYPOGRAPHY,
  HEADER_TEXT,
  SPACING,
  FLEX,
  DEFAULTS,
} from "@/app/api/og/constants";

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

describe("COLORS", () => {
  it("has gradient backgrounds", () => {
    expect(COLORS.gradient.background.homepage).toBeTruthy();
    expect(COLORS.gradient.background.default).toBeTruthy();
  });

  it("has text colors for both themes", () => {
    expect(COLORS.text.primary).toBeTruthy();
    expect(COLORS.text.primaryLight).toBeTruthy();
  });
});

describe("TYPOGRAPHY", () => {
  it("has dark and light themes", () => {
    expect(TYPOGRAPHY.dark).toBeDefined();
    expect(TYPOGRAPHY.light).toBeDefined();
  });

  it("each theme has all style keys", () => {
    for (const theme of [TYPOGRAPHY.dark, TYPOGRAPHY.light]) {
      expect(theme.header).toBeDefined();
      expect(theme.titleHomepage).toBeDefined();
      expect(theme.titleDefault).toBeDefined();
      expect(theme.description).toBeDefined();
    }
  });
});

describe("HEADER_TEXT", () => {
  it("maps all OG types", () => {
    expect(HEADER_TEXT.homepage).toBe("Software Engineer");
    expect(HEADER_TEXT.note).toBe("Note");
    expect(HEADER_TEXT.notes).toBe("Notes");
  });
});

describe("SPACING", () => {
  it("has container padding values", () => {
    expect(SPACING.containerPadding.homepage).toBeTruthy();
    expect(SPACING.containerPadding.default).toBeTruthy();
  });
});

describe("FLEX", () => {
  it("has text and image flex values", () => {
    expect(FLEX.textFlex.withImage).toBeTruthy();
    expect(FLEX.textFlex.withoutImage).toBeTruthy();
    expect(FLEX.imageFlex).toBeTruthy();
  });
});

describe("DEFAULTS", () => {
  it("has correct defaults", () => {
    expect(DEFAULTS.title).toBe("Nicholas Adamou");
    expect(DEFAULTS.type).toBe("note");
    expect(DEFAULTS.theme).toBe("dark");
  });
});
