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
    upload_date: 1704931200000, // 2024-01-11
    height: 2048,
    width: 1536,
    file_name: "photo1.jpg",
    responsive_url: "im.vsco.co/aws-us-west-2/abc/123/photo1.jpg",
    is_video: false,
    perma_subdomain: "nicholasadamou",
    share_link: "http://vsco.co/nicholasadamou/media/abc123",
  },
  {
    id: "def456",
    capture_date: 1704412800000, // 2024-01-05
    upload_date: 1704499200000, // 2024-01-06
    height: 1800,
    width: 1200,
    file_name: "photo2.jpg",
    responsive_url: "im.vsco.co/aws-us-west-2/abc/456/photo2.jpg",
    is_video: false,
    perma_subdomain: "nicholasadamou",
    share_link: "http://vsco.co/nicholasadamou/media/def456",
  },
  {
    id: "dup789",
    capture_date: 1704326400000, // 2024-01-04 (duplicate file_name)
    upload_date: 1704672000000, // 2024-01-08
    height: 2048,
    width: 1536,
    file_name: "photo1.jpg",
    responsive_url: "im.vsco.co/aws-us-west-2/abc/789/photo1_dup.jpg",
    is_video: false,
    perma_subdomain: "nicholasadamou",
    share_link: "http://vsco.co/nicholasadamou/media/dup789",
  },
  {
    id: "vid001",
    capture_date: 1704240000000,
    upload_date: 1704240000000,
    height: 1920,
    width: 1080,
    file_name: "video.mp4",
    responsive_url: "",
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

    expect(result.images.length).toBe(3); // 3 unique ids (no video)
    expect(result.totalCount).toBe(3);
    expect(result.source).toBe("vsco-export");
  });

  it("sorts by upload date (most recent first)", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(EXPORT_DATA));

    const { getLocalVscoImages } = await import("@/lib/vsco-local");
    const result = getLocalVscoImages();

    expect(result.images[0]?.id).toBe("abc123"); // uploaded Jan 11
    expect(result.images[1]?.id).toBe("dup789"); // uploaded Jan 8
    expect(result.images[2]?.id).toBe("def456"); // uploaded Jan 6
  });

  it("supports pagination with limit and offset", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(EXPORT_DATA));

    const { getLocalVscoImages } = await import("@/lib/vsco-local");
    const result = getLocalVscoImages(2, 0);

    expect(result.images).toHaveLength(2);
    expect(result.hasMore).toBe(true);
  });

  it("constructs correct image URLs", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(EXPORT_DATA));

    const { getLocalVscoImages } = await import("@/lib/vsco-local");
    const result = getLocalVscoImages();

    expect(result.images[0]?.url).toBe(
      "https://im.vsco.co/aws-us-west-2/abc/123/photo1.jpg"
    );
    expect(result.images[1]?.url).toBe(
      "https://im.vsco.co/aws-us-west-2/abc/789/photo1_dup.jpg"
    );
    expect(result.images[2]?.url).toBe(
      "https://im.vsco.co/aws-us-west-2/abc/456/photo2.jpg"
    );
  });

  it("deduplicates entries with the same id", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    const dataWithDuplicateId = [
      ...EXPORT_DATA,
      { ...EXPORT_DATA[0], file_name: "different.jpg" }, // same id, different file_name
    ];
    vi.mocked(fs.readFileSync).mockReturnValue(
      JSON.stringify(dataWithDuplicateId)
    );

    const { getLocalVscoImages } = await import("@/lib/vsco-local");
    const result = getLocalVscoImages();

    // abc123 appears twice but should only show once
    const abc123s = result.images.filter((i) => i.id === "abc123");
    expect(abc123s).toHaveLength(1);
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
