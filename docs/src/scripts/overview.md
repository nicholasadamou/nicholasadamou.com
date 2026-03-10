# Scripts Overview

Automation scripts organized by purpose.

## Directory Structure

```
scripts/
├── build/          # Build-time automation
│   └── download-unsplash.js
├── content/        # Content processing
│   └── prepare-chatbot.js
└── training-data/  # Generated chatbot data
```

## Categories

### Build Scripts

- **download-unsplash.js** - Downloads Unsplash images via API

### Content Scripts

- **prepare-chatbot.js** - Extracts content for AI chatbot training

## Usage Workflow

```bash
# Download Unsplash images locally
pnpm run download:images:unsplash

# Prepare chatbot data
pnpm run prepare-chatbot-data

# Start development
pnpm dev
```
