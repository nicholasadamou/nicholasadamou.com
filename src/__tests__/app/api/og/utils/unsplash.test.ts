import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fs from "fs";
import {
  isUnsplashPhotoUrl,
  extractUnsplashPhotoId,
  loadUnsplashManifest,
  resolveUnsplashImage,
  getUnsplashImageMetadata,
} from "@/app/api/og/utils/unsplash";

// Mock fs.readFileSync
vi.mock("fs");
const mockReadFileSync = vi.mocked(fs.readFileSync);

const mockManifest = {
  generated_at: "2025-09-06T08:20:57.474Z",
  version: "2.0.0",
  images: {
    Am6pBe2FpJw: {
      local_path: "/../../public/images/unsplash/Am6pBe2FpJw.jpg",
      downloaded_at: "2025-09-06T08:20:57.475Z",
      author: "Growtika",
      author_url: "https://unsplash.com/@growtika",
      image_url:
        "https://images.unsplash.com/photo-1667984390538-3dea7a3fe33d?ixid=M3w3OTY0MTZ8MHwxfGFsbHx8fHx8fHx8fDE3NTcxNDY1NTJ8&ixlib=rb-4.1.0",
      size_bytes: 426013,
      width: 3840,
      height: 2160,
      description: "diagram",
      likes: 41,
      skipped: false,
      download_method: "playwright",
    },
    "4Mw7nkQDByk": {
      local_path: "/../../public/images/unsplash/4Mw7nkQDByk.jpg",
      downloaded_at: "2025-09-06T08:20:57.475Z",
      author: "Gabriel Heinzer",
      author_url: "https://unsplash.com/@6heinz3r",
      size_bytes: 1084121,
      width: 5184,
      height: 3888,
      description: "sudo stands for superuser do",
      skipped: true,
      download_method: "playwright",
    },
  },
};

describe("Unsplash Utility Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockReadFileSync.mockReturnValue(JSON.stringify(mockManifest));
  });

  describe("isUnsplashPhotoUrl", () => {
    it("should identify valid Unsplash photo URLs", () => {
      expect(
        isUnsplashPhotoUrl("https://unsplash.com/photos/Am6pBe2FpJw")
      ).toBe(true);
      expect(
        isUnsplashPhotoUrl("https://unsplash.com/photos/diagram-Am6pBe2FpJw")
      ).toBe(true);
    });

    it("should reject non-Unsplash URLs", () => {
      expect(isUnsplashPhotoUrl("https://example.com/photo.jpg")).toBe(false);
      expect(
        isUnsplashPhotoUrl("https://images.unsplash.com/photo-123.jpg")
      ).toBe(false);
      expect(
        isUnsplashPhotoUrl("https://unsplash.com/search/photos?query=nature")
      ).toBe(false);
    });

    it("should handle malformed URLs", () => {
      expect(isUnsplashPhotoUrl("not-a-url")).toBe(false);
      expect(isUnsplashPhotoUrl("")).toBe(false);
      expect(isUnsplashPhotoUrl("unsplash.com/photos/test")).toBe(false);
    });
  });

  describe("extractUnsplashPhotoId", () => {
    it("should extract photo IDs from simple URLs", () => {
      expect(
        extractUnsplashPhotoId("https://unsplash.com/photos/Am6pBe2FpJw")
      ).toBe("Am6pBe2FpJw");
      expect(
        extractUnsplashPhotoId("https://unsplash.com/photos/4Mw7nkQDByk")
      ).toBe("4Mw7nkQDByk");
    });

    it("should extract photo IDs from descriptive URLs", () => {
      expect(
        extractUnsplashPhotoId(
          "https://unsplash.com/photos/diagram-Am6pBe2FpJw"
        )
      ).toBe("Am6pBe2FpJw");
      expect(
        extractUnsplashPhotoId(
          "https://unsplash.com/photos/some-description-4Mw7nkQDByk"
        )
      ).toBe("4Mw7nkQDByk");
    });

    it("should return null for invalid URLs", () => {
      expect(
        extractUnsplashPhotoId("https://example.com/photo.jpg")
      ).toBeNull();
      expect(
        extractUnsplashPhotoId("https://unsplash.com/search/photos")
      ).toBeNull();
      expect(extractUnsplashPhotoId("not-a-url")).toBeNull();
    });
  });

  describe("loadUnsplashManifest", () => {
    it("should load and parse the manifest successfully", () => {
      const manifest = loadUnsplashManifest();
      expect(manifest).toEqual(mockManifest);
      expect(mockReadFileSync).toHaveBeenCalledWith(
        expect.stringContaining("public/images/unsplash/manifest.json"),
        "utf-8"
      );
    });

    it("should return null when manifest cannot be read", () => {
      mockReadFileSync.mockImplementation(() => {
        throw new Error("File not found");
      });

      const manifest = loadUnsplashManifest();
      expect(manifest).toBeNull();
    });

    it("should return null when manifest is invalid JSON", () => {
      mockReadFileSync.mockReturnValue("invalid json");

      const manifest = loadUnsplashManifest();
      expect(manifest).toBeNull();
    });
  });

  describe("resolveUnsplashImage", () => {
    it("should resolve to local path for available images", () => {
      const result = resolveUnsplashImage(
        "https://unsplash.com/photos/diagram-Am6pBe2FpJw"
      );
      expect(result).toBe("/images/unsplash/Am6pBe2FpJw.jpg");
    });

    it("should return null for skipped images", () => {
      const result = resolveUnsplashImage(
        "https://unsplash.com/photos/4Mw7nkQDByk"
      );
      expect(result).toBeNull();
    });

    it("should return null for non-existent images", () => {
      const result = resolveUnsplashImage(
        "https://unsplash.com/photos/nonexistent-id"
      );
      expect(result).toBeNull();
    });

    it("should return null for invalid URLs", () => {
      const result = resolveUnsplashImage("https://example.com/photo.jpg");
      expect(result).toBeNull();
    });

    it("should fall back to image_url when local_path is not available", () => {
      const manifestWithoutLocalPath = {
        ...mockManifest,
        images: {
          testId: {
            image_url: "https://images.unsplash.com/test-image.jpg",
            skipped: false,
          },
        },
      };

      mockReadFileSync.mockReturnValue(
        JSON.stringify(manifestWithoutLocalPath)
      );

      const result = resolveUnsplashImage("https://unsplash.com/photos/testId");
      expect(result).toBe("https://images.unsplash.com/test-image.jpg");
    });
  });

  describe("getUnsplashImageMetadata", () => {
    it("should return metadata for existing images", () => {
      const metadata = getUnsplashImageMetadata("Am6pBe2FpJw");
      expect(metadata).toEqual(mockManifest.images["Am6pBe2FpJw"]);
    });

    it("should return null for non-existent images", () => {
      const metadata = getUnsplashImageMetadata("nonexistent");
      expect(metadata).toBeNull();
    });

    it("should return null when manifest cannot be loaded", () => {
      mockReadFileSync.mockImplementation(() => {
        throw new Error("File not found");
      });

      const metadata = getUnsplashImageMetadata("Am6pBe2FpJw");
      expect(metadata).toBeNull();
    });
  });
});
