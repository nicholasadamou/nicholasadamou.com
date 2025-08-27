import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  beforeAll,
  afterAll,
} from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/unsplash/route";

// Mock the cache to avoid Redis dependency in tests
vi.mock("@/lib/cache/unsplash-cache", () => ({
  unsplashCache: {
    get: vi.fn(),
    set: vi.fn(),
    getStats: vi.fn().mockResolvedValue({
      hits: 10,
      misses: 5,
      total_requests: 15,
    }),
    clearCache: vi.fn(),
    getCacheHitRate: vi.fn().mockReturnValue(66.67),
    getMemoryCacheSize: vi.fn().mockReturnValue(5),
  },
}));

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

const mockPremiumPhotoData = {
  ...mockPhotoData,
  id: "premium-photo-id",
  urls: {
    ...mockPhotoData.urls,
    regular: "https://plus.unsplash.com/premium-photo-test-regular",
  },
};

// MSW server setup
const server = setupServer(
  // Mock successful photo fetch
  http.get("https://api.unsplash.com/photos/test-photo-id", () => {
    return HttpResponse.json(mockPhotoData);
  }),

  // Mock premium photo fetch
  http.get("https://api.unsplash.com/photos/premium-photo-id", () => {
    return HttpResponse.json(mockPremiumPhotoData);
  }),

  // Mock photo not found
  http.get("https://api.unsplash.com/photos/not-found", () => {
    return new HttpResponse(null, { status: 404 });
  }),

  // Mock rate limit
  http.get("https://api.unsplash.com/photos/rate-limited", () => {
    return new HttpResponse("Rate Limit Exceeded", { status: 403 });
  }),

  // Mock download tracking
  http.get("https://api.unsplash.com/photos/*/download", () => {
    return HttpResponse.json({
      url: "https://unsplash.com/photos/download-url",
    });
  }),

  // Mock network error
  http.get("https://api.unsplash.com/photos/network-error", () => {
    return HttpResponse.error();
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Unsplash API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/unsplash", () => {
    describe("get-photo action", () => {
      it("should return cached photo when available", async () => {
        const { unsplashCache } = await import("@/lib/cache/unsplash-cache");
        const cachedData = {
          id: "test-photo-id",
          optimized_url: "cached-url",
          urls: mockPhotoData.urls,
          user: {
            name: "Test Photographer",
            username: "test-photographer",
            profile_url: "https://unsplash.com/@test-photographer",
          },
          image_author: "Test Photographer",
          image_author_url: "https://unsplash.com/@test-photographer",
          description: "Test photo description",
          width: 4000,
          height: 3000,
        };

        vi.mocked(unsplashCache.get).mockResolvedValue(cachedData);

        const request = new NextRequest(
          "http://localhost:3000/api/unsplash?action=get-photo&id=test-photo-id"
        );
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual(cachedData);
        expect(unsplashCache.get).toHaveBeenCalledWith("test-photo-id");
      });

      it("should fetch photo from API when not cached", async () => {
        const { unsplashCache } = await import("@/lib/cache/unsplash-cache");
        vi.mocked(unsplashCache.get).mockResolvedValue(null);
        vi.mocked(unsplashCache.set).mockResolvedValue();

        const request = new NextRequest(
          "http://localhost:3000/api/unsplash?action=get-photo&id=test-photo-id"
        );
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.id).toBe("test-photo-id");
        expect(data.optimized_url).toContain("test-regular");
        expect(data.user.name).toBe("Test Photographer");
        expect(data.image_author).toBe("Test Photographer");
        expect(data.width).toBe(4000);
        expect(data.height).toBe(3000);
        expect(unsplashCache.set).toHaveBeenCalled();
      });

      it("should handle premium photos correctly", async () => {
        const { unsplashCache } = await import("@/lib/cache/unsplash-cache");
        vi.mocked(unsplashCache.get).mockResolvedValue(null);
        vi.mocked(unsplashCache.set).mockResolvedValue();

        const request = new NextRequest(
          "http://localhost:3000/api/unsplash?action=get-photo&id=premium-photo-id"
        );
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.id).toBe("premium-photo-id");
        expect(data.optimized_url).toContain("plus.unsplash.com");
        expect(data.optimized_url).toContain("client_id=test-access-key");
      });

      it("should return 400 when photo ID is missing", async () => {
        const request = new NextRequest(
          "http://localhost:3000/api/unsplash?action=get-photo"
        );
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("Photo ID is required");
      });

      it("should return 404 when photo is not found", async () => {
        const { unsplashCache } = await import("@/lib/cache/unsplash-cache");
        vi.mocked(unsplashCache.get).mockResolvedValue(null);

        const request = new NextRequest(
          "http://localhost:3000/api/unsplash?action=get-photo&id=not-found"
        );
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.error).toBe("Photo not found or API error");
        expect(data.message).toContain("invalid photo ID or API issues");
      });

      it("should handle rate limiting gracefully", async () => {
        const { unsplashCache } = await import("@/lib/cache/unsplash-cache");
        vi.mocked(unsplashCache.get).mockResolvedValue(null);

        const request = new NextRequest(
          "http://localhost:3000/api/unsplash?action=get-photo&id=rate-limited"
        );
        const response = await GET(request);
        const data = await response.json();

        // Should return 429 Rate Limit Exceeded
        expect(response.status).toBe(429);
        expect(data.error).toBe("Rate limit exceeded");
        expect(data.message).toContain("Unsplash API rate limit reached");
      }, 15000);

      it("should handle network errors", async () => {
        const { unsplashCache } = await import("@/lib/cache/unsplash-cache");
        vi.mocked(unsplashCache.get).mockResolvedValue(null);

        const request = new NextRequest(
          "http://localhost:3000/api/unsplash?action=get-photo&id=network-error"
        );
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.error).toBe("Photo not found or API error");
      }, 15000);

      it("should return 500 when API key is not configured", async () => {
        delete process.env.UNSPLASH_ACCESS_KEY;

        const request = new NextRequest(
          "http://localhost:3000/api/unsplash?action=get-photo&id=test-photo-id"
        );
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe("Unsplash API key not configured");

        // Restore the API key
        process.env.UNSPLASH_ACCESS_KEY = "test-access-key";
      });
    });

    describe("extract-id action", () => {
      it("should extract photo ID from page URL with slug", async () => {
        const request = new NextRequest(
          "http://localhost:3000/api/unsplash?action=extract-id&url=https://unsplash.com/photos/beautiful-sunset-abc123def456"
        );
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.photo_id).toBe("abc123def456");
      });

      it("should extract photo ID from simple page URL", async () => {
        const request = new NextRequest(
          "http://localhost:3000/api/unsplash?action=extract-id&url=https://unsplash.com/photos/abc123def456"
        );
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.photo_id).toBe("abc123def456");
      });

      it("should return 400 when URL is missing", async () => {
        const request = new NextRequest(
          "http://localhost:3000/api/unsplash?action=extract-id"
        );
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("URL is required");
      });

      it("should return 400 when photo ID cannot be extracted", async () => {
        const request = new NextRequest(
          "http://localhost:3000/api/unsplash?action=extract-id&url=https://example.com/invalid-url"
        );
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("Could not extract photo ID from URL");
      });
    });

    describe("invalid action", () => {
      it("should return 400 for invalid action", async () => {
        const request = new NextRequest(
          "http://localhost:3000/api/unsplash?action=invalid"
        );
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe(
          "Invalid action. Supported actions: get-photo, extract-id"
        );
      });
    });

    describe("error handling", () => {
      it("should handle internal server errors", async () => {
        // Mock unsplashCache to throw an error
        const { unsplashCache } = await import("@/lib/cache/unsplash-cache");
        vi.mocked(unsplashCache.get).mockRejectedValue(
          new Error("Cache error")
        );

        const request = new NextRequest(
          "http://localhost:3000/api/unsplash?action=get-photo&id=test-photo-id"
        );
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe("Internal server error");
      });
    });
  });
});
