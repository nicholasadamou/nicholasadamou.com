# Image Optimization

Multi-layered image optimization with Unsplash+, VSCO, and local caching.

## System Overview

- External APIs (Unsplash+, VSCO)
- Redis caching for performance
- Local manifests for offline/CI builds
- Next.js Image automatic optimization

## Unsplash+ Integration

Watermark-free images with API caching and local fallback.

```typescript
import { getOptimizedImageSrc } from "@/lib/image/fallback";

const url = await getOptimizedImageSrc(imageUrl, fallbackUrl);
```

## VSCO Integration

Personal gallery sync with Playwright automation.

```bash
pnpm run download:images:vsco
```

## Build Process

```bash
# Build manifest
pnpm run build:cache-images

# Download images locally
pnpm run download:images:unsplash
pnpm run download:images:vsco
```

## Best Practices

Always use Next.js Image component with dimensions:

```typescript
<Image src={src} alt={alt} width={1200} height={800} priority={isHero} />
```
