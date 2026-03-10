# Image Optimization

Image optimization with Unsplash, VSCO, and Next.js.

## System Overview

- Unsplash images downloaded locally via API
- VSCO images served from local data export
- Unsplash URLs resolved to local paths at MDX parse time
- Next.js Image automatic optimization

## Unsplash Integration

Images are resolved server-side in `src/lib/image/unsplash.ts`:

```typescript
import { resolveImageUrl, getAttribution } from "@/lib/image/unsplash";

const localPath = resolveImageUrl(unsplashPageUrl);
const attribution = getAttribution(unsplashPageUrl);
```

Key functions:

- `extractPhotoId()` - Extract 11-char ID from various URL formats
- `resolveImageUrl()` - Resolve to local `/images/unsplash/{id}.jpg` path
- `getAttribution()` - Get author name and UTM-tagged URL

## VSCO Integration

VSCO images are served from a local data export — no API or automation needed.
Images live in `public/images/vsco/` and metadata is in `data/vsco-export.json`.

## Build Process

```bash
# Download Unsplash images locally
pnpm run download:images:unsplash
```

## Best Practices

Always use the `UniversalImage` component or Next.js `Image`:

```typescript
<UniversalImage src={src} alt={alt} width={1200} height={800} priority={isHero} />
```
