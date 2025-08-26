#!/usr/bin/env node

/**
 * Clean Unsplash Images Script
 *
 * This script removes all downloaded images and their local manifest
 * to allow for a fresh download when running the download script.
 */

const fs = require("fs").promises;
const path = require("path");

// Configuration
const CONFIG = {
  downloadDir: path.join(process.cwd(), "public", "images", "unsplash"),
  localManifestPath: path.join(
    process.cwd(),
    "public",
    "images",
    "unsplash",
    "local-manifest.json"
  ),
};

// Utility function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Get directory size recursively
async function getDirectorySize(dirPath) {
  let totalSize = 0;

  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dirPath, item.name);

      if (item.isDirectory()) {
        totalSize += await getDirectorySize(itemPath);
      } else if (item.isFile()) {
        const stats = await fs.stat(itemPath);
        totalSize += stats.size;
      }
    }
  } catch (error) {
    // Directory might not exist or be accessible
    return 0;
  }

  return totalSize;
}

// Count files in directory
async function countFiles(dirPath) {
  let fileCount = 0;

  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true });

    for (const item of items) {
      if (
        item.isFile() &&
        !item.name.startsWith(".") &&
        item.name !== "local-manifest.json"
      ) {
        fileCount++;
      }
    }
  } catch (error) {
    return 0;
  }

  return fileCount;
}

// Main cleaning function
async function main() {
  console.log("🧹 Unsplash Images Cleanup Tool\n");

  // Check if download directory exists
  try {
    await fs.access(CONFIG.downloadDir);
  } catch (error) {
    console.log("✅ No images directory found - nothing to clean!");
    console.log(`📁 Directory would be: ${CONFIG.downloadDir}`);
    return;
  }

  // Get stats before cleaning
  console.log("📊 Analyzing current state...");
  const directorySize = await getDirectorySize(CONFIG.downloadDir);
  const fileCount = await countFiles(CONFIG.downloadDir);
  const manifestExists = await fs
    .access(CONFIG.localManifestPath)
    .then(() => true)
    .catch(() => false);

  console.log(`📁 Directory: ${CONFIG.downloadDir}`);
  console.log(`📄 Files found: ${fileCount}`);
  console.log(`💾 Total size: ${formatFileSize(directorySize)}`);
  console.log(`📋 Local manifest: ${manifestExists ? "exists" : "not found"}`);

  if (fileCount === 0 && !manifestExists) {
    console.log("\n✅ Directory is already clean - nothing to remove!");
    return;
  }

  console.log("\n🧹 Starting cleanup...");

  let removedFiles = 0;
  let freedSpace = 0;

  try {
    // Remove all image files (keep directory structure)
    const items = await fs.readdir(CONFIG.downloadDir, { withFileTypes: true });

    for (const item of items) {
      if (
        item.isFile() &&
        !item.name.startsWith(".") &&
        item.name !== "local-manifest.json"
      ) {
        const filePath = path.join(CONFIG.downloadDir, item.name);

        try {
          const stats = await fs.stat(filePath);
          await fs.unlink(filePath);
          removedFiles++;
          freedSpace += stats.size;

          // Show progress for every 10 files
          if (removedFiles % 10 === 0) {
            process.stdout.write(`\r🗑️  Removed ${removedFiles} files...`);
          }
        } catch (error) {
          console.warn(`\n⚠️  Could not remove ${item.name}: ${error.message}`);
        }
      }
    }

    if (removedFiles > 0) {
      process.stdout.write(`\r🗑️  Removed ${removedFiles} files`);
      console.log(); // New line
    }

    // Remove local manifest if it exists
    if (manifestExists) {
      try {
        await fs.unlink(CONFIG.localManifestPath);
        console.log("📋 Removed local manifest");
      } catch (error) {
        console.warn(`⚠️  Could not remove manifest: ${error.message}`);
      }
    }

    console.log("\n📊 Cleanup Results:");
    console.log(`   🗑️  Files removed: ${removedFiles}`);
    console.log(`   💾 Space freed: ${formatFileSize(freedSpace)}`);
    console.log(`   📁 Directory: ${CONFIG.downloadDir}`);

    console.log("\n✅ Cleanup complete!");
    console.log("\n💡 Next steps:");
    console.log("   • Run 'pnpm run download:images' to download fresh images");
    console.log(
      "   • Or run 'pnpm run build:cache-images' to rebuild the cache first"
    );
  } catch (error) {
    console.error(`\n❌ Cleanup failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle script interruption gracefully
process.on("SIGINT", () => {
  console.log("\n\n⏹️  Cleanup interrupted by user");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n\n⏹️  Cleanup terminated");
  process.exit(0);
});

main().catch((error) => {
  console.error("\n❌ Script failed:", error.message);
  console.error(error.stack);
  process.exit(1);
});
