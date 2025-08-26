#!/usr/bin/env node

/**
 * Build-time Unsplash Images Cache Script
 *
 * This script pre-fetches Unsplash image data during build time and generates
 * a static manifest file to eliminate runtime API calls in production.
 */

const fs = require("fs").promises;
const path = require("path");
const { createApi } = require("unsplash-js");
require("dotenv").config();

// Initialize Unsplash API client
const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  ...(process.env.UNSPLASH_SECRET_KEY && {
    secret: process.env.UNSPLASH_SECRET_KEY,
  }),
});

// Extract Unsplash photo ID from page URL (same logic as frontend)
function extractUnsplashPhotoId(url) {
  if (!url || !url.includes("unsplash.com/photos/")) return null;

  // Clean the URL first by removing any trailing punctuation
  const cleanUrl = url.replace(/["'.,;:!?]+$/, "");

  // Handle page URLs: https://unsplash.com/photos/{slug}-{id}
  const pageUrlMatch = cleanUrl.match(
    /https:\/\/unsplash\.com\/photos\/.*-([a-zA-Z0-9_-]{11})(?:[\?#]|$)/
  );
  if (pageUrlMatch) {
    return pageUrlMatch[1];
  }

  // Handle simple page URLs: https://unsplash.com/photos/{id}
  const simplePageMatch = cleanUrl.match(
    /https:\/\/unsplash\.com\/photos\/([a-zA-Z0-9_-]{11})(?:[\?#]|$)/
  );
  if (simplePageMatch) {
    return simplePageMatch[1];
  }

  // Handle URLs where the ID is at the end of the path (without slug)
  const endMatch = cleanUrl.match(
    /https:\/\/unsplash\.com\/photos\/[^/]*([a-zA-Z0-9_-]{11})$/
  );
  if (endMatch) {
    return endMatch[1];
  }

  return null;
}

// Create premium watermark-free URL for Unsplash+ subscribers
function createPremiumUnsplashUrl(
  baseUrl,
  photoId,
  width = 1200,
  quality = 80
) {
  // If we don't have a secret key, return the regular URL
  if (!process.env.UNSPLASH_SECRET_KEY) {
    return baseUrl;
  }

  try {
    const url = new URL(baseUrl);

    // For premium content (plus.unsplash.com), we need to ensure proper authentication
    if (url.hostname === "plus.unsplash.com") {
      // For premium content, use minimal parameters and ensure client_id is included
      // Clear existing parameters that might interfere with premium access
      const cleanUrl = new URL(url.origin + url.pathname);

      // Keep essential Unsplash parameters
      if (url.searchParams.get("ixid")) {
        cleanUrl.searchParams.set("ixid", url.searchParams.get("ixid"));
      }
      if (url.searchParams.get("ixlib")) {
        cleanUrl.searchParams.set("ixlib", url.searchParams.get("ixlib"));
      }

      // Add our authentication
      cleanUrl.searchParams.set("client_id", process.env.UNSPLASH_ACCESS_KEY);

      // Add minimal optimization parameters
      cleanUrl.searchParams.set("w", width.toString());
      cleanUrl.searchParams.set("q", quality.toString());
      cleanUrl.searchParams.set("fm", "jpg");

      return cleanUrl.toString();
    } else {
      // For regular images, add standard optimization parameters
      url.searchParams.set("w", width.toString());
      url.searchParams.set("q", quality.toString());
      url.searchParams.set("fit", "crop");
      url.searchParams.set("crop", "entropy");
      url.searchParams.set("cs", "tinysrgb");
      url.searchParams.set("fm", "jpg");
      url.searchParams.set("client_id", process.env.UNSPLASH_ACCESS_KEY);
    }

    return url.toString();
  } catch (error) {
    console.error("Error creating premium Unsplash URL:", error);
    return baseUrl; // Fallback to original URL
  }
}

// Scan MDX files for image URLs
async function scanMdxFiles() {
  const contentDir = path.join(process.cwd(), "content");
  const imageUrls = new Set();

  async function scanDirectory(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await scanDirectory(fullPath);
      } else if (entry.name.endsWith(".mdx")) {
        const content = await fs.readFile(fullPath, "utf-8");

        // Extract frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1];

          // Look for image_url in frontmatter
          const imageUrlMatch = frontmatter.match(
            /image_url:\s*["']([^"']+)["']/
          );
          if (imageUrlMatch) {
            const imageUrl = imageUrlMatch[1];
            if (imageUrl.includes("unsplash.com")) {
              imageUrls.add(imageUrl);
              console.log(`📄 Found image in ${fullPath}: ${imageUrl}`);
            }
          }
        }

        // Also look for Unsplash URLs in content body
        const unsplashUrls = content.match(
          /https:\/\/unsplash\.com\/photos\/[^\s\)"']+/g
        );
        if (unsplashUrls) {
          unsplashUrls.forEach((url) => {
            // Clean up any trailing punctuation that might have been captured
            const cleanUrl = url.replace(/["'.,;:!?]+$/, "");
            imageUrls.add(cleanUrl);
            console.log(
              `📄 Found image in content of ${fullPath}: ${cleanUrl}`
            );
          });
        }
      }
    }
  }

  await scanDirectory(contentDir);
  return Array.from(imageUrls);
}

// Fetch image data from Unsplash API
async function fetchImageData(photoId) {
  try {
    console.log(`🔄 Fetching photo: ${photoId}`);
    const result = await unsplash.photos.get({ photoId });

    if (result.errors) {
      console.log(`❌ API errors for ${photoId}:`, result.errors);
      return null;
    }

    const photo = result.response;
    if (!photo) {
      console.log(`❌ No photo data for ${photoId}`);
      return null;
    }

    // Create premium watermark-free URL
    const premiumUrl = createPremiumUnsplashUrl(
      photo.urls.regular,
      photo.id,
      1200,
      80
    );

    // Trigger download tracking as required by Unsplash API terms
    try {
      await fetch(`https://api.unsplash.com/photos/${photo.id}/download`, {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      });
    } catch (error) {
      // Download tracking failed, but continue serving the image
      console.warn("Download tracking failed for photo:", photo.id);
    }

    const imageData = {
      id: photo.id,
      optimized_url: premiumUrl,
      urls: photo.urls,
      user: {
        name: photo.user.name,
        username: photo.user.username,
        profile_url: `https://unsplash.com/@${photo.user.username}`,
      },
      image_author: photo.user.name,
      image_author_url: `https://unsplash.com/@${photo.user.username}`,
      description: photo.description || photo.alt_description,
      width: photo.width,
      height: photo.height,
      cached_at: Date.now(),
    };

    console.log(`✅ Fetched photo: ${photoId} - ${imageData.image_author}`);
    return imageData;
  } catch (error) {
    console.log(`❌ Error fetching ${photoId}: ${error.message}`);
    return null;
  }
}

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
if (typeof fetch === "undefined") {
  console.error("❌ This script requires Node.js 18+ or a fetch polyfill");
  process.exit(1);
}

main().catch((error) => {
  console.error("❌ Script failed:", error);
  process.exit(1);
});
