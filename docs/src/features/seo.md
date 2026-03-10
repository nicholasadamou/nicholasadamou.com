# SEO Implementation

Comprehensive SEO enhancements for better search engine visibility.

## Dynamic OG Image Generation

**Location**: `src/app/api/og/route.tsx`

Server-rendered OG images with customizable layout:

- Supports homepage, note, and notes types
- Dark and light themes
- Custom image support with base64 encoding
- Embedded avatar fallback for homepage

### Components

- `OGLayout` - Main layout with text + optional image
- `TextElement` - Styled text rendering
- `ImageElement` - Image with fallback emoji

### URL Generation

```typescript
import { generateOGUrl } from "@/lib/og";

const ogUrl = generateOGUrl({
  title: "Article Title",
  description: "Description",
  type: "note",
  image: "/images/hero.jpg",
});
```

## Metadata

- Dynamic metadata per page
- Twitter Cards and Open Graph tags
- Canonical URLs

## Automated Sitemap & Robots

- `src/app/sitemap.ts` - Dynamic sitemap generation
- `src/app/robots.ts` - Robots.txt configuration

## Testing Tools

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
