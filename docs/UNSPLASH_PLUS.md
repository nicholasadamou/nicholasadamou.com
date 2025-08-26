# Using Unsplash+ Premium Images

This guide explains how to use Unsplash+ premium images in your MDX frontmatter, with information about the caching system and advanced functionality.

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
pnpm add unsplash-js ioredis
```

## Using Premium Images

### Method 1: Direct Photo ID Usage

If you know the Unsplash photo ID, you can use it directly:

```yaml
---
title: My Post
image_url: "https://images.unsplash.com/photo-1234567890-abcdef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
image_author: "Photographer Name"
image_author_url: "https://unsplash.com/@photographer?utm_source=nicholasadamou.com&utm_medium=referral"
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
- Author information
- Image dimensions
- Description
- All image URLs (raw, full, regular, small, thumb)

#### Search for Images

```bash
GET /api/unsplash?action=search&query=nature&per_page=10&page=1
```

Parameters:

- `query`: Search term (required)
- `per_page`: Results per page (default: 10, max: 30)
- `page`: Page number (default: 1)

#### Get Random Images

```bash
GET /api/unsplash?action=random&count=5&query=technology
```

Parameters:

- `count`: Number of images (default: 1, max: 30)
- `query`: Optional search term to filter results
- `collections`: Optional comma-separated list of collection IDs

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

Manage the cache through the API:

```bash
# Get cache statistics
GET /api/cache?action=stats

# Clear the cache
GET /api/cache?action=clear
```

The stats response includes:

- Hit count
- Miss count
- Total requests
- Hit rate percentage
- Memory cache size

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
image_author: "Premium Photographer"
image_author_url: "https://unsplash.com/@premium_photographer?utm_source=nicholasadamou.com&utm_medium=referral"
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

Always include proper attribution for Unsplash images:

```yaml
image_author: "Photographer Name"
image_author_url: "https://unsplash.com/@photographer?utm_source=nicholasadamou.com&utm_medium=referral"
image_url_source: "https://unsplash.com/?utm_source=nicholasadamou.com&utm_medium=referral"
```

The `generateUnsplashAttribution` utility function can help with this:

```typescript
const { photographerUrl, unsplashUrl } = generateUnsplashAttribution(
  photographer,
  photographerUsername,
  photoId
);
```

## Available Scripts and Tools

### Image Caching

```bash
pnpm run cache:images     # Pre-cache all Unsplash images from content
pnpm run cache:stats      # Get cache performance statistics
pnpm run cache:clear      # Clear the image cache
```

### Account Verification

```bash
pnpm run unsplash:verify  # Verify Unsplash account status and API access
```

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
