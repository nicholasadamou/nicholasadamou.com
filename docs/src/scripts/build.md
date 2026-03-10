# Build Scripts

Automated scripts for downloading images.

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

## Troubleshooting

### Missing API Key

Ensure `UNSPLASH_ACCESS_KEY` is set in `.env.local`.

### API Rate Limits

The Unsplash API allows 50 requests/hour for free tier.
