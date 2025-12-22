import { describe, it, expect, vi, beforeEach } from "vitest";
import { isValidImagePath, fetchImageAsBase64 } from "@/app/api/og/utils/image";
import * as unsplashUtils from "@/app/api/og/utils/unsplash";
import * as fs from "fs";

// Mock the unsplash utilities and fs
vi.mock("@/app/api/og/utils/unsplash");
vi.mock("fs");

const mockResolveUnsplashImage = vi.mocked(unsplashUtils.resolveUnsplashImage);
const mockIsUnsplashPhotoUrl = vi.mocked(unsplashUtils.isUnsplashPhotoUrl);

describe("Image Utility Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mocks
    mockIsUnsplashPhotoUrl.mockImplementation((url) =>
      url.includes("unsplash.com/photos/")
    );
    mockResolveUnsplashImage.mockImplementation((url) => {
      if (url.includes("valid-photo")) {
        return "/images/unsplash/valid-photo.jpg";
      }
      return null;
    });
  });
  describe("isValidImagePath", () => {
    describe("Valid Paths", () => {
      it("should validate local image paths with valid extensions", () => {
        const validPaths = [
          "/images/photo.jpg",
          "/assets/logo.png",
          "/uploads/avatar.gif",
          "/media/banner.webp",
          "/icons/star.svg",
          "./local/image.jpeg",
          "../parent/image.png",
        ];

        validPaths.forEach((path) => {
          expect(isValidImagePath(path)).toBe(true);
        });
      });

      it("should validate external image URLs", () => {
        const validUrls = [
          "https://example.com/image.jpg",
          "http://cdn.example.com/photo.png",
          "https://images.unsplash.com/photo-123.jpg",
          "https://picsum.photos/200/300.jpg",
        ];

        validUrls.forEach((url) => {
          expect(isValidImagePath(url)).toBe(true);
        });
      });

      it("should validate Unsplash photo URLs when they can be resolved", () => {
        const validUnsplashUrl = "https://unsplash.com/photos/valid-photo";
        expect(isValidImagePath(validUnsplashUrl)).toBe(true);
        expect(mockIsUnsplashPhotoUrl).toHaveBeenCalledWith(validUnsplashUrl);
        expect(mockResolveUnsplashImage).toHaveBeenCalledWith(validUnsplashUrl);
      });
    });

    describe("Invalid Paths", () => {
      it("should reject empty or whitespace-only strings", () => {
        const invalidPaths = ["", " ", "  ", "\t", "\n"];

        invalidPaths.forEach((path) => {
          expect(isValidImagePath(path)).toBe(false);
        });
      });

      it("should reject paths with invalid extensions", () => {
        const invalidPaths = [
          "/file.txt",
          "/document.pdf",
          "/video.mp4",
          "/audio.mp3",
          "/archive.zip",
          "/no-extension",
        ];

        invalidPaths.forEach((path) => {
          expect(isValidImagePath(path)).toBe(false);
        });
      });

      it("should reject invalid URLs", () => {
        const invalidUrls = [
          "ftp://example.com/image.jpg",
          "file:///local/image.png",
          "data:image/png;base64,abc123",
          "javascript:alert('xss')",
          "https://", // Incomplete URL
          "http://", // Incomplete URL
        ];

        invalidUrls.forEach((url) => {
          expect(isValidImagePath(url)).toBe(false);
        });
      });

      it("should handle malformed URLs gracefully", () => {
        const malformedUrls = [
          "https://[invalid-host]/image.jpg", // Invalid host format
          "https://example.com:99999/image.gif", // Invalid port
        ];

        malformedUrls.forEach((url) => {
          expect(isValidImagePath(url)).toBe(false);
        });
      });

      it("should reject Unsplash URLs that cannot be resolved", () => {
        const invalidUnsplashUrl = "https://unsplash.com/photos/nonexistent";
        expect(isValidImagePath(invalidUnsplashUrl)).toBe(false);
        expect(mockIsUnsplashPhotoUrl).toHaveBeenCalledWith(invalidUnsplashUrl);
        expect(mockResolveUnsplashImage).toHaveBeenCalledWith(
          invalidUnsplashUrl
        );
      });
    });

    describe("Edge Cases", () => {
      it("should handle URLs with query parameters and fragments", () => {
        const urlsWithParams = [
          "https://example.com/image.jpg?w=500&h=300",
          "https://example.com/image.png#fragment",
          "https://example.com/image.gif?query=value&other=param#section",
        ];

        urlsWithParams.forEach((url) => {
          expect(isValidImagePath(url)).toBe(true);
        });
      });

      it("should handle special characters in paths", () => {
        const pathsWithSpecialChars = [
          "/images/file with spaces.jpg",
          "/images/file-with-dashes.png",
          "/images/file_with_underscores.gif",
          "/images/файл.jpg", // Cyrillic
          "/images/画像.png", // Japanese
        ];

        pathsWithSpecialChars.forEach((path) => {
          expect(isValidImagePath(path)).toBe(true);
        });
      });

      it("should be case insensitive for extensions", () => {
        const caseVariations = [
          "/image.JPG",
          "/image.Jpeg",
          "/image.PNG",
          "/image.GIF",
          "/image.WEBP",
          "/image.SVG",
        ];

        caseVariations.forEach((path) => {
          expect(isValidImagePath(path)).toBe(true);
        });
      });

      it("should handle very long paths", () => {
        const longPath = "/images/" + "a".repeat(1000) + ".jpg";
        expect(isValidImagePath(longPath)).toBe(true);

        const longUrl =
          "https://example.com/" + "path/".repeat(100) + "image.png";
        expect(isValidImagePath(longUrl)).toBe(true);
      });
    });
  });

  describe("fetchImageAsBase64", () => {
    beforeEach(() => {
      // Mock global fetch
      global.fetch = vi.fn();
    });

    it("should convert image to base64 data URL", async () => {
      const mockImageData = new Uint8Array([137, 80, 78, 71]); // PNG header
      const mockResponse = {
        ok: true,
        arrayBuffer: async () => mockImageData.buffer,
        headers: new Map([["content-type", "image/png"]]),
      };

      vi.mocked(global.fetch).mockResolvedValue(mockResponse as any);

      const result = await fetchImageAsBase64(
        "https://example.com/image.png",
        false
      );

      expect(result).toBeDefined();
      expect(result).toMatch(/^data:image\/png;base64,/);
    });

    it("should handle fetch failures gracefully", async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: "Not Found",
      };

      vi.mocked(global.fetch).mockResolvedValue(mockResponse as any);

      const result = await fetchImageAsBase64(
        "https://example.com/missing.jpg",
        false
      );

      expect(result).toBeNull();
    });

    it("should handle network errors", async () => {
      vi.mocked(global.fetch).mockRejectedValue(new Error("Network error"));

      const result = await fetchImageAsBase64(
        "https://example.com/image.jpg",
        false
      );

      expect(result).toBeNull();
    });

    it("should infer content-type from URL if not in headers", async () => {
      const mockImageData = new Uint8Array([255, 216, 255, 224]); // JPEG header
      const mockResponse = {
        ok: true,
        arrayBuffer: async () => mockImageData.buffer,
        headers: {
          get: () => null, // No content-type header
        },
      };

      vi.mocked(global.fetch).mockResolvedValue(mockResponse as any);

      const result = await fetchImageAsBase64(
        "https://example.com/image.jpg",
        false
      );

      expect(result).toBeDefined();
      expect(result).toMatch(/^data:image\/jpeg;base64,/);
    });
  });
});
