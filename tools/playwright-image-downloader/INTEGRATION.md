# 🎭 Playwright Image Downloader Integration

This document explains how the Playwright Image Downloader integrates with your main project.

## 🔄 Integration with Main Project

### npm Scripts

The main project now includes a new npm script that runs the Playwright downloader:

```bash
# From the main project root
pnpm run download:images:playwright
```

This script automatically:

1. Navigates to the Playwright tool directory
2. Installs dependencies (if needed)
3. Runs the downloader with default settings

### File Structure

```
nicholasadamou.com/
├── scripts/
│   └── download-images.js          # Original Node.js script
├── tools/
│   └── playwright-image-downloader/ # New Playwright service
│       ├── src/
│       ├── package.json
│       ├── playwright.config.js
│       └── README.md
└── public/
    ├── unsplash-manifest.json      # Source manifest (shared)
    └── images/unsplash/           # Download directory (shared)
```

## 🆚 Comparison: Original vs Playwright

| Aspect               | Original Script       | Playwright Service                  |
| -------------------- | --------------------- | ----------------------------------- |
| **Authentication**   | API tokens only       | Full browser login                  |
| **Download Method**  | Direct API calls      | Browser-based downloads             |
| **Rate Limiting**    | API rate limits       | Browser-like behavior               |
| **Image Quality**    | API restrictions      | Highest available quality           |
| **Error Handling**   | Basic retry logic     | Advanced retry with browser context |
| **Debugging**        | Console logs only     | Visual browser debugging            |
| **Setup Complexity** | Simple (Node.js only) | Moderate (requires browsers)        |
| **Resource Usage**   | Low                   | Higher (browser overhead)           |
| **Premium Content**  | Limited access        | Full access with login              |

## 🎯 When to Use Which

### Use Original Script When:

- You want fast, lightweight downloads
- API rate limits are not an issue
- You don't need premium/high-res images
- Running in constrained environments (CI, etc.)

### Use Playwright Service When:

- You need the highest quality images
- You have an Unsplash account for better access
- API downloads are failing or rate-limited
- You want better error handling and retry logic
- You need to debug download issues visually

## 🚀 Quick Start

1. **Setup Environment Variables**

   ```bash
   cd tools/playwright-image-downloader
   cp .env.example .env
   # Edit .env with your Unsplash credentials
   ```

2. **Install Browser Dependencies**

   ```bash
   cd tools/playwright-image-downloader
   pnpm run install-browsers
   ```

3. **Run from Main Project**

   ```bash
   # From project root
   pnpm run download:images:playwright
   ```

4. **Or Run Directly**
   ```bash
   cd tools/playwright-image-downloader
   pnpm run download
   ```

## 🎛️ Advanced Usage

### Custom Configuration

```bash
# With custom settings
cd tools/playwright-image-downloader
pnpm run download -- --concurrency 5 --timeout 45000 --no-headless

# Debug mode (shows browser)
pnpm run download -- --debug --no-headless --concurrency 1

# Check environment
pnpm run download -- check

# List what would be downloaded
pnpm run download -- list
```

### Integration in CI/CD

```yaml
# GitHub Actions example
- name: Download images with Playwright
  run: |
    cd tools/playwright-image-downloader
    pnpm install
    pnpm run install-browsers
    pnpm run download
  env:
    UNSPLASH_EMAIL: ${{ secrets.UNSPLASH_EMAIL }}
    UNSPLASH_PASSWORD: ${{ secrets.UNSPLASH_PASSWORD }}
    UNSPLASH_ACCESS_KEY: ${{ secrets.UNSPLASH_ACCESS_KEY }}
```

## 🔧 Troubleshooting Integration

### Common Issues

**"Manifest not found"**

- Ensure you've run the cache building step first
- Check the manifest path in configuration

**"Browser installation failed"**

- Run `pnpm run install-browsers` manually
- Check system requirements for Playwright

**"Permission denied"**

- Check write permissions on the download directory
- Ensure the script has access to create files

### Debug Mode

For troubleshooting, always use debug mode:

```bash
cd tools/playwright-image-downloader
pnpm run download -- --no-headless --debug --concurrency 1
```

This will:

- Show the browser window
- Open DevTools
- Process one image at a time
- Provide detailed error messages

## 📊 Output Comparison

### Original Script Output

```
🖼️  Unsplash Image Download Tool
📄 Loading manifest...
📊 Found 18 images to process
🚀 Starting downloads...
Progress: [████████████████] 100% (18/18)
✅ Successfully downloaded: 15
⏭️  Skipped: 2
❌ Failed: 1
💾 Storage Used: 45.67 MB
```

### Playwright Service Output

```
🎭 Playwright Image Downloader
🚀 Initializing Playwright Image Downloader...
✅ Browser initialized
📄 Loading manifest...
✅ Loaded 18 images from manifest
📊 Configuration:
   • Download directory: /path/to/images
   • Concurrency: 3
   • Timeout: 30000ms
   • Retries: 3
   • Headless: true
🚀 Starting downloads...

📥 [1/3] Downloading: ZV_64LdGoao
✅ Downloaded: ZV_64LdGoao.jpg (2.34 MB)
⏭️  Skipped (exists): NZYgKwRA4Cg

📊 Download Results:
   ✅ Successfully downloaded: 15
   ⏭️  Skipped (already exist): 2
   ❌ Failed to download: 1
   ⏱️  Total time: 45.2s
   💾 Storage used: 45.67 MB
   📄 Local manifest: tools/../public/images/unsplash/local-manifest.json
🎉 Download process complete!
```

## 🔮 Future Enhancements

Potential improvements to consider:

- Support for other image sources besides Unsplash
- Image optimization/compression during download
- Parallel browser instances for faster downloads
- Integration with CDN upload
- Automatic image format conversion
- Duplicate image detection across different sources

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section in `tools/playwright-image-downloader/README.md`
2. Run in debug mode to see what's happening
3. Check the browser compatibility
4. Verify your Unsplash account permissions
