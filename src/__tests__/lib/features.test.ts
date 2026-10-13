import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("gallery feature flag", () => {
  it.each([undefined, "false", "true"])(
    "gates routes and discovery for %s",
    async (value) => {
      vi.stubEnv("NEXT_PUBLIC_GALLERY_ENABLED", value);
      vi.resetModules();
      const enabled = value === "true";
      const { galleryEnabled } = await import("@/lib/features");
      const { default: page } = await import("@/app/gallery/page");
      const { default: sitemap } = await import("@/app/sitemap");
      const { getHomeMarkdown, getAboutMarkdown } =
        await import("@/lib/markdown/pages");
      expect(galleryEnabled).toBe(enabled);
      expect(sitemap().some(({ url }) => url.endsWith("/gallery"))).toBe(
        enabled
      );
      expect(getHomeMarkdown().includes("/gallery")).toBe(enabled);
      expect(getAboutMarkdown().includes("/gallery")).toBe(enabled);
      if (enabled) expect(page()).toBeTruthy();
      else {
        expect(page).toThrow("NEXT_NOT_FOUND");
        const { GET } = await import("@/app/api/vsco/route");
        const { NextRequest } = await import("next/server");
        expect(
          (await GET(new NextRequest("https://example.com/api/vsco"))).status
        ).toBe(404);
      }
    }
  );
});
