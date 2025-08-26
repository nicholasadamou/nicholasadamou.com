#!/usr/bin/env node

/**
 * Pre-cache Unsplash Images Script
 *
 * This script scans all MDX files for Unsplash image URLs,
 * fetches them from the API, and caches them to reduce runtime API calls.
 */

const fs = require("fs").promises;
const path = require("path");
const {
  extractUnsplashPhotoId,
  scanMdxFiles,
  checkFetchAvailable,
} = require("./unsplash-lib");

require("dotenv").config();

// Call local API to cache images
async function cacheImage(imageUrl) {
  const photoId = extractUnsplashPhotoId(imageUrl);
  if (!photoId) {
    console.log(`⚠️  Could not extract photo ID from: ${imageUrl}`);
    return false;
  }

  try {
    console.log(`🔄 Caching photo: ${photoId}`);
    const response = await fetch(
      `http://localhost:3000/api/unsplash?action=get-photo&id=${photoId}`
    );

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Cached photo: ${photoId} - ${data.image_author}`);
      return true;
    } else {
      const error = await response.json();
      console.log(
        `❌ Failed to cache ${photoId}: ${error.error || "Unknown error"}`
      );
      return false;
    }
  } catch (error) {
    console.log(`❌ Error caching ${photoId}: ${error.message}`);
    return false;
  }
}

// Add cache management endpoints to the API
async function addCacheManagementEndpoint() {
  const routePath = path.join(process.cwd(), "src/app/api/cache/route.ts");

  const cacheApiContent = `import { NextRequest, NextResponse } from "next/server";
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
          hit_rate: hitRate.toFixed(2) + '%',
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
}`;

  try {
    await fs.mkdir(path.dirname(routePath), { recursive: true });
    await fs.writeFile(routePath, cacheApiContent);
    console.log("✅ Created cache management API endpoint");
  } catch (error) {
    console.log("⚠️  Could not create cache API endpoint:", error.message);
  }
}

// Main function
async function main() {
  console.log("🔍 Unsplash Image Pre-Caching Tool\n");

  // Check if server is running
  try {
    const response = await fetch(
      "http://localhost:3000/api/unsplash?action=extract-id&url=https://unsplash.com/photos/test-123"
    );
    if (!response.ok && response.status !== 400) {
      console.log(
        "❌ Development server is not running. Please start it with:"
      );
      console.log("   pnpm dev");
      process.exit(1);
    }
  } catch (error) {
    console.log(
      "❌ Cannot connect to development server. Please start it with:"
    );
    console.log("   pnpm dev");
    process.exit(1);
  }

  console.log("✅ Development server is running");

  // Create cache management API
  await addCacheManagementEndpoint();

  // Scan for images
  console.log("🔍 Scanning MDX files for Unsplash images...");
  const imageUrls = await scanMdxFiles();

  if (imageUrls.length === 0) {
    console.log("⚠️  No Unsplash images found in your content");
    return;
  }

  console.log(`\n📊 Found ${imageUrls.length} unique Unsplash images:`);
  imageUrls.forEach((url, index) => {
    console.log(`   ${index + 1}. ${url}`);
  });

  // Cache all images
  console.log("\n🚀 Starting cache population...");
  let cached = 0;
  let failed = 0;

  for (const imageUrl of imageUrls) {
    const success = await cacheImage(imageUrl);
    if (success) {
      cached++;
    } else {
      failed++;
    }

    // Add small delay to avoid overwhelming the API
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log(`\n📊 Cache Population Results:`);
  console.log(`   ✅ Successfully cached: ${cached}`);
  console.log(`   ❌ Failed to cache: ${failed}`);
  console.log(
    `   📈 Success rate: ${((cached / imageUrls.length) * 100).toFixed(1)}%`
  );

  // Show cache stats
  try {
    const statsResponse = await fetch(
      "http://localhost:3000/api/cache?action=stats"
    );
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log(`\n💾 Cache Statistics:`);
      console.log(`   🎯 Hit rate: ${stats.hit_rate}`);
      console.log(`   📦 Memory cache size: ${stats.memory_cache_size}`);
      console.log(`   📊 Total requests: ${stats.stats.total_requests}`);
    }
  } catch (error) {
    console.log("⚠️  Could not fetch cache stats");
  }

  console.log("\n🎉 Pre-caching complete!");
  console.log("\n💡 Tips:");
  console.log("   • Run this script after adding new images to your content");
  console.log(
    "   • Check cache stats at: http://localhost:3000/api/cache?action=stats"
  );
  console.log(
    "   • Clear cache with: http://localhost:3000/api/cache?action=clear"
  );
}

// Check if fetch is available (Node.js 18+)
if (!checkFetchAvailable()) {
  process.exit(1);
}

main().catch((error) => {
  console.error("❌ Script failed:", error);
  process.exit(1);
});
