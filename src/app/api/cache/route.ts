import { NextRequest, NextResponse } from "next/server";
import { unsplashCache } from "@/lib/cache/unsplash-cache";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    switch (action) {
      case "stats": {
        const stats = await unsplashCache.getStats();
        const hitRate = unsplashCache.getCacheHitRate();
        const memorySize = unsplashCache.getMemoryCacheSize();

        return NextResponse.json({
          stats,
          hit_rate: hitRate.toFixed(2) + "%",
          memory_cache_size: memorySize,
        });
      }

      case "clear": {
        await unsplashCache.clearCache();
        return NextResponse.json({ message: "Cache cleared successfully" });
      }

      default:
        return NextResponse.json(
          { error: "Invalid action. Supported: stats, clear" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Cache API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
