#!/usr/bin/env node

// Test the photo ID extraction with your actual URLs

function extractUnsplashPhotoId(url) {
  if (!url || typeof url !== 'string') return null;
  
  // Match various Unsplash URL patterns
  const patterns = [
    // images.unsplash.com and plus.unsplash.com formats
    /(?:images|plus)\.unsplash\.com\/(?:premium_)?photo-([a-zA-Z0-9_-]{10,})/,
    // Standard unsplash.com photo URLs
    /unsplash\.com\/photo-([a-zA-Z0-9_-]+)/,
    /unsplash\.com\/photos\/([a-zA-Z0-9_-]+)/,
    // Generic pattern for any 11-character IDs
    /unsplash\.com\/.*\/([a-zA-Z0-9_-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      console.log(`  ✅ Extracted: ${match[1]} using pattern: ${pattern}`);
      return match[1];
    }
  }
  
  console.log(`  ❌ Could not extract from: ${url}`);
  return null;
}

// Test URLs from your content
const testUrls = [
  "https://images.unsplash.com/photo-1755181023996-348eb11282ef?ixlib=rb-4.1.0%5C&w=1200&q=80&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1721476529166-1210b1ca371c?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1501426026826-31c667bdf23d?ixlib=rb-4.1.0%5C&w=1200&q=80&auto=format&fit=crop"
];

console.log("Testing Unsplash photo ID extraction:\n");

for (const url of testUrls) {
  console.log(`URL: ${url}`);
  extractUnsplashPhotoId(url);
  console.log();
}
