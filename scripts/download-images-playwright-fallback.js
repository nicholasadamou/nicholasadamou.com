#!/usr/bin/env node

/**
 * Fallback script for download:images:playwright when submodules are not available
 * This ensures the build process doesn't fail due to missing playwright-image-downloader submodule
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function runPlaywrightImageDownloader() {
  console.log("🎭 Attempting to run Playwright image downloader...");

  const playwrightPath = "tools/playwright-image-downloader";
  const setupScriptPath = "scripts/setup-playwright-env.js";
  const mainManifestPath = "public/unsplash-manifest.json";

  try {
    // Check if submodules exist
    if (!fs.existsSync(playwrightPath)) {
      throw new Error(
        `Playwright image downloader not found at ${playwrightPath} - submodules not available in CI environment`
      );
    }

    if (!fs.existsSync(setupScriptPath)) {
      throw new Error(`Setup script not found at ${setupScriptPath}`);
    }

    // Initialize submodules first
    console.log("🔄 Initializing git submodules...");
    execSync("git submodule update --init --recursive", {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    // Run setup script
    console.log("⚙️  Running setup script...");
    execSync(`node ${setupScriptPath}`, {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    // Install dependencies
    console.log("📦 Installing Playwright downloader dependencies...");
    execSync("pnpm install", {
      stdio: "inherit",
      cwd: path.resolve(process.cwd(), playwrightPath),
    });

    // Determine a manifest path to use
    const manifestPathArg = fs.existsSync(mainManifestPath)
      ? `--manifest-path ../../${mainManifestPath}`
      : "";

    if (!fs.existsSync(mainManifestPath)) {
      console.log(
        "⚠️  Main manifest not found, Playwright will run with empty manifest"
      );
    } else {
      console.log(`✅ Using manifest: ${mainManifestPath}`);
    }

    console.log("⬇️  Running image download...");
    // Use tsx to run TypeScript directly instead of building first
    const downloadCommand = manifestPathArg
      ? `npx tsx src/cli.ts ${manifestPathArg}`
      : "npx tsx src/cli.ts";

    execSync(downloadCommand, {
      stdio: "inherit",
      cwd: path.resolve(process.cwd(), playwrightPath),
    });

    console.log("✅ Playwright image download completed successfully");
  } catch (error) {
    console.log("⚠️  Playwright image download failed:", error.message);
    console.log(
      "🔧 This is expected in CI environments without git submodule access"
    );
    console.log(
      "💡 Build will continue without downloaded images - they will be fetched at runtime"
    );
  }
}

function main() {
  console.log("🚀 Starting Playwright image download process...");
  runPlaywrightImageDownloader();
}

if (require.main === module) {
  main();
}

module.exports = { runPlaywrightImageDownloader };
