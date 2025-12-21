#!/usr/bin/env node

/**
 * Fallback script for build-cache-images when submodules are not available
 * This ensures the build process doesn't fail due to missing submodules
 */

const fs = require("fs");
const path = require("path");

function createFallbackManifest() {
  console.log("📄 Creating fallback Unsplash manifest...");

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
      reason: "Submodule not available during build",
    },
  };

  const manifestDir = path.join(process.cwd(), "public");
  fs.mkdirSync(manifestDir, { recursive: true });

  const manifestPath = path.join(manifestDir, "unsplash-manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log("✅ Fallback manifest created successfully");
  console.log(`📍 Location: ${manifestPath}`);
  console.log(
    "💡 This allows the build to continue without Unsplash integration"
  );
}

function fixSubmoduleStructure() {
  const submoduleDir = "tools/unsplash-node-utilities";
  const unsplashDir = path.join(submoduleDir, "unsplash");
  const originalLib = path.join(submoduleDir, "unsplash-lib.js");
  const expectedLib = path.join(unsplashDir, "unsplash-lib.js");

  try {
    // Check if the expected structure exists
    if (!fs.existsSync(unsplashDir) && fs.existsSync(originalLib)) {
      console.log("🔧 Creating expected directory structure for submodule...");
      fs.mkdirSync(unsplashDir, { recursive: true });
      fs.copyFileSync(originalLib, expectedLib);
      console.log("✅ Fixed submodule directory structure");
      return true;
    }
    return fs.existsSync(expectedLib);
  } catch (error) {
    console.log("⚠️  Could not fix submodule structure:", error.message);
    return false;
  }
}

function cleanupSubmoduleStructure() {
  const submoduleDir = "tools/unsplash-node-utilities";
  const unsplashDir = path.join(submoduleDir, "unsplash");

  try {
    if (fs.existsSync(unsplashDir)) {
      console.log("🧹 Cleaning up temporary directory structure...");
      fs.rmSync(unsplashDir, { recursive: true, force: true });
    }
  } catch (error) {
    console.log("⚠️  Could not clean up temporary structure:", error.message);
  }
}

function main() {
  const submodulePath = "tools/unsplash-node-utilities/src/cli/build-cache.js";

  if (fs.existsSync(submodulePath)) {
    console.log(
      "✅ Unsplash utilities found, attempting to run original script..."
    );

    // Try to fix the directory structure
    const structureFixed = fixSubmoduleStructure();

    try {
      require(path.resolve(process.cwd(), submodulePath));

      // Clean up the temporary structure after successful run
      if (structureFixed) {
        cleanupSubmoduleStructure();
      }
    } catch (error) {
      console.log("⚠️  Original script failed:", error.message);
      console.log("🔧 Falling back to creating empty manifest...");

      // Clean up the temporary structure
      if (structureFixed) {
        cleanupSubmoduleStructure();
      }

      createFallbackManifest();
    }
  } else {
    console.log(
      "⚠️  Unsplash utilities not found, creating fallback manifest..."
    );
    createFallbackManifest();
  }
}

if (require.main === module) {
  main();
}

module.exports = { createFallbackManifest };
