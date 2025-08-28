#!/usr/bin/env node

/**
 * VSCO image download script using playwright-vsco-downloader
 * Downloads images from VSCO and generates manifest for local usage
 * This ensures the build process can work with locally stored VSCO images
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function runPlaywrightVscoDownloader() {
  console.log("🎭 Attempting to run Playwright VSCO downloader...");

  // Check if we're in a CI environment
  const isCI =
    process.env.CI === "true" ||
    process.env.VERCEL === "1" ||
    process.env.NODE_ENV === "production";

  if (isCI) {
    console.log(
      "⚠️  Detected CI/production environment - skipping Playwright VSCO downloader"
    );
    console.log(
      "🔧 This is expected in CI environments without git submodule access"
    );
    console.log(
      "💡 Build will continue without downloaded images - they will be fetched at runtime"
    );
    return;
  }

  const playwrightPath = "tools/playwright-vsco-downloader";
  const setupScriptPath = "scripts/setup-playwright-env.js";
  const publicVscoDir = "public/images/vsco/nicholasadamou";
  const publicManifestPath = "public/vsco-manifest.json";
  const vscoUsername = "nicholasadamou";

  try {
    // Check if submodules exist
    if (!fs.existsSync(playwrightPath)) {
      throw new Error(
        `Playwright VSCO downloader not found at ${playwrightPath} - submodules not available in CI environment`
      );
    }

    if (!fs.existsSync(setupScriptPath)) {
      throw new Error(`Setup script not found at ${setupScriptPath}`);
    }

    // Ensure public directories exist
    if (!fs.existsSync(publicVscoDir)) {
      console.log(`📁 Creating directory: ${publicVscoDir}`);
      fs.mkdirSync(publicVscoDir, { recursive: true });
    }

    // Initialize submodules first
    console.log("🔄 Initializing git submodules...");
    execSync("git submodule update --init --recursive", {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    // Run setup script for VSCO specifically
    console.log("⚙️  Setting up VSCO downloader environment...");
    execSync(`node ${setupScriptPath} playwright-vsco-downloader`, {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    // Install dependencies
    console.log("📦 Installing Playwright VSCO downloader dependencies...");
    execSync("pnpm install", {
      stdio: "inherit",
      cwd: path.resolve(process.cwd(), playwrightPath),
    });

    // Create downloads directory in the playwright tool that points to our public directory
    const playwrightDownloadsDir = path.resolve(
      process.cwd(),
      playwrightPath,
      "downloads",
      "vsco"
    );

    // Remove existing downloads directory and create symlink to public directory
    if (fs.existsSync(path.dirname(playwrightDownloadsDir))) {
      execSync(`rm -rf ${path.dirname(playwrightDownloadsDir)}`, {
        cwd: path.resolve(process.cwd(), playwrightPath),
      });
    }

    // Create symlink so downloads go directly to public directory
    const absolutePublicDir = path.resolve(process.cwd(), "public/images/vsco");
    execSync(`mkdir -p ${path.dirname(playwrightDownloadsDir)}`, {
      cwd: path.resolve(process.cwd(), playwrightPath),
    });
    execSync(
      `ln -sf ${absolutePublicDir} ${path.dirname(playwrightDownloadsDir)}/vsco`,
      {
        cwd: path.resolve(process.cwd(), playwrightPath),
      }
    );

    console.log("⬇️  Running VSCO image download...");

    // Run the VSCO downloader with limited images for build performance
    const downloadCommand = `pnpm download --username ${vscoUsername} --download-dir ../../public/images/vsco`;

    execSync(downloadCommand, {
      stdio: "inherit",
      cwd: path.resolve(process.cwd(), playwrightPath),
    });

    // Check if manifest was generated and move it to public directory
    const generatedManifestPath = path.resolve(
      process.cwd(),
      publicVscoDir,
      "vsco-manifest.json"
    );
    if (fs.existsSync(generatedManifestPath)) {
      console.log("📄 Moving VSCO manifest to public directory...");
      const manifestContent = fs.readFileSync(generatedManifestPath, "utf8");
      fs.writeFileSync(publicManifestPath, manifestContent);
      console.log(`✅ VSCO manifest saved to: ${publicManifestPath}`);
    }

    console.log("✅ Playwright VSCO download completed successfully");

    // Log some stats
    const manifestPath = fs.existsSync(publicManifestPath)
      ? publicManifestPath
      : generatedManifestPath;
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
      const imageCount = Object.keys(manifest.images || {}).length;
      console.log(`📸 Downloaded ${imageCount} VSCO images`);
    }
  } catch (error) {
    console.log("⚠️  Playwright VSCO download failed:", error.message);
    console.log(
      "🔧 This is expected in CI environments without git submodule access"
    );
    console.log(
      "💡 Build will continue without downloaded images - they will be fetched at runtime"
    );
  }
}

function main() {
  console.log("🚀 Starting Playwright VSCO download process...");
  runPlaywrightVscoDownloader();
}

if (require.main === module) {
  main();
}

module.exports = { runPlaywrightVscoDownloader };
