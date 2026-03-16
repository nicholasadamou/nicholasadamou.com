# Scripts Overview

Automation scripts organized by purpose.

## Directory Structure

```
scripts/
├── build/          # Build-time automation
│   ├── download-unsplash.js
│   └── compress-images.mjs
├── content/        # Content processing
│   └── prepare-chatbot.js
├── setup/          # One-time setup helpers
│   └── spotify-token.js
└── training-data/  # Generated chatbot data
```

## Categories

### Build Scripts

- **download-unsplash.js** - Downloads Unsplash images via API
- **compress-images.mjs** - Compresses oversized images in `public/` using sharp

### Content Scripts

- **prepare-chatbot.js** - Extracts content for AI chatbot training

## Usage Workflow

```bash
# Download Unsplash images locally
pnpm run download:images:unsplash

# Compress oversized public images
node scripts/build/compress-images.mjs

# Prepare chatbot data
pnpm run prepare-chatbot-data

# Start development
pnpm dev
```
