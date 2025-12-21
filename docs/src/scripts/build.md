# Build Scripts

Automated scripts that run during the build process to optimize images and generate fallback manifests.

## cache-images-fallback.js

Generates a static manifest of all images used in the project during build time.

**Purpose**: Creates `/public/unsplash-manifest.json` with pre-fetched image metadata to reduce runtime API calls.

**Usage**:

```bash
pnpm run build:cache-images
```

**What it does**:

- Scans all MDX files in `content/` directory
- Extracts Unsplash and VSCO URLs from frontmatter
- Fetches metadata for each image
- Generates optimized URLs
- Creates manifest JSON file

**Benefits**:

- Faster page loads (no API calls needed)
- Works offline after build
- CI/CD friendly
- Reduces API rate limit usage

## download-unsplash-fallback.js

Downloads Unsplash images locally for development and faster loading.

**Purpose**: Downloads all Unsplash images referenced in content to `public/images/unsplash/`.

**Usage**:

```bash
pnpm run download:images:unsplash
```

**Features**:

- Concurrent downloads (configurable)
- Progress tracking with progress bars
- Automatic retry with exponential backoff
- Skips already-downloaded files
- Creates local manifest tracking downloads

**Configuration**:

```javascript
const CONFIG = {
  concurrency: 3, // Simultaneous downloads
  retries: 2, // Retry attempts
  timeout: 30000, // 30 second timeout
};
```

## download-vsco-fallback.js

Downloads VSCO gallery images locally for development.

**Purpose**: Downloads VSCO images to `public/images/vsco/` directory.

**Usage**:

```bash
pnpm run download:images:vsco
```

**Features**:

- Automated VSCO profile sync
- Local manifest generation
- Optimized image storage
- Fallback URL tracking

## Running During Build

All build scripts run automatically during `pnpm run build`:

```json
{
  "scripts": {
    "prebuild": "npm-run-all build:cache-images download:images",
    "build": "next build"
  }
}
```

## Troubleshooting

### Script Fails with "Manifest Not Found"

Run the cache script first:

```bash
pnpm run build:cache-images
```

### Slow Downloads

Increase concurrency (edit script CONFIG):

```javascript
const CONFIG = { concurrency: 5 };
```

### API Rate Limits

The scripts respect rate limits and include retry logic. If you hit limits:

- Wait before retrying
- Use cached manifests from previous builds
- Contact Unsplash for rate limit increases
