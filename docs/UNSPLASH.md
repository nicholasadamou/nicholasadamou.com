# Unsplash Integration Guide

This comprehensive guide explains how to use Unsplash images in your project, including premium Unsplash+ images, with a sophisticated 3-layer caching and fallback system for maximum performance and reliability.

## Table of Contents

- [Setup](#setup)
- [Using Images](#using-images)
- [Premium Unsplash+ Images](#premium-unsplash-images)
- [3-Layer Fallback System](#3-layer-fallback-system)
- [Caching System](#caching-system)
- [Image Download Fallback](#image-download-fallback)
- [UniversalImage Component](#universalimage-component)
- [API Compliance](#api-compliance)
- [Available Scripts](#available-scripts)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Setup

### 1. Get Unsplash API Access

1. **Create an Unsplash Developer Account**: Go to [unsplash.com/developers](https://unsplash.com/developers)
2. **Create a new application** and get your API keys
3. **Request Unsplash+ access** (requires an approval process for premium content)

### 2. Configure Environment Variables

Add your Unsplash API credentials to your `.env` file:

```bash
UNSPLASH_ACCESS_KEY=your-access-key-here
UNSPLASH_SECRET_KEY=your-secret-key-here  # Required for Unsplash+ premium access

# Optional: Redis Cache Configuration
REDIS_URL=your-redis-url                   # Redis connection string (preferred)
# OR
UPSTASH_REDIS_REST_URL=your-upstash-url    # Upstash Redis URL (alternative)
```

### 3. Install Dependencies

The required packages are already installed:

```bash
pnpm add ioredis
```

## Using Images

### Method 1: Direct Photo ID Usage

If you know the Unsplash photo ID, you can use it directly:

```yaml
---
title: My Post
image_url: "https://images.unsplash.com/photo-1234567890-abcdef?ixlib=rb-4.0.3&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
---
```

### Method 2: Using the API Routes

The website includes API routes to help you work with Unsplash images:

#### Get Photo Information

```bash
GET /api/unsplash?action=get-photo&id=PHOTO_ID
```

Response includes:

- Optimized URL with watermark removal (if Unsplash+ enabled)
- Image dimensions
- Description
- All image URLs (raw, full, regular, small, thumb)

#### Extract Photo ID from URL

```bash
GET /api/unsplash?action=extract-id&url=https://unsplash.com/photos/beautiful-sunset-abc123
```

Supports various URL formats:

- https://unsplash.com/photos/ID
- https://unsplash.com/photos/slug-ID
- Direct image URLs

## Premium Unsplash+ Images

### What You Need

1. **Valid Unsplash+ subscription**
2. **API access approved for premium content**
3. **Linking your API application to your Unsplash+ account**

### Watermark Removal

The system automatically attempts to remove watermarks from premium images when:

1. You have an Unsplash+ subscription
2. Your API application is linked to your subscription
3. The `UNSPLASH_SECRET_KEY` is configured
4. The image URL is from `plus.unsplash.com`

### Example Premium Image Usage

```yaml
---
title: My Premium Post
summary: Using a beautiful premium image
date: 2024-12-14
image_url: "https://plus.unsplash.com/premium-photo-12345?ixlib=rb-4.0.3&ixid=YOUR_APP_ID&auto=format&fit=crop&w=1200&q=80"
---
```

### Verifying Premium Access

Use the verification script to check your premium access status:

```bash
pnpm run unsplash:verify
```

This diagnostic tool checks:

- API key validity
- Rate limits
- Premium photo access
- Watermark removal capabilities
- Download tracking endpoint

## 3-Layer Fallback System

The application features a sophisticated **3-layer fallback system** providing maximum performance and reliability:

### Layer 1: Local Downloaded Images (Fastest) 🏠

- Images are systematically downloaded to `public/images/unsplash/` during build
- Served directly from your domain (instant loading)
- Complete offline capability
- Zero API dependency for cached images

### Layer 2: Build Manifest Cache (Fast) 🎯

- Static manifest generation during build via `scripts/build-cache-images.js`
- Scans all MDX files for Unsplash URLs and pre-fetches metadata
- Creates `/public/unsplash-manifest.json` with optimized URLs
- Used when local images aren't available

### Layer 3: Runtime API Calls (Reliable) 🌐

- Dynamic API calls to `/api/unsplash` as final fallback
- Redis + memory caching for performance
- Handles new images not in build cache
- Comprehensive error handling and retry logic

### Smart Production vs Development Behavior

#### Production Environment (`NODE_ENV === 'production'`)

**Compliant with Unsplash API Terms**

1. ✅ **Build Manifest Cache**: Uses Unsplash CDN URLs from `/public/unsplash-manifest.json`
2. ✅ **API Fallback**: Falls back to `/api/unsplash` which returns Unsplash CDN URLs
3. ❌ **No Local Images**: Never serves locally downloaded images (ensures hotlinking compliance)

#### Development Environment (`NODE_ENV === 'development'`)

**Optimized for Developer Experience**

1. 🏠 **Local Images First**: Fastest loading with locally downloaded images
2. 🎯 **Build Manifest**: Falls back to cached Unsplash CDN URLs
3. 🌐 **API Fallback**: Final fallback to runtime API calls

## Caching System

The application implements a multi-level caching system to improve performance and reduce API calls:

### How Caching Works

1. **Redis Cache** (Primary): Persistent cache with 24-hour expiration
2. **Memory Cache** (Fallback): In-memory cache limited to 100 items
3. **Cache Keys**: Based on photo ID (`unsplash:photo:{photoId}`)

### Cache Configuration

Cache settings are defined in `src/lib/cache/unsplash-cache.ts`:

```typescript
private readonly CACHE_DURATION = 24 * 60 * 60; // 24 hours in seconds
private readonly MAX_MEMORY_CACHE_SIZE = 100;   // Maximum memory cache items
```

### Cache Management API

The enhanced cache API (`/api/cache`) provides comprehensive cache management:

```bash
# Get cache statistics
GET /api/cache?action=stats

# Clear the cache
GET /api/cache?action=clear
```

#### Enhanced Stats Response

The `/api/cache?action=stats` endpoint returns detailed cache metrics:

```json
{
  "stats": {
    "hits": 145,
    "misses": 23,
    "sets": 23,
    "deletes": 0,
    "total_requests": 168
  },
  "hit_rate": "86.31%",
  "memory_cache_size": 23
}
```

**Response Fields:**

- `stats.hits`: Number of cache hits (data found in cache)
- `stats.misses`: Number of cache misses (data not found, fetched from API)
- `stats.sets`: Number of items stored in cache
- `stats.deletes`: Number of items removed from cache
- `stats.total_requests`: Total cache operations
- `hit_rate`: Cache effectiveness as percentage
- `memory_cache_size`: Current items in memory cache

## Image Download Fallback

### Quick Start

#### 1. Build Your Manifest First

Before downloading images, ensure you have a current manifest:

```bash
# Build the manifest with current images from your content
pnpm run build:cache-images
```

#### 2. Download All Images Locally

```bash
# Download all images from the manifest to public/images/unsplash/
pnpm run download:images
```

### File Structure

After running the download script, you'll have:

```
public/
├── images/
│   └── unsplash/
│       ├── ZV_64LdGoao.jpg
│       ├── NZYgKwRA4Cg.jpg
│       ├── ud_kWC-3Bdg.jpg
│       └── ...
│       └── local-manifest.json
├── unsplash-manifest.json
└── ...
```

### Local Manifest Structure

The `local-manifest.json` file contains:

```json
{
  "generated_at": "2025-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "source_manifest": "2025-01-15T09:00:00.000Z",
  "images": {
    "ZV_64LdGoao": {
      "local_path": "/images/unsplash/ZV_64LdGoao.jpg",
      "original_url": "https://images.unsplash.com/photo-...",
      "author": "Pankaj Patel",
      "downloaded_at": "2025-01-15T10:30:15.000Z"
    }
  },
  "stats": {
    "total_images": 18,
    "downloaded": 18,
    "failed": 0,
    "skipped": 0
  }
}
```

### Advanced Download Features

The download system includes:

- **Progress Tracking**: Real-time download progress with progress bars
- **Concurrent Downloads**: Configurable simultaneous downloads (default: 3)
- **Retry Logic**: Automatic retry with exponential backoff
- **Smart Skipping**: Skips already-downloaded files
- **Storage Optimization**: Efficient file naming and organization
- **Validation**: Verifies downloaded files exist and are valid

## UniversalImage Component

### Enhanced Image Handling

The `UniversalImage` component provides intelligent image loading:

```typescript
// Usage in MDX or React components
<UniversalImage
  src="https://unsplash.com/photos/beautiful-sunset-abc123"
  alt="Beautiful sunset"
  width={800}
  height={600}
  priority={true}
/>
```

### 3-Layer Loading Strategy

1. **🏠 Local Downloaded Images (Fastest)**: First checks for locally downloaded images in `/images/unsplash/`
2. **🎯 Build Manifest Cache (Fast)**: Falls back to static manifest `/public/unsplash-manifest.json`
3. **🌐 Runtime API Calls (Reliable)**: Final fallback to `/api/unsplash` for missing images
4. **Error Handling**: Graceful degradation with placeholder rendering at each layer
5. **Loading States**: Shows loading animation while processing fallback chain

### Key Features

- **Photo ID Extraction**: Automatically extracts Unsplash photo IDs from page URLs
- **Optimized URLs**: Uses cached optimized URLs when available
- **Timeout Handling**: 10-second timeout for API fallback requests
- **Error Recovery**: Comprehensive error logging and fallback rendering
- **Memory Efficient**: Caches manifest data to avoid repeated fetches

## API Compliance

### 🚨 Important: Automatic Compliance

Your application **automatically complies** with all Unsplash API requirements for production usage:

#### ✅ Hotlinking Requirement

**Requirement**: "Photos must be hotlinked to the original image URL on Unsplash"

**Implementation**: The `UniversalImage` component automatically ensures compliance:

- **Production** (`NODE_ENV === 'production'`): **Always** uses Unsplash CDN URLs, never local images
- **Development** (`NODE_ENV === 'development'`): Can use local images for faster dev experience

```typescript
// PRODUCTION: Always use Unsplash CDN URLs to comply with hotlinking requirement
// Per Unsplash API Terms: "Photos must be hotlinked to the original image URL on Unsplash"
if (process.env.NODE_ENV === "production") {
  // Uses Unsplash CDN URLs from build manifest or API calls
} else {
  // Development can use local images for speed
}
```

#### ✅ Download Tracking Requirement

**Requirement**: "Trigger downloads when a user in your application uses a photo"

**Implementation**: Every photo usage automatically triggers the download endpoint:

```typescript
// In /api/unsplash route - lines 65-75
// Trigger download tracking as required by Unsplash API terms
try {
  await fetch(`https://api.unsplash.com/photos/${photo.id}/download`, {
    headers: {
      Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
    },
  });
} catch (error) {
  console.warn("Download tracking failed for photo:", photo.id);
}
```

### Attribution Requirements

Always include proper attribution for Unsplash images.

The `generateUnsplashAttribution` utility function can help with this:

```typescript
const { photographerUrl, unsplashUrl } = generateUnsplashAttribution(
  photographer,
  photographerUsername,
  photoId
);
```

## Unsplash Library (`scripts/lib/unsplash-lib.js`)

The `scripts/lib/unsplash-lib.js` file provides a comprehensive library of shared functionality used across all Unsplash-related scripts. This library ensures consistency and avoids code duplication across the various tools in the Unsplash integration system.

### Core Features

#### Photo ID Extraction

The library provides robust photo ID extraction from various Unsplash URL formats:

```javascript
const { extractPhotoId } = require("./scripts/lib/unsplash-lib.js");

// Supports various URL formats:
const id1 = extractPhotoId(
  "https://unsplash.com/photos/beautiful-sunset-abc123"
);
const id2 = extractPhotoId("https://unsplash.com/photos/abc123");
// Returns: 'abc123' for both
```

**Supported URL formats:**

- `https://unsplash.com/photos/{slug}-{id}`
- `https://unsplash.com/photos/{id}`
- Direct image URLs with embedded IDs
- URLs with query parameters and fragments

#### URL Construction and Manipulation

**Generate Download URLs:**

```javascript
const { generateDownloadUrl } = require("./scripts/lib/unsplash-lib.js");

const downloadUrl = generateDownloadUrl("abc123", "optional-ixid");
// Returns: 'https://unsplash.com/photos/abc123/download?ixid=optional-ixid&force=true'
```

**Premium URL Creation:**

```javascript
const { createPremiumUnsplashUrl } = require("./scripts/lib/unsplash-lib.js");

const premiumUrl = createPremiumUnsplashUrl(
  "https://plus.unsplash.com/premium-photo-123",
  "abc123",
  1200, // width
  80 // quality
);
```

**URL Conversion:**

```javascript
const { convertToDownloadUrl } = require("./scripts/lib/unsplash-lib.js");

const result = await convertToDownloadUrl(
  "https://unsplash.com/photos/beautiful-sunset-abc123",
  true // fetch ixid for better tracking
);

// Returns:
// {
//   success: true,
//   photoId: 'abc123',
//   originalUrl: 'https://unsplash.com/photos/beautiful-sunset-abc123',
//   downloadUrl: 'https://unsplash.com/photos/abc123/download?ixid=...&force=true',
//   ixid: '...',
//   hasIxid: true
// }
```

#### HTTP Utilities

**API Request Handling:**

```javascript
const { makeApiRequest } = require("./scripts/lib/unsplash-lib.js");

const response = await makeApiRequest(
  "https://api.unsplash.com/photos/abc123",
  {
    headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
  }
);

// Returns: { ok: boolean, status: number, data: object, headers: object, error?: string }
```

**Fetch Image Data:**

```javascript
const { fetchImageData } = require("./scripts/lib/unsplash-lib.js");

const imageData = await fetchImageData("abc123");
// Automatically handles premium URLs, download tracking, and API compliance
```

**Download Tracking:**

```javascript
const { triggerDownloadTracking } = require("./scripts/lib/unsplash-lib.js");

// Required by Unsplash API terms - automatically called by fetchImageData
await triggerDownloadTracking("abc123");
```

#### File System Utilities

**Scan MDX Files:**

```javascript
const { scanMdxFiles } = require("./scripts/lib/unsplash-lib.js");

// Scan content directory for Unsplash URLs
const urls = await scanMdxFiles("./content");
// Returns array of unique Unsplash URLs found in frontmatter and content
```

**File Utilities:**

```javascript
const {
  sanitizeFilename,
  getImageExtension,
} = require("./scripts/lib/unsplash-lib.js");

const safeFilename = sanitizeFilename("Photo by John Doe!.jpg"); // 'Photo_by_John_Doe_.jpg'
const extension = getImageExtension(
  "https://images.unsplash.com/photo-123?fm=webp"
); // 'webp'
```

#### Console Output and Progress Tracking

**Colored Logging:**

```javascript
const {
  logSuccess,
  logError,
  logWarning,
  logInfo,
  logSection,
} = require("./scripts/lib/unsplash-lib.js");

logSection("Processing Images");
logSuccess("Image downloaded successfully");
logError("Failed to fetch image");
logWarning("Rate limit approaching");
logInfo("Processing photo abc123");
```

**Progress Bars:**

```javascript
const { createProgressBar } = require("./scripts/lib/unsplash-lib.js");

const progress = createProgressBar(100);
for (let i = 0; i < 100; i++) {
  // ... do work
  progress.update(); // Updates progress bar display
}
```

#### Validation Utilities

**Environment Validation:**

```javascript
const {
  checkEnvironmentVariables,
  checkFetchAvailable,
} = require("./scripts/lib/unsplash-lib.js");

// Check required environment variables
if (!checkEnvironmentVariables(true)) {
  // true = require secret key for premium
  process.exit(1);
}

// Check Node.js version compatibility
if (!checkFetchAvailable()) {
  process.exit(1);
}
```

### Configuration

The library includes default configuration that can be referenced:

```javascript
const { CONFIG } = require("./scripts/lib/unsplash-lib.js");

// CONFIG contains:
// {
//   timeout: 10000,  // 10 seconds timeout for HTTP requests
//   userAgent: 'Mozilla/5.0 (compatible; Unsplash-Script-Library/1.0)',
//   retries: 2,      // Number of retry attempts
//   rateLimitDelay: 100  // Milliseconds between API calls
// }
```

### Key Features for Premium/Watermark-Free Images

- **Automatic Premium Detection**: Detects `plus.unsplash.com` URLs and applies appropriate parameters
- **Client ID Authentication**: Automatically adds required authentication parameters
- **Minimal Parameter Optimization**: Uses minimal parameters for premium content to maintain quality
- **Fallback Handling**: Gracefully falls back to regular URLs if premium access fails

### Error Handling

The library implements comprehensive error handling:

- **Graceful Degradation**: Functions return null or default values instead of throwing errors
- **Timeout Protection**: HTTP requests include configurable timeouts
- **Rate Limit Awareness**: Detects and handles API rate limit responses
- **Retry Logic**: Built-in retry mechanisms for failed operations

### Usage in Scripts

This library is used by:

- `scripts/build-cache-images.js` - For building the manifest
- `scripts/download-images.js` - For downloading images locally
- `scripts/cache-images.js` - For runtime caching
- `scripts/unsplash-url-to-download.js` - For URL conversion
- Various API routes and components

### Backwards Compatibility

The library maintains backwards compatibility with older function names:

- `extractUnsplashPhotoId` → `extractPhotoId`
- `constructDownloadUrl` → `generateDownloadUrl`

All functions are fully documented with JSDoc comments for better IDE support and development experience.

## Available Scripts

### Complete Build Workflow

```bash
pnpm run build              # Full automated build (prebuild + build + postbuild)
# Automatically runs: build:cache-images → download:images → next build → generate RSS & sitemap
```

### Build-time Image Management

```bash
pnpm run build:cache-images   # Build manifest from content (step 1 of prebuild)
pnpm run download:images      # Download images locally (step 2 of prebuild)
pnpm run cache:images         # Runtime pre-caching script (development)
pnpm run cache:images:test    # Test legacy fallback functionality
```

### Cache Management

```bash
pnpm run cache:stats      # Get cache performance statistics
pnpm run cache:clear      # Clear the runtime image cache
```

### Testing and Verification

```bash
pnpm run unsplash:verify      # Verify Unsplash account status and API access
pnpm run cache:images:test    # Test image fallback functionality
pnpm run test:integration     # Test complete 3-layer fallback system
```

### Unsplash URL Utilities

```bash
pnpm run unsplash:url-to-download           # Convert Unsplash page URLs to download URLs
pnpm run unsplash:url-to-download --json    # Get JSON output for scripting
pnpm run unsplash:url-to-download --no-ixid # Skip ixid fetching (faster)
pnpm run unsplash:url-to-download --help    # Show usage instructions
```

**Example:**

```bash
# Convert a regular Unsplash photo URL to a download URL
pnpm run unsplash:url-to-download "https://unsplash.com/photos/beautiful-sunset-abc123"

# Output includes:
# - Photo ID extraction
# - Original URL reference
# - Direct download URL (unwatermarked)
# - IXID parameter (for better tracking)
```

### Integration Testing

The comprehensive integration test validates your entire image system:

```bash
pnpm run test:integration
```

**Tests:**

- ✅ Manifest file integrity (build + local manifests)
- ✅ Downloaded image file validation
- ✅ Client-side utility functions
- ✅ Server-side integration
- ✅ Fallback logic and photo ID extraction

### Enhanced Build Script Integration

The build process now automatically runs **both** manifest generation and image downloading:

```json
{
  "scripts": {
    "prebuild": "npm-run-all build:cache-images download:images",
    "build:cache-images": "node scripts/build-cache-images.js",
    "download:images": "node scripts/download-images.js",
    "build": "next build"
  }
}
```

**What happens during `pnpm run build`:**

1. **`prebuild`** automatically runs:
   - 📋 **`build:cache-images`** → Scans content and creates manifest
   - 📥 **`download:images`** → Downloads all images locally
2. **`build`** → Builds Next.js app with optimized images
3. **`postbuild`** → Generates RSS and sitemap

## Image Optimization

The system automatically optimizes images with these parameters:

- **Width**: 1200px (configurable)
- **Quality**: 80% (configurable)
- **Format**: JPG (for consistent quality)
- **Fit**: Crop (maintains aspect ratio)
- **Crop**: Entropy (focuses on interesting areas)

### Premium vs. Regular Image Optimization

The system uses different optimization parameters based on the image type:

**Premium Images** (plus.unsplash.com):

- Minimal parameters to preserve premium quality
- Client ID authentication
- Width and quality optimization only

**Regular Images** (images.unsplash.com):

- Full optimization parameters
- Enhanced cropping and color space settings
- Client ID authentication

## Troubleshooting

### Common Issues

1. **404 Errors**: Premium images require valid API credentials and subscription
2. **Rate Limits**: Unsplash API has rate limits (50 requests/hour for free accounts)
3. **Watermarks on Premium Images**: Your API application needs to be linked to your Unsplash+ subscription
4. **Cache Misses**: Check Redis connection and memory cache size

### Cache Performance Monitoring

Monitor cache performance with the stats endpoint:

```bash
curl "http://localhost:3000/api/cache?action=stats"
```

Check for:

- Low hit rates (< 70%)
- High miss counts
- Memory cache size reaching limits

### Testing Your Setup

Test your API configuration with specific photo IDs:

```bash
# Test regular photo
curl "http://localhost:3000/api/unsplash?action=get-photo&id=1234567890"

# Test premium photo
curl "http://localhost:3000/api/unsplash?action=get-photo&id=W_JehBhi8wo"  # Known premium photo
```

### Download Script Issues

**Script fails with "manifest not found":**

```bash
# Make sure you've built the manifest first
pnpm run build:cache-images
```

**Downloads are slow:**

```javascript
// Increase concurrency in the script
const CONFIG = {
  concurrency: 5, // Increase from default 3
  // ...
};
```

### Fallback Strategy

The system automatically handles fallbacks through the 3-layer system (local images → build manifest → API calls) rather than requiring manual fallback configuration in frontmatter.

## Best Practices

1. **Use the caching system** to reduce API calls and improve performance
2. **Pre-cache images** before deployment with the caching script
3. **Monitor cache performance** through the stats API
4. **Use appropriate image dimensions** for your content layout
5. **Always include proper attribution** with UTM parameters
6. **Implement fallbacks** for premium content
7. **Verify premium access** before deploying
8. **Regular Updates**: Run the download script when you add new images
9. **Size Management**: Monitor the size of your `public/images` directory
10. **CDN Integration**: Serve downloaded images through your CDN for best performance

## Performance Considerations

### Pros

- ✅ No API rate limits during page loads
- ✅ Faster image loading (local files in development)
- ✅ Works offline
- ✅ Reduces API dependencies
- ✅ Automatic compliance with Unsplash API terms

### Cons

- ❌ Increases build time
- ❌ Increases repository/deployment size (development only)
- ❌ Images may become stale
- ❌ Need to manage storage

## Legal Considerations

- **Unsplash+ License**: Ensure you have a valid subscription for premium content
- **API Terms**: The Unsplash API requires tracking downloads (handled automatically)
- **Attribution**: Always credit photographers properly with the required UTM parameters
- **Commercial Use**: Verify your license allows commercial usage
- **Rate Limits**: Respect API rate limits through proper caching

## Security Considerations

- Images are downloaded from Unsplash's CDN, which is generally safe
- The script includes a 30-second timeout to prevent hanging downloads
- User-Agent header is set to identify the downloader
- Failed downloads are logged but don't stop the overall process

## License and Attribution

Remember that downloaded Unsplash images still require proper attribution according to Unsplash's terms of service. The script preserves author information in the local manifest for this purpose.
