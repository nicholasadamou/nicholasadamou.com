# Build Scripts

Automated scripts for downloading and optimizing images.

## download-unsplash.js

Downloads Unsplash images via the API.

**Purpose**: Downloads images referenced in content to `public/images/unsplash/`.

```bash
pnpm run download:images:unsplash
```

**Features**:

- Scans MDX content for Unsplash URLs
- Fetches images directly via the Unsplash API
- Skips already-downloaded files
- Requires `UNSPLASH_ACCESS_KEY` in `.env.local`

## compress-images.mjs

Compresses oversized images in `public/images/` using sharp.

**Purpose**: Reduces image file sizes for faster page loads and smaller build output.

```bash
node scripts/build/compress-images.mjs
```

**Features**:

- Processes all JPG/JPEG/PNG files larger than 500 KB
- Resizes to max 2400px on the longest edge (preserves aspect ratio)
- Re-encodes JPEGs with mozjpeg quality 80, PNGs with compression level 9
- Only overwrites if the compressed version is smaller
- Requires `sharp` (installed as a project dependency)

## Troubleshooting

### Missing API Key

Ensure `UNSPLASH_ACCESS_KEY` is set in `.env.local`.

### API Rate Limits

The Unsplash API allows 50 requests/hour for free tier.
