#!/usr/bin/env node

/**
 * Check and initialize git submodules script
 * This ensures submodules are available and up to date before running build scripts
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function getConfiguredSubmodules() {
  try {
    const gitmodulesPath = path.resolve(process.cwd(), ".gitmodules");
    if (!fs.existsSync(gitmodulesPath)) {
      return [];
    }

    const content = fs.readFileSync(gitmodulesPath, "utf8");
    const submodules = [];
    const lines = content.split("\n");

    let currentSubmodule = null;
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("[submodule ")) {
        currentSubmodule = {};
      } else if (trimmed.startsWith("path = ") && currentSubmodule) {
        currentSubmodule.path = trimmed.replace("path = ", "");
      } else if (trimmed.startsWith("url = ") && currentSubmodule) {
        currentSubmodule.url = trimmed.replace("url = ", "");
        submodules.push(currentSubmodule);
        currentSubmodule = null;
      }
    }

    return submodules;
  } catch (error) {
    console.warn("⚠️  Could not read .gitmodules file:", error.message);
    return [];
  }
}

function checkSubmoduleExists(submodulePath) {
  const fullPath = path.resolve(process.cwd(), submodulePath);
  try {
    return fs.existsSync(fullPath) && fs.readdirSync(fullPath).length > 0;
  } catch (error) {
    return false;
  }
}

function isSubmoduleUpToDate(submodulePath) {
  try {
    const fullPath = path.resolve(process.cwd(), submodulePath);
    if (!fs.existsSync(fullPath)) {
      return false;
    }

    // Get the current commit in the submodule
    const currentCommit = execSync("git rev-parse HEAD", {
      cwd: fullPath,
      encoding: "utf8",
    }).trim();

    // Get the expected commit from the parent repository
    const expectedCommit = execSync(`git ls-tree HEAD ${submodulePath}`, {
      cwd: process.cwd(),
      encoding: "utf8",
    })
      .split("\t")[0]
      .split(" ")[2];

    // Also check if there are newer commits on the remote
    execSync("git fetch origin", { cwd: fullPath, stdio: "pipe" });
    const remoteCommit = execSync("git rev-parse origin/HEAD", {
      cwd: fullPath,
      encoding: "utf8",
    }).trim();

    const isCommitUpToDate = currentCommit === expectedCommit;
    const isRemoteUpToDate = currentCommit === remoteCommit;

    return {
      isCommitUpToDate,
      isRemoteUpToDate,
      currentCommit,
      expectedCommit,
      remoteCommit,
    };
  } catch (error) {
    console.warn(
      `⚠️  Could not check submodule status for ${submodulePath}:`,
      error.message
    );
    return { isCommitUpToDate: false, isRemoteUpToDate: false };
  }
}

function initializeSubmodules() {
  console.log("🔧 Initializing git submodules...");
  try {
    execSync("git submodule update --init --recursive --remote", {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    console.log(
      "✅ Git submodules initialized successfully with latest versions"
    );
    return true;
  } catch (error) {
    console.error("❌ Failed to initialize git submodules:", error.message);
    return false;
  }
}

function updateSubmodules() {
  console.log("🔄 Updating git submodules to latest versions...");
  try {
    execSync("git submodule update --recursive --remote", {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    console.log("✅ Git submodules updated successfully");
    return true;
  } catch (error) {
    console.error("❌ Failed to update git submodules:", error.message);
    return false;
  }
}

function main() {
  console.log("🔍 Checking git submodules...");

  // Get all configured submodules from .gitmodules
  const configuredSubmodules = getConfiguredSubmodules();

  if (configuredSubmodules.length === 0) {
    console.log("💡 No submodules configured in .gitmodules");
    return;
  }

  console.log(`Found ${configuredSubmodules.length} configured submodule(s)`);

  let needsInitialization = false;
  let needsUpdate = false;
  const submoduleStatus = [];

  // Check each configured submodule
  for (const submodule of configuredSubmodules) {
    const exists = checkSubmoduleExists(submodule.path);

    if (!exists) {
      console.log(`⚠️  Submodule missing: ${submodule.path}`);
      needsInitialization = true;
      submoduleStatus.push({ ...submodule, exists: false, upToDate: false });
    } else {
      console.log(`✅ Submodule found: ${submodule.path}`);

      // Check if submodule is up to date
      const status = isSubmoduleUpToDate(submodule.path);

      if (
        status.isCommitUpToDate === false ||
        status.isRemoteUpToDate === false
      ) {
        if (!status.isCommitUpToDate) {
          console.log(
            `🔄 Submodule not synced with parent repo: ${submodule.path}`
          );
        }
        if (!status.isRemoteUpToDate) {
          console.log(
            `🔄 Submodule has newer commits available: ${submodule.path}`
          );
        }
        needsUpdate = true;
        submoduleStatus.push({
          ...submodule,
          exists: true,
          upToDate: false,
          status,
        });
      } else {
        console.log(`✅ Submodule up to date: ${submodule.path}`);
        submoduleStatus.push({
          ...submodule,
          exists: true,
          upToDate: true,
          status,
        });
      }
    }
  }

  // Handle missing submodules
  if (needsInitialization) {
    console.log("🚀 Attempting to initialize missing submodules...");
    const success = initializeSubmodules();

    if (!success) {
      console.warn(
        "⚠️  Could not initialize submodules - this is expected in CI environments."
      );
      console.log(
        "💡 Build will continue with fallback scripts that handle missing submodules."
      );
      console.log(
        "💡 Fallback manifests will be created to ensure build success."
      );
      return; // Don't exit, let the build continue
    }

    // Verify initialization worked
    for (const submodule of configuredSubmodules) {
      if (!checkSubmoduleExists(submodule.path)) {
        console.warn(
          `⚠️  Submodule still missing after initialization: ${submodule.path}`
        );
        console.log("💡 Build will continue with fallback scripts.");
        return; // Don't exit, let the build continue
      }
    }

    console.log("✅ All submodules initialized successfully");
  }

  // Handle out-of-date submodules
  else if (needsUpdate) {
    console.log("🚀 Attempting to update submodules...");
    const success = updateSubmodules();

    if (!success) {
      console.warn(
        "⚠️  Could not update submodules - build will continue with current versions."
      );
    } else {
      console.log("✅ All submodules updated successfully");
    }
  }

  console.log("🎉 All submodules are ready!");
}

if (require.main === module) {
  main();
}

module.exports = {
  getConfiguredSubmodules,
  checkSubmoduleExists,
  isSubmoduleUpToDate,
  initializeSubmodules,
  updateSubmodules,
};
