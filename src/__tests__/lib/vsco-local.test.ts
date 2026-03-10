import { describe, it, expect, vi, beforeEach } from "vitest";

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
  },
  join: (...args: string[]) => args.join("/"),
}));

import fs from "fs";

const EXPORT_DATA = [
  {
    id: "abc123",
    capture_date: 1704844800000, // 2024-01-10
    height: 2048,
    width: 1536,
    file_name: "photo1.jpg",
    is_video: false,
    perma_subdomain: "nicholasadamou",
    share_link: "http://vsco.co/nicholasadamou/media/abc123",
  },
  {
    id: "def456",
    capture_date: 1704412800000, // 2024-01-05
    height: 1800,
    width: 1200,
    file_name: "photo2.jpg",
    is_video: false,
    perma_subdomain: "nicholasadamou",
    share_link: "http://vsco.co/nicholasadamou/media/def456",
  },
  {
    id: "dup789",
    capture_date: 1704326400000, // 2024-01-04 (duplicate file_name)
    height: 2048,
    width: 1536,
    file_name: "photo1.jpg",
    is_video: false,
    perma_subdomain: "nicholasadamou",
    share_link: "http://vsco.co/nicholasadamou/media/dup789",
  },
  {
    id: "vid001",
    capture_date: 1704240000000,
    height: 1920,
    width: 1080,
    file_name: "video.mp4",
    is_video: true,
    perma_subdomain: "nicholasadamou",
    share_link: "http://vsco.co/nicholasadamou/media/vid001",
  },
];

describe("getLocalVscoImages", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("returns error response when no export exists", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);

    const { getLocalVscoImages } = await import("@/lib/vsco-local");
    const result = getLocalVscoImages();

    expect(result.images).toEqual([]);
    expect(result.hasMore).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("parses export and returns images", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(EXPORT_DATA));

    const { getLocalVscoImages } = await import("@/lib/vsco-local");
    const result = getLocalVscoImages();

    expect(result.images.length).toBe(2); // 2 unique files (deduped + no video)
    expect(result.totalCount).toBe(2);
    expect(result.source).toBe("vsco-export");
  });

  it("sorts by capture date (most recent first)", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(EXPORT_DATA));

    const { getLocalVscoImages } = await import("@/lib/vsco-local");
    const result = getLocalVscoImages();

    expect(result.images[0]?.id).toBe("abc123"); // Jan 10
    expect(result.images[1]?.id).toBe("def456"); // Jan 5
  });

  it("supports pagination with limit and offset", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(EXPORT_DATA));

    const { getLocalVscoImages } = await import("@/lib/vsco-local");
    const result = getLocalVscoImages(1, 0);

    expect(result.images).toHaveLength(1);
    expect(result.hasMore).toBe(true);
  });

  it("constructs correct image URLs", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(EXPORT_DATA));

    const { getLocalVscoImages } = await import("@/lib/vsco-local");
    const result = getLocalVscoImages();

    expect(result.images[0]?.url).toBe("/images/vsco/photo1.jpg");
    expect(result.images[1]?.url).toBe("/images/vsco/photo2.jpg");
  });

  it("deduplicates entries with the same file_name", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(EXPORT_DATA));

    const { getLocalVscoImages } = await import("@/lib/vsco-local");
    const result = getLocalVscoImages();

    // photo1.jpg appears twice in EXPORT_DATA but should only show once
    const photo1s = result.images.filter(
      (i) => i.url === "/images/vsco/photo1.jpg"
    );
    expect(photo1s).toHaveLength(1);
    expect(photo1s[0]?.id).toBe("abc123"); // keeps first occurrence
  });

  it("filters out videos", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(EXPORT_DATA));

    const { getLocalVscoImages } = await import("@/lib/vsco-local");
    const result = getLocalVscoImages();

    const video = result.images.find((i) => i.id === "vid001");
    expect(video).toBeUndefined();
  });
});

describe("hasLocalVscoImages", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("returns false when no export exists", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);

    const { hasLocalVscoImages } = await import("@/lib/vsco-local");
    expect(hasLocalVscoImages()).toBe(false);
  });

  it("returns true when valid export exists", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(EXPORT_DATA));

    const { hasLocalVscoImages } = await import("@/lib/vsco-local");
    expect(hasLocalVscoImages()).toBe(true);
  });
});
