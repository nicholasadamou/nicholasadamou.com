import { Redis } from "ioredis";

// Types
interface CachedUnsplashPhoto {
  id: string;
  optimized_url: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
    profile_url: string;
  };
  image_author: string;
  image_author_url: string;
  description?: string;
  width: number;
  height: number;
  cached_at: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  total_requests: number;
}

class UnsplashCache {
  private redis: Redis | null = null;
  private memoryCache: Map<string, CachedUnsplashPhoto> = new Map();
  private stats: CacheStats = { hits: 0, misses: 0, total_requests: 0 };
  private readonly CACHE_DURATION = 24 * 60 * 60; // 24 hours in seconds
  private readonly MAX_MEMORY_CACHE_SIZE = 100;

  constructor() {
    this.initRedis();
  }

  private initRedis() {
    try {
      // Only initialize Redis if URL is provided
      if (process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL) {
        this.redis = new Redis(
          process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL!
        );
        console.log("✅ Redis cache initialized");
      } else {
        console.log("📝 Using memory cache (Redis not configured)");
      }
    } catch (error) {
      console.warn(
        "⚠️ Redis initialization failed, falling back to memory cache:",
        error
      );
      this.redis = null;
    }
  }

  private generateCacheKey(photoId: string): string {
    return `unsplash:photo:${photoId}`;
  }

  private generateStatsKey(): string {
    return "unsplash:cache:stats";
  }

  async get(photoId: string): Promise<CachedUnsplashPhoto | null> {
    this.stats.total_requests++;

    try {
      // Try Redis first
      if (this.redis) {
        try {
          const cached = await this.redis.get(this.generateCacheKey(photoId));
          if (cached) {
            try {
              const parsed = JSON.parse(cached) as CachedUnsplashPhoto;

              // Check if cache is still valid (not older than 24 hours)
              if (Date.now() - parsed.cached_at < this.CACHE_DURATION * 1000) {
                this.stats.hits++;
                console.log(`🎯 Redis cache HIT for photo: ${photoId}`);
                return parsed;
              } else {
                // Cache expired, remove it
                await this.redis.del(this.generateCacheKey(photoId));
              }
            } catch (parseError) {
              console.error("JSON parse error for Redis data:", parseError);
              // Continue to memory cache fallback
            }
          }
        } catch (redisError) {
          console.error("Redis get error:", redisError);
          // Continue to memory cache fallback
        }
      }

      // Try memory cache
      const memoryCached = this.memoryCache.get(photoId);
      if (memoryCached) {
        // Check if cache is still valid
        if (Date.now() - memoryCached.cached_at < this.CACHE_DURATION * 1000) {
          this.stats.hits++;
          console.log(`🎯 Memory cache HIT for photo: ${photoId}`);
          return memoryCached;
        } else {
          // Cache expired, remove it
          this.memoryCache.delete(photoId);
        }
      }

      this.stats.misses++;
      console.log(`❌ Cache MISS for photo: ${photoId}`);
      return null;
    } catch (error) {
      console.error("Cache get error:", error);
      this.stats.misses++;
      return null;
    }
  }

  async set(
    photoId: string,
    data: Omit<CachedUnsplashPhoto, "cached_at">
  ): Promise<void> {
    const cachedData: CachedUnsplashPhoto = {
      ...data,
      cached_at: Date.now(),
    };

    try {
      // Store in Redis
      if (this.redis) {
        await this.redis.setex(
          this.generateCacheKey(photoId),
          this.CACHE_DURATION,
          JSON.stringify(cachedData)
        );
        console.log(`💾 Stored in Redis cache: ${photoId}`);
      }

      // Store in memory cache (with size limit)
      if (this.memoryCache.size >= this.MAX_MEMORY_CACHE_SIZE) {
        // Remove oldest entry
        const firstKey = this.memoryCache.keys().next().value;
        if (firstKey) {
          this.memoryCache.delete(firstKey);
        }
      }
      this.memoryCache.set(photoId, cachedData);
      console.log(`💾 Stored in memory cache: ${photoId}`);
    } catch (error) {
      console.error("Cache set error:", error);
    }
  }

  async getStats(): Promise<CacheStats> {
    try {
      // Try to get stats from Redis
      if (this.redis) {
        const redisStats = await this.redis.get(this.generateStatsKey());
        if (redisStats) {
          return JSON.parse(redisStats);
        }
      }
      return this.stats;
    } catch (error) {
      console.error("Error getting cache stats:", error);
      return this.stats;
    }
  }

  async updateStats(): Promise<void> {
    try {
      if (this.redis) {
        await this.redis.setex(
          this.generateStatsKey(),
          this.CACHE_DURATION,
          JSON.stringify(this.stats)
        );
      }
    } catch (error) {
      console.error("Error updating cache stats:", error);
    }
  }

  async clearCache(): Promise<void> {
    try {
      if (this.redis) {
        const keys = await this.redis.keys("unsplash:*");
        if (keys.length > 0) {
          await this.redis.del(...keys);
          console.log(`🗑️ Cleared ${keys.length} Redis cache entries`);
        }
      }

      this.memoryCache.clear();
      this.stats = { hits: 0, misses: 0, total_requests: 0 };
      console.log("🗑️ Cleared memory cache and stats");
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }

  getCacheHitRate(): number {
    if (this.stats.total_requests === 0) return 0;
    return (this.stats.hits / this.stats.total_requests) * 100;
  }

  getMemoryCacheSize(): number {
    return this.memoryCache.size;
  }

  async close(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
    }
  }
}

// Singleton instance
export const unsplashCache = new UnsplashCache();

// Export class and types
export { UnsplashCache };
export type { CachedUnsplashPhoto, CacheStats };
