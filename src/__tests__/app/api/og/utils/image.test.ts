import { describe, it, expect, vi, beforeEach } from "vitest";

import { isValidImagePath, fetchImageAsBase64 } from "@/app/api/og/utils/image";

describe("isValidImagePath", () => {
  it("returns false for undefined/empty", () => {
    expect(isValidImagePath()).toBe(false);
    expect(isValidImagePath("")).toBe(false);
    expect(isValidImagePath("   ")).toBe(false);
  });

  it("validates local file paths", () => {
    expect(isValidImagePath("/images/photo.jpg")).toBe(true);
    expect(isValidImagePath("/images/photo.png")).toBe(true);
    expect(isValidImagePath("/images/photo.webp")).toBe(true);
    expect(isValidImagePath("/images/photo.svg")).toBe(true);
    expect(isValidImagePath("/images/photo.txt")).toBe(false);
  });

  it("validates HTTP URLs with image extensions", () => {
    expect(isValidImagePath("https://example.com/photo.jpg")).toBe(true);
    expect(isValidImagePath("https://example.com/photo.png")).toBe(true);
    expect(isValidImagePath("https://example.com/photo.txt")).toBe(false);
  });

  it("rejects non-http protocols", () => {
    expect(isValidImagePath("ftp://example.com/photo.jpg")).toBe(false);
  });

  it("rejects URLs without hostname", () => {
    expect(isValidImagePath("http:///photo.jpg")).toBe(false);
  });
});

describe("fetchImageAsBase64", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
    vi.mocked(global.fetch).mockReset();
  });

  it("loads local assets from the deployment CDN", async () => {
    vi.mocked(global.fetch).mockResolvedValue(
      new Response("image", {
        headers: { "content-type": "image/webp" },
      })
    );
    const result = await fetchImageAsBase64(
      "https://site.test/images/photo.webp",
      true
    );
    expect(result).toBe(
      `data:image/webp;base64,${Buffer.from("image").toString("base64")}`
    );
    expect(global.fetch).toHaveBeenCalledWith(
      "https://site.test/images/photo.webp",
      expect.any(Object)
    );
  });

  it("does not embed deployment protection HTML as an image", async () => {
    vi.mocked(global.fetch).mockResolvedValue(
      new Response("login", {
        headers: { "content-type": "text/html" },
      })
    );
    expect(
      await fetchImageAsBase64("https://site.test/image.png", true)
    ).toBeNull();
  });

  it("fetches remote image and returns base64", async () => {
    const buffer = new ArrayBuffer(8);
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(buffer),
      headers: new Headers({ "content-type": "image/jpeg" }),
    } as Response);

    const result = await fetchImageAsBase64("https://example.com/photo.jpg");
    expect(result).toContain("data:image/jpeg;base64,");
  });

  it("only sends the preview bypass secret to this deployment's local assets", async () => {
    vi.stubEnv("VERCEL_URL", "preview.vercel.app");
    vi.stubEnv("VERCEL_AUTOMATION_BYPASS_SECRET", "test-bypass");
    vi.mocked(global.fetch).mockImplementation(
      async () =>
        new Response("image", {
          headers: { "content-type": "image/png" },
        })
    );
    await fetchImageAsBase64("https://preview.vercel.app/photo.png", true);
    expect(global.fetch).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: { "x-vercel-protection-bypass": "test-bypass" },
        redirect: "error",
      })
    );
    await fetchImageAsBase64("https://external.test/photo.png", true);
    expect(global.fetch).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({ headers: {} })
    );
    await fetchImageAsBase64("https://preview.vercel.app/photo.png");
    expect(global.fetch).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({ headers: {} })
    );
  });

  it("returns null on fetch failure", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
    } as Response);

    const result = await fetchImageAsBase64("https://example.com/photo.jpg");
    expect(result).toBeNull();
  });

  it("returns null on error", async () => {
    vi.mocked(global.fetch).mockRejectedValue(new Error("Network error"));
    const result = await fetchImageAsBase64("https://example.com/photo.jpg");
    expect(result).toBeNull();
  });
});
