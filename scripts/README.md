# Scripts Directory

Utility scripts organized by purpose for build process, content preparation, and environment setup.

## Directory Structure

```
scripts/
├── build/          # Build-time scripts (image caching, downloads)
├── setup/          # Environment and dependency setup
├── content/        # Content processing and preparation
└── README.md
```

## Build Scripts

### cache-images-fallback.js

Fallback for Unsplash image caching. Creates manifest or runs submodule script.

```bash
pnpm run build:cache-images
```

### download-unsplash-fallback.js

Downloads Unsplash images via Playwright (skipped in CI).

```bash
pnpm run download:images:unsplash
```

### download-vsco-fallback.js

Downloads VSCO gallery images (skipped in CI).

```bash
pnpm run download:images:vsco
```

## Setup Scripts

### check-submodules.js

Verifies and initializes git submodules (runs automatically in prebuild).

### playwright-env.js

Sets up environment variables for Playwright downloaders.

```bash
node scripts/setup/playwright-env.js [tool-name]
```

## Content Scripts

### prepare-chatbot.js

Extracts site content for AI chatbot training.

```bash
pnpm run prepare-chatbot-data
```

## Build Workflow

```bash
pnpm format                        # Format code
node scripts/setup/check-submodules.js  # Check submodules
pnpm run build:cache-images        # Build manifests
pnpm run download:images:unsplash  # Download images (optional)
pnpm run download:images:vsco      # Download images (optional)
pnpm run build                     # Build site
```

## CI/CD

All scripts gracefully handle CI environments:

- Missing submodules are detected
- Downloads are skipped automatically
- Build continues with fallback behavior
- Images fetched at runtime via API routes
