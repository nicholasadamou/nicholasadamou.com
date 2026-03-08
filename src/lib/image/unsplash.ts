import fs from "fs";
import path from "path";

interface ManifestEntry {
  local_path: string;
  author?: string;
  author_url?: string;
}

interface UnsplashManifest {
  images: Record<string, ManifestEntry>;
}

let cachedManifest: UnsplashManifest | null = null;
let manifestLoaded = false;

function loadManifest(): UnsplashManifest | null {
  if (manifestLoaded) return cachedManifest;
  manifestLoaded = true;

  try {
    const manifestPath = path.join(
      process.cwd(),
      "public",
      "images",
      "unsplash",
      "manifest.json"
    );
    const content = fs.readFileSync(manifestPath, "utf-8");
    cachedManifest = JSON.parse(content) as UnsplashManifest;
    return cachedManifest;
  } catch {
    return null;
  }
}

/**
 * Extract the Unsplash photo ID from various URL formats:
 * - https://unsplash.com/photos/diagram-Am6pBe2FpJw → Am6pBe2FpJw
 * - https://unsplash.com/photos/an-aerial-view-ud_kWC-3Bdg → ud_kWC-3Bdg
 * - https://images.unsplash.com/photo-1234567890ab?... → 1234567890ab
 * - Raw ID string: Am6pBe2FpJw → Am6pBe2FpJw
 *
 * Unsplash photo IDs are 11 alphanumeric characters (with dashes/underscores).
 */
export function extractPhotoId(url: string): string | null {
  if (!url) return null;

  // Already a bare ID (11 chars, alphanumeric + dash + underscore)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  try {
    const urlObj = new URL(url);

    // images.unsplash.com/photo-{id}
    if (urlObj.hostname === "images.unsplash.com") {
      const match = urlObj.pathname.match(/photo-([a-zA-Z0-9_-]{11})/);
      return match ? match[1] : null;
    }

    // unsplash.com/photos/{slug-}id
    if (
      urlObj.hostname === "unsplash.com" &&
      urlObj.pathname.startsWith("/photos/")
    ) {
      const slug = urlObj.pathname.split("/")[2];
      if (!slug) return null;

      // Extract trailing ID: the last segment after the final dash if 11 chars
      const dashMatch = slug.match(/([a-zA-Z0-9_-]{11})$/);
      return dashMatch ? dashMatch[1] : slug.length === 11 ? slug : null;
    }

    return null;
  } catch {
    // Not a URL — try extracting trailing 11 chars
    const match = url.match(/([a-zA-Z0-9_-]{11})$/);
    return match ? match[1] : null;
  }
}

/**
 * Resolve an Unsplash page URL to a local /images/unsplash/{id}.jpg path.
 * Uses the manifest as the primary lookup; falls back to fs check.
 * Returns null if no local image exists.
 */
export function resolveImageUrl(unsplashUrl: string): string | null {
  const photoId = extractPhotoId(unsplashUrl);
  if (!photoId) return null;

  // Primary: check manifest
  const manifest = loadManifest();
  if (manifest?.images[photoId]?.local_path) {
    return manifest.images[photoId].local_path;
  }

  // Fallback: check filesystem directly
  const localPath = `/images/unsplash/${photoId}.jpg`;
  const fsPath = path.join(process.cwd(), "public", localPath);
  if (fs.existsSync(fsPath)) {
    return localPath;
  }

  return null;
}

/**
 * Get author attribution for an Unsplash photo.
 */
export function getAttribution(
  unsplashUrl: string
): { author: string; authorUrl: string } | null {
  const photoId = extractPhotoId(unsplashUrl);
  if (!photoId) return null;

  const manifest = loadManifest();
  const entry = manifest?.images[photoId];
  if (!entry?.author || !entry?.author_url) return null;

  return {
    author: entry.author,
    authorUrl: `${entry.author_url}?utm_source=nicholasadamou.com&utm_medium=referral`,
  };
}
