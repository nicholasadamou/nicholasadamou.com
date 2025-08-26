#!/usr/bin/env node

/**
 * Unsplash URL to Download URL Converter
 *
 * This script takes an Unsplash photo page URL and returns the direct download URL.
 * It can be used as a standalone utility or imported as a module.
 *
 * Usage:
 *   node unsplash-url-to-download.js "https://unsplash.com/photos/example-photo-abc123"
 *   node unsplash-url-to-download.js -j "https://unsplash.com/photos/example-photo-abc123"
 *
 * Features:
 *   - Extracts photo ID from various Unsplash URL formats
 *   - Generates direct download URLs (unwatermarked)
 *   - Supports both CLI and programmatic usage
 *   - JSON output option for scripting
 */

const {
  extractPhotoId,
  generateDownloadUrl,
  fetchIxidFromPage,
  convertToDownloadUrl,
  checkFetchAvailable,
} = require("./unsplash-lib");

/**
 * CLI interface
 */
async function runCLI() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
    console.log(`
Unsplash URL to Download URL Converter

Usage:
  node ${process.argv[1].split("/").pop()} [options] <unsplash-url>

Options:
  -j, --json     Output result as JSON
  -n, --no-ixid  Skip fetching ixid (faster but less optimal)
  -h, --help     Show this help message

Examples:
  node ${process.argv[1].split("/").pop()} "https://unsplash.com/photos/ocean-view-abc123"
  node ${process.argv[1].split("/").pop()} --json "https://unsplash.com/photos/mountain-def456"
  node ${process.argv[1].split("/").pop()} --no-ixid "https://unsplash.com/photos/forest-ghi789"
`);
    return;
  }

  const jsonOutput = args.includes("-j") || args.includes("--json");
  const skipIxid = args.includes("-n") || args.includes("--no-ixid");
  const url = args.find((arg) => !arg.startsWith("-"));

  if (!url) {
    console.error("❌ Please provide an Unsplash URL");
    process.exit(1);
  }

  if (!jsonOutput) {
    console.log("🔍 Converting Unsplash URL to download URL...\n");
  }

  try {
    const result = await convertToDownloadUrl(url, !skipIxid);

    if (jsonOutput) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      if (result.success) {
        console.log("✅ Conversion successful!\n");
        console.log(`📷 Photo ID: ${result.photoId}`);
        console.log(`🔗 Original URL: ${result.originalUrl}`);
        console.log(`⬇️  Download URL: ${result.downloadUrl}`);
        console.log(`🏷️  Has IXID: ${result.hasIxid ? "Yes" : "No"}`);
        if (result.ixid) {
          console.log(`🆔 IXID: ${result.ixid}`);
        }

        console.log(
          "\n💡 Tip: The download URL provides an unwatermarked, full-resolution image."
        );
      } else {
        console.log("❌ Conversion failed!");
        console.log(`Error: ${result.error}`);
        process.exit(1);
      }
    }
  } catch (error) {
    if (jsonOutput) {
      console.log(
        JSON.stringify(
          {
            success: false,
            error: error.message,
            url: url,
          },
          null,
          2
        )
      );
    } else {
      console.error("❌ An error occurred:", error.message);
    }
    process.exit(1);
  }
}

// Module exports for programmatic usage
module.exports = {
  extractPhotoId,
  generateDownloadUrl,
  convertToDownloadUrl,
  fetchIxidFromPage,
};

// Run CLI if this script is executed directly
if (require.main === module) {
  // Check if fetch is available (Node.js 18+)
  if (!checkFetchAvailable()) {
    process.exit(1);
  }

  runCLI();
}
