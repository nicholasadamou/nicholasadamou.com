# API Routes

Next.js API routes providing server-side functionality for analytics, images, and third-party integrations.

## /api/views

Page view tracking and analytics.

**Location**: `src/app/api/views/route.ts`

**Methods**:

- `GET` - Retrieve view count for a slug
- `POST` - Increment view count

**Usage**:

```typescript
// Get views
const response = await fetch("/api/views?slug=blog-post-slug");
const { views } = await response.json();

// Increment views
await fetch("/api/views", {
  method: "POST",
  body: JSON.stringify({ slug: "blog-post-slug" }),
});
```

**Database**: Uses Vercel Postgres for persistent storage.

**Response**:

```json
{
  "slug": "blog-post-slug",
  "views": 42
}
```

## /api/vsco

VSCO gallery integration.

**Location**: `src/app/api/vsco/route.ts`

**Actions**:

- `get-profile` - Fetch VSCO profile and images

**Usage**:

```typescript
const response = await fetch(
  "/api/vsco?action=get-profile&username=nicholasadamou&page=1"
);
const { images, hasMore } = await response.json();
```

**Features**:

- Local manifest fallback
- Pagination support
- Responsive image URLs
- Offline support

**Response**:

```json
{
  "images": [
    {
      "id": "image-id",
      "vsco_url": "https://image.vsco.co/...",
      "responsive_url": "https://image.vsco.co/...",
      "width": 1080,
      "height": 1350
    }
  ],
  "hasMore": true
}
```

## /api/gumroad/products

Gumroad product integration.

**Location**: `src/app/api/gumroad/products/route.ts`

**Method**: `GET`

**Usage**:

```typescript
const response = await fetch("/api/gumroad/products");
const products = await response.json();
```

**Features**:

- Product listing
- Price information
- Download counts
- Thumbnail URLs

**Response**:

```json
{
  "products": [
    {
      "name": "Product Name",
      "price": 999,
      "url": "https://gumroad.com/l/product",
      "thumbnail_url": "https://..."
    }
  ]
}
```

## Authentication

### Environment Variables

API keys are securely stored in environment variables:

```bash
# Unsplash
UNSPLASH_ACCESS_KEY=your-access-key

# VSCO (optional)
VSCO_EMAIL=your-email
VSCO_PASSWORD=your-password

# Gumroad
GUMROAD_API_KEY=your-key

# Database
POSTGRES_URL=your-postgres-url
```

### Security

- All API keys remain server-side
- CORS configured for same-origin
- Rate limiting on sensitive endpoints
- Input validation and sanitization

## Error Handling

All routes return consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details",
  "status": 400
}
```

**Common Status Codes**:

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (missing/invalid API key)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Rate Limiting

Some endpoints implement rate limiting:

- **Views API**: No rate limiting (internal use)

## Testing

Test API routes locally:

```bash
# Start dev server
pnpm dev

# Test endpoint
curl http://localhost:3000/api/views?slug=test
```

For production testing:

```bash
# Build and start
pnpm build
pnpm start

# Test with production URL
curl https://your-site.com/api/views?slug=test
```
