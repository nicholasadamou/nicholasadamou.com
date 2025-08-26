# Using Unsplash+ Premium Images

This guide explains how to use Unsplash+ premium images in your MDX frontmatter, with information about the comprehensive multi-layer caching and fallback system.

> **📖 Related Documentation**: For detailed information about the local image download fallback system, see [Image Download Fallback System](./IMAGE_DOWNLOAD_FALLBACK.md).

## Setup

### 1. Get Unsplash API Access

1. **Create an Unsplash Developer Account**: Go to [unsplash.com/developers](https://unsplash.com/developers)
2. **Create a new application** and get your API keys
3. **Request Unsplash+ access** (requires an approval process)

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

## Using Premium Images

### Method 1: Direct Photo ID Usage

If you know the Unsplash photo ID, you can use it directly:

```yaml
---
title: My Post
image_url: "https://images.unsplash.com/photo-1234567890-abcdef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
image_url_source: "https://unsplash.com/?utm_source=nicholasadamou.com&utm_medium=referral"
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

The `/api/cache?action=stats` endpoint now returns detailed cache metrics:

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

#### Clear Cache Response

The `/api/cache?action=clear` endpoint returns confirmation:

```json
{
  "message": "Cache cleared successfully"
}
```

#### Error Handling

Both endpoints include proper error handling:

```json
{
  "error": "Invalid action. Supported: stats, clear"
}
```

### Pre-caching Images

Use the pre-caching script to warm the cache with images from your content:

```bash
pnpm run cache:images
```

This script:

1. Scans all MDX files for Unsplash image URLs
2. Extracts photo IDs
3. Pre-fetches and caches the images
4. Reports success/failure for each image

## Premium Image Access

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
image_url_source: "https://unsplash.com/?utm_source=nicholasadamou.com&utm_medium=referral"
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

## Attribution Requirements

Always include proper attribution for Unsplash images.

The `generateUnsplashAttribution` utility function can help with this:

```typescript
const { photographerUrl, unsplashUrl } = generateUnsplashAttribution(
  photographer,
  photographerUsername,
  photoId
);
```

## Comprehensive 3-Layer Image Fallback System

> **📖 Detailed Guide**: See [Image Download Fallback System](./IMAGE_DOWNLOAD_FALLBACK.md) for complete integration documentation.

### How the 3-Layer System Works

The application now features a sophisticated **3-layer fallback system** providing maximum performance and reliability:

#### Layer 1: Local Downloaded Images (Fastest) 🏠

- Images are systematically downloaded to `public/images/unsplash/` during build
- Served directly from your domain (instant loading)
- Complete offline capability
- Zero API dependency for cached images

#### Layer 2: Build Manifest Cache (Fast) 🎯

- Static manifest generation during build via `scripts/build-cache-images.js`
- Scans all MDX files for Unsplash URLs and pre-fetches metadata
- Creates `/public/unsplash-manifest.json` with optimized URLs
- Used when local images aren't available

#### Layer 3: Runtime API Calls (Reliable) 🌐

- Dynamic API calls to `/api/unsplash` as final fallback
- Redis + memory caching for performance
- Handles new images not in build cache
- Comprehensive error handling and retry logic

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

### Advanced Download Features

The new download system includes:

- **Progress Tracking**: Real-time download progress with progress bars
- **Concurrent Downloads**: Configurable simultaneous downloads (default: 3)
- **Retry Logic**: Automatic retry with exponential backoff
- **Smart Skipping**: Skips already-downloaded files
- **Storage Optimization**: Efficient file naming and organization
- **Validation**: Verifies downloaded files exist and are valid

### Fallback Mode for CI/CD

The system gracefully handles CI/CD environments without API keys:

- **Empty Manifest Creation**: Prevents build failures when `UNSPLASH_ACCESS_KEY` is missing
- **Graceful Degradation**: Components automatically fall back to API calls
- **Development Mode**: Works seamlessly in local development
- **Production Ready**: Optimized for deployment scenarios

## UniversalImage Component

### Enhanced Image Handling

The new `UniversalImage` component provides intelligent image loading:

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

### 3-Layer Loading Strategy 🆕

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

## Available Scripts and Tools

### Complete Build Workflow

```bash
pnpm run build              # Full automated build (prebuild + build + postbuild)
# Automatically runs: build:cache-images → download:images → next build → generate RSS & sitemap
```

### Build-time Image Management

```bash
pnpm run build:cache-images   # Build manifest from content (step 1 of prebuild)
pnpm run download:images      # Download images locally (step 2 of prebuild)  🆕
pnpm run cache:images         # Runtime pre-caching script (development)
pnpm run cache:images:test    # Test legacy fallback functionality
```

### New Image Download System 🆕

```bash
pnpm run download:images      # Download all images from manifest to public/images/unsplash/
# • Progress tracking with real-time progress bars
# • Concurrent downloads (configurable)
# • Automatic retry with exponential backoff
# • Smart file skipping (won't re-download existing files)
# • Creates local-manifest.json for path mapping
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
pnpm run test:integration     # Test complete 3-layer fallback system  🆕
```

### New Integration Testing 🆕

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

**Sample output:**

```bash
🚀 Image Fallback System Integration Test

✅ Manifest Integrity
✅ Image Files
✅ Client Side Utilities
✅ Server Side Integration

🎉 Overall Result: All tests passed!

💡 Your image fallback system is fully integrated and working!
   • Local images will be served when available
   • Build manifest provides second-level caching
   • API fallback ensures reliability

🚀 Ready for production!
```

### Test Fallback Functionality

The `cache:images:test` script (`scripts/test-fallback.js`) provides comprehensive testing of the UniversalImage fallback mechanism:

```bash
pnpm run cache:images:test
```

#### What the Test Validates

1. **Manifest Loading**: Verifies the static manifest can be loaded and parsed
2. **Cache Hit Testing**: Tests images that should be found in the manifest
3. **Fallback Trigger Testing**: Tests with fake/missing image IDs to verify API fallback
4. **Statistics Reporting**: Shows cache performance and build metadata

#### Sample Test Output

```bash
🧪 Testing Unsplash Image Fallback Functionality

✅ Successfully loaded manifest
📊 Current manifest contains 18 cached images

🔍 Testing scenarios:

📝 Test: Image that should be in manifest
   Photo ID: abc123def456
   ✅ PASS: Image found in manifest as expected
   📄 Image URL: https://plus.unsplash.com/premium-photo-...

📝 Test: Image that should NOT be in manifest (fake ID)
   Photo ID: FAKE123456
   ✅ PASS: Image not in manifest - would trigger API fallback as expected

📈 Manifest Statistics:
   Generated: 2025-08-26T00:05:22.123Z
   Build version: 2.0.0
   Total found: 18
   Successfully cached: 18
   Failed to cache: 0
   Success rate: 100%

💡 How the fallback works:
1. UniversalImage component receives an Unsplash URL
2. Extracts photo ID from the URL
3. First checks the static manifest (build-time cached)
4. If not found, makes API call to /api/unsplash
5. API route fetches from Unsplash API and caches the result
6. Returns optimized image URL to the component
```

#### Integration with CI/CD

The test script is particularly useful for:

- **Pre-deployment validation**: Ensure your manifest is properly generated
- **CI/CD integration**: Add to your pipeline to validate image caching
- **Debug assistance**: Identify which images are cached vs. requiring API calls
- **Performance monitoring**: Track cache hit rates and success percentages

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

### Fallback Strategy

Implement fallback images for resilience:

```yaml
# Primary premium image
image_url: "https://plus.unsplash.com/premium-photo-123..."
image_url_source: "https://unsplash.com/?utm_source=nicholasadamou.com&utm_medium=referral"
# Fallback free image
image_url_fallback: "https://images.unsplash.com/photo-free-456..."
```

## Best Practices

1. **Use the caching system** to reduce API calls and improve performance
2. **Pre-cache images** before deployment with the caching script
3. **Monitor cache performance** through the stats API
4. **Use appropriate image dimensions** for your content layout
5. **Always include proper attribution** with UTM parameters
6. **Implement fallbacks** for premium content
7. **Verify premium access** before deploying

## Legal Considerations

- **Unsplash+ License**: Ensure you have a valid subscription for premium content
- **API Terms**: The Unsplash API requires tracking downloads (handled automatically)
- **Attribution**: Always credit photographers properly with the required UTM parameters
- **Commercial Use**: Verify your license allows commercial usage
- **Rate Limits**: Respect API rate limits through proper caching
