#!/usr/bin/env node

/**
 * Setup script for Playwright Unsplash Image Downloader
 * Copies necessary environment variables from the main project to submodule
 */

const fs = require("fs");
const path = require("path");

// Environment variables needed by the Playwright downloader
const REQUIRED_ENV_VARS = [
  "UNSPLASH_ACCESS_KEY",
  "UNSPLASH_SECRET_KEY",
  "REDIS_URL",
  "UPSTASH_REDIS_REST_URL",
  "UNSPLASH_EMAIL",
  "UNSPLASH_PASSWORD",
];

function findEnvFile() {
  const possibleFiles = [".env.local", ".env"];

  for (const file of possibleFiles) {
    if (fs.existsSync(file)) {
      console.log(`📄 Found environment file: ${file}`);
      return file;
    }
  }

  return null;
}

function parseEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const env = {};

    content.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const [key, ...valueParts] = trimmed.split("=");
        env[key.trim()] = valueParts.join("=").trim();
      }
    });

    return env;
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error.message);
    return {};
  }
}

function createSubmoduleEnvFile(env) {
  const submoduleEnvPath = path.join(
    "tools",
    "playwright-image-downloader",
    ".env"
  );

  // Filter only the required environment variables
  const filteredEnv = {};
  let foundVars = 0;

  REQUIRED_ENV_VARS.forEach((key) => {
    if (env[key]) {
      filteredEnv[key] = env[key];
      foundVars++;
    }
  });

  if (foundVars === 0) {
    console.warn("⚠️  No required environment variables found");
    console.log("   Required variables:", REQUIRED_ENV_VARS.join(", "));
    return false;
  }

  // Create .env content
  const envContent =
    Object.entries(filteredEnv)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n") + "\n";

  try {
    // Ensure directory exists
    const dir = path.dirname(submoduleEnvPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(submoduleEnvPath, envContent);
    console.log(
      `✅ Created ${submoduleEnvPath} with ${foundVars} environment variables`
    );
    return true;
  } catch (error) {
    console.error(`❌ Error creating ${submoduleEnvPath}:`, error.message);
    return false;
  }
}

function main() {
  console.log("🔧 Setting up Playwright Image Downloader environment...\n");

  const envFile = findEnvFile();
  if (!envFile) {
    console.error("❌ No environment file found (.env.local or .env)");
    console.log("   Please create one with your Unsplash API credentials");
    process.exit(1);
  }

  const env = parseEnvFile(envFile);
  const success = createSubmoduleEnvFile(env);

  if (!success) {
    console.error("❌ Failed to setup environment for Playwright downloader");
    process.exit(1);
  }

  console.log(
    "\n🎭 Environment setup complete! The Playwright downloader can now access your API credentials."
  );
}

if (require.main === module) {
  main();
}

module.exports = { main, REQUIRED_ENV_VARS };
