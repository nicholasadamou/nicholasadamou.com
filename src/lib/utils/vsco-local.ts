import fs from "fs";
import path from "path";
import { VscoApiResponse, VscoImage } from "@/types/vsco";

interface VscoManifestImage {
  local_path?: string;
  filename?: string;
  file_size_bytes?: number;
  downloaded_at?: string;
  skipped?: boolean;
  vsco_image_id?: string;
  vsco_image_url?: string;
  vsco_profile_url?: string;
  direct_image_url?: string;
  thumbnail_url?: string;
  width_px?: number;
  height_px?: number;
  dimensions?: string;
  author?: string;
  vsco_username?: string;
  upload_date?: string;
  available_sizes?: string;
  srcset?: string;
  download_method?: string;
  extracted_at?: string;
}

interface VscoManifest {
  generated_at?: string;
  version?: string;
  source?: string;
  download_method?: string;
  profile?: {
    username: string;
    display_name?: string;
    profile_url?: string;
    total_images_found?: number;
  };
  images: Record<string, VscoManifestImage>;
  stats?: {
    total_images?: number;
    downloaded?: number;
    failed?: number;
    skipped?: number;
    success_rate?: number;
    duration_seconds?: number;
  };
}

/**
 * Read VSCO manifest from local file system
 */
function readVscoManifest(): VscoManifest | null {
  const manifestPath = path.join(
    process.cwd(),
    "public/images/vsco/manifest.json"
  );

  try {
    if (!fs.existsSync(manifestPath)) {
      console.warn("VSCO manifest not found at:", manifestPath);
      return null;
    }

    const manifestContent = fs.readFileSync(manifestPath, "utf-8");
    return JSON.parse(manifestContent) as VscoManifest;
  } catch (error) {
    console.error("Error reading VSCO manifest:", error);
    return null;
  }
}

/**
 * Convert manifest entry to VscoImage format
 */
function manifestEntryToVscoImage(
  photoId: string,
  entry: VscoManifestImage
): VscoImage | null {
  // Skip if no local path and no direct image URL
  if (!entry.local_path && !entry.direct_image_url) {
    return null;
  }

  // Create image URL - prefer local path, fallback to direct image URL
  let imageUrl: string;

  if (entry.local_path && entry.filename) {
    // Convert local path to proper public URL
    // The local_path in manifest is malformed, so construct it from filename
    imageUrl = `/images/vsco/nicholasadamou/${entry.filename}`;
  } else if (entry.direct_image_url) {
    imageUrl = entry.direct_image_url;
  } else {
    return null;
  }

  return {
    id: entry.vsco_image_id || photoId,
    url: imageUrl,
    alt: `Photography by ${entry.author || entry.vsco_username || "Nicholas Adamou"}`,
    width: entry.width_px,
    height: entry.height_px,
    vsco_url: entry.vsco_image_url,
    upload_date: entry.upload_date,
  };
}

/**
 * Get VSCO images from local manifest
 * This is used as a fallback when the API cannot fetch from VSCO directly
 */
export function getLocalVscoImages(
  limit?: number,
  offset?: number
): VscoApiResponse {
  const manifest = readVscoManifest();

  if (!manifest || !manifest.images) {
    return {
      images: [],
      hasMore: false,
      totalCount: 0,
      source: "local-manifest",
      error: "No local VSCO manifest found",
    };
  }

  const images: VscoImage[] = [];

  // Convert manifest entries to VscoImage objects
  Object.entries(manifest.images).forEach(([photoId, entry]) => {
    const image = manifestEntryToVscoImage(photoId, entry);
    if (image) {
      images.push(image);
    }
  });

  // Sort by upload date (most recent first) if available
  images.sort((a, b) => {
    if (!a.upload_date || !b.upload_date) return 0;
    return (
      new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime()
    );
  });

  const totalCount = images.length;
  const startIndex = offset || 0;
  const endIndex = limit ? startIndex + limit : images.length;

  // Apply pagination
  const paginatedImages = images.slice(startIndex, endIndex);
  const hasMore = endIndex < totalCount;

  return {
    images: paginatedImages,
    hasMore,
    totalCount,
    source: "local-manifest",
    generated_at: manifest.generated_at,
    profile: manifest.profile,
  };
}

/**
 * Check if local VSCO images are available
 */
export function hasLocalVscoImages(): boolean {
  const manifest = readVscoManifest();

  if (!manifest || !manifest.images) {
    return false;
  }

  // Check if there are any images with filenames (whether skipped or not)
  const availableImages = Object.values(manifest.images).filter(
    (entry) => entry.filename && (entry.local_path || entry.direct_image_url)
  );

  return availableImages.length > 0;
}

/**
 * Get VSCO manifest stats
 */
export function getVscoManifestStats() {
  const manifest = readVscoManifest();

  if (!manifest) {
    return null;
  }

  const totalEntries = Object.keys(manifest.images || {}).length;
  const downloadedImages = Object.values(manifest.images || {}).filter(
    (entry) => !entry.skipped && entry.local_path
  ).length;
  const skippedImages = Object.values(manifest.images || {}).filter(
    (entry) => entry.skipped
  ).length;

  return {
    total_entries: totalEntries,
    downloaded: downloadedImages,
    skipped: skippedImages,
    success_rate:
      totalEntries > 0 ? (downloadedImages / totalEntries) * 100 : 0,
    generated_at: manifest.generated_at,
    version: manifest.version,
    source: manifest.source,
    profile: manifest.profile,
    stats: manifest.stats,
  };
}
