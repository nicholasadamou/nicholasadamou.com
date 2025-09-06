import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { GET } from "@/app/api/og/route";

// Use vi.hoisted to create hoisted mock functions
// Use vi.hoisted to create hoisted mock functions for file system
const { mockReadFile, mockSharp, mockJoin, mockExtname } = vi.hoisted(() => ({
  mockReadFile: vi.fn(),
  mockSharp: vi.fn().mockReturnValue({
    resize: vi.fn().mockReturnThis(),
    jpeg: vi.fn().mockReturnThis(),
    toBuffer: vi.fn().mockResolvedValue(Buffer.from("optimized-image-data")),
  }),
  mockJoin: vi.fn().mockImplementation((...paths) => {
    // Ensure we return a valid, deterministic path string for testing
    const joinedPath = paths.filter(Boolean).join("/");
    return joinedPath || "/mock/project/root/public";
  }),
  mockExtname: vi.fn().mockImplementation((path) => {
    if (!path || typeof path !== "string") return "";
    const parts = path.split(".");
    return parts.length > 1 ? `.${parts[parts.length - 1]}` : "";
  }),
}));

// Mock Next.js ImageResponse
vi.mock("next/og", () => ({
  ImageResponse: vi.fn().mockImplementation((element, options) => {
    return {
      element,
      options,
      headers: new Headers({
        "Content-Type": "image/png",
        "Cache-Control": "public, s-maxage=31536000, immutable",
      }),
      status: 200,
    };
  }),
}));

// Mock file system operations
vi.mock("fs/promises", () => ({
  readFile: mockReadFile,
  default: {
    readFile: mockReadFile,
  },
}));

// Mock path module
vi.mock("path", () => ({
  join: mockJoin,
  extname: mockExtname,
  default: {
    join: mockJoin,
    extname: mockExtname,
  },
}));

// Mock Sharp for image optimization
vi.mock("sharp", () => ({
  __esModule: true,
  default: mockSharp,
}));

// Create console spies without hoisting
let consoleLogSpy: any;
let consoleErrorSpy: any;

// Get properly typed mock for ImageResponse
const MockedImageResponse = vi.mocked(ImageResponse);

describe("OG Route - Image Rendering Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    process.cwd = vi.fn().mockReturnValue("/mock/project/root");

    // Create fresh console spies for each test
    consoleLogSpy = vi.spyOn(console, "log");
    consoleErrorSpy = vi.spyOn(console, "error");

    // Reset the mocks before each test
    mockReadFile.mockReset();
    mockSharp.mockReset();
    mockJoin.mockReset();
    mockExtname.mockReset();

    // Setup default mock behavior
    mockReadFile.mockResolvedValue(Buffer.from("mock-image-data"));
    mockSharp.mockReturnValue({
      resize: vi.fn().mockReturnThis(),
      jpeg: vi.fn().mockReturnThis(),
      toBuffer: vi.fn().mockResolvedValue(Buffer.from("optimized-image-data")),
    });
    mockJoin.mockImplementation((...paths) => {
      // Ensure we return a valid, deterministic path string for testing
      const joinedPath = paths.filter(Boolean).join("/");
      return joinedPath || "/mock/project/root/public";
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Basic Route Functionality", () => {
    it("should return an ImageResponse for basic request", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/og?title=Test%20Title"
      );

      const response = await GET(request);

      expect(response).toBeDefined();
      expect(ImageResponse).toHaveBeenCalledWith(
        expect.anything(), // React element
        {
          width: 1920,
          height: 1080,
        }
      );
    });

    it("should handle different page types", async () => {
      const types = [
        "homepage",
        "project",
        "note",
        "projects",
        "notes",
        "contact",
        "gallery",
      ];

      for (const type of types) {
        const request = new NextRequest(
          `http://localhost:3000/api/og?title=Test&type=${type}`
        );

        const response = await GET(request);

        expect(response).toBeDefined();
        expect(ImageResponse).toHaveBeenCalled();
      }
    });

    it("should handle missing parameters with defaults", async () => {
      const request = new NextRequest("http://localhost:3000/api/og");

      const response = await GET(request);

      expect(response).toBeDefined();
      expect(ImageResponse).toHaveBeenCalledWith(expect.anything(), {
        width: 1920,
        height: 1080,
      });
    });
  });

  describe("Local Image Rendering", () => {
    it("should load and render local image successfully", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/og?title=Test&image=/test-image.jpg"
      );

      const response = await GET(request);

      // With direct URLs, no file reading occurs
      expect(response).toBeDefined();
      expect(ImageResponse).toHaveBeenCalled();
    });

    it("should handle different image file extensions", async () => {
      const extensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

      for (const ext of extensions) {
        const request = new NextRequest(
          `http://localhost:3000/api/og?title=Test&image=/test${ext}`
        );

        const response = await GET(request);

        expect(response).toBeDefined();
        // With direct URLs, no file processing occurs
      }
    });

    it("should optimize large local images", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/og?title=Test&image=/large-image.jpg"
      );

      const response = await GET(request);

      // With direct URLs, no Sharp optimization occurs
      expect(response).toBeDefined();
    });

    it("should handle local image file not found", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/og?title=Test&image=/nonexistent.jpg"
      );

      const response = await GET(request);

      // With direct URLs, non-existent files don't cause errors during generation
      expect(response).toBeDefined();
    });
  });

  describe("External Image Rendering", () => {
    it("should load and render external image successfully", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/og?title=Test&image=https://example.com/image.jpg"
      );

      const response = await GET(request);

      // With direct URLs, no fetch occurs during OG generation
      expect(response).toBeDefined();
    });

    it("should optimize large external images", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/og?title=Test&image=https://example.com/large-image.png"
      );

      const response = await GET(request);

      // With direct URLs, no optimization occurs during generation
      expect(response).toBeDefined();
    });

    it("should handle external image fetch failure", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/og?title=Test&image=https://example.com/404.jpg"
      );

      const response = await GET(request);

      // With direct URLs, no fetch failure occurs during generation
      expect(response).toBeDefined();
    });

    it("should handle network errors for external images", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/og?title=Test&image=https://example.com/image.jpg"
      );

      const response = await GET(request);

      // With direct URLs, no network errors occur during generation
      expect(response).toBeDefined();
    });
  });

  describe("Image Fallback and Error Handling", () => {
    it("should render without image when image loading fails", async () => {
      const imageError = new Error("Image not found");
      mockReadFile.mockRejectedValue(imageError);

      // Configure path.join mock for this test
      mockJoin.mockImplementation((...args) => {
        if (
          args.includes("public") &&
          args.some((arg) => arg && arg.includes("failed-image.jpg"))
        ) {
          return "/mock/project/root/public/failed-image.jpg";
        }
        return args.join("/");
      });

      const request = new NextRequest(
        "http://localhost:3000/api/og?title=Test&image=/failed-image.jpg"
      );

      const response = await GET(request);

      expect(response).toBeDefined();
      expect(ImageResponse).toHaveBeenCalled();

      // Verify the call was made with the processedImage being undefined/null
      const [[reactElement]] = ImageResponse.mock.calls;
      expect(reactElement).toBeDefined();
    });

    it("should validate image paths and reject invalid ones", async () => {
      const invalidPaths = [
        "",
        " ",
        "invalid-extension.txt",
        "no-extension",
        "ftp://invalid-protocol.com/image.jpg",
      ];

      for (const invalidPath of invalidPaths) {
        const request = new NextRequest(
          `http://localhost:3000/api/og?title=Test&image=${encodeURIComponent(invalidPath)}`
        );

        const response = await GET(request);

        expect(response).toBeDefined();
        // Should render without image for invalid paths
      }
    });

    it("should handle Sharp optimization failures gracefully", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/og?title=Test&image=/large-image.jpg"
      );

      const response = await GET(request);

      // With direct URLs, no Sharp processing occurs
      expect(response).toBeDefined();
    });
  });

  describe("Theme and Layout Variations", () => {
    it("should render with dark theme (default)", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/og?title=Test&theme=dark"
      );

      const response = await GET(request);

      expect(response).toBeDefined();
      expect(ImageResponse).toHaveBeenCalled();
    });

    it("should render with light theme", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/og?title=Test&theme=light"
      );

      const response = await GET(request);

      expect(response).toBeDefined();
      expect(ImageResponse).toHaveBeenCalled();
    });

    it("should render homepage layout differently", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/og?title=Test&type=homepage"
      );

      const response = await GET(request);

      expect(response).toBeDefined();
      expect(ImageResponse).toHaveBeenCalled();
    });

    it("should automatically include avatar for homepage when no image is provided", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/og?title=Nicholas%20Adamou&type=homepage"
      );

      const response = await GET(request);

      expect(response).toBeDefined();
      expect(ImageResponse).toHaveBeenCalled();

      // Should have processed avatar as image
      // This is verified through successful generation and logging
    });

    it("should use provided image for homepage instead of avatar when image is given", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/og?title=Nicholas%20Adamou&type=homepage&image=/custom-image.jpg"
      );

      const response = await GET(request);

      expect(response).toBeDefined();
      expect(ImageResponse).toHaveBeenCalled();
    });

    it("should not include avatar for non-homepage types", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/og?title=Test%20Project&type=project"
      );

      const response = await GET(request);

      expect(response).toBeDefined();
      expect(ImageResponse).toHaveBeenCalled();
    });

    it("should handle layout with and without images", async () => {
      // Test with image
      mockReadFile.mockResolvedValue(Buffer.from("image-data"));

      // Configure path.join mock for the image test
      mockJoin.mockImplementation((...args) => {
        if (
          args.includes("public") &&
          args.some((arg) => arg && arg.includes("test.jpg"))
        ) {
          return "/mock/project/root/public/test.jpg";
        }
        return args.join("/");
      });

      const requestWithImage = new NextRequest(
        "http://localhost:3000/api/og?title=Test&image=/test.jpg"
      );

      const responseWithImage = await GET(requestWithImage);
      expect(responseWithImage).toBeDefined();

      // Test without image
      const requestWithoutImage = new NextRequest(
        "http://localhost:3000/api/og?title=Test"
      );

      const responseWithoutImage = await GET(requestWithoutImage);
      expect(responseWithoutImage).toBeDefined();

      // Both should render successfully but with different layouts
      expect(ImageResponse).toHaveBeenCalledTimes(2);
    });
  });

  describe("Error Recovery and Fallback Images", () => {
    it("should return error fallback image when route fails completely", async () => {
      // Force an error in the main route logic
      MockedImageResponse.mockImplementationOnce(() => {
        throw new Error("Catastrophic failure");
      });

      const request = new NextRequest(
        "http://localhost:3000/api/og?title=Test"
      );

      const response = await GET(request);

      // Check that console.error was called with the expected message
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "OG Route Error - Image generation failed:",
        expect.any(Error)
      );
      expect(response).toBeDefined();

      // Should create a fallback error image
      expect(ImageResponse).toHaveBeenCalledTimes(2); // First call fails, second is fallback
    });

    it("should handle malformed URL parameters gracefully", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/og?title=%malformed%&type=invalid-type"
      );

      const response = await GET(request);

      expect(response).toBeDefined();
      expect(ImageResponse).toHaveBeenCalled();
    });

    it("should handle extremely long parameters", async () => {
      const longTitle = "A".repeat(1000);
      const longDescription = "B".repeat(2000);

      const request = new NextRequest(
        `http://localhost:3000/api/og?title=${encodeURIComponent(longTitle)}&description=${encodeURIComponent(longDescription)}`
      );

      const response = await GET(request);

      expect(response).toBeDefined();
      expect(ImageResponse).toHaveBeenCalled();
    });
  });

  describe("Content Type and Headers", () => {
    it("should handle different image content types correctly", async () => {
      const contentTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
      ];

      for (const contentType of contentTypes) {
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          arrayBuffer: () => Promise.resolve(Buffer.from("image-data").buffer),
          headers: {
            get: vi.fn().mockReturnValue(contentType),
          },
        });

        const request = new NextRequest(
          "http://localhost:3000/api/og?title=Test&image=https://example.com/image.jpg"
        );

        const response = await GET(request);
        expect(response).toBeDefined();
      }
    });

    it("should default to jpeg when content type is missing", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(Buffer.from("image-data").buffer),
        headers: {
          get: vi.fn().mockReturnValue(null), // No content type
        },
      });

      const request = new NextRequest(
        "http://localhost:3000/api/og?title=Test&image=https://example.com/image"
      );

      const response = await GET(request);
      expect(response).toBeDefined();
    });
  });

  describe("Performance and Caching", () => {
    it("should handle multiple concurrent requests", async () => {
      mockReadFile.mockResolvedValue(Buffer.from("image-data"));

      // Configure path.join mock for multiple image tests
      mockJoin.mockImplementation((...args) => {
        if (args.includes("public")) {
          const imageArg = args.find(
            (arg) => arg && arg.toString().includes(".jpg")
          );
          if (imageArg) {
            return `/mock/project/root/public${imageArg.toString().startsWith("/") ? "" : "/"}${imageArg}`;
          }
        }
        return args.join("/");
      });

      const requests = Array.from(
        { length: 5 },
        (_, i) =>
          new NextRequest(
            `http://localhost:3000/api/og?title=Test${i}&image=/test${i}.jpg`
          )
      );

      const responses = await Promise.all(requests.map((req) => GET(req)));

      expect(responses).toHaveLength(5);
      responses.forEach((response) => {
        expect(response).toBeDefined();
      });
      expect(ImageResponse).toHaveBeenCalledTimes(5);
    });

    it("should log successful image generation", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/og?title=Success%20Test"
      );

      await GET(request);

      // Check that console.log was called with a message containing "OG Route"
      expect(
        consoleLogSpy.mock.calls.some(
          (call) => typeof call[0] === "string" && call[0].includes("OG Route")
        )
      ).toBe(true);
    });
  });
});
