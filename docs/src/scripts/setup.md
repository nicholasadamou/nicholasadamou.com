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

- `tools/playwright-vsco-downloader` - VSCO gallery downloader

**If check fails**:

```bash
# Initialize submodules
git submodule update --init --recursive

# Or clone with submodules
git clone --recursive <repo-url>
```

## playwright-env.js

Sets up environment variables for the VSCO Playwright downloader.

**Purpose**: Copies VSCO credentials from `.env.local` to the downloader submodule.

**Usage**:

```bash
node scripts/setup/playwright-env.js playwright-vsco-downloader
```

**What it does**:

- Reads VSCO credentials from `.env.local`
- Creates `.env` file in the downloader submodule

**Required for**:

- VSCO gallery scraping

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
