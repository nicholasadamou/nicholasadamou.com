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

## Client work and social previews

`/clients` is server-rendered with a canonical URL, responsive local screenshots,
CollectionPage and ItemList structured data, and a Markdown representation using
shared data. It is linked from the homepage, command palette, sitemap, and
`llms.txt`. The root Open Graph image is generated at 1200 × 630 with an embedded
portrait, so image generation does not depend on an external avatar fetch.

Static sitemap entries omit invented modification dates. Article entries use
their published dates. Crawlers can fetch the OG and Markdown endpoints while
private dashboard and unrelated API routes remain excluded.

## Verify a release

1. Inspect server HTML for a single page title, description, canonical URL, and heading.
2. Request the same URL with `Accept: text/markdown`; check the content and `Vary: Accept`.
3. Confirm a missing page returns 404 and offers navigation back to the site.
4. Check the social image, sitemap, robots rules, and links after deployment.
5. Rescan the public URL at [Is Agentic](https://is-agentic.com/scan/nicholasadamou.com).

The public report returned **100/100 on October 13, 2026**, before this portfolio
update. Scores are external snapshots, not a guarantee for future deployments.
Search ranking and indexing also depend on the search engine; no score guarantees
placement in results.
