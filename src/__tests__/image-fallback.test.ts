import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  beforeAll,
  afterAll,
} from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

// Mock the local manifest
const mockLocalManifest = {
  generated_at: "2024-01-15T10:30:00.000Z",
  version: "1.0.0",
  source_manifest: "2024-01-15T09:00:00.000Z",
  images: {
    ZV_64LdGoao: {
      local_path: "/images/unsplash/ZV_64LdGoao.jpg",
      original_url: "https://images.unsplash.com/photo-123-regular",
      author: "John Doe",
      downloaded_at: "2024-01-15T10:30:15.000Z",
    },
    NZYgKwRA4Cg: {
      local_path: "/images/unsplash/NZYgKwRA4Cg.jpg",
      original_url: "https://plus.unsplash.com/premium-photo-456",
      author: "Jane Smith",
      downloaded_at: "2024-01-15T10:30:20.000Z",
    },
    SkippedPhto: {
      local_path: "",
      original_url: "https://images.unsplash.com/photo-skipped",
      author: "Skip Author",
      downloaded_at: "2024-01-15T10:30:25.000Z",
      skipped: true,
      reason: "Download failed",
    },
  },
  stats: {
    total_images: 3,
    downloaded: 2,
    failed: 1,
    skipped: 0,
  },
};

// MSW server setup
const server = setupServer(
  // Mock successful local manifest fetch
  http.get("/images/unsplash/local-manifest.json", () => {
    return HttpResponse.json(mockLocalManifest);
  }),

  // Mock manifest not found (404)
  http.get("/images/unsplash/local-manifest-404.json", () => {
    return new HttpResponse(null, { status: 404 });
  }),

  // Mock network error for manifest
  http.get("/images/unsplash/local-manifest-error.json", () => {
    return HttpResponse.error();
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());

// Reset the local manifest cache between tests
beforeEach(() => {
  // Clear the module-level cache first
  vi.resetModules();

  // Reset global fetch
  global.fetch = vi.fn();
});

describe("Image Fallback Utilities", () => {
  describe("extractUnsplashPhotoId", () => {
    it("should extract ID from page URL with slug", async () => {
      const { extractUnsplashPhotoId } = await import("@/lib/image-fallback");
      const testCases = [
        {
          url: "https://unsplash.com/photos/beautiful-sunset-ZV_64LdGoao",
          expected: "ZV_64LdGoao",
        },
        {
          url: "https://unsplash.com/photos/mountain-landscape-NZYgKwRA4Cg",
          expected: "NZYgKwRA4Cg",
        },
        {
          url: "https://unsplash.com/photos/ocean-waves-842ofHC6MaI",
          expected: "842ofHC6MaI",
        },
      ];

      testCases.forEach(({ url, expected }) => {
        expect(extractUnsplashPhotoId(url)).toBe(expected);
      });
    });

    it("should extract ID from simple page URL", async () => {
      const { extractUnsplashPhotoId } = await import("@/lib/image-fallback");
      const testCases = [
        {
          url: "https://unsplash.com/photos/ZV_64LdGoao",
          expected: "ZV_64LdGoao",
        },
        {
          url: "https://unsplash.com/photos/NZYgKwRA4Cg",
          expected: "NZYgKwRA4Cg",
        },
      ];

      testCases.forEach(({ url, expected }) => {
        expect(extractUnsplashPhotoId(url)).toBe(expected);
      });
    });

    it("should extract ID from URL with query parameters", async () => {
      const { extractUnsplashPhotoId } = await import("@/lib/image-fallback");
      const url =
        "https://unsplash.com/photos/sunset-ZV_64LdGoao?utm_source=test&utm_medium=referral";
      expect(extractUnsplashPhotoId(url)).toBe("ZV_64LdGoao");
    });

    it("should extract ID from URL with fragment", async () => {
      const { extractUnsplashPhotoId } = await import("@/lib/image-fallback");
      const url =
        "https://unsplash.com/photos/sunset-ZV_64LdGoao#image-section";
      expect(extractUnsplashPhotoId(url)).toBe("ZV_64LdGoao");
    });

    it("should handle URLs with trailing punctuation", async () => {
      const { extractUnsplashPhotoId } = await import("@/lib/image-fallback");
      const testCases = [
        'https://unsplash.com/photos/sunset-ZV_64LdGoao\"',
        "https://unsplash.com/photos/sunset-ZV_64LdGoao.",
        "https://unsplash.com/photos/sunset-ZV_64LdGoao,",
        "https://unsplash.com/photos/sunset-ZV_64LdGoao!",
      ];

      testCases.forEach((url) => {
        expect(extractUnsplashPhotoId(url)).toBe("ZV_64LdGoao");
      });
    });

    it("should return null for invalid URLs", async () => {
      const { extractUnsplashPhotoId } = await import("@/lib/image-fallback");
      const invalidUrls = [
        "https://example.com/photo",
        "not-a-url",
        "",
        null,
        undefined,
        "https://unsplash.com/collections/123",
        "https://unsplash.com/photos/",
        "https://unsplash.com/search?query=test",
        "https://pixabay.com/photos/nature-123",
      ];

      invalidUrls.forEach((url) => {
        expect(extractUnsplashPhotoId(url as any)).toBeNull();
      });
    });

    it("should return null for URLs without valid photo ID format", async () => {
      const { extractUnsplashPhotoId } = await import("@/lib/image-fallback");
      const invalidPhotoIds = [
        "https://unsplash.com/photos/short", // Too short
        "https://unsplash.com/photos/toolongforphotoid12345", // Too long
        "https://unsplash.com/photos/invalid-id", // Wrong format
        "https://unsplash.com/photos/hotoid12345", // Wrong format (not 11 chars)
      ];

      invalidPhotoIds.forEach((url) => {
        expect(extractUnsplashPhotoId(url)).toBeNull();
      });
    });
  });

  describe("getOptimizedImageSrc", () => {
    beforeEach(() => {
      // Reset fetch mock
      global.fetch = vi.fn();
    });

    it("should return local path when image is available locally", async () => {
      const { getOptimizedImageSrc } = await import("@/lib/image-fallback");
      // Mock successful manifest fetch
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockLocalManifest),
      });

      const url = "https://unsplash.com/photos/test-photo-ZV_64LdGoao";
      const result = await getOptimizedImageSrc(url);

      expect(result).toBe("/images/unsplash/ZV_64LdGoao.jpg");
    });

    it("should return fallback URL when image is not available locally", async () => {
      const { getOptimizedImageSrc } = await import("@/lib/image-fallback");
      // Mock successful manifest fetch
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockLocalManifest),
      });

      const url = "https://unsplash.com/photos/not-cached-photo-ABC123def456";
      const fallbackUrl = "https://api.example.com/image/ABC123def456";
      const result = await getOptimizedImageSrc(url, fallbackUrl);

      expect(result).toBe(fallbackUrl);
    });

    it("should return original URL when no fallback is provided", async () => {
      const { getOptimizedImageSrc } = await import("@/lib/image-fallback");
      // Mock successful manifest fetch
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockLocalManifest),
      });

      const url = "https://unsplash.com/photos/not-cached-ABC123def456";
      const result = await getOptimizedImageSrc(url);

      expect(result).toBe(url);
    });

    it("should return fallback when photo ID cannot be extracted", async () => {
      const { getOptimizedImageSrc } = await import("@/lib/image-fallback");
      const invalidUrl = "https://example.com/invalid-url";
      const fallbackUrl = "https://fallback.example.com/image.jpg";

      const result = await getOptimizedImageSrc(invalidUrl, fallbackUrl);

      expect(result).toBe(fallbackUrl);
    });

    it("should return original URL when photo ID cannot be extracted and no fallback", async () => {
      const { getOptimizedImageSrc } = await import("@/lib/image-fallback");
      const invalidUrl = "https://example.com/invalid-url";

      const result = await getOptimizedImageSrc(invalidUrl);

      expect(result).toBe(invalidUrl);
    });

    it("should handle manifest fetch errors gracefully", async () => {
      const { getOptimizedImageSrc } = await import("@/lib/image-fallback");
      // Mock fetch error
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

      const url = "https://unsplash.com/photos/test-ZV_64LdGoao";
      const fallbackUrl = "https://fallback.example.com/image.jpg";

      const result = await getOptimizedImageSrc(url, fallbackUrl);

      expect(result).toBe(fallbackUrl);
    });

    it("should handle 404 manifest responses", async () => {
      const { getOptimizedImageSrc } = await import("@/lib/image-fallback");
      // Mock 404 response
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });

      const consoleLogSpy = vi
        .spyOn(console, "log")
        .mockImplementation(() => {});

      const url = "https://unsplash.com/photos/test-ZV_64LdGoao";
      const fallbackUrl = "https://fallback.example.com/image.jpg";

      const result = await getOptimizedImageSrc(url, fallbackUrl);

      expect(result).toBe(fallbackUrl);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("Local image manifest not available")
      );

      consoleLogSpy.mockRestore();
    });
  });

  describe("getOptimizedImageSrcSync", () => {
    it("should return local path when image is available in static manifest", async () => {
      const { getOptimizedImageSrcSync } = await import("@/lib/image-fallback");
      const url = "https://unsplash.com/photos/test-photo-ZV_64LdGoao";
      const result = getOptimizedImageSrcSync(
        url,
        undefined,
        mockLocalManifest
      );

      expect(result).toBe("/images/unsplash/ZV_64LdGoao.jpg");
    });

    it("should return fallback URL when image is not in static manifest", async () => {
      const { getOptimizedImageSrcSync } = await import("@/lib/image-fallback");
      const url = "https://unsplash.com/photos/not-cached-ABC123def456";
      const fallbackUrl = "https://api.example.com/image/ABC123def456";
      const result = getOptimizedImageSrcSync(
        url,
        fallbackUrl,
        mockLocalManifest
      );

      expect(result).toBe(fallbackUrl);
    });

    it("should return fallback when no static manifest is provided", async () => {
      const { getOptimizedImageSrcSync } = await import("@/lib/image-fallback");
      const url = "https://unsplash.com/photos/test-ZV_64LdGoao";
      const fallbackUrl = "https://fallback.example.com/image.jpg";
      const result = getOptimizedImageSrcSync(url, fallbackUrl);

      expect(result).toBe(fallbackUrl);
    });

    it("should return original URL when no fallback and no manifest", async () => {
      const { getOptimizedImageSrcSync } = await import("@/lib/image-fallback");
      const url = "https://unsplash.com/photos/test-ZV_64LdGoao";
      const result = getOptimizedImageSrcSync(url);

      expect(result).toBe(url);
    });
  });

  describe("getImageMetadata", () => {
    beforeEach(() => {
      global.fetch = vi.fn();
    });

    it("should return metadata when image is available locally", async () => {
      const { getImageMetadata } = await import("@/lib/image-fallback");
      // Mock successful manifest fetch
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockLocalManifest),
      });

      const url = "https://unsplash.com/photos/test-photo-ZV_64LdGoao";
      const metadata = await getImageMetadata(url);

      expect(metadata).toEqual({
        photoId: "ZV_64LdGoao",
        localPath: "/images/unsplash/ZV_64LdGoao.jpg",
        author: "John Doe",
        isLocal: true,
      });
    });

    it("should return metadata without local info when image is not cached", async () => {
      const { getImageMetadata } = await import("@/lib/image-fallback");
      // Mock successful manifest fetch
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockLocalManifest),
      });

      const url = "https://unsplash.com/photos/not-cached-BC123def456";
      const metadata = await getImageMetadata(url);

      expect(metadata).toEqual({
        photoId: "BC123def456",
        localPath: null,
        author: null,
        isLocal: false,
      });
    });

    it("should return null when photo ID cannot be extracted", async () => {
      const { getImageMetadata } = await import("@/lib/image-fallback");
      const invalidUrl = "https://example.com/invalid-url";
      const metadata = await getImageMetadata(invalidUrl);

      expect(metadata).toBeNull();
    });

    it("should handle manifest fetch errors", async () => {
      const { getImageMetadata } = await import("@/lib/image-fallback");
      // Mock fetch error
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

      const url = "https://unsplash.com/photos/test-ZV_64LdGoao";
      const metadata = await getImageMetadata(url);

      expect(metadata).toEqual({
        photoId: "ZV_64LdGoao",
        localPath: null,
        author: null,
        isLocal: false,
      });
    });

    it("should handle skipped images correctly", async () => {
      const { getImageMetadata } = await import("@/lib/image-fallback");
      // Mock successful manifest fetch
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockLocalManifest),
      });

      const url = "https://unsplash.com/photos/test-SkippedPhto";
      const metadata = await getImageMetadata(url);

      expect(metadata).toEqual({
        photoId: "SkippedPhto",
        localPath: null, // Empty string treated as null for skipped images
        author: "Skip Author", // Author info is still available even for skipped images
        isLocal: false,
      });
    });
  });

  describe("isImageLocal", () => {
    beforeEach(() => {
      global.fetch = vi.fn();
    });

    it("should return true when image is available locally", async () => {
      const { isImageLocal } = await import("@/lib/image-fallback");
      // Mock successful manifest fetch
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockLocalManifest),
      });

      const url = "https://unsplash.com/photos/test-photo-ZV_64LdGoao";
      const isLocal = await isImageLocal(url);

      expect(isLocal).toBe(true);
    });

    it("should return false when image is not available locally", async () => {
      const { isImageLocal } = await import("@/lib/image-fallback");
      // Mock successful manifest fetch
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockLocalManifest),
      });

      const url = "https://unsplash.com/photos/not-cached-ABC123def456";
      const isLocal = await isImageLocal(url);

      expect(isLocal).toBe(false);
    });

    it("should return false for invalid URLs", async () => {
      const { isImageLocal } = await import("@/lib/image-fallback");
      const invalidUrl = "https://example.com/invalid-url";
      const isLocal = await isImageLocal(invalidUrl);

      expect(isLocal).toBe(false);
    });

    it("should return false when manifest cannot be loaded", async () => {
      const { isImageLocal } = await import("@/lib/image-fallback");
      // Mock fetch error
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

      const url = "https://unsplash.com/photos/test-ZV_64LdGoao";
      const isLocal = await isImageLocal(url);

      expect(isLocal).toBe(false);
    });
  });

  describe("Manifest caching", () => {
    beforeEach(() => {
      global.fetch = vi.fn();
    });

    it("should cache manifest and not fetch multiple times", async () => {
      // Reset modules to clear cache
      vi.resetModules();
      const { getOptimizedImageSrc, isImageLocal } = await import(
        "@/lib/image-fallback"
      );

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockLocalManifest),
      });
      global.fetch = mockFetch;

      const url1 = "https://unsplash.com/photos/test1-ZV_64LdGoao";
      const url2 = "https://unsplash.com/photos/test2-NZYgKwRA4Cg";

      // Make multiple calls
      await getOptimizedImageSrc(url1);
      await getOptimizedImageSrc(url2);
      await isImageLocal(url1);

      // Should only fetch manifest once due to caching
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        "/images/unsplash/local-manifest.json"
      );
    });

    it("should handle concurrent manifest requests", async () => {
      // Reset modules to clear cache
      vi.resetModules();
      const { getOptimizedImageSrc } = await import("@/lib/image-fallback");

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockLocalManifest),
      });
      global.fetch = mockFetch;

      const url1 = "https://unsplash.com/photos/test1-ZV_64LdGoao";
      const url2 = "https://unsplash.com/photos/test2-NZYgKwRA4Cg";

      // Make concurrent calls
      const [result1, result2] = await Promise.all([
        getOptimizedImageSrc(url1),
        getOptimizedImageSrc(url2),
      ]);

      expect(result1).toBe("/images/unsplash/ZV_64LdGoao.jpg");
      expect(result2).toBe("/images/unsplash/NZYgKwRA4Cg.jpg");

      // Should only fetch manifest once even with concurrent requests
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
