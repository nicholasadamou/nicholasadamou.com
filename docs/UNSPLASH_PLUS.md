# Using Unsplash+ Premium Images

This guide explains how to use Unsplash+ premium images in your MDX frontmatter.

## Setup

### 1. Get Unsplash API Access

1. **Create an Unsplash Developer Account**: Go to [unsplash.com/developers](https://unsplash.com/developers)
2. **Create a new application** and get your API keys
3. **Request Unsplash+ access** (may require approval process)

### 2. Configure Environment Variables

Add your Unsplash API credentials to your `.env` file:

```bash
UNSPLASH_ACCESS_KEY=your-access-key-here
UNSPLASH_SECRET_KEY=your-secret-key-here
```

### 3. Install Dependencies

The `unsplash-js` package is already installed via:

```bash
pnpm add unsplash-js
```

## Using Premium Images

### Method 1: Direct Photo ID Usage

If you know the Unsplash photo ID, you can use it directly:

```yaml
---
title: My Post
image_url: "https://images.unsplash.com/photo-1234567890-abcdef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
image_author: "Photographer Name"
image_author_url: "https://unsplash.com/@photographer"
---
```

### Method 2: Using the API Routes

The website includes API routes to help you work with Unsplash images:

#### Get Photo Information

```bash
GET /api/unsplash?action=get-photo&id=PHOTO_ID
```

#### Search for Images

```bash
GET /api/unsplash?action=search&query=nature&per_page=10&page=1
```

#### Get Random Images

```bash
GET /api/unsplash?action=random&count=5&query=technology
```

#### Extract Photo ID from URL

```bash
GET /api/unsplash?action=extract-id&url=https://unsplash.com/photos/beautiful-sunset-abc123
```

## Premium Image Access

### What You Need

1. **Valid Unsplash+ subscription**
2. **API access approved for premium content**
3. **Proper attribution** in your frontmatter

### Example Premium Image Usage

```yaml
---
title: My Premium Post
summary: Using a beautiful premium image
date: 2024-12-14
image_url: "https://images.unsplash.com/photo-premium-12345?ixlib=rb-4.0.3&ixid=YOUR_APP_ID&auto=format&fit=crop&w=1200&q=80"
image_author: "Premium Photographer"
image_author_url: "https://unsplash.com/@premium_photographer?utm_source=your-app&utm_medium=referral"
image_url_source: "https://unsplash.com/?utm_source=your-app&utm_medium=referral"
---
```

## Image Optimization

The system automatically optimizes images with these parameters:

- **Width**: 1200px (configurable)
- **Quality**: 80% (configurable)
- **Format**: Auto (WebP when supported)
- **Fit**: Crop (maintains aspect ratio)

### Custom Optimization

You can customize image parameters:

```bash
GET /api/unsplash?action=optimize-url&id=PHOTO_ID&width=800&quality=90&fit=fill&format=webp
```

## Attribution Requirements

Always include proper attribution for Unsplash images:

```yaml
image_author: "Photographer Name"
image_author_url: "https://unsplash.com/@photographer?utm_source=your-app&utm_medium=referral"
image_url_source: "https://unsplash.com/?utm_source=your-app&utm_medium=referral"
```

## Troubleshooting

### Common Issues

1. **404 Errors**: Premium images require valid API credentials and subscription
2. **Rate Limits**: Unsplash API has rate limits (50 requests/hour for free accounts)
3. **Photo Not Found**: Some premium photos may not be available via API

### Testing Your Setup

Test your API configuration:

```bash
curl "http://localhost:3000/api/unsplash?action=get-photo&id=1234567890"
```

### Fallback Strategy

Always have a fallback plan:

```yaml
# Primary premium image
image_url: "https://images.unsplash.com/photo-premium-123..."
# Fallback free image
image_url_fallback: "https://images.unsplash.com/photo-free-456..."
```

## Best Practices

1. **Cache API responses** to avoid rate limits
2. **Use appropriate image dimensions** for your use case
3. **Always include proper attribution**
4. **Test premium access** before deploying
5. **Have fallback images** for production resilience

## Legal Considerations

- **Unsplash+ License**: Ensure you have valid subscription for premium content
- **Attribution**: Always credit photographers properly
- **Commercial Use**: Verify your license allows commercial usage
- **Terms of Service**: Follow Unsplash's terms and API guidelines
