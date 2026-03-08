#!/usr/bin/env node

/**
 * Download Unsplash images referenced in content.
 *
 * 1. Scans MDX files for Unsplash URLs
 * 2. Skips images that already exist locally
 * 3. Fetches missing images via the Unsplash API (CDN URL)
 * 4. Generates manifest.json mapping photo IDs to local paths + attribution
 */

const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream/promises");
const { Readable } = require("stream");

const DOWNLOAD_DIR = path.join(process.cwd(), "public", "images", "unsplash");
const MANIFEST_PATH = path.join(DOWNLOAD_DIR, "manifest.json");

/**
 * Load UNSPLASH_ACCESS_KEY from .env.local (simple KEY=VALUE parser).
 */
function loadAccessKey() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return null;
  const content = fs.readFileSync(envPath, "utf-8");
  const match = content.match(/^UNSPLASH_ACCESS_KEY=(.+)$/m);
  return match ? match[1].trim() : null;
}

/**
 * Load existing manifest to preserve metadata across runs.
 */
function loadExistingManifest() {
  try {
    if (!fs.existsSync(MANIFEST_PATH)) return null;
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  } catch {
    return null;
  }
}

/**
 * Extract Unsplash photo ID from a page URL.
 * e.g. https://unsplash.com/photos/some-slug-Am6pBe2FpJw → Am6pBe2FpJw
 */
function extractPhotoId(url) {
  if (!url || !url.includes("unsplash.com/photos/")) return null;
  const slug = url.replace(/["'.,;:!?]+$/, "").split("/photos/")[1];
  if (!slug) return null;
  const match = slug.match(/([a-zA-Z0-9_-]{11})$/);
  return match ? match[1] : slug.length === 11 ? slug : null;
}

/**
 * Scan all MDX files for image_url fields containing Unsplash URLs.
 */
function scanContentForUnsplashUrls() {
  const contentDir = path.join(process.cwd(), "content");
  const results = [];
  const seen = new Set();

  function scan(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(full);
      } else if (entry.name.endsWith(".mdx")) {
        const content = fs.readFileSync(full, "utf-8");
        const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!fmMatch) continue;
        const urlMatch = fmMatch[1].match(/image_url:\s*["']([^"']+)["']/);
        if (!urlMatch || !urlMatch[1].includes("unsplash.com")) continue;
        const url = urlMatch[1];
        const photoId = extractPhotoId(url);
        if (photoId && !seen.has(photoId)) {
          seen.add(photoId);
          results.push({ url, photoId });
        }
      }
    }
  }

  scan(contentDir);
  return results;
}

/**
 * Check whether a photo has already been downloaded.
 */
function isAlreadyDownloaded(photoId) {
  return fs.existsSync(path.join(DOWNLOAD_DIR, `${photoId}.jpg`));
}

/**
 * Fetch photo data from the Unsplash API.
 * Returns CDN URL + author metadata.
 */
async function fetchPhotoData(photoId, accessKey) {
  const res = await fetch(`https://api.unsplash.com/photos/${photoId}`, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText}`);
  }
  const data = await res.json();
  return {
    cdnUrl: data.urls?.regular,
    author: data.user?.name || "Unknown",
    author_url: data.user?.links?.html || null,
  };
}

/**
 * Download an image from a CDN URL and save it locally.
 */
async function downloadImage(cdnUrl, photoId) {
  const res = await fetch(cdnUrl);
  if (!res.ok) {
    throw new Error(`Download ${res.status}: ${res.statusText}`);
  }
  const dest = path.join(DOWNLOAD_DIR, `${photoId}.jpg`);
  await pipeline(Readable.fromWeb(res.body), fs.createWriteStream(dest));
  const stat = fs.statSync(dest);
  return { dest, size: stat.size };
}

/**
 * Write manifest.json mapping every photo ID to its local path + metadata.
 */
function writeManifest(images, manifestEntries) {
  const manifest = {
    generated_at: new Date().toISOString(),
    images: {},
  };

  for (const { photoId } of images) {
    manifest.images[photoId] = {
      local_path: `/images/unsplash/${photoId}.jpg`,
      ...(manifestEntries[photoId] || {}),
    };
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

async function main() {
  console.log("🚀 Starting Unsplash image download...");

  // Skip in CI
  const isCI =
    process.env.CI === "true" ||
    process.env.VERCEL === "1" ||
    process.env.NODE_ENV === "production";

  if (isCI) {
    console.log("⚠️  CI environment detected — skipping image download");
    return;
  }

  const accessKey = loadAccessKey();
  if (!accessKey) {
    console.log("⚠️  No UNSPLASH_ACCESS_KEY in .env.local — skipping download");
    return;
  }

  // 1. Scan content
  console.log("🔍 Scanning content for Unsplash images...");
  const images = scanContentForUnsplashUrls();
  console.log(`   Found ${images.length} Unsplash images in content`);

  if (images.length === 0) {
    console.log("✅ No images to download");
    return;
  }

  // 2. Load existing manifest to preserve metadata
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
  const existing = loadExistingManifest();
  const manifestEntries = {};

  // Carry forward existing metadata
  if (existing?.images) {
    for (const [id, entry] of Object.entries(existing.images)) {
      manifestEntries[id] = { author: entry.author, author_url: entry.author_url };
    }
  }

  // 3. Filter to missing images
  const missing = images.filter((img) => !isAlreadyDownloaded(img.photoId));
  const skipped = images.length - missing.length;
  if (skipped > 0) {
    console.log(`⏭️  Skipping ${skipped} already-downloaded images`);
  }

  // 4. Download missing images
  let succeeded = 0;
  let failed = 0;

  if (missing.length > 0) {
    console.log(`⬇️  Downloading ${missing.length} missing images via Unsplash API...`);

    for (const { photoId } of missing) {
      try {
        const { cdnUrl, author, author_url } = await fetchPhotoData(photoId, accessKey);
        if (!cdnUrl) throw new Error("No CDN URL in API response");
        const { size } = await downloadImage(cdnUrl, photoId);
        manifestEntries[photoId] = { author, author_url };
        console.log(`   ✅ ${photoId} (${(size / 1024 / 1024).toFixed(2)} MB)`);
        succeeded++;
      } catch (err) {
        console.log(`   ❌ ${photoId}: ${err.message}`);
        failed++;
      }
    }
  }

  // 5. Fetch metadata for images that exist locally but lack author info
  const needsMeta = images.filter(
    (img) => isAlreadyDownloaded(img.photoId) && !manifestEntries[img.photoId]?.author
  );

  if (needsMeta.length > 0) {
    console.log(`📝 Fetching metadata for ${needsMeta.length} images...`);
    for (const { photoId } of needsMeta) {
      try {
        const { author, author_url } = await fetchPhotoData(photoId, accessKey);
        manifestEntries[photoId] = { author, author_url };
      } catch {
        // Non-fatal — manifest entry will just lack author data
      }
    }
  }

  // 6. Write manifest
  writeManifest(images, manifestEntries);
  console.log(`📄 Wrote manifest.json (${images.length} images)`);

  console.log(
    `\n✅ Done: ${succeeded} downloaded, ${skipped} skipped, ${failed} failed`
  );
}

if (require.main === module) {
  main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}

module.exports = { main };
