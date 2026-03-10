# Gallery Integration

VSCO gallery features with infinite scroll.

## VSCO Gallery

### Features

- Local images from VSCO data export
- Infinite scroll loading
- Responsive layout
- Image lazy loading
- Automatic deduplication

### Architecture

1. **Data Source**: `data/vsco-export.json` — raw VSCO data export
2. **Images**: `public/images/vsco/` — image files from the export
3. **Data Reader**: `src/lib/vsco-local.ts` reads the export JSON directly
4. **API Route**: `/api/vsco` serves paginated images
5. **Gallery Components**: `VscoGallery` and `FeaturedGallery`

### Hooks

- `useVscoGallery()` - Single-page gallery fetch
- `useInfiniteVscoGallery()` - Paginated infinite scroll

### Obtaining the VSCO Data Export

VSCO provides an official data export that includes all your image metadata and full-resolution photos. This is the only reliable way to get your images — VSCO’s Cloudflare protection blocks all API scraping and direct CDN downloads.

#### Step 1: Request the Export

1. Log in to [vsco.co](https://vsco.co)
2. Go to **Account**
3. Scroll down and click **Download my data**
4. VSCO will email you when the export is ready (usually within a few hours)

#### Step 2: Download the Archive

1. Open the email from VSCO and click the download link or visit [vsco.co/user/account](https://vsco.co/user/account) and click on **Access snapshot**
2. Extract the ZIP archive — you’ll get a folder like `vsco-username-12345/` containing:

```
vsco-username-12345/
├── images.json    # Metadata for all images (IDs, dimensions, dates, URLs)
└── images/        # Full-resolution image files
    ├── vsco_082925.jpg
    ├── vsco5dd89b7d97fb0.jpg
    └── ...
```

!!! note
The export may contain more entries in `images.json` than files in `images/` — this is normal. Multiple metadata entries can share the same filename. The gallery automatically deduplicates by filename.

#### Step 3: Copy into the Project

```bash
# Copy images
cp ~/Downloads/vsco-username-12345/images/* public/images/vsco/

# Copy metadata
cp ~/Downloads/vsco-username-12345/images.json data/vsco-export.json
```

That’s it — no build step or tooling needed. Run `pnpm dev` and the gallery will pick up the new images.

### How It Works Internally

`src/lib/vsco-local.ts` reads `data/vsco-export.json` at runtime and:

1. Filters out video entries (`is_video: true`)
2. Deduplicates by `file_name` (keeps the first occurrence)
3. Constructs image URLs as `/images/vsco/{file_name}`
4. Sorts by `capture_date` (most recent first)
5. Returns paginated results to the `/api/vsco` route

### `images.json` Format

Each entry in the VSCO export looks like:

```json
{
  "id": "60f6042f56ee7b3727dc1786",
  "capture_date": 1626735666000,
  "width": 2048,
  "height": 1536,
  "file_name": "vsco60f604326085a.jpg",
  "is_video": false,
  "perma_subdomain": "nicholasadamou",
  "responsive_url": "im.vsco.co/aws-us-west-2/.../vsco60f604326085a.jpg",
  "share_link": "http://vsco.co/nicholasadamou/media/60f6042f56ee7b3727dc1786"
}
```

Only `id`, `capture_date`, `width`, `height`, `file_name`, `is_video`, and `perma_subdomain` are used by the gallery.
