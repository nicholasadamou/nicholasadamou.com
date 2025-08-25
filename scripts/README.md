# Scripts Documentation

This directory contains utility scripts for maintaining and updating the website content.

## Unsplash Integration

### Enhanced Unsplash API

The Unsplash API (`/api/unsplash`) has been enhanced to automatically include image author information:

**New Response Fields:**

- `image_author`: The photographer's name
- `image_author_url`: Link to the photographer's Unsplash profile

**Example API Response:**

```json
{
  "id": "1755181023996-348eb11282ef",
  "optimized_url": "...",
  "urls": { ... },
  "user": {
    "name": "Hans Isaacson",
    "username": "hans_isaacson",
    "profile_url": "https://unsplash.com/@hans_isaacson"
  },
  "image_author": "Hans Isaacson",
  "image_author_url": "https://unsplash.com/@hans_isaacson",
  "description": "...",
  "width": 1200,
  "height": 800
}
```

### Updating MDX Files with Unsplash Data

#### Script: `update-unsplash-data.mjs`

This script automatically updates your MDX files to use the latest author information from Unsplash.

**What it does:**

1. Scans all `.mdx` files in the `content/` directory
2. Identifies files with Unsplash image URLs (`image_url` field)
3. Extracts the photo ID from the URL
4. Fetches current author data from your Unsplash API
5. Updates the `image_author` and `image_author_url` fields in the frontmatter

**Usage:**

```bash
# Make sure your development server is running first
pnpm dev

# In another terminal, run the update script
pnpm unsplash:update

# Or run directly
node scripts/update-unsplash-data.mjs
```

**Supported URL Formats:**

- `https://images.unsplash.com/photo-1234567890123-abcdefghijkl`
- `https://plus.unsplash.com/premium_photo-1234567890123-abcdefghijkl`
- Standard Unsplash photo URLs

**Before (Manual):**

```yaml
---
title: "My Article"
image_url: "https://images.unsplash.com/photo-1755181023996-348eb11282ef"
image_author: "Hans Isaacson" # Manually entered
image_author_url: "https://unsplash.com/@hans_isaacson" # Manually entered
---
```

**After (Automated):**

```yaml
---
title: "My Article"
image_url: "https://images.unsplash.com/photo-1755181023996-348eb11282ef"
image_author: "Hans Isaacson" # Automatically updated
image_author_url: "https://unsplash.com/@hans_isaacson" # Automatically updated
---
```

### Benefits

1. **Accuracy**: Always up-to-date photographer information
2. **Consistency**: Standardized author attribution format
3. **Automation**: No manual copying of author details
4. **Maintenance**: Easy bulk updates when needed

### Test Script

Use `test-photo-id-extraction.mjs` to test URL parsing:

```bash
node scripts/test-photo-id-extraction.mjs
```

This will validate that the script can correctly extract photo IDs from your Unsplash URLs.

## Requirements

- Node.js 18+
- Development server running on `http://localhost:3000`
- Valid `UNSPLASH_ACCESS_KEY` environment variable

## Error Handling

The script includes comprehensive error handling:

- Skips files without Unsplash URLs
- Handles API failures gracefully
- Preserves original files if extraction fails
- Provides detailed logging output

## Future Enhancements

Potential improvements:

- Batch API requests for better performance
- Support for other image providers
- Image URL optimization
- Backup and rollback functionality
