#!/usr/bin/env node

/**
 * Unsplash Account Verification Script
 *
 * This script verifies your Unsplash account status and API access levels
 * to help diagnose Unsplash+ premium access issues.
 */

const {
  colors,
  log,
  logSection,
  logSuccess,
  logError,
  logWarning,
  logInfo,
  makeApiRequest,
  checkFetchAvailable,
} = require("./lib/unsplash-lib");

require("dotenv").config();

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const UNSPLASH_SECRET_KEY = process.env.UNSPLASH_SECRET_KEY;

// Alias for backwards compatibility with existing code
const makeRequest = makeApiRequest;

async function verifyEnvironmentVariables() {
  logSection("Environment Variables");

  if (!UNSPLASH_ACCESS_KEY) {
    logError("UNSPLASH_ACCESS_KEY is not set");
    return false;
  }
  logSuccess(`UNSPLASH_ACCESS_KEY: ${UNSPLASH_ACCESS_KEY.substring(0, 8)}...`);

  if (!UNSPLASH_SECRET_KEY) {
    logWarning("UNSPLASH_SECRET_KEY is not set (required for Unsplash+)");
  } else {
    logSuccess(
      `UNSPLASH_SECRET_KEY: ${UNSPLASH_SECRET_KEY.substring(0, 8)}...`
    );
  }

  return true;
}

async function verifyBasicApiAccess() {
  logSection("Basic API Access");

  // Test basic API access by fetching photos (doesn't require OAuth)
  const result = await makeRequest(
    "https://api.unsplash.com/photos?per_page=1",
    {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    }
  );

  if (!result.ok) {
    logError(`API access failed: ${result.data?.errors || result.error}`);
    return false;
  }

  logSuccess("Basic API access works");
  logInfo("Successfully authenticated with Unsplash API");

  // Try to get rate limit info from headers
  const rateLimit = result.headers["x-ratelimit-limit"];
  const remaining = result.headers["x-ratelimit-remaining"];

  if (rateLimit) {
    logInfo(`Rate Limit: ${remaining}/${rateLimit} requests remaining`);

    if (parseInt(rateLimit) > 50) {
      logSuccess(
        "✨ You have elevated rate limits (indicates premium API access)"
      );
    } else {
      logWarning("You have standard rate limits (50/hour)");
    }
  }

  return true;
}

async function checkRateLimits(headers) {
  logSection("Rate Limits");

  const rateLimit = headers["x-ratelimit-limit"];
  const remaining = headers["x-ratelimit-remaining"];

  if (rateLimit && remaining) {
    logInfo(`Rate Limit: ${remaining}/${rateLimit} requests remaining`);

    if (parseInt(rateLimit) > 50) {
      logSuccess("You have elevated rate limits (likely premium access)");
    } else {
      logWarning("You have basic rate limits (50/hour)");
    }
  } else {
    logWarning("Could not determine rate limits");
  }
}

async function testPremiumPhoto() {
  logSection("Premium Photo Access Test");

  // Test with a known premium photo
  const premiumPhotoId = "W_JehBhi8wo"; // The photo you mentioned

  logInfo(`Testing premium photo: ${premiumPhotoId}`);

  const result = await makeRequest(
    `https://api.unsplash.com/photos/${premiumPhotoId}`,
    {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    }
  );

  if (!result.ok) {
    logError(
      `Failed to fetch premium photo: ${result.data?.errors || result.error}`
    );
    return false;
  }

  const photo = result.data;
  const isPremium = photo.urls.regular.includes("plus.unsplash.com");

  if (isPremium) {
    logSuccess("Premium photo detected (plus.unsplash.com domain)");
    logInfo(`Photo URL: ${photo.urls.regular.substring(0, 60)}...`);
  } else {
    logWarning("Photo does not appear to be premium content");
  }

  return { photo, isPremium };
}

async function testDownloadTracking() {
  logSection("Download Tracking Test");

  const premiumPhotoId = "W_JehBhi8wo";

  logInfo("Testing download tracking endpoint...");

  // Test with Client-ID
  const clientIdResult = await makeRequest(
    `https://api.unsplash.com/photos/${premiumPhotoId}/download`,
    {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    }
  );

  if (clientIdResult.ok) {
    logSuccess("Download tracking works with Client-ID");
    logInfo(
      `Download URL available: ${clientIdResult.data.url ? "Yes" : "No"}`
    );
  } else {
    logError(
      `Download tracking failed with Client-ID: ${clientIdResult.data?.errors || clientIdResult.error}`
    );
  }

  // Test with Bearer token if available
  if (UNSPLASH_SECRET_KEY) {
    logInfo("Testing with Bearer token...");

    const bearerResult = await makeRequest(
      `https://api.unsplash.com/photos/${premiumPhotoId}/download`,
      {
        headers: {
          Authorization: `Bearer ${UNSPLASH_SECRET_KEY}`,
        },
      }
    );

    if (bearerResult.ok) {
      logSuccess("Download tracking works with Bearer token");
      logInfo(
        `Download URL available: ${bearerResult.data.url ? "Yes" : "No"}`
      );
    } else {
      logError(
        `Download tracking failed with Bearer token: ${bearerResult.data?.errors || bearerResult.error}`
      );
    }
  }
}

async function checkApplicationInfo() {
  logSection("Application Information");

  // Test application limits and permissions
  logInfo("Testing API application permissions...");

  // Test different endpoints to understand permissions
  const tests = [
    {
      name: "Public Photos",
      endpoint: "https://api.unsplash.com/photos?per_page=1",
    },
    {
      name: "Search Photos",
      endpoint:
        "https://api.unsplash.com/search/photos?query=nature&per_page=1",
    },
    {
      name: "Collections",
      endpoint: "https://api.unsplash.com/collections?per_page=1",
    },
  ];

  for (const test of tests) {
    const result = await makeRequest(test.endpoint, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (result.ok) {
      logSuccess(`${test.name}: ✅ Access granted`);
    } else {
      logError(
        `${test.name}: ❌ Access denied - ${result.data?.errors || result.error}`
      );
    }
  }

  logInfo(
    "Note: Client-ID authentication cannot access user-specific endpoints like /me"
  );
  logInfo("This is normal for application-level API access");
}

async function generateReport() {
  logSection("Diagnostic Report");

  logInfo("Based on the tests above, here are the recommendations:");

  console.log("\n📋 UNSPLASH+ WATERMARK REMOVAL CHECKLIST:\n");

  console.log("1. ✅ Verify you have an active Unsplash+ subscription");
  console.log("   - Log into your Unsplash account");
  console.log("   - Check your billing/subscription status\n");

  console.log("2. 🔗 Link your API application to Unsplash+");
  console.log("   - Contact Unsplash support: help@unsplash.com");
  console.log("   - Provide your API application details");
  console.log("   - Request watermark-free access for premium content\n");

  console.log("3. 📧 Email Template for Unsplash Support:");
  console.log("   Subject: Link Unsplash+ subscription to API application\n");
  console.log("   Body:");
  console.log('   "Hello,');
  console.log("   ");
  console.log("   I have an active Unsplash+ subscription and would like to");
  console.log("   link it to my API application for watermark-free access");
  console.log("   to premium content.");
  console.log("   ");
  console.log("   API Access Key: [Your access key]");
  console.log("   Account Username: [Your username]");
  console.log("   ");
  console.log("   Please enable watermark-free downloads for premium");
  console.log("   photos through my API application.");
  console.log("   ");
  console.log('   Thank you!"\n');

  console.log("4. 🧪 Test after linking:");
  console.log("   - Run this script again");
  console.log("   - Check if download tracking endpoint returns success");
  console.log("   - Verify premium images load without watermarks\n");
}

async function main() {
  console.log(
    `${colors.bold}${colors.cyan}🔍 Unsplash Account Verification Tool${colors.reset}\n`
  );

  try {
    // Step 1: Verify environment variables
    const hasEnvVars = await verifyEnvironmentVariables();
    if (!hasEnvVars) {
      process.exit(1);
    }

    // Step 2: Test basic API access
    const userInfo = await verifyBasicApiAccess();
    if (!userInfo) {
      process.exit(1);
    }

    // Step 3: Check rate limits
    const basicResult = await makeRequest("https://api.unsplash.com/photos", {
      headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
    });
    if (basicResult.ok) {
      await checkRateLimits(basicResult.headers);
    }

    // Step 4: Test premium photo access
    await testPremiumPhoto();

    // Step 5: Test download tracking
    await testDownloadTracking();

    // Step 6: Show application info
    await checkApplicationInfo();

    // Step 7: Generate report
    await generateReport();
  } catch (error) {
    logError(`Script failed: ${error.message}`);
    process.exit(1);
  }
}

// Check if fetch is available (Node.js 18+)
if (!checkFetchAvailable()) {
  process.exit(1);
}

main();
