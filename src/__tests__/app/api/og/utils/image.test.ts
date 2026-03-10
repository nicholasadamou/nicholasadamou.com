import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("fs", () => ({
  default: { readFileSync: vi.fn() },
  readFileSync: vi.fn(),
}));

vi.mock("path", () => ({
  default: { join: (...args: string[]) => args.join("/") },
  join: (...args: string[]) => args.join("/"),
}));

import fs from "fs";
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
    vi.clearAllMocks();
    vi.mocked(global.fetch).mockReset();
  });

  it("reads local file and returns base64", async () => {
    const buffer = Buffer.from("test-image");
    vi.mocked(fs.readFileSync).mockReturnValue(buffer);

    const result = await fetchImageAsBase64("/images/photo.jpg", true);
    expect(result).toContain("data:image/jpeg;base64,");
  });

  it("detects png content type for local files", async () => {
    const buffer = Buffer.from("test-png");
    vi.mocked(fs.readFileSync).mockReturnValue(buffer);

    const result = await fetchImageAsBase64("/images/photo.png", true);
    expect(result).toContain("data:image/png;base64,");
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
