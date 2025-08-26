# Scripts Directory

This directory contains utility scripts for managing your website's RSS feeds, sitemaps, and other build-time operations.

## 🔄 Migrated to Submodule

Most Unsplash-related scripts have been moved to the `tools/unsplash-node-utilities` submodule to eliminate duplication and improve maintainability. See the [Unsplash Utilities Documentation](../tools/unsplash-node-utilities/README.md) for details.

## Local Scripts

### Core Image Scripts

#### `build-cache-images.js` → **Moved to submodule**

**Purpose**: Build-time Unsplash image caching for static generation.

```bash
# Usage
pnpm run build:cache-images
# or
node tools/unsplash-node-utilities/build-cache-images.js
```

**What it does**:

- Scans all MDX files for Unsplash image URLs
- Fetches image metadata from Unsplash API
- Creates `public/unsplash-manifest.json` with cached image data
- Optimizes images for premium Unsplash+ subscribers
- Tracks download metrics as required by Unsplash API

**When to use**: During build process or when adding new images to content.

---

#### `download-images.js` → **Moved to submodule**

**Purpose**: Downloads all Unsplash images locally for complete offline fallback.

```bash
# Usage
pnpm run download:images
# or
node tools/unsplash-node-utilities/download-images.js
```

**What it does**:

- Reads `public/unsplash-manifest.json`
- Downloads all optimized images to `public/images/unsplash/`
- Creates `local-manifest.json` with local file mappings
- Provides progress tracking and error handling
- Supports retry logic and concurrent downloads

**Output**:

```
public/images/unsplash/
├── ZV_64LdGoao.jpg      # Downloaded image files
├── NZYgKwRA4Cg.jpg
├── ...
└── local-manifest.json  # Maps photo IDs to local paths
```

**When to use**: After building the cache manifest, or when you want complete offline capability.

---

#### `cache-unsplash-images.js` → **Moved to submodule**

**Purpose**: Development-time image caching via local API.

```bash
# Usage (requires dev server running)
pnpm run cache:images
# or
node tools/unsplash-node-utilities/cache-unsplash-images.js
```

**What it does**:

- Scans MDX files for Unsplash URLs
- Pre-caches images via `http://localhost:3000/api/unsplash`
- Populates runtime cache for development
- Creates cache management API endpoints

**When to use**: During development to pre-populate the runtime cache.

---

#### `test-fallback.js` → **Moved to submodule**

**Purpose**: Test the fallback functionality of your image system.

```bash
# Usage
pnpm run test:fallback
# or
node tools/unsplash-node-utilities/test-fallback.js
```

**What it does**:

- Loads current manifest
- Tests various fallback scenarios
- Validates manifest structure and completeness
- Shows cache statistics

**When to use**: To verify your image caching system is working correctly.

---

#### `verify-unsplash-account.js` → **Moved to submodule**

**Purpose**: Verify Unsplash API credentials and account status.

```bash
# Usage
pnpm run verify:unsplash
# or
node tools/unsplash-node-utilities/verify-unsplash-account.js
```

**What it does**:

- Tests Unsplash API connection
- Verifies API key validity
- Shows account limits and usage
- Checks Unsplash+ subscription status

**When to use**: When setting up or troubleshooting Unsplash integration.

## Image Workflow

### Complete Workflow for Maximum Reliability

```bash
# 1. First, ensure you have valid Unsplash credentials
pnpm run verify:unsplash

# 2. Build the image cache manifest (fetches metadata)
pnpm run build:cache-images

# 3. Download all images locally (complete offline fallback)
pnpm run download:images

# 4. Test the fallback system
pnpm run test:fallback

# 5. Build your site
pnpm run build
```

### Development Workflow

```bash
# Start with local caching for development
pnpm run dev              # Start dev server
pnpm run cache:images     # Pre-cache via local API (optional)

# When adding new images to content:
pnpm run build:cache-images  # Update manifest
pnpm run download:images      # Download new images
```

### Troubleshooting Workflow

```bash
# Check API credentials
pnpm run verify:unsplash

# Clear and rebuild everything
rm public/unsplash-manifest.json
rm -rf public/images/unsplash/
pnpm run build:cache-images
pnpm run download:images

# Test the system
pnpm run test:fallback
```

## Other Scripts

### `generate-rss.mjs`

Generates RSS feed from your content.

```bash
pnpm run generate:rss
```

### `generate-sitemap.mjs`

Generates XML sitemap for SEO.

```bash
pnpm run generate:sitemap
```

## Configuration

Most scripts can be configured by modifying the `CONFIG` object at the top of each file:

```javascript
// Example from download-images.js
const CONFIG = {
  manifestPath: path.join(process.cwd(), "public", "unsplash-manifest.json"),
  downloadDir: path.join(process.cwd(), "public", "images", "unsplash"),
  concurrency: 3, // Simultaneous downloads
  retries: 3, // Retry attempts
  timeout: 30000, // 30 second timeout
};
```

## Environment Variables

Required for Unsplash scripts:

```bash
UNSPLASH_ACCESS_KEY=your_access_key_here
UNSPLASH_SECRET_KEY=your_secret_key_here  # Optional, for Unsplash+
```

## Integration

### With Your Components

Use the provided utility library:

```typescript
import { getOptimizedImageSrc, useOptimizedImage } from "@/lib/image-fallback";

// In a component
const { src, isLocal, isLoading } = useOptimizedImage(unsplashUrl);

// Or async function
const optimizedSrc = await getOptimizedImageSrc(unsplashUrl, fallbackUrl);
```

### With Your Build Process

Update `package.json`:

```json
{
  "scripts": {
    "prebuild": "npm-run-all build:cache-images download:images",
    "build": "next build"
  }
}
```

## File Sizes and Storage

Typical storage requirements:

- **Manifest file**: ~10KB for 20 images
- **Each optimized image**: 100-500KB
- **Total for 100 images**: 10-50MB

Monitor your `public/images/` directory size, especially for large projects.

## Best Practices

1. **Run scripts in order**: manifest → download → build
2. **Version control**: Commit both manifest and downloaded images
3. **CI/CD**: Include image download in your deployment pipeline
4. **Monitoring**: Check script output for failed downloads
5. **Cleanup**: Periodically clean old/unused images
6. **Rate limits**: Scripts include delays to respect API limits

## Error Handling

All scripts include comprehensive error handling:

- Network timeouts (30s default)
- Retry logic (3 attempts default)
- Graceful degradation (continues on individual failures)
- Detailed logging with emoji indicators

## Performance

Scripts are optimized for:

- **Concurrent operations**: Downloads run in parallel
- **Rate limiting**: Respectful delays between API calls
- **Memory efficiency**: Streaming downloads to disk
- **Resume capability**: Skip already-downloaded files

## Maintenance

### Regular Tasks

- Run `download:images` when adding new content
- Check `verify:unsplash` if downloads start failing
- Monitor storage usage in `public/images/`
- Update scripts when adding new image sources

### Troubleshooting

- **"Manifest not found"**: Run `build:cache-images` first
- **"API key invalid"**: Check environment variables
- **"Downloads failing"**: Check internet connection and rate limits
- **"Out of space"**: Clean old downloads or increase storage
