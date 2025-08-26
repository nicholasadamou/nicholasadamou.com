/**
 * Unsplash Library - Shared functionality for Unsplash scripts
 *
 * This library contains all common functionality used across different
 * Unsplash-related scripts to avoid duplication and ensure consistency.
 */

const fs = require("fs").promises;
const path = require("path");
const https = require("https");
const { URL } = require("url");

// Configuration constants
const CONFIG = {
  timeout: 10000, // 10 seconds timeout
  userAgent: "Mozilla/5.0 (compatible; Unsplash-Script-Library/1.0)",
  retries: 2,
  rateLimitDelay: 100, // ms between API calls
};

// =============================================================================
// PHOTO ID EXTRACTION
// =============================================================================

/**
 * Extract photo ID from various Unsplash URL formats
 * @param {string} url - The Unsplash URL
 * @returns {string|null} - The photo ID or null if not found
 */
function extractPhotoId(url) {
  if (!url || !url.includes("unsplash.com")) return null;

  // Clean the URL by removing any trailing punctuation
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

// Alias for backwards compatibility
const extractUnsplashPhotoId = extractPhotoId;

// =============================================================================
// URL CONSTRUCTION AND MANIPULATION
// =============================================================================

/**
 * Generate download URL from photo ID
 * @param {string} photoId - The Unsplash photo ID
 * @param {string} [ixid] - Optional ixid parameter for tracking
 * @returns {string} - The download URL
 */
function generateDownloadUrl(photoId, ixid = null) {
  const baseUrl = `https://unsplash.com/photos/${photoId}/download`;
  if (ixid) {
    return `${baseUrl}?ixid=${ixid}&force=true`;
  }
  return `${baseUrl}?force=true`;
}

/**
 * Construct the unwatermarked download URL (alias for generateDownloadUrl)
 * @param {string} photoId - The Unsplash photo ID
 * @param {string} ixid - The ixid parameter
 * @returns {string} - The download URL
 */
function constructDownloadUrl(photoId, ixid) {
  return generateDownloadUrl(photoId, ixid);
}

/**
 * Extract ixid parameter from URL
 * @param {string} url - The URL to extract from
 * @returns {string|null} - The ixid parameter or null
 */
function extractIxidFromUrl(url) {
  const ixidMatch = url.match(/[?&]ixid=([^&]+)/);
  return ixidMatch ? ixidMatch[1] : null;
}

/**
 * Create premium watermark-free URL for Unsplash+ subscribers
 * @param {string} baseUrl - The base image URL
 * @param {string} photoId - The photo ID
 * @param {number} [width=1200] - Desired width
 * @param {number} [quality=80] - Desired quality
 * @returns {string} - The optimized URL
 */
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

// =============================================================================
// HTTP UTILITIES
// =============================================================================

/**
 * Fetch the actual page to extract ixid parameter for better download URL
 * @param {string} pageUrl - The original Unsplash page URL
 * @returns {Promise<string|null>} - The ixid parameter or null
 */
function fetchIxidFromPage(pageUrl) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Request timeout"));
    }, CONFIG.timeout);

    https
      .get(
        pageUrl,
        {
          headers: {
            "User-Agent": CONFIG.userAgent,
          },
        },
        (res) => {
          clearTimeout(timeout);

          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            // Look for ixid in the page content
            const ixidMatch = data.match(/ixid=([a-zA-Z0-9_-]+)/);
            resolve(ixidMatch ? ixidMatch[1] : null);
          });
        }
      )
      .on("error", (err) => {
        clearTimeout(timeout);
        resolve(null); // Don't reject, just return null
      });
  });
}

/**
 * Make a request to the Unsplash API with proper error handling
 * @param {string} url - The API endpoint URL
 * @param {object} [options={}] - Fetch options
 * @returns {Promise<object>} - Response object with ok, status, data, headers, error
 */
async function makeApiRequest(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return {
      ok: response.ok,
      status: response.status,
      data,
      headers: Object.fromEntries(response.headers.entries()),
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message,
    };
  }
}

/**
 * Fetch image data from Unsplash API
 * @param {string} photoId - The photo ID
 * @returns {Promise<object|null>} - The image data or null
 */
async function fetchImageData(photoId) {
  try {
    console.log(`🔄 Fetching photo: ${photoId}`);
    const response = await fetch(`https://api.unsplash.com/photos/${photoId}`, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      if (response.status === 403 && text.includes("Rate Limit Exceeded")) {
        console.log(`⚠️ Rate limit exceeded for ${photoId}`);
      } else {
        console.log(
          `❌ API error for ${photoId}: ${response.status} ${response.statusText}`
        );
      }
      return null;
    }

    const photo = await response.json();
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
    await triggerDownloadTracking(photo.id);

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

/**
 * Trigger download tracking as required by Unsplash API terms
 * @param {string} photoId - The photo ID
 * @returns {Promise<void>}
 */
async function triggerDownloadTracking(photoId) {
  try {
    await fetch(`https://api.unsplash.com/photos/${photoId}/download`, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });
  } catch (error) {
    // Download tracking failed, but continue serving the image
    console.warn("Download tracking failed for photo:", photoId);
  }
}

// =============================================================================
// FILE SYSTEM UTILITIES
// =============================================================================

/**
 * Scan MDX files for Unsplash image URLs
 * @param {string} [contentDir] - Directory to scan (defaults to ./content)
 * @returns {Promise<string[]>} - Array of unique Unsplash URLs
 */
async function scanMdxFiles(contentDir = null) {
  const scanDir = contentDir || path.join(process.cwd(), "content");
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

  await scanDirectory(scanDir);
  return Array.from(imageUrls);
}

/**
 * Sanitize filename for safe file system usage
 * @param {string} filename - The filename to sanitize
 * @returns {string} - The sanitized filename
 */
function sanitizeFilename(filename) {
  return filename.replace(/[^a-zA-Z0-9.-]/g, "_");
}

/**
 * Get image extension from URL parameters or default to jpg
 * @param {string} url - The image URL
 * @returns {string} - The file extension
 */
function getImageExtension(url) {
  // Extract format from URL params or default to jpg
  const formatMatch = url.match(/[?&]fm=([^&]+)/);
  return formatMatch ? formatMatch[1] : "jpg";
}

// =============================================================================
// CONSOLE OUTPUT UTILITIES
// =============================================================================

// Colors for console output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

/**
 * Log a message with optional color
 * @param {string} message - The message to log
 * @param {string} [color] - The color code
 */
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Log a section header
 * @param {string} title - The section title
 */
function logSection(title) {
  console.log("\n" + "=".repeat(60));
  log(`${colors.bold}${colors.cyan}${title}${colors.reset}`);
  console.log("=".repeat(60));
}

/**
 * Log a success message
 * @param {string} message - The success message
 */
function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

/**
 * Log an error message
 * @param {string} message - The error message
 */
function logError(message) {
  log(`❌ ${message}`, colors.red);
}

/**
 * Log a warning message
 * @param {string} message - The warning message
 */
function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

/**
 * Log an info message
 * @param {string} message - The info message
 */
function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

// =============================================================================
// PROGRESS TRACKING UTILITIES
// =============================================================================

/**
 * Create a progress bar for tracking operations
 * @param {number} total - Total number of items
 * @returns {object} - Progress bar object with update method
 */
function createProgressBar(total) {
  let completed = 0;

  return {
    update() {
      completed++;
      const percentage = ((completed / total) * 100).toFixed(1);
      const filled = Math.floor((completed / total) * 40);
      const empty = 40 - filled;
      const bar = "█".repeat(filled) + "░".repeat(empty);

      process.stdout.write(
        `\r📥 Progress: [${bar}] ${percentage}% (${completed}/${total})`
      );

      if (completed === total) {
        process.stdout.write("\n");
      }
    },
  };
}

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

/**
 * Check if fetch API is available (Node.js 18+)
 * @returns {boolean} - True if fetch is available
 */
function checkFetchAvailable() {
  if (typeof fetch === "undefined") {
    logError("This script requires Node.js 18+ or a fetch polyfill");
    return false;
  }
  return true;
}

/**
 * Check if required environment variables are set
 * @param {boolean} [requireSecretKey=false] - Whether to require UNSPLASH_SECRET_KEY
 * @returns {boolean} - True if all required env vars are set
 */
function checkEnvironmentVariables(requireSecretKey = false) {
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    logError("UNSPLASH_ACCESS_KEY environment variable is not set");
    return false;
  }

  if (requireSecretKey && !process.env.UNSPLASH_SECRET_KEY) {
    logError(
      "UNSPLASH_SECRET_KEY environment variable is required but not set"
    );
    return false;
  }

  return true;
}

// =============================================================================
// URL CONVERSION UTILITIES
// =============================================================================

/**
 * Convert Unsplash URL to download URL
 * @param {string} unsplashUrl - The Unsplash page URL
 * @param {boolean} [fetchIxid=true] - Whether to fetch ixid for better download URL
 * @returns {Promise<Object>} - Result object with download info
 */
async function convertToDownloadUrl(unsplashUrl, fetchIxid = true) {
  const photoId = extractPhotoId(unsplashUrl);

  if (!photoId) {
    return {
      success: false,
      error: "Could not extract photo ID from URL",
      url: unsplashUrl,
    };
  }

  let ixid = null;

  if (fetchIxid) {
    try {
      ixid = await fetchIxidFromPage(unsplashUrl);
    } catch (error) {
      // Continue without ixid if fetch fails
    }
  }

  const downloadUrl = generateDownloadUrl(photoId, ixid);

  return {
    success: true,
    photoId,
    originalUrl: unsplashUrl,
    downloadUrl,
    ixid,
    hasIxid: !!ixid,
  };
}

// =============================================================================
// MODULE EXPORTS
// =============================================================================

module.exports = {
  // Configuration
  CONFIG,

  // Photo ID extraction
  extractPhotoId,
  extractUnsplashPhotoId, // Backwards compatibility alias

  // URL construction and manipulation
  generateDownloadUrl,
  constructDownloadUrl, // Backwards compatibility alias
  extractIxidFromUrl,
  createPremiumUnsplashUrl,
  convertToDownloadUrl,

  // HTTP utilities
  fetchIxidFromPage,
  makeApiRequest,
  fetchImageData,
  triggerDownloadTracking,

  // File system utilities
  scanMdxFiles,
  sanitizeFilename,
  getImageExtension,

  // Console output utilities
  colors,
  log,
  logSection,
  logSuccess,
  logError,
  logWarning,
  logInfo,

  // Progress tracking
  createProgressBar,

  // Validation utilities
  checkFetchAvailable,
  checkEnvironmentVariables,
};
