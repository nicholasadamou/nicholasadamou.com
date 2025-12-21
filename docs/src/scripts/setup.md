# Setup Scripts

Environment validation and setup scripts that run before builds to ensure proper configuration.

## check-submodules.js

Validates that all required git submodules are properly initialized and up-to-date.

**Purpose**: Ensures submodules (like Playwright downloaders) are available before build.

**Usage**:

```bash
node scripts/setup/check-submodules.js
```

**Runs automatically**: This script runs as part of `prebuild` in package.json.

**What it checks**:

- Submodule directories exist
- Submodules are initialized
- Submodules are on correct commits
- Required files are present

**Submodules used**:

- `tools/playwright-image-downloader` - Unsplash image downloader
- `tools/playwright-vsco-downloader` - VSCO gallery downloader

**If check fails**:

```bash
# Initialize submodules
git submodule update --init --recursive

# Or clone with submodules
git clone --recursive <repo-url>
```

## playwright-env.js

Sets up Playwright browser automation environment for image downloading.

**Purpose**: Configures Playwright browsers and environment variables for automated downloads.

**Usage**:

```bash
node scripts/setup/playwright-env.js
```

**What it does**:

- Installs Playwright browsers (Chromium)
- Sets up browser cache directory
- Configures environment variables
- Validates Playwright installation

**Required for**:

- Automated image downloading
- VSCO gallery scraping
- Premium Unsplash+ content access

**Browser setup**:

```bash
# Manual browser installation
pnpm exec playwright install chromium

# Or install all browsers
pnpm exec playwright install
```

## Running Setup Scripts

Setup scripts run automatically during installation:

```json
{
  "scripts": {
    "postinstall": "node scripts/setup/check-submodules.js",
    "prebuild": "node scripts/setup/check-submodules.js"
  }
}
```

## Troubleshooting

### Submodule Check Fails

```bash
# Reset submodules
git submodule deinit -f .
git submodule update --init --recursive
```

### Playwright Installation Fails

```bash
# Clean Playwright cache
rm -rf ~/.cache/ms-playwright

# Reinstall browsers
pnpm exec playwright install --with-deps chromium
```

### Permission Errors

```bash
# Fix script permissions
chmod +x scripts/setup/*.js
```
