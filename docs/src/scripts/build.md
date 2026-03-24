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

## capture-previews.mjs

Captures 1920×1080 screenshots of every project website using Playwright.

**Purpose**: Generates preview images shown on hover for projects on the homepage and `/projects` page.

```bash
pnpm run capture:previews
```

To capture only specific projects:

```bash
node scripts/build/capture-previews.mjs prr sluice
```

**Features**:

- Reads project URLs directly from `src/lib/projects/config.ts`
- Launches headless Chromium at 1920×1080 viewport
- Waits for network idle + 1.5s for animations/fonts to settle
- Saves PNGs to `public/images/projects/previews/{name}.png`
- Supports filtering by project name via CLI arguments
- Requires Playwright: `npx playwright install chromium`

**When to run**: After adding a new project or when a project site has changed significantly.

## Troubleshooting

### Missing API Key

Ensure `UNSPLASH_ACCESS_KEY` is set in `.env.local`.

### API Rate Limits

The Unsplash API allows 50 requests/hour for free tier.
