#!/usr/bin/env node

/**
 * Setup script for Playwright Image Downloaders
 * Copies necessary environment variables from the main project to submodules
 * Supports both Unsplash and VSCO downloaders
 */

const fs = require("fs");
const path = require("path");

// Environment variables for different services
const ENV_VAR_CONFIGS = {
  "playwright-unsplash-downloader": {
    name: "Unsplash",
    vars: [
      "UNSPLASH_ACCESS_KEY",
      "UNSPLASH_SECRET_KEY",
      "REDIS_URL",
      "UPSTASH_REDIS_REST_URL",
      "UNSPLASH_EMAIL",
      "UNSPLASH_PASSWORD",
    ],
  },
  "playwright-vsco-downloader": {
    name: "VSCO",
    vars: ["VSCO_EMAIL", "VSCO_PASSWORD"],
  },
};

// Get all unique environment variables across all tools
const REQUIRED_ENV_VARS = [
  ...new Set(Object.values(ENV_VAR_CONFIGS).flatMap((config) => config.vars)),
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

function createSubmoduleEnvFile(env, toolName) {
  const config = ENV_VAR_CONFIGS[toolName];
  if (!config) {
    console.error(`❌ Unknown tool: ${toolName}`);
    return false;
  }

  const submoduleEnvPath = path.join("tools", toolName, ".env");

  // Filter only the required environment variables for this tool
  const filteredEnv = {};
  let foundVars = 0;

  config.vars.forEach((key) => {
    if (env[key]) {
      filteredEnv[key] = env[key];
      foundVars++;
    }
  });

  if (foundVars === 0) {
    console.warn(`⚠️  No required ${config.name} environment variables found`);
    console.log(
      `   Required variables for ${config.name}:`,
      config.vars.join(", ")
    );
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
      console.log(`📁 Tool directory ${dir} does not exist, skipping...`);
      return false;
    }

    fs.writeFileSync(submoduleEnvPath, envContent);
    console.log(
      `✅ Created ${submoduleEnvPath} with ${foundVars} ${config.name} environment variables`
    );
    return true;
  } catch (error) {
    console.error(`❌ Error creating ${submoduleEnvPath}:`, error.message);
    return false;
  }
}

function createAllSubmoduleEnvFiles(env) {
  let overallSuccess = false;

  // Create .env files for each available tool
  Object.keys(ENV_VAR_CONFIGS).forEach((toolName) => {
    console.log(
      `\n🔧 Setting up environment for ${ENV_VAR_CONFIGS[toolName].name}...`
    );
    const success = createSubmoduleEnvFile(env, toolName);
    if (success) {
      overallSuccess = true;
    }
  });

  return overallSuccess;
}

function getEnvironmentVariables() {
  // First try to get from environment files (.env.local or .env)
  const envFile = findEnvFile();

  if (envFile) {
    console.log(`📄 Found environment file: ${envFile}`);
    return parseEnvFile(envFile);
  }

  // If no file found, try to get from process.env (for CI environments like Vercel)
  console.log(
    "📄 No .env file found, checking process environment variables..."
  );
  return process.env;
}

function main(specificTool = null) {
  console.log("🔧 Setting up Playwright Image Downloader environment...\n");

  const env = getEnvironmentVariables();

  let success;
  if (specificTool) {
    // Set up environment for a specific tool only
    console.log(
      `🎯 Setting up environment for ${ENV_VAR_CONFIGS[specificTool]?.name || specificTool} only...`
    );
    success = createSubmoduleEnvFile(env, specificTool);
  } else {
    // Set up environment for all available tools
    success = createAllSubmoduleEnvFiles(env);
  }

  if (!success) {
    console.warn(
      "⚠️  Failed to setup environment for any Playwright downloader"
    );
    console.log(
      "💡 This is expected in CI environments without service credentials"
    );
    console.log("💡 Build will continue with fallback behavior");
    // Don't exit with error in CI - let the build continue
    return;
  }

  console.log(
    "\n🎭 Environment setup complete! The Playwright downloaders can now access your API credentials."
  );
}

if (require.main === module) {
  // Allow specifying a specific tool via command line argument
  const specificTool = process.argv[2];
  main(specificTool);
}

module.exports = {
  main,
  REQUIRED_ENV_VARS,
  ENV_VAR_CONFIGS,
  createSubmoduleEnvFile,
  createAllSubmoduleEnvFiles,
};
