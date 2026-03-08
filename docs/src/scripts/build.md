# Build Scripts

Automated scripts that run during the build process to download images.

## download-unsplash.js

Downloads Unsplash images via the Unsplash API for development and faster loading.

**Purpose**: Downloads all Unsplash images referenced in content to `public/images/unsplash/`.

**Usage**:

```bash
pnpm run download:images:unsplash
```

**Features**:

- Scans MDX content for Unsplash URLs (no manifest needed)
- Fetches images directly via the Unsplash API
- Skips already-downloaded files
- Requires `UNSPLASH_ACCESS_KEY` in `.env.local`

## download-vsco.js

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

## Running Manually

Build scripts are **not** run automatically during `pnpm run build`. Run them manually when needed:

## Troubleshooting

### Missing API Key

Ensure `UNSPLASH_ACCESS_KEY` is set in `.env.local`.

### API Rate Limits

The Unsplash API allows 50 requests/hour for free tier. If you hit limits, wait before retrying.
