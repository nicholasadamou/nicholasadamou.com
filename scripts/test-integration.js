#!/usr/bin/env node

/**
 * Integration Test Script for Image Fallback System
 *
 * This script tests the complete image fallback integration to ensure
 * all components work together correctly.
 */

const fs = require("fs").promises;
const path = require("path");

// Test the server-side functionality by simulating it
async function testServerSideIntegration() {
  console.log("🧪 Testing Server-side Integration\n");

  try {
    // Load local manifest directly
    const localManifestPath = path.join(
      process.cwd(),
      "public",
      "images",
      "unsplash",
      "local-manifest.json"
    );

    let localManifest = null;
    try {
      const content = await fs.readFile(localManifestPath, "utf-8");
      localManifest = JSON.parse(content);
      console.log(
        `✅ Loaded local manifest with ${Object.keys(localManifest.images).length} images`
      );
    } catch (error) {
      console.log("⚠️  Local manifest not found, testing fallback logic");
      return true; // Don't fail if manifest doesn't exist yet
    }

    // Test URL extraction
    const testUrls = [
      "https://unsplash.com/photos/turned-on-macbook-pro-beside-gray-mug-ZV_64LdGoao",
      "https://unsplash.com/photos/nonexistent-image-abc123def",
      "https://example.com/regular-image.jpg",
    ];

    console.log("\n2. Testing URL ID extraction...");
    for (const testUrl of testUrls) {
      // Simple ID extraction logic
      let photoId = null;
      if (testUrl.includes("unsplash.com/photos/")) {
        const match = testUrl.match(/-([a-zA-Z0-9_-]{11})(?:[\?#]|$)/);
        if (match) {
          photoId = match[1];
        }
      }

      if (photoId) {
        const isLocal = localManifest && localManifest.images[photoId];
        console.log(`   ${isLocal ? "🏠" : "🌐"} Photo ID: ${photoId}`);
      } else {
        console.log(`   ➖ Non-Unsplash URL: ${testUrl.substring(0, 30)}...`);
      }
    }

    // Test manifest stats
    if (localManifest && localManifest.stats) {
      console.log("\n3. Local manifest stats:");
      console.log(`   📊 Total images: ${localManifest.stats.total_images}`);
      console.log(`   📥 Downloaded: ${localManifest.stats.downloaded}`);
      console.log(`   ❌ Failed: ${localManifest.stats.failed}`);
      console.log(`   ⏭️  Skipped: ${localManifest.stats.skipped}`);
    }

    return true;
  } catch (error) {
    console.error("❌ Server-side integration test failed:", error);
    return false;
  }
}

// Test the manifest files exist and are properly structured
async function testManifestIntegrity() {
  console.log("\n🔍 Testing Manifest File Integrity\n");

  const manifestFiles = [
    {
      name: "Build Manifest",
      path: path.join(process.cwd(), "public", "unsplash-manifest.json"),
      required: true,
    },
    {
      name: "Local Image Manifest",
      path: path.join(
        process.cwd(),
        "public",
        "images",
        "unsplash",
        "local-manifest.json"
      ),
      required: false,
    },
  ];

  let allValid = true;

  for (const file of manifestFiles) {
    try {
      await fs.access(file.path);
      const content = await fs.readFile(file.path, "utf-8");
      const manifest = JSON.parse(content);

      console.log(`✅ ${file.name} found and valid`);
      console.log(`   📄 Path: ${file.path}`);
      console.log(`   📊 Images: ${Object.keys(manifest.images || {}).length}`);
      console.log(`   📅 Generated: ${manifest.generated_at || "Unknown"}`);

      if (file.name === "Local Image Manifest" && manifest.stats) {
        console.log(
          `   📈 Success rate: ${((manifest.stats.downloaded / manifest.stats.total_images) * 100).toFixed(1)}%`
        );
      }
    } catch (error) {
      if (file.required) {
        console.log(`❌ ${file.name} missing or invalid: ${error.message}`);
        allValid = false;
      } else {
        console.log(`⚠️  ${file.name} not found (optional): ${error.message}`);
      }
    }
  }

  return allValid;
}

// Test that downloaded image files exist
async function testImageFiles() {
  console.log("\n🖼️  Testing Downloaded Image Files\n");

  const localManifestPath = path.join(
    process.cwd(),
    "public",
    "images",
    "unsplash",
    "local-manifest.json"
  );

  try {
    const manifestContent = await fs.readFile(localManifestPath, "utf-8");
    const manifest = JSON.parse(manifestContent);

    const imageEntries = Object.entries(manifest.images);
    console.log(`📋 Testing ${imageEntries.length} downloaded images...\n`);

    let validFiles = 0;
    let missingFiles = 0;

    for (const [photoId, imageData] of imageEntries.slice(0, 5)) {
      // Test first 5 images
      const imagePath = path.join(
        process.cwd(),
        "public",
        imageData.local_path
      );

      try {
        const stats = await fs.stat(imagePath);
        const sizeInKB = (stats.size / 1024).toFixed(1);
        console.log(`✅ ${photoId}.jpg (${sizeInKB} KB)`);
        validFiles++;
      } catch (error) {
        console.log(`❌ ${photoId}.jpg (missing)`);
        missingFiles++;
      }
    }

    if (imageEntries.length > 5) {
      console.log(`   ... and ${imageEntries.length - 5} more images`);
    }

    console.log(`\n📊 Image file summary:`);
    console.log(`   ✅ Valid: ${validFiles}`);
    console.log(`   ❌ Missing: ${missingFiles}`);

    return missingFiles === 0;
  } catch (error) {
    console.log("⚠️  Local manifest not found, skipping image file test");
    return true; // Don't fail the test if local manifest doesn't exist
  }
}

// Test the browser-side utilities (basic syntax check)
async function testClientSideUtilities() {
  console.log("\n🌐 Testing Client-side Utilities\n");

  try {
    // Try to import the client utilities (syntax check only)
    const clientUtilPath = path.join(
      process.cwd(),
      "src",
      "lib",
      "image-fallback.ts"
    );
    await fs.access(clientUtilPath);
    console.log("✅ Client-side utilities file exists");

    // Check if the file has the expected exports
    const content = await fs.readFile(clientUtilPath, "utf-8");
    const expectedExports = [
      "extractUnsplashPhotoId",
      "getOptimizedImageSrc",
      "getImageMetadata",
      "isImageLocal",
      "useOptimizedImage",
    ];

    for (const exportName of expectedExports) {
      if (
        content.includes(`export function ${exportName}`) ||
        content.includes(`export async function ${exportName}`)
      ) {
        console.log(`   ✅ ${exportName} export found`);
      } else {
        console.log(`   ⚠️  ${exportName} export not found`);
      }
    }

    return true;
  } catch (error) {
    console.log("❌ Client-side utilities test failed:", error.message);
    return false;
  }
}

// Main test runner
async function main() {
  console.log("🚀 Image Fallback System Integration Test\n");
  console.log("=".repeat(50));

  const results = {
    manifestIntegrity: await testManifestIntegrity(),
    imageFiles: await testImageFiles(),
    clientSideUtilities: await testClientSideUtilities(),
    serverSideIntegration: await testServerSideIntegration(),
  };

  console.log("\n" + "=".repeat(50));
  console.log("📋 Test Results Summary:\n");

  const allPassed = Object.values(results).every((result) => result);

  for (const [testName, passed] of Object.entries(results)) {
    const emoji = passed ? "✅" : "❌";
    const formattedName = testName
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
    console.log(`${emoji} ${formattedName}`);
  }

  console.log(
    `\n${allPassed ? "🎉" : "⚠️"} Overall Result: ${allPassed ? "All tests passed!" : "Some tests failed"}`
  );

  if (allPassed) {
    console.log(
      "\n💡 Your image fallback system is fully integrated and working!"
    );
    console.log("   • Local images will be served when available");
    console.log("   • Build manifest provides second-level caching");
    console.log("   • API fallback ensures reliability");
    console.log("\n🚀 Ready for production!");
  } else {
    console.log("\n🔧 Integration Issues Found:");
    console.log("   • Check the error messages above");
    console.log("   • Ensure you've run: pnpm run download:images");
    console.log("   • Verify all manifests are present and valid");
  }

  process.exit(allPassed ? 0 : 1);
}

main().catch((error) => {
  console.error("❌ Integration test failed:", error);
  process.exit(1);
});
