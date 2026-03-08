# Scripts Overview

Comprehensive automation scripts organized by purpose to streamline development and deployment.

## Directory Structure

```
scripts/
├── build/          # Build-time automation
│   ├── download-unsplash.js
│   └── download-vsco-fallback.js
├── setup/          # Environment configuration
│   ├── check-submodules.js
│   └── playwright-env.js
└── content/        # Content processing
    └── prepare-chatbot.js
```

## Categories

### Build Scripts

Run during build time to optimize assets and generate manifests.

- **download-unsplash.js** - Downloads Unsplash images via API
- **download-vsco-fallback.js** - Downloads VSCO gallery images

**When they run**: Manually, when you need to refresh local images.

### Setup Scripts

Validate environment and prepare dependencies before builds.

- **check-submodules.js** - Verifies git submodules are initialized
- **playwright-env.js** - Configures Playwright VSCO downloader environment

**When they run**: During `postinstall` and `prebuild` hooks.

### Content Scripts

Process and transform site content for various features.

- **prepare-chatbot.js** - Extracts content for AI chatbot training

**When they run**: Manually when content updates or chatbot retraining needed.

## Usage Workflow

### Initial Setup

```bash
# Install dependencies (runs setup scripts)
pnpm install

# Initialize submodules if needed
git submodule update --init --recursive
```

### Development

```bash
# Download images locally
pnpm run download:images:unsplash
pnpm run download:images:vsco

# Start development server
pnpm dev
```

### Production Build

```bash
# Full build (includes all scripts)
pnpm run build
```

This automatically runs:

1. Setup scripts (submodule check)
2. Next.js build

### Content Updates

```bash
# Update chatbot training data
node scripts/content/prepare-chatbot.js

# Then upload to OpenAI Assistant dashboard
```

## Script Configuration

Many scripts support configuration via environment variables:

```bash
# Unsplash API
UNSPLASH_ACCESS_KEY=your-key

# VSCO credentials (if needed)
VSCO_EMAIL=your-email
VSCO_PASSWORD=your-password

# OpenAI (for chatbot)
OPENAI_API_KEY=your-key
OPENAI_ASSISTANT_ID=asst-id
```

## Best Practices

1. **Always run setup scripts after cloning**

   ```bash
   git clone --recursive <repo>
   pnpm install
   ```

2. **Download images after content changes**

   ```bash
   pnpm run download:images:unsplash
   ```

3. **Update chatbot after publishing new content**

   ```bash
   node scripts/content/prepare-chatbot.js
   ```

4. **Test builds locally before deploying**
   ```bash
   pnpm run build
   pnpm start
   ```

## Troubleshooting

See individual script documentation for specific troubleshooting:

- [Build Scripts](build.md) - Image and manifest issues
- [Setup Scripts](setup.md) - Environment and dependency problems
- [Content Scripts](content.md) - Content processing errors

Common issues:

### Scripts Not Found

```bash
# Verify script locations
ls -la scripts/build/
ls -la scripts/setup/
ls -la scripts/content/
```

### Permission Denied

```bash
# Make scripts executable
chmod +x scripts/**/*.js
```

### Missing Dependencies

```bash
# Reinstall dependencies
rm -rf node_modules
pnpm install
```
