#!/usr/bin/env node

/**
 * Download Unsplash Images Script
 *
 * This script reads the unsplash-manifest.json and systematically downloads
 * all optimized images to the public/images directory for local self-serving
 * when the fallback API doesn't work.
 */

const fs = require("fs").promises;
const path = require("path");
const { createWriteStream } = require("fs");
const { pipeline } = require("stream/promises");
const {
  constructDownloadUrl,
  extractIxidFromUrl,
  sanitizeFilename,
  getImageExtension,
  createProgressBar,
  checkFetchAvailable,
} = require("./unsplash/unsplash-lib");

// Configuration
const CONFIG = {
  manifestPath: path.join(process.cwd(), "public", "unsplash-manifest.json"),
  downloadDir: path.join(process.cwd(), "public", "images", "unsplash"),
  concurrency: 3, // Number of simultaneous downloads
  retries: 3, // Number of retry attempts for failed downloads
  timeout: 30000, // 30 seconds timeout per download
};

// Download function with timeout and retry logic
async function downloadImage(url, filepath, retries = CONFIG.retries) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Image-Downloader/1.0)",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Ensure directory exists
      await fs.mkdir(path.dirname(filepath), { recursive: true });

      // Stream the image to file
      const fileStream = createWriteStream(filepath);
      await pipeline(response.body, fileStream);

      return { success: true, filepath };
    } catch (error) {
      if (attempt === retries) {
        return {
          success: false,
          error: error.message,
          filepath,
        };
      }

      // Wait before retry (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// Process images in batches to avoid overwhelming the system
async function downloadImagesBatch(imageEntries, progressBar) {
  const results = {
    successful: [],
    failed: [],
    skipped: [],
  };

  for (let i = 0; i < imageEntries.length; i += CONFIG.concurrency) {
    const batch = imageEntries.slice(i, i + CONFIG.concurrency);

    const batchPromises = batch.map(async ([photoId, imageData]) => {
      // Determine which URL to use for downloading
      let downloadUrl;
      let isUnwatermarked = false;

      // Extract ixid from the optimized_url to construct download URL
      const ixid = extractIxidFromUrl(imageData.optimized_url);

      if (ixid) {
        // Use unwatermarked download URL
        downloadUrl = constructDownloadUrl(photoId, ixid);
        isUnwatermarked = true;
      } else {
        // Fallback to optimized_url if we can't extract ixid
        downloadUrl = imageData.optimized_url;
        console.warn(
          `⚠️  Could not extract ixid for ${photoId}, using optimized URL`
        );
      }

      const extension = getImageExtension(imageData.optimized_url);
      const filename = `${sanitizeFilename(photoId)}.${extension}`;
      const filepath = path.join(CONFIG.downloadDir, filename);

      // Check if file already exists
      try {
        await fs.access(filepath);
        results.skipped.push({
          photoId,
          filepath,
          reason: "Already exists",
        });
        progressBar.update();
        return;
      } catch {
        // File doesn't exist, proceed with download
      }

      const result = await downloadImage(downloadUrl, filepath);

      if (result.success) {
        results.successful.push({
          photoId,
          filepath: result.filepath,
          author: imageData.image_author,
          url: downloadUrl,
          unwatermarked: isUnwatermarked,
          original_url: imageData.optimized_url,
        });
      } else {
        results.failed.push({
          photoId,
          filepath: result.filepath,
          error: result.error,
          url: downloadUrl,
          unwatermarked: isUnwatermarked,
          original_url: imageData.optimized_url,
        });
      }

      progressBar.update();
    });

    await Promise.all(batchPromises);

    // Small delay between batches to be respectful
    if (i + CONFIG.concurrency < imageEntries.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return results;
}

// Create a local manifest mapping photo IDs to local file paths
async function createLocalManifest(results, originalManifest) {
  const localManifest = {
    generated_at: new Date().toISOString(),
    version: "1.0.0",
    source_manifest: originalManifest.generated_at,
    images: {},
    stats: {
      total_images:
        results.successful.length +
        results.failed.length +
        results.skipped.length,
      downloaded: results.successful.length,
      failed: results.failed.length,
      skipped: results.skipped.length,
    },
  };

  // Add successful downloads
  results.successful.forEach((item) => {
    const relativePath = path.relative(
      path.join(process.cwd(), "public"),
      item.filepath
    );
    localManifest.images[item.photoId] = {
      local_path: `/${relativePath.replace(/\\/g, "/")}`, // Ensure forward slashes for web
      download_url: item.url,
      optimized_url: item.original_url,
      author: item.author,
      downloaded_at: new Date().toISOString(),
      unwatermarked: item.unwatermarked,
    };
  });

  // Add skipped files (they exist locally)
  results.skipped.forEach((item) => {
    const relativePath = path.relative(
      path.join(process.cwd(), "public"),
      item.filepath
    );
    localManifest.images[item.photoId] = {
      local_path: `/${relativePath.replace(/\\/g, "/")}`,
      skipped: true,
      reason: item.reason,
    };
  });

  const localManifestPath = path.join(
    CONFIG.downloadDir,
    "local-manifest.json"
  );
  await fs.writeFile(localManifestPath, JSON.stringify(localManifest, null, 2));

  return { localManifest, localManifestPath };
}

// Main function
async function main() {
  console.log("🖼️  Unsplash Image Download Tool\n");

  // Check if manifest exists
  try {
    await fs.access(CONFIG.manifestPath);
  } catch (error) {
    console.error("❌ Unsplash manifest not found at:", CONFIG.manifestPath);
    console.log("💡 Run the build cache script first:");
    console.log("   pnpm run build:cache-images");
    process.exit(1);
  }

  // Load the manifest
  console.log("📄 Loading manifest...");
  const manifestContent = await fs.readFile(CONFIG.manifestPath, "utf-8");
  const manifest = JSON.parse(manifestContent);

  const imageEntries = Object.entries(manifest.images);

  if (imageEntries.length === 0) {
    console.log("⚠️  No images found in manifest");
    process.exit(0);
  }

  console.log(`📊 Found ${imageEntries.length} images to process`);
  console.log(`📁 Download directory: ${CONFIG.downloadDir}`);
  console.log(`🔧 Concurrency: ${CONFIG.concurrency} simultaneous downloads`);
  console.log(`⏱️  Timeout: ${CONFIG.timeout / 1000}s per download`);
  console.log(`🔄 Retries: ${CONFIG.retries} attempts per image`);
  console.log(
    `🎨 Mode: Downloading unwatermarked versions via Unsplash download API\n`
  );

  // Create download directory
  await fs.mkdir(CONFIG.downloadDir, { recursive: true });

  // Start downloads with progress tracking
  console.log("🚀 Starting downloads...\n");
  const progressBar = createProgressBar(imageEntries.length);
  const results = await downloadImagesBatch(imageEntries, progressBar);

  // Create local manifest
  console.log("\n📝 Creating local manifest...");
  const { localManifest, localManifestPath } = await createLocalManifest(
    results,
    manifest
  );

  // Display results
  console.log("\n📊 Download Results:");
  console.log(`   ✅ Successfully downloaded: ${results.successful.length}`);
  console.log(`   ⏭️  Skipped (already exist): ${results.skipped.length}`);
  console.log(`   ❌ Failed to download: ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log("\n❌ Failed Downloads:");
    results.failed.forEach((item) => {
      console.log(`   • ${item.photoId}: ${item.error}`);
    });
  }

  // Calculate storage used
  let totalSize = 0;
  for (const item of results.successful) {
    try {
      const stats = await fs.stat(item.filepath);
      totalSize += stats.size;
    } catch (error) {
      // Ignore errors getting file size
    }
  }

  const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
  console.log(`\n💾 Storage Used: ${sizeInMB} MB`);
  console.log(
    `📄 Local manifest created: ${path.relative(process.cwd(), localManifestPath)}`
  );

  console.log("\n🎉 Image download complete!");

  if (results.failed.length > 0) {
    console.log(
      "\n⚠️  Some downloads failed. You may want to run this script again."
    );
    process.exit(1);
  }
}

// Check if fetch is available (Node.js 18+)
if (!checkFetchAvailable()) {
  process.exit(1);
}

main().catch((error) => {
  console.error("\n❌ Script failed:", error.message);
  console.error(error.stack);
  process.exit(1);
});
