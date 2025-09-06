import { describe, it, expect, vi, beforeEach } from "vitest";
import { isValidImagePath } from "@/app/api/og/utils/image";
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
});
