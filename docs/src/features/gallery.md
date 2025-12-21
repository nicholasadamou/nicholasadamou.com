# Gallery Integration

VSCO and Unsplash gallery features with infinite scroll and local caching.

## VSCO Gallery

### Features

- Automated sync with VSCO profile
- Infinite scroll loading
- Local image caching
- Responsive masonry layout
- Image lazy loading

### Architecture

1. **Image Downloading**: Automated downloading using Playwright
2. **Manifest Management**: JSON manifest tracking downloaded images
3. **API Routes**: Server-side endpoints (`/api/vsco`)
4. **Gallery Components**: React components for display
5. **Local Caching**: Local fallback system for optimal performance

### Components

- **VscoGallery** - Main gallery component with infinite scroll
- **FeaturedGallery** - Curated photos for homepage
- **VscoGallerySkeleton** - Loading skeleton

### File Structure

```
src/
├── app/api/vsco/ - VSCO API endpoint
├── components/features/gallery/ - Gallery components
├── hooks/ - useVscoGallery, useInfiniteVscoGallery
public/images/vsco/ - Downloaded images + manifest
```

### Development Workflow

1. Download images:

   ```bash
   cd tools/playwright-vsco-downloader
   npm start -- --username nicholasadamou --max-images 50
   ```

2. Generate fallback manifest:

   ```bash
   pnpm run download:images:vsco-fallback
   ```

3. Start development:
   ```bash
   pnpm dev
   ```

### Responsive Design

- **Mobile**: 2 columns
- **Tablet**: 3 columns
- **Desktop**: 4-5 columns
- **Large screens**: 6+ columns

### Image Fallback Logic

1. Try local image first
2. Fall back to VSCO responsive URL
3. Fall back to original VSCO URL

For detailed VSCO integration, see the original VSCO.md file.
