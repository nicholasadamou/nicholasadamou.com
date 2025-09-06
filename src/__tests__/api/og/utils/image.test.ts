import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock fs/promises with vi.hoisted to ensure proper mocking
vi.mock("fs/promises", () => {
  const readFile = vi.fn();
  return {
    default: {
      readFile,
    },
    readFile,
  };
});

// Mock path module with the same structure as fs/promises
vi.mock("path", () => {
  const join = vi.fn().mockImplementation((...args) => {
    const validArgs = args.filter(
      (arg) =>
        arg !== undefined &&
        arg !== null &&
        arg !== "" &&
        typeof arg === "string"
    );
    if (validArgs.length === 0) {
      return "/default/path";
    }
    const result = validArgs.join("/").replace(/\/+/g, "/");
    return result || "/default/path";
  });
  const extname = vi.fn().mockImplementation((path) => {
    if (typeof path !== "string" || !path) return "";
    const parts = path.split(".");
    return parts.length > 1 ? `.${parts[parts.length - 1]}` : "";
  });
  return {
    default: {
      join,
      extname,
    },
    join,
    extname,
  };
});

import { loadImageAsBase64, isValidImagePath } from "@/app/api/og/utils/image";
import { readFile } from "fs/promises";
import { join, extname } from "path";

// Get references to mocked functions
const mockReadFile = vi.mocked(readFile);
const mockJoin = vi.mocked(join);
const mockExtname = vi.mocked(extname);

// Mock Sharp
const mockToBuffer = vi
  .fn()
  .mockResolvedValue(Buffer.from("optimized-image-data"));
const mockJpeg = vi.fn(() => ({
  toBuffer: mockToBuffer,
}));
const mockResize = vi.fn(() => ({
  jpeg: mockJpeg,
}));
const mockSharp = vi.fn((buffer) => {
  // Ensure we always return a proper sharp-like object
  if (buffer && Buffer.isBuffer(buffer)) {
    return {
      resize: mockResize,
    };
  }
  // Return a basic mock even if buffer is invalid
  return {
    resize: mockResize,
  };
});

vi.mock("sharp", () => ({
  __esModule: true,
  default: mockSharp,
}));

// Mock console methods
const mockConsoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
const mockConsoleError = vi
  .spyOn(console, "error")
  .mockImplementation(() => {});

describe("Image Utility Functions", () => {
  beforeEach(() => {
    // Clear call history but don't reset implementations
    global.fetch = vi.fn();
    process.cwd = vi.fn().mockReturnValue("/mock/project/root");

    // Clear console mocks
    mockConsoleLog.mockClear();
    mockConsoleError.mockClear();

    // Reset path mocks
    mockJoin.mockClear();
    mockExtname.mockClear();

    // Reset file system mock
    mockReadFile.mockClear();

    // Reset Sharp mocks
    mockSharp.mockClear();
    mockResize.mockClear();
    mockJpeg.mockClear();
    mockToBuffer.mockClear();

    // Restore default Sharp mock implementation
    mockSharp.mockImplementation((buffer) => {
      if (buffer && Buffer.isBuffer(buffer)) {
        return {
          resize: mockResize,
        };
      }
      return {
        resize: mockResize,
      };
    });
    mockResize.mockReturnValue({ jpeg: mockJpeg });
    mockJpeg.mockReturnValue({ toBuffer: mockToBuffer });
    mockToBuffer.mockResolvedValue(Buffer.from("optimized-image-data"));

    // Ensure the mock has a default implementation that doesn't throw
    mockReadFile.mockImplementation(() => {
      throw new Error("readFile mock not set up for this test case");
    });
  });

  describe("loadImageAsBase64", () => {
    describe("Local Image Loading", () => {
      it("should load local image successfully", async () => {
        const mockImageBuffer = Buffer.from("test-image-data");

        // Setup the mock implementation in the test
        mockReadFile.mockResolvedValue(mockImageBuffer);

        // First, just check that the function exists and can be called
        expect(typeof loadImageAsBase64).toBe("function");

        // Now the function should work with proper mocks
        const result = await loadImageAsBase64("/test-image.jpg");

        // Should not be null since we're providing a proper mock
        expect(result).not.toBeNull();
        expect(result).toBe(
          "data:image/jpeg;base64," + mockImageBuffer.toString("base64")
        );

        // Check that mocks were called properly
        expect(mockJoin).toHaveBeenCalledWith(
          "/mock/project/root",
          "public",
          "test-image.jpg"
        );
        expect(mockReadFile).toHaveBeenCalledWith(
          "/mock/project/root/public/test-image.jpg"
        );
      });

      it("should handle image path without leading slash", async () => {
        const mockImageBuffer = Buffer.from("test-image-data");
        mockReadFile.mockResolvedValue(mockImageBuffer);

        const result = await loadImageAsBase64("test-image.png");

        expect(mockReadFile).toHaveBeenCalledWith(
          "/mock/project/root/public/test-image.png"
        );
        expect(result).toBe(
          "data:image/png;base64," + mockImageBuffer.toString("base64")
        );
      });

      it("should return correct content type for different extensions", async () => {
        const mockImageBuffer = Buffer.from("image-data");
        mockReadFile.mockResolvedValue(mockImageBuffer);

        const tests = [
          { path: "/test.jpg", expected: "image/jpeg" },
          { path: "/test.jpeg", expected: "image/jpeg" },
          { path: "/test.png", expected: "image/png" },
          { path: "/test.gif", expected: "image/gif" },
          { path: "/test.webp", expected: "image/webp" },
          { path: "/test.svg", expected: "image/svg+xml" },
        ];

        for (const test of tests) {
          const result = await loadImageAsBase64(test.path);
          expect(result).toContain(`data:${test.expected};base64,`);
        }
      });

      it("should optimize large local images", async () => {
        const largeImageBuffer = Buffer.alloc(300 * 1024, "large-image-data");
        mockReadFile.mockResolvedValue(largeImageBuffer);

        const result = await loadImageAsBase64("/large-image.jpg");

        expect(mockSharp).toHaveBeenCalledWith(largeImageBuffer);
        expect(mockConsoleLog).toHaveBeenCalledWith(
          expect.stringContaining("Image /large-image.jpg is large")
        );
        expect(result).toBe(
          "data:image/jpeg;base64,b3B0aW1pemVkLWltYWdlLWRhdGE="
        );
      });

      it("should return null when local image file not found", async () => {
        mockReadFile.mockRejectedValue(new Error("ENOENT: no such file"));

        const result = await loadImageAsBase64("/nonexistent.jpg");

        expect(result).toBeNull();
        expect(mockConsoleError).toHaveBeenCalledWith(
          "Error reading local image file:",
          expect.any(Error)
        );
      });

      it("should return null when local image read fails", async () => {
        mockReadFile.mockRejectedValue(new Error("Permission denied"));

        const result = await loadImageAsBase64("/protected.jpg");

        expect(result).toBeNull();
        expect(mockConsoleError).toHaveBeenCalledWith(
          "Error reading local image file:",
          expect.any(Error)
        );
      });
    });

    describe("External Image Loading", () => {
      it("should load external image successfully", async () => {
        const mockImageBuffer = Buffer.from("external-image-data");
        // Create a proper ArrayBuffer that will be correctly converted back to our expected data
        const arrayBuffer = new ArrayBuffer(mockImageBuffer.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        uint8Array.set(mockImageBuffer);

        const mockResponse = {
          ok: true,
          arrayBuffer: vi.fn().mockResolvedValue(arrayBuffer),
          headers: new Map([["content-type", "image/jpeg"]]),
        };
        mockResponse.headers.get = vi.fn().mockReturnValue("image/jpeg");
        global.fetch = vi.fn().mockResolvedValue(mockResponse);

        const result = await loadImageAsBase64("https://example.com/image.jpg");

        expect(global.fetch).toHaveBeenCalledWith(
          "https://example.com/image.jpg"
        );
        expect(result).toBe(
          "data:image/jpeg;base64," + mockImageBuffer.toString("base64")
        );
      });

      it("should handle missing content type header", async () => {
        const mockImageBuffer = Buffer.from("image-data");
        // Create a proper ArrayBuffer that will be correctly converted back to our expected data
        const arrayBuffer = new ArrayBuffer(mockImageBuffer.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        uint8Array.set(mockImageBuffer);

        const mockResponse = {
          ok: true,
          arrayBuffer: vi.fn().mockResolvedValue(arrayBuffer),
          headers: new Map(),
        };
        mockResponse.headers.get = vi.fn().mockReturnValue(null);
        global.fetch = vi.fn().mockResolvedValue(mockResponse);

        const result = await loadImageAsBase64("https://example.com/image");

        expect(result).toBe(
          "data:image/jpeg;base64," + mockImageBuffer.toString("base64")
        );
      });

      it("should optimize large external images", async () => {
        const largeImageBuffer = Buffer.alloc(
          300 * 1024,
          "large-external-image"
        );
        // Create a proper ArrayBuffer that will be correctly converted back to our expected data
        const arrayBuffer = new ArrayBuffer(largeImageBuffer.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        uint8Array.set(largeImageBuffer);

        const mockResponse = {
          ok: true,
          arrayBuffer: vi.fn().mockResolvedValue(arrayBuffer),
          headers: new Map([["content-type", "image/png"]]),
        };
        mockResponse.headers.get = vi.fn().mockReturnValue("image/png");
        global.fetch = vi.fn().mockResolvedValue(mockResponse);

        const result = await loadImageAsBase64(
          "https://example.com/large-image.png"
        );

        expect(mockSharp).toHaveBeenCalledWith(largeImageBuffer);
        expect(mockConsoleLog).toHaveBeenCalledWith(
          expect.stringContaining(
            "External image https://example.com/large-image.png is large"
          )
        );
        expect(result).toBe(
          "data:image/jpeg;base64,b3B0aW1pemVkLWltYWdlLWRhdGE="
        );
      });

      it("should return null when external image fetch fails", async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
          statusText: "Not Found",
        });

        const result = await loadImageAsBase64("https://example.com/404.jpg");

        expect(result).toBeNull();
        expect(mockConsoleError).toHaveBeenCalledWith(
          "Failed to fetch external image: 404 Not Found"
        );
      });

      it("should return null when network error occurs", async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

        const result = await loadImageAsBase64("https://example.com/image.jpg");

        expect(result).toBeNull();
        expect(mockConsoleError).toHaveBeenCalledWith(
          "Error loading external image:",
          expect.any(Error)
        );
      });

      it("should handle different content types", async () => {
        const contentTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
          "image/svg+xml",
        ];

        for (const contentType of contentTypes) {
          const mockImageBuffer = Buffer.from("image-data");
          // Create a proper ArrayBuffer that will be correctly converted back to our expected data
          const arrayBuffer = new ArrayBuffer(mockImageBuffer.length);
          const uint8Array = new Uint8Array(arrayBuffer);
          uint8Array.set(mockImageBuffer);

          const mockResponse = {
            ok: true,
            arrayBuffer: vi.fn().mockResolvedValue(arrayBuffer),
            headers: new Map([["content-type", contentType]]),
          };
          mockResponse.headers.get = vi.fn().mockReturnValue(contentType);
          global.fetch = vi.fn().mockResolvedValue(mockResponse);

          const result = await loadImageAsBase64(
            "https://example.com/image.jpg"
          );
          expect(result).toContain(`data:${contentType};base64,`);
        }
      });
    });

    describe("Image Optimization", () => {
      it("should not optimize small images", async () => {
        const smallImageBuffer = Buffer.alloc(100 * 1024, "small-image"); // 100KB
        mockReadFile.mockResolvedValue(smallImageBuffer);

        const result = await loadImageAsBase64("/small-image.jpg");

        expect(mockSharp).not.toHaveBeenCalled();
        expect(result).toBe(
          "data:image/jpeg;base64," + smallImageBuffer.toString("base64")
        );
      });

      it("should handle Sharp optimization failure gracefully", async () => {
        const largeImageBuffer = Buffer.alloc(300 * 1024, "large-image");
        mockReadFile.mockResolvedValue(largeImageBuffer);

        // Mock Sharp to fail
        mockSharp.mockImplementation(() => {
          console.log("DEBUG: Sharp mockImplementation called");
          throw new Error("Sharp optimization failed");
        });

        const result = await loadImageAsBase64("/large-image.jpg");

        expect(mockConsoleError).toHaveBeenCalledWith(
          "Error optimizing image with Sharp:",
          expect.any(Error)
        );
        // Should fall back to original image
        expect(result).toBe(
          "data:image/jpeg;base64," + largeImageBuffer.toString("base64")
        );
      });

      it("should return null for extremely large images that fail optimization", async () => {
        const veryLargeImageBuffer = Buffer.alloc(
          350 * 1024,
          "very-large-image"
        ); // 350KB - larger than 300KB threshold
        mockReadFile.mockResolvedValue(veryLargeImageBuffer);

        // Clear previous console calls
        mockConsoleLog.mockClear();
        mockConsoleError.mockClear();

        // Mock Sharp to fail and image is too large for fallback
        mockSharp.mockImplementation(() => {
          throw new Error("Sharp optimization failed");
        });
        const result = await loadImageAsBase64("/very-large-image.jpg");

        // Debug: Log what actually happened
        console.log(
          "Test Debug - mockConsoleLog calls:",
          mockConsoleLog.mock.calls
        );
        console.log(
          "Test Debug - mockConsoleError calls:",
          mockConsoleError.mock.calls
        );
        console.log("Test Debug - result type:", typeof result);
        console.log(
          "Test Debug - result length:",
          result ? result.length : "null"
        );
        console.log(
          "Test Debug - Sharp was called:",
          mockSharp.mock.calls.length > 0
        );

        expect(mockConsoleLog).toHaveBeenCalledWith(
          "Image too large and optimization failed, falling back to no image"
        );
        expect(result).toBeNull();
      });

      it("should log optimization results", async () => {
        const originalBuffer = Buffer.alloc(300 * 1024, "original");
        const optimizedBuffer = Buffer.from("optimized-image-data");

        mockReadFile.mockResolvedValue(originalBuffer);
        mockSharp.mockReturnValue({
          resize: vi.fn().mockReturnThis(),
          jpeg: vi.fn().mockReturnThis(),
          toBuffer: vi.fn().mockResolvedValue(optimizedBuffer),
        });

        await loadImageAsBase64("/image.jpg");

        expect(mockConsoleLog).toHaveBeenCalledWith(
          expect.stringContaining("Optimizing image/jpeg image with Sharp...")
        );
        expect(mockConsoleLog).toHaveBeenCalledWith(
          `Image optimized: ${originalBuffer.length} bytes -> ${optimizedBuffer.length} bytes`
        );
      });
    });

    describe("Error Handling", () => {
      it("should return null for any error in main function", async () => {
        // Force an error by mocking fetch to throw
        global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

        const result = await loadImageAsBase64("https://example.com/error.jpg");

        expect(result).toBeNull();
      });
    });
  });

  describe("isValidImagePath", () => {
    describe("Valid Paths", () => {
      it("should validate local image paths with valid extensions", () => {
        const validPaths = [
          "/image.jpg",
          "/image.jpeg",
          "/image.png",
          "/image.gif",
          "/image.webp",
          "/image.svg",
          "image.JPG", // Case insensitive
          "folder/image.PNG",
          "./relative/image.gif",
          "../parent/image.webp",
        ];

        validPaths.forEach((path) => {
          expect(isValidImagePath(path)).toBe(true);
        });
      });

      it("should validate external image URLs", () => {
        const validUrls = [
          "http://example.com/image.jpg",
          "https://example.com/image.png",
          "https://cdn.example.com/path/to/image.gif",
          "http://localhost:3000/image.webp",
          "https://images.example.com/very/long/path/to/image.svg",
        ];

        validUrls.forEach((url) => {
          expect(isValidImagePath(url)).toBe(true);
        });
      });
    });

    describe("Invalid Paths", () => {
      it("should reject empty or whitespace-only strings", () => {
        const invalidPaths = ["", " ", "   ", "\t", "\n", undefined];

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
          "/noextension",
          "/image.", // Empty extension
          "/image.jpgx", // Invalid extension
        ];

        invalidPaths.forEach((path) => {
          expect(isValidImagePath(path)).toBe(false);
        });
      });

      it("should reject invalid URLs", () => {
        const invalidUrls = [
          "ftp://example.com/image.jpg", // Wrong protocol
          "example.com/image.png", // Missing protocol
          "https://", // Incomplete URL
          "not-a-url",
          "mailto:user@example.com",
          "file:///local/image.jpg",
        ];

        invalidUrls.forEach((url) => {
          expect(isValidImagePath(url)).toBe(false);
        });
      });

      it("should handle malformed URLs gracefully", () => {
        const malformedUrls = [
          "https://[invalid-host]/image.jpg",
          "http://example..com/image.png",
          "https://example.com:99999/image.gif", // Invalid port
        ];

        malformedUrls.forEach((url) => {
          expect(isValidImagePath(url)).toBe(false);
        });
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
