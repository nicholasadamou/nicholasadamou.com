# Image Optimization

Image optimization with Unsplash, VSCO, and Next.js.

## System Overview

- Unsplash images downloaded locally via API at build time
- VSCO images downloaded via Playwright automation
- Unsplash URLs resolved to local paths at MDX parse time
- Next.js Image automatic optimization

## Unsplash Integration

Images are resolved server-side in `src/lib/image/unsplash.ts`:

```typescript
import { resolveImageUrl, getAttribution } from "@/lib/image/unsplash";

const localPath = resolveImageUrl(unsplashPageUrl);
const attribution = getAttribution(unsplashPageUrl);
```

## VSCO Integration

Personal gallery sync with Playwright automation.

```bash
pnpm run download:images:vsco
```

## Build Process

```bash
# Download images locally
pnpm run download:images:unsplash
pnpm run download:images:vsco
```

## Best Practices

Always use Next.js Image component with dimensions:

```typescript
<Image src={src} alt={alt} width={1200} height={800} priority={isHero} />
```
