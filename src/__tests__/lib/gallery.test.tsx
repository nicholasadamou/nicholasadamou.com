import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/vsco/route";
import Home from "@/app/page";
import GalleryPage from "@/app/gallery/page";
import sitemap from "@/app/sitemap";
import { getLocalVscoImages } from "@/lib/vsco-local";
import { getHomeMarkdown, getAboutMarkdown } from "@/lib/markdown/pages";

describe("local gallery", () => {
  it("is always available in pages, discovery, and Markdown", () => {
    expect(GalleryPage()).toBeTruthy();
    expect(sitemap().some(({ url }) => url.endsWith("/gallery"))).toBe(true);
    expect(getHomeMarkdown()).toContain("/gallery");
    expect(getAboutMarkdown()).toContain("## Photography");
  });
  it("has a local photo for every gallery entry", () => {
    const { images } = getLocalVscoImages();
    expect(images.length).toBeGreaterThan(4);
    for (const image of images)
      expect(existsSync(`public${image.url}`)).toBe(true);
  });
  it("passes the newest four gallery entries to the homepage", () => {
    expect(Home().props.children.at(-1).props.photos).toEqual(
      getLocalVscoImages(4).images
    );
  });
  it("returns the requested page size after a smaller request", async () => {
    for (const limit of [4, 12]) {
      const response = await GET(
        new NextRequest(`https://example.com/api/vsco?limit=${limit}`)
      );
      expect(response.status).toBe(200);
      expect((await response.json()).images).toHaveLength(limit);
    }
  });
});
