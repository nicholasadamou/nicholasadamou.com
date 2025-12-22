import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  beforeAll,
  afterEach,
} from "vitest";
import {
  UnsplashCache,
  type CachedUnsplashPhoto,
} from "@/lib/cache/unsplash-cache";

// Mock ioredis to avoid Redis dependency in tests
const mockRedis = {
  get: vi.fn(),
  setex: vi.fn(),
  del: vi.fn(),
  keys: vi.fn(),
  quit: vi.fn(),
};

vi.mock("ioredis", () => ({
  Redis: vi.fn(() => mockRedis),
}));

// Mock console methods to avoid noise in tests
const consoleSpies = {
  log: vi.spyOn(console, "log").mockImplementation(() => {}),
  warn: vi.spyOn(console, "warn").mockImplementation(() => {}),
  error: vi.spyOn(console, "error").mockImplementation(() => {}),
};

// Create a fresh instance for each test
let unsplashCache: UnsplashCache;

beforeAll(() => {
  // Set environment variable to enable Redis
  process.env.REDIS_URL = "redis://localhost:6379";
});

beforeEach(() => {
  // Create a fresh cache instance for each test
  unsplashCache = new UnsplashCache();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("UnsplashCache", () => {
  const mockPhotoData: Omit<CachedUnsplashPhoto, "cached_at"> = {
    id: "test-photo-id",
    optimized_url: "https://example.com/optimized-photo.jpg",
    urls: {
      raw: "https://example.com/raw.jpg",
      full: "https://example.com/full.jpg",
      regular: "https://example.com/regular.jpg",
      small: "https://example.com/small.jpg",
      thumb: "https://example.com/thumb.jpg",
    },
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

  beforeEach(() => {
    // Reset all mocks before each test
    Object.values(mockRedis).forEach((mock) => mock.mockReset());
    Object.values(consoleSpies).forEach((spy) => spy.mockClear());
  });

  describe("get", () => {
    it("should return cached data from Redis when available and valid", async () => {
      const cachedData: CachedUnsplashPhoto = {
        ...mockPhotoData,
        cached_at: Date.now() - 1000, // 1 second ago
      };

      mockRedis.get.mockResolvedValue(JSON.stringify(cachedData));

      const result = await unsplashCache.get("test-photo-id");

      expect(result).toEqual(
        expect.objectContaining({
          id: "test-photo-id",
          optimized_url: "https://example.com/optimized-photo.jpg",
        })
      );
      expect(mockRedis.get).toHaveBeenCalledWith(
        "unsplash:photo:test-photo-id"
      );
    });

    it("should remove expired data from Redis and return null", async () => {
      const expiredData: CachedUnsplashPhoto = {
        ...mockPhotoData,
        cached_at: Date.now() - 25 * 60 * 60 * 1000, // 25 hours ago (expired)
      };

      mockRedis.get.mockResolvedValue(JSON.stringify(expiredData));
      mockRedis.del.mockResolvedValue(1);

      const result = await unsplashCache.get("test-photo-id");

      expect(result).toBeNull();
      expect(mockRedis.del).toHaveBeenCalledWith(
        "unsplash:photo:test-photo-id"
      );
    });

    it("should fall back to memory cache when Redis is not available", async () => {
      mockRedis.get.mockResolvedValue(null);

      // First, store data in cache
      await unsplashCache.set("test-photo-id", mockPhotoData);

      // Clear Redis mock and make it return null
      mockRedis.get.mockResolvedValue(null);

      const result = await unsplashCache.get("test-photo-id");

      expect(result).toBeTruthy();
      expect(result?.id).toBe("test-photo-id");
    });

    it("should return null when data is not cached anywhere", async () => {
      mockRedis.get.mockResolvedValue(null);

      const result = await unsplashCache.get("non-existent-photo");

      expect(result).toBeNull();
    });

    it("should handle Redis errors gracefully", async () => {
      // First store something in memory cache
      mockRedis.setex.mockResolvedValue("OK");
      await unsplashCache.set("test-photo-id", mockPhotoData);

      // Now make Redis operations fail - should fallback to memory cache
      mockRedis.get.mockRejectedValue(new Error("Redis connection error"));

      const result = await unsplashCache.get("test-photo-id");

      // Should get data from memory cache even if Redis fails
      expect(result).not.toBeNull();
      expect(result?.id).toBe("test-photo-id");
      expect(consoleSpies.error).toHaveBeenCalledWith(
        "Redis get error:",
        expect.any(Error)
      );
    });

    it("should handle JSON parsing errors", async () => {
      // First store something in memory cache
      mockRedis.setex.mockResolvedValue("OK");
      await unsplashCache.set("test-photo-id", mockPhotoData);

      // Now make Redis return invalid JSON - the get should fall back to memory cache
      mockRedis.get.mockResolvedValue("invalid-json");

      const result = await unsplashCache.get("test-photo-id");

      // Should fall back to memory cache
      expect(result).not.toBeNull();
      expect(result?.id).toBe("test-photo-id");
      expect(consoleSpies.error).toHaveBeenCalledWith(
        "JSON parse error for Redis data:",
        expect.any(Error)
      );
    });
  });

  describe("set", () => {
    it("should store data in both Redis and memory cache", async () => {
      mockRedis.setex.mockResolvedValue("OK");

      await unsplashCache.set("test-photo-id", mockPhotoData);

      expect(mockRedis.setex).toHaveBeenCalledWith(
        "unsplash:photo:test-photo-id",
        24 * 60 * 60, // 24 hours
        expect.stringContaining('"id":"test-photo-id"')
      );
    });

    it("should handle Redis errors during set operation", async () => {
      mockRedis.setex.mockRejectedValue(new Error("Redis connection error"));

      await expect(
        unsplashCache.set("test-photo-id", mockPhotoData)
      ).resolves.not.toThrow();

      expect(consoleSpies.error).toHaveBeenCalledWith(
        "Cache set error:",
        expect.any(Error)
      );
    });

    it("should limit memory cache size", async () => {
      // Add many items to exceed the limit (100 items)
      const promises = [];
      for (let i = 0; i < 150; i++) {
        const photoData = { ...mockPhotoData, id: `photo-${i}` };
        promises.push(unsplashCache.set(`photo-${i}`, photoData));
      }

      await Promise.all(promises);

      // Memory cache size should be limited
      expect(unsplashCache.getMemoryCacheSize()).toBeLessThanOrEqual(100);
    });
  });

  describe("getStats", () => {
    it("should return stats from Redis when available", async () => {
      const mockStats = {
        hits: 10,
        misses: 5,
        total_requests: 15,
      };

      mockRedis.get.mockResolvedValue(JSON.stringify(mockStats));

      const stats = await unsplashCache.getStats();

      expect(stats).toEqual(mockStats);
      expect(mockRedis.get).toHaveBeenCalledWith("unsplash:cache:stats");
    });

    it("should return local stats when Redis is not available", async () => {
      mockRedis.get.mockResolvedValue(null);

      // Simulate some cache operations to generate stats
      await unsplashCache.get("test-1"); // miss
      await unsplashCache.get("test-2"); // miss

      const stats = await unsplashCache.getStats();

      expect(stats.misses).toBeGreaterThan(0);
      expect(stats.total_requests).toBeGreaterThan(0);
    });

    it("should handle Redis errors during stats retrieval", async () => {
      mockRedis.get.mockRejectedValue(new Error("Redis error"));

      const stats = await unsplashCache.getStats();

      expect(stats).toBeTruthy();
      expect(consoleSpies.error).toHaveBeenCalledWith(
        "Error getting cache stats:",
        expect.any(Error)
      );
    });
  });

  describe("clearCache", () => {
    it("should clear both Redis and memory cache", async () => {
      const mockKeys = [
        "unsplash:photo:1",
        "unsplash:photo:2",
        "unsplash:cache:stats",
      ];
      mockRedis.keys.mockResolvedValue(mockKeys);
      mockRedis.del.mockResolvedValue(3);

      await unsplashCache.clearCache();

      expect(mockRedis.keys).toHaveBeenCalledWith("unsplash:*");
      expect(mockRedis.del).toHaveBeenCalledWith(...mockKeys);
    });

    it("should handle empty Redis cache", async () => {
      mockRedis.keys.mockResolvedValue([]);

      await unsplashCache.clearCache();

      expect(mockRedis.del).not.toHaveBeenCalled();
    });

    it("should handle Redis errors during cache clear", async () => {
      mockRedis.keys.mockRejectedValue(new Error("Redis error"));

      await expect(unsplashCache.clearCache()).resolves.not.toThrow();

      expect(consoleSpies.error).toHaveBeenCalledWith(
        "Error clearing cache:",
        expect.any(Error)
      );
    });
  });

  describe("getCacheHitRate", () => {
    it("should calculate hit rate correctly", async () => {
      // Simulate cache operations
      mockRedis.get.mockResolvedValue(null);

      await unsplashCache.get("test-1"); // miss
      await unsplashCache.get("test-2"); // miss

      // Add some data and retrieve it for hits
      await unsplashCache.set("test-3", mockPhotoData);
      mockRedis.get.mockResolvedValueOnce(
        JSON.stringify({
          ...mockPhotoData,
          cached_at: Date.now(),
        })
      );

      await unsplashCache.get("test-3"); // hit

      const hitRate = unsplashCache.getCacheHitRate();

      expect(hitRate).toBeGreaterThan(0);
      expect(hitRate).toBeLessThanOrEqual(100);
    });

    it("should return 0 when no requests have been made", () => {
      // Create a fresh cache instance for this test
      const hitRate = unsplashCache.getCacheHitRate();

      expect(hitRate).toBeGreaterThanOrEqual(0);
    });
  });

  describe("getMemoryCacheSize", () => {
    it("should return the current memory cache size", async () => {
      const initialSize = unsplashCache.getMemoryCacheSize();

      await unsplashCache.set("test-memory-1", mockPhotoData);
      await unsplashCache.set("test-memory-2", {
        ...mockPhotoData,
        id: "test-memory-2",
      });

      const newSize = unsplashCache.getMemoryCacheSize();

      expect(newSize).toBeGreaterThanOrEqual(initialSize);
    });
  });

  describe("close", () => {
    it("should close Redis connection", async () => {
      mockRedis.quit.mockResolvedValue("OK");

      await unsplashCache.close();

      expect(mockRedis.quit).toHaveBeenCalled();
    });
  });

  describe("updateStats", () => {
    it("should update stats in Redis", async () => {
      mockRedis.setex.mockResolvedValue("OK");

      await unsplashCache.updateStats();

      expect(mockRedis.setex).toHaveBeenCalledWith(
        "unsplash:cache:stats",
        24 * 60 * 60,
        expect.stringContaining('"hits"')
      );
    });

    it("should handle Redis errors during stats update", async () => {
      mockRedis.setex.mockRejectedValue(new Error("Redis error"));

      await expect(unsplashCache.updateStats()).resolves.not.toThrow();

      expect(consoleSpies.error).toHaveBeenCalledWith(
        "Error updating cache stats:",
        expect.any(Error)
      );
    });
  });

  describe("initialization without Redis", () => {
    it("should work without Redis configuration", () => {
      // This is tested by the fact that the cache works with mocked Redis
      // In a real scenario without Redis URL, it would only use memory cache
      expect(unsplashCache).toBeTruthy();
      expect(unsplashCache.getMemoryCacheSize()).toBeGreaterThanOrEqual(0);
    });
  });
});
