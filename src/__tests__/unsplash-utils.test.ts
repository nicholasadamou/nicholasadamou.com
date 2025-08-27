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
import {
  getUnsplashPhoto,
  extractUnsplashPhotoId,
  createPremiumUnsplashUrl,
} from "@/lib/utils/unsplash";

// Mock environment variables
const mockEnv = {
  UNSPLASH_ACCESS_KEY: "test-access-key",
  UNSPLASH_SECRET_KEY: "test-secret-key",
};

beforeAll(() => {
  Object.assign(process.env, mockEnv);
});

// Mock Unsplash API responses
const mockPhotoData = {
  id: "test-photo-id",
  urls: {
    raw: "https://images.unsplash.com/photo-test-raw",
    full: "https://images.unsplash.com/photo-test-full",
    regular: "https://images.unsplash.com/photo-test-regular",
    small: "https://images.unsplash.com/photo-test-small",
    thumb: "https://images.unsplash.com/photo-test-thumb",
  },
  user: {
    name: "Test Photographer",
    username: "test-photographer",
    profile_image: {
      small: "https://images.unsplash.com/profile-small",
    },
  },
  description: "Test photo description",
  alt_description: "Test alt description",
  width: 4000,
  height: 3000,
};

// MSW server setup
const server = setupServer(
  // Mock successful photo fetch
  http.get("https://api.unsplash.com/photos/test-photo-id", () => {
    return HttpResponse.json(mockPhotoData);
  }),

  // Mock photo not found
  http.get("https://api.unsplash.com/photos/not-found", () => {
    return new HttpResponse(null, { status: 404 });
  }),

  // Mock rate limit
  http.get("https://api.unsplash.com/photos/rate-limited", () => {
    return new HttpResponse("Rate Limit Exceeded", { status: 403 });
  }),

  // Mock network error
  http.get("https://api.unsplash.com/photos/network-error", () => {
    return HttpResponse.error();
  }),

  // Mock server error
  http.get("https://api.unsplash.com/photos/server-error", () => {
    return new HttpResponse("Internal Server Error", { status: 500 });
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());

describe("Unsplash Utility Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getUnsplashPhoto", () => {
    it("should fetch photo successfully", async () => {
      const photo = await getUnsplashPhoto("test-photo-id");

      expect(photo).toEqual(mockPhotoData);
    });

    it("should return null when photo is not found", async () => {
      const photo = await getUnsplashPhoto("not-found");

      expect(photo).toBeNull();
    });

    it("should handle rate limiting", async () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      // Rate limiting should throw an error to be handled by the API route
      await expect(getUnsplashPhoto("rate-limited")).rejects.toThrow(
        "Rate Limit Exceeded: 403 - Rate Limit Exceeded"
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          "Unsplash rate limit exceeded for photo rate-limited"
        )
      );

      consoleSpy.mockRestore();
    });

    it("should handle server errors", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const photo = await getUnsplashPhoto("server-error");

      expect(photo).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Unsplash API error: status=500")
      );

      consoleSpy.mockRestore();
    });

    it("should handle network errors", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const photo = await getUnsplashPhoto("network-error");

      expect(photo).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching Unsplash photo (network or parsing):",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it("should return null when API key is not configured", async () => {
      delete process.env.UNSPLASH_ACCESS_KEY;

      const photo = await getUnsplashPhoto("test-photo-id");

      expect(photo).toBeNull();

      // Restore API key
      process.env.UNSPLASH_ACCESS_KEY = "test-access-key";
    });
  });

  describe("extractUnsplashPhotoId", () => {
    it("should extract ID from page URL with slug", () => {
      const url = "https://unsplash.com/photos/beautiful-sunset-abc123def456";
      const photoId = extractUnsplashPhotoId(url);

      expect(photoId).toBe("abc123def456");
    });

    it("should extract ID from simple page URL", () => {
      const url = "https://unsplash.com/photos/abc123def456";
      const photoId = extractUnsplashPhotoId(url);

      expect(photoId).toBe("abc123def456");
    });

    it("should extract ID from URL with query parameters", () => {
      const url =
        "https://unsplash.com/photos/beautiful-sunset-abc123def456?utm_source=test";
      const photoId = extractUnsplashPhotoId(url);

      expect(photoId).toBe("abc123def456");
    });

    it("should extract ID from URL with fragment", () => {
      const url =
        "https://unsplash.com/photos/beautiful-sunset-abc123def456#section";
      const photoId = extractUnsplashPhotoId(url);

      expect(photoId).toBe("abc123def456");
    });

    it("should handle URLs with trailing punctuation", () => {
      const url = 'https://unsplash.com/photos/beautiful-sunset-abc123def456\"';
      const photoId = extractUnsplashPhotoId(url);

      expect(photoId).toBe("abc123def456");
    });

    it("should return null for invalid URLs", () => {
      const invalidUrls = [
        "https://example.com/photo",
        "not-a-url",
        "",
        null,
        undefined,
        "https://unsplash.com/collections/123",
        "https://unsplash.com/photos/",
      ];

      invalidUrls.forEach((url) => {
        expect(extractUnsplashPhotoId(url as any)).toBeNull();
      });
    });

    it("should return null for URLs without valid photo ID format", () => {
      const url = "https://unsplash.com/photos/invalid-id";
      const photoId = extractUnsplashPhotoId(url);

      expect(photoId).toBeNull();
    });
  });

  describe("createPremiumUnsplashUrl", () => {
    it("should create premium URL for plus.unsplash.com images", () => {
      const baseUrl =
        "https://plus.unsplash.com/premium-photo-123?ixid=test&ixlib=rb-4.0.3";
      const photoId = "test-photo-id";

      const premiumUrl = createPremiumUnsplashUrl(baseUrl, photoId, 1200, 80);

      expect(premiumUrl).toContain("plus.unsplash.com");
      expect(premiumUrl).toContain("client_id=test-access-key");
      expect(premiumUrl).toContain("w=1200");
      expect(premiumUrl).toContain("q=80");
      expect(premiumUrl).toContain("fm=jpg");
      expect(premiumUrl).toContain("ixid=test");
      expect(premiumUrl).toContain("ixlib=rb-4.0.3");
    });

    it("should create optimized URL for regular images", () => {
      const baseUrl = "https://images.unsplash.com/photo-123";
      const photoId = "test-photo-id";

      const premiumUrl = createPremiumUnsplashUrl(baseUrl, photoId, 1200, 80);

      expect(premiumUrl).toContain("images.unsplash.com");
      expect(premiumUrl).toContain("client_id=test-access-key");
      expect(premiumUrl).toContain("w=1200");
      expect(premiumUrl).toContain("q=80");
      expect(premiumUrl).toContain("fit=crop");
      expect(premiumUrl).toContain("crop=entropy");
      expect(premiumUrl).toContain("cs=tinysrgb");
      expect(premiumUrl).toContain("fm=jpg");
    });

    it("should use default parameters when not specified", () => {
      const baseUrl = "https://images.unsplash.com/photo-123";
      const photoId = "test-photo-id";

      const premiumUrl = createPremiumUnsplashUrl(baseUrl, photoId);

      expect(premiumUrl).toContain("w=1200");
      expect(premiumUrl).toContain("q=80");
    });

    it("should return original URL when no secret key is configured", () => {
      delete process.env.UNSPLASH_SECRET_KEY;

      const baseUrl = "https://plus.unsplash.com/premium-photo-123";
      const photoId = "test-photo-id";

      const premiumUrl = createPremiumUnsplashUrl(baseUrl, photoId);

      expect(premiumUrl).toBe(baseUrl);

      // Restore secret key
      process.env.UNSPLASH_SECRET_KEY = "test-secret-key";
    });

    it("should handle invalid URLs gracefully", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const invalidUrl = "not-a-valid-url";
      const photoId = "test-photo-id";

      const premiumUrl = createPremiumUnsplashUrl(invalidUrl, photoId);

      expect(premiumUrl).toBe(invalidUrl);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error creating premium Unsplash URL:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });
});
