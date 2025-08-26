#!/usr/bin/env node

/**
 * Build-time Unsplash Images Cache Script
 *
 * This script pre-fetches Unsplash image data during build time and generates
 * a static manifest file to eliminate runtime API calls in production.
 */

const fs = require("fs").promises;
const path = require("path");
const {
  extractUnsplashPhotoId,
  scanMdxFiles,
  fetchImageData,
  checkFetchAvailable,
} = require("./lib/unsplash-lib");

require("dotenv").config();

// Main function
async function main() {
  console.log("🚀 Build-time Unsplash Image Caching Tool\n");

  // Check if API key is configured
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    console.warn("⚠️  UNSPLASH_ACCESS_KEY environment variable not configured");
    console.log("🔧 Running in fallback mode - creating empty manifest");

    // Create empty manifest for CI builds without API keys
    const manifest = {
      generated_at: new Date().toISOString(),
      build_version: "2.0.0",
      images: {},
      stats: {
        total_found: 0,
        successfully_cached: 0,
        failed_to_cache: 0,
        success_rate: "0%",
      },
      metadata: {
        scan_timestamp: Date.now(),
        environment: process.env.NODE_ENV || "development",
        has_secret_key: !!process.env.UNSPLASH_SECRET_KEY,
        fallback_mode: true,
        reason: "No API key configured",
      },
    };

    const manifestDir = path.join(process.cwd(), "public");
    await fs.mkdir(manifestDir, { recursive: true });
    await fs.writeFile(
      path.join(manifestDir, "unsplash-manifest.json"),
      JSON.stringify(manifest, null, 2)
    );

    console.log("📄 Fallback manifest created successfully");
    console.log(
      "💡 To enable image caching, set UNSPLASH_ACCESS_KEY environment variable"
    );
    return;
  }

  console.log("✅ Unsplash API key configured");

  // Scan for images
  console.log("🔍 Scanning MDX files for Unsplash images...");
  const imageUrls = await scanMdxFiles();

  if (imageUrls.length === 0) {
    console.log("⚠️  No Unsplash images found in your content");

    // Create empty manifest
    const manifest = {
      generated_at: new Date().toISOString(),
      images: {},
      stats: {
        total_found: 0,
        successfully_cached: 0,
        failed_to_cache: 0,
      },
    };

    const manifestDir = path.join(process.cwd(), "public");
    await fs.mkdir(manifestDir, { recursive: true });
    await fs.writeFile(
      path.join(manifestDir, "unsplash-manifest.json"),
      JSON.stringify(manifest, null, 2)
    );

    console.log("📄 Empty manifest created");
    return;
  }

  console.log(`\n📊 Found ${imageUrls.length} unique Unsplash images:`);
  imageUrls.forEach((url, index) => {
    console.log(`   ${index + 1}. ${url}`);
  });

  // Fetch all images
  console.log("\n🚀 Starting build-time fetch...");
  const imageManifest = {};
  let cached = 0;
  let failed = 0;

  for (const imageUrl of imageUrls) {
    const photoId = extractUnsplashPhotoId(imageUrl);
    if (!photoId) {
      console.log(`⚠️  Could not extract photo ID from: ${imageUrl}`);
      failed++;
      continue;
    }

    const imageData = await fetchImageData(photoId);
    if (imageData) {
      imageManifest[photoId] = imageData;
      cached++;
    } else {
      failed++;
    }

    // Add small delay to avoid overwhelming the API
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Generate comprehensive manifest file
  const manifest = {
    generated_at: new Date().toISOString(),
    build_version: "2.0.0",
    images: imageManifest,
    stats: {
      total_found: imageUrls.length,
      successfully_cached: cached,
      failed_to_cache: failed,
      success_rate:
        imageUrls.length > 0
          ? ((cached / imageUrls.length) * 100).toFixed(1) + "%"
          : "0%",
    },
    // Add metadata for debugging
    metadata: {
      scan_timestamp: Date.now(),
      environment: process.env.NODE_ENV || "development",
      has_secret_key: !!process.env.UNSPLASH_SECRET_KEY,
    },
  };

  const manifestDir = path.join(process.cwd(), "public");
  await fs.mkdir(manifestDir, { recursive: true });
  await fs.writeFile(
    path.join(manifestDir, "unsplash-manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  console.log(`\n📊 Build-time Cache Results:`);
  console.log(`   ✅ Successfully cached: ${cached}`);
  console.log(`   ❌ Failed to cache: ${failed}`);
  console.log(
    `   📈 Success rate: ${((cached / imageUrls.length) * 100).toFixed(1)}%`
  );
  console.log(`   📄 Manifest generated at: public/unsplash-manifest.json`);

  console.log("\n🎉 Build-time caching complete!");
  console.log("\n💡 Tips:");
  console.log(
    "   • This manifest will be used by the UniversalImage component"
  );
  console.log(
    "   • No runtime API calls will be made for these images in production"
  );
  console.log(
    "   • Run this script again when you add new images to your content"
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
