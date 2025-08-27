#!/usr/bin/env node

/**
 * Check and initialize git submodules script
 * This ensures submodules are available before running build scripts
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function checkSubmoduleExists(submodulePath) {
  const fullPath = path.resolve(process.cwd(), submodulePath);
  return fs.existsSync(fullPath) && fs.readdirSync(fullPath).length > 0;
}

function initializeSubmodules() {
  console.log("🔧 Initializing git submodules...");
  try {
    execSync("git submodule update --init --recursive", {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    console.log("✅ Git submodules initialized successfully");
    return true;
  } catch (error) {
    console.error("❌ Failed to initialize git submodules:", error.message);
    return false;
  }
}

function main() {
  console.log("🔍 Checking git submodules...");

  const submodules = [
    "tools/unsplash-node-utilities",
    "tools/playwright-image-downloader",
  ];

  let allExist = true;

  for (const submodule of submodules) {
    if (!checkSubmoduleExists(submodule)) {
      console.log(`⚠️  Submodule missing: ${submodule}`);
      allExist = false;
    } else {
      console.log(`✅ Submodule found: ${submodule}`);
    }
  }

  if (!allExist) {
    console.log("🚀 Attempting to initialize missing submodules...");
    const success = initializeSubmodules();

    if (!success) {
      console.error("❌ Could not initialize submodules. Build may fail.");
      console.log(
        "💡 This might happen in CI environments without git access to submodules."
      );
      console.log(
        "💡 Consider using alternative deployment strategies or copying submodule contents."
      );
      process.exit(1);
    }

    // Verify again
    for (const submodule of submodules) {
      if (!checkSubmoduleExists(submodule)) {
        console.error(
          `❌ Submodule still missing after initialization: ${submodule}`
        );
        process.exit(1);
      }
    }
  }

  console.log("🎉 All submodules are ready!");
}

if (require.main === module) {
  main();
}

module.exports = { checkSubmoduleExists, initializeSubmodules };
