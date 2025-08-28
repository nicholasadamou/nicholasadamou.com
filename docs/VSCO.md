# VSCO Integration Guide

This guide explains how the VSCO gallery functionality works in the project, including image downloading, caching, and display.

## 🏗️ Architecture Overview

The VSCO integration consists of several components working together:

1. **Image Downloading**: Automated downloading of VSCO photos using Playwright
2. **Manifest Management**: JSON manifest tracking downloaded images
3. **API Routes**: Server-side endpoints for fetching VSCO data
4. **Gallery Components**: React components for displaying VSCO photos
5. **Local Caching**: Local fallback system for optimal performance

## 📁 File Structure

```
src/
├── 📂 app/
│   ├── 📂 api/
│   │   └── 📂 vsco/
│   │       └── route.ts                 # VSCO API endpoint
│   └── 📂 gallery/                      # Gallery page
│       ├── layout.tsx                   # Gallery layout
│       ├── metadata.ts                  # SEO metadata
│       └── page.tsx                     # Main gallery page
├── 📂 components/
│   └── 📂 features/
│       └── 📂 gallery/                  # Gallery-specific components
│           ├── FeaturedGallery.tsx      # Featured photos section
│           ├── VscoGallery.tsx          # Main gallery component
│           └── VscoGallerySkeleton.tsx  # Loading skeleton
├── 📂 hooks/                            # Custom React hooks
│   ├── useInfiniteVscoGallery.ts       # Infinite scroll gallery
│   ├── useIntersectionObserver.ts      # Intersection observer utility
│   └── useVscoGallery.ts               # Basic VSCO gallery hook
├── 📂 lib/
│   └── 📂 utils/
│       └── vsco-local.ts                # VSCO local utilities
└── 📂 types/
    └── vsco.ts                          # TypeScript definitions

public/
└── 📂 images/
    └── 📂 vsco/                         # Downloaded VSCO images
        ├── manifest.json                # Image manifest
        └── 📂 [username]/               # User-specific images
            └── [image-id].jpg

scripts/
└── download-images-vsco-fallback.js    # Image download script

tools/
└── 📂 playwright-vsco-downloader/       # VSCO downloader tool (submodule)
```

## 🛠️ Components Breakdown

### API Route (`/api/vsco`)

**Location**: `src/app/api/vsco/route.ts`

The VSCO API route handles server-side operations:

- Fetches VSCO profile data
- Manages local image manifest
- Provides fallback for missing images
- Handles error responses gracefully

**Endpoints**:

- `GET /api/vsco?action=get-profile&username=[username]&page=[page]`

### Gallery Components

#### 1. VscoGallery

**Location**: `src/components/features/gallery/VscoGallery.tsx`

Main gallery component featuring:

- Infinite scroll functionality
- Responsive masonry layout
- Image lazy loading
- Local image fallback
- Loading states and error handling

#### 2. FeaturedGallery

**Location**: `src/components/features/gallery/FeaturedGallery.tsx`

Featured photos section with:

- Curated selection of best photos
- Optimized layout for hero display
- High-quality image rendering

#### 3. VscoGallerySkeleton

**Location**: `src/components/features/gallery/VscoGallerySkeleton.tsx`

Loading skeleton component for:

- Better perceived performance
- Consistent layout during loading
- Smooth user experience

### Custom Hooks

#### 1. useVscoGallery

**Location**: `src/hooks/useVscoGallery.ts`

Basic hook for fetching VSCO data:

```typescript
const { images, isLoading, error, hasMore } = useVscoGallery({
  username: "nicholasadamou",
  initialPage: 1,
});
```

#### 2. useInfiniteVscoGallery

**Location**: `src/hooks/useInfiniteVscoGallery.ts`

Advanced hook with infinite scroll:

```typescript
const { images, isLoading, error, hasMore, loadMore } = useInfiniteVscoGallery({
  username: "nicholasadamou",
});
```

#### 3. useIntersectionObserver

**Location**: `src/hooks/useIntersectionObserver.ts`

Utility hook for intersection detection:

```typescript
const { isIntersecting, ref } = useIntersectionObserver({
  threshold: 0.1,
  rootMargin: "100px",
});
```

## 🖼️ Image Management

### Local Image System

The VSCO integration uses a local-first approach:

1. **Download**: Images are downloaded using the Playwright-based tool
2. **Manifest**: `public/images/vsco/manifest.json` tracks all downloaded images
3. **Fallback**: If local image missing, falls back to VSCO CDN URLs
4. **Optimization**: Local images are optimized for web delivery

### Manifest Structure

```json
{
  "generated_at": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "source": "vsco",
  "username": "nicholasadamou",
  "images": {
    "[image-id]": {
      "local_path": "/images/vsco/nicholasadamou/[image-id].jpg",
      "original_url": "https://vsco.co/...",
      "vsco_url": "https://image.vsco.co/...",
      "downloaded_at": "2024-01-15T10:30:15.000Z",
      "width": 1080,
      "height": 1350,
      "responsive_url": "https://image.vsco.co/..."
    }
  },
  "stats": {
    "total_images": 150,
    "downloaded": 150,
    "failed": 0,
    "skipped": 0
  }
}
```

### Image Fallback Logic

```typescript
// 1. Try local image first
if (localImage?.local_path) {
  return localImage.local_path;
}

// 2. Fall back to VSCO responsive URL
if (image.responsive_url) {
  return image.responsive_url;
}

// 3. Fall back to original VSCO URL
return image.vsco_url || image.original_url;
```

## 🔧 Development Workflow

### 1. Download Images

Use the Playwright-based downloader:

```bash
# Navigate to the tool
cd tools/playwright-vsco-downloader

# Install dependencies
npm install

# Download images
npm start -- --username nicholasadamou --max-images 50
```

### 2. Run Fallback Script

Generate fallback manifest for build:

```bash
pnpm run download:images:vsco-fallback
```

### 3. Development

Start the development server:

```bash
pnpm dev
```

Visit `http://localhost:3000/gallery` to see the gallery.

## 🎨 Styling & Layout

### Responsive Design

The gallery uses a responsive masonry layout:

- **Mobile**: 2 columns
- **Tablet**: 3 columns
- **Desktop**: 4-5 columns
- **Large screens**: 6+ columns

### CSS Classes

Key Tailwind classes used:

```css
/* Gallery container */
.columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6

/* Image items */
.break-inside-avoid mb-4 rounded-lg overflow-hidden

/* Loading skeleton */
.animate-pulse bg-gray-200 dark:bg-gray-800
```

## 🚀 Performance Optimizations

### 1. Image Loading

- **Lazy Loading**: Images load as they enter viewport
- **Progressive Enhancement**: Skeleton → Low quality → High quality
- **Local First**: Prioritizes local images over CDN

### 2. Infinite Scroll

- **Virtual Scrolling**: Only renders visible items
- **Debounced Loading**: Prevents excessive API calls
- **Error Boundary**: Graceful error handling

### 3. Caching Strategy

- **Local Storage**: Caches API responses
- **Manifest Caching**: Reuses downloaded image manifest
- **Browser Caching**: Leverages HTTP caching headers

## 🧪 Testing

### Test Coverage

The VSCO integration includes tests for:

- API route functionality
- Hook behavior and state management
- Component rendering and interactions
- Image fallback logic
- Error handling scenarios

### Running Tests

```bash
# Run all tests
pnpm test

# Run VSCO-specific tests
pnpm test -- vsco

# Run with coverage
pnpm test:coverage
```

## 🔒 Environment Variables

Required environment variables:

```bash
# Optional: VSCO credentials for private profiles
VSCO_EMAIL="your-email@example.com"
VSCO_PASSWORD="your-password"

# Optional: Custom VSCO API endpoints
VSCO_API_BASE_URL="https://vsco.co"
```

## 🐛 Troubleshooting

### Common Issues

1. **Images not loading**
   - Check if manifest exists: `public/images/vsco/manifest.json`
   - Verify image files exist in `public/images/vsco/[username]/`
   - Check network tab for API errors

2. **Infinite scroll not working**
   - Ensure intersection observer is supported
   - Check console for JavaScript errors
   - Verify API endpoints are responding

3. **Build failures**
   - Run `pnpm run download:images:vsco-fallback` before build
   - Check that all image references are valid
   - Verify TypeScript types are correct

### Debug Mode

Enable debug logging:

```typescript
// In your component
console.log("VSCO Gallery Debug:", {
  images: images.length,
  isLoading,
  hasMore,
  error,
});
```

## 📚 Resources

- [VSCO Website](https://vsco.co)
- [Playwright Documentation](https://playwright.dev)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [React Intersection Observer](https://github.com/thebuilder/react-intersection-observer)

## 🤝 Contributing

When contributing to VSCO functionality:

1. Follow existing patterns in `/components/features/gallery/`
2. Add tests for new functionality
3. Update this documentation for significant changes
4. Test both local and fallback image loading
5. Ensure responsive design works across devices

---

**For more integration guides, see other files in the `docs/` directory.**
