import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fs and path before importing module
vi.mock("fs", () => ({
  default: {
    readFileSync: vi.fn(),
    existsSync: vi.fn(),
  },
  readFileSync: vi.fn(),
  existsSync: vi.fn(),
}));

vi.mock("path", () => ({
  default: {
    join: (...args: string[]) => args.join("/"),
    basename: (p: string, ext: string) => p.replace(ext, "").split("/").pop()!,
  },
  join: (...args: string[]) => args.join("/"),
  basename: (p: string, ext: string) => p.replace(ext, "").split("/").pop()!,
}));

import fs from "fs";
import { extractPhotoId } from "@/lib/image/unsplash";

describe("extractPhotoId", () => {
  it("returns null for empty string", () => {
    expect(extractPhotoId("")).toBeNull();
  });

  it("extracts bare 11-char ID", () => {
    expect(extractPhotoId("Am6pBe2FpJw")).toBe("Am6pBe2FpJw");
  });

  it("extracts from unsplash.com/photos/ slug URL", () => {
    expect(
      extractPhotoId("https://unsplash.com/photos/diagram-Am6pBe2FpJw")
    ).toBe("Am6pBe2FpJw");
  });

  it("extracts from images.unsplash.com URL", () => {
    expect(
      extractPhotoId("https://images.unsplash.com/photo-Am6pBe2FpJw?ixlib=rb")
    ).toBe("Am6pBe2FpJw");
  });

  it("extracts trailing ID from non-URL string", () => {
    expect(extractPhotoId("some-prefix-Am6pBe2FpJw")).toBe("Am6pBe2FpJw");
  });

  it("returns null for unrecognized hostname", () => {
    expect(extractPhotoId("https://example.com/photos/short")).toBeNull();
  });
});

describe("resolveImageUrl", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("returns null for invalid photo ID", async () => {
    const { resolveImageUrl } = await import("@/lib/image/unsplash");
    expect(resolveImageUrl("")).toBeNull();
  });

  it("returns local path from manifest", async () => {
    const manifest = {
      images: {
        Am6pBe2FpJw: { local_path: "/images/unsplash/Am6pBe2FpJw.jpg" },
      },
    };
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(manifest));

    const { resolveImageUrl } = await import("@/lib/image/unsplash");
    const result = resolveImageUrl("Am6pBe2FpJw");
    expect(result).toBe("/images/unsplash/Am6pBe2FpJw.jpg");
  });

  it("falls back to fs check when not in manifest", async () => {
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({ images: {} }));
    vi.mocked(fs.existsSync).mockReturnValue(true);

    const { resolveImageUrl } = await import("@/lib/image/unsplash");
    const result = resolveImageUrl("Am6pBe2FpJw");
    expect(result).toBe("/images/unsplash/Am6pBe2FpJw.jpg");
  });

  it("returns null when no local image exists", async () => {
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({ images: {} }));
    vi.mocked(fs.existsSync).mockReturnValue(false);

    const { resolveImageUrl } = await import("@/lib/image/unsplash");
    const result = resolveImageUrl("Am6pBe2FpJw");
    expect(result).toBeNull();
  });
});

describe("getAttribution", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("returns null for invalid photo ID", async () => {
    const { getAttribution } = await import("@/lib/image/unsplash");
    expect(getAttribution("")).toBeNull();
  });

  it("returns attribution when manifest has data", async () => {
    const manifest = {
      images: {
        Am6pBe2FpJw: {
          local_path: "/images/unsplash/Am6pBe2FpJw.jpg",
          author: "John Doe",
          author_url: "https://unsplash.com/@johndoe",
        },
      },
    };
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(manifest));

    const { getAttribution } = await import("@/lib/image/unsplash");
    const result = getAttribution("Am6pBe2FpJw");
    expect(result).toEqual({
      author: "John Doe",
      authorUrl:
        "https://unsplash.com/@johndoe?utm_source=nicholasadamou.com&utm_medium=referral",
    });
  });

  it("returns null when entry lacks author", async () => {
    const manifest = {
      images: {
        Am6pBe2FpJw: { local_path: "/images/unsplash/Am6pBe2FpJw.jpg" },
      },
    };
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(manifest));

    const { getAttribution } = await import("@/lib/image/unsplash");
    expect(getAttribution("Am6pBe2FpJw")).toBeNull();
  });
});
