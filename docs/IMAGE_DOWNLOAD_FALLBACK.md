# Image Download Fallback System

This document explains how to use the image download script to create a complete fallback system for when your Unsplash API calls fail.

## Overview

The image download system works in conjunction with your existing Unsplash caching infrastructure to provide multiple layers of fallback:

1. **Static Build Cache**: Images are cached at build time via `build-cache-images.js`
2. **Runtime API Cache**: Images are cached at runtime via your `/api/unsplash` endpoint
3. **Local Image Fallback**: Images are downloaded locally via `download-images.js` (this script)

## Quick Start

### 1. Build Your Manifest First

Before downloading images, ensure you have a current manifest:

```bash
# Build the manifest with current images from your content
pnpm run cache:images:build
```

### 2. Download All Images Locally

```bash
# Download all images from the manifest to public/images/unsplash/
pnpm run download:images
```

### 3. Verify Downloads

The script will create a `local-manifest.json` file that maps photo IDs to local file paths.

## How It Works

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

## Integration with Your Components

### Method 1: Update Your UniversalImage Component

```typescript
// lib/image-fallback.ts
import localManifest from "../public/images/unsplash/local-manifest.json";

export function getOptimizedImageSrc(
  photoId: string,
  fallbackUrl: string
): string {
  // Try local first
  const localImage = localManifest.images[photoId];
  if (localImage?.local_path) {
    return localImage.local_path;
  }

  // Fall back to external URL
  return fallbackUrl;
}

// In your UniversalImage component:
const optimizedSrc = getOptimizedImageSrc(photoId, apiUrl);
```

### Method 2: Middleware Approach

Create a custom image middleware:

```typescript
// middleware/image-fallback.ts
export function createImageFallbackMiddleware() {
  return (photoId: string) => {
    // Check if local file exists
    const localPath = `/images/unsplash/${photoId}.jpg`;

    // You can use a HEAD request to check if file exists
    // or preload the manifest at build time

    return localPath;
  };
}
```

### Method 3: Next.js API Route

Create an API route that handles the fallback logic:

```typescript
// pages/api/images/[photoId].ts
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import localManifest from "../../../public/images/unsplash/local-manifest.json";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { photoId } = req.query;

  // Check local manifest
  const localImage = localManifest.images[photoId as string];
  if (localImage?.local_path) {
    return res.redirect(307, localImage.local_path);
  }

  // Fall back to Unsplash API
  return res.redirect(307, `/api/unsplash?id=${photoId}`);
}
```

## Script Configuration

You can customize the download behavior by modifying the `CONFIG` object in `download-images.js`:

```javascript
const CONFIG = {
  manifestPath: path.join(process.cwd(), "public", "unsplash-manifest.json"),
  downloadDir: path.join(process.cwd(), "public", "images", "unsplash"),
  concurrency: 3, // Number of simultaneous downloads
  retries: 3, // Number of retry attempts for failed downloads
  timeout: 30000, // 30 seconds timeout per download
};
```

### Configuration Options

- **concurrency**: Number of images to download simultaneously (default: 3)
- **retries**: Number of retry attempts for failed downloads (default: 3)
- **timeout**: Timeout in milliseconds for each download (default: 30000)
- **downloadDir**: Where to save the images (default: `public/images/unsplash`)

## Workflow Integration

### Development Workflow

1. Add new images to your MDX content
2. Run `pnpm run cache:images:build` to update the manifest
3. Run `pnpm run download:images` to download new images locally
4. Commit both the manifest and downloaded images

### Build/Deploy Workflow

Consider adding the download script to your build process:

```json
{
  "scripts": {
    "prebuild": "npm-run-all cache:images:build download:images",
    "build": "next build"
  }
}
```

Or run it as a separate step in your CI/CD:

```yaml
# .github/workflows/build.yml
- name: Download Images
  run: pnpm run download:images

- name: Build
  run: pnpm run build
```

## Troubleshooting

### Common Issues

**Script fails with "manifest not found":**

```bash
# Make sure you've built the manifest first
pnpm run cache:images:build
```

**Downloads are slow:**

```javascript
// Increase concurrency in the script
const CONFIG = {
  concurrency: 5, // Increase from default 3
  // ...
};
```

**Some images fail to download:**

- Check your internet connection
- Verify the URLs in the manifest are still valid
- The script will automatically retry failed downloads

**Out of disk space:**

- Each image is typically 200-500KB optimized
- 100 images ≈ 20-50MB
- Consider cleaning old downloads periodically

### Maintenance

**Cleaning old images:**

```bash
# Remove all downloaded images
rm -rf public/images/unsplash/*

# Re-download everything
pnpm run download:images
```

**Checking download status:**
The script provides detailed output including:

- Progress bar
- Success/failure counts
- File sizes
- Storage usage

## Performance Considerations

### Pros

- ✅ No API rate limits during page loads
- ✅ Faster image loading (local files)
- ✅ Works offline
- ✅ Reduces API dependencies

### Cons

- ❌ Increases build time
- ❌ Increases repository/deployment size
- ❌ Images may become stale
- ❌ Need to manage storage

### Best Practices

1. **Regular Updates**: Run the download script when you add new images
2. **Size Management**: Monitor the size of your `public/images` directory
3. **Git LFS**: Consider using Git LFS for large image collections
4. **CDN Integration**: Serve downloaded images through your CDN for best performance

## Security Considerations

- Images are downloaded from Unsplash's CDN, which is generally safe
- The script includes a 30-second timeout to prevent hanging downloads
- User-Agent header is set to identify the downloader
- Failed downloads are logged but don't stop the overall process

## License and Attribution

Remember that downloaded Unsplash images still require proper attribution according to Unsplash's terms of service. The script preserves author information in the local manifest for this purpose.
