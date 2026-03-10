# Utilities

Helper functions and utilities.

## lib/og.ts

- `getBaseUrl()` - Returns base URL based on environment
- `generateOGUrl()` - Generates OG image API URL with params

## lib/animation/variants.ts

- `EASING` - Cubic bezier curves
- `DURATION` - Animation durations
- `filterVariants`, `buttonVariants`, `itemVariants` - Framer Motion variants
- `getStaggerDelay()` - Calculate stagger delay by index

## lib/content/mdx.ts

- `getAllArticles()` - Parse all MDX files, sorted by date
- `getArticleBySlug()` - Get single article
- `getAllArticleSlugs()` - List slugs
- `getRelatedArticles()` - Random related articles

## lib/image/unsplash.ts

- `extractPhotoId()` - Extract Unsplash photo ID from URLs
- `resolveImageUrl()` - Resolve to local path via manifest
- `getAttribution()` - Get author attribution

## lib/vsco-local.ts

- `getLocalVscoImages()` - Read VSCO export data with pagination
- `hasLocalVscoImages()` - Check if VSCO export exists

## lib/projects/config.ts

- `projects` - Project array with name, href, description, icon, tags
