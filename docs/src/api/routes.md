# API Routes

Next.js API routes providing server-side functionality.

## /api/notes/[slug]/views

Page view tracking.

- `GET` - Retrieve view count for a slug
- `POST` - Increment view count

**Database**: Vercel Postgres.

## /api/vsco

VSCO gallery integration with pagination and local manifest fallback.

**Query params**: `limit`, `offset`

## /api/gumroad/products

Gumroad product listing.

## /api/chatbot

AI chatbot powered by OpenAI Assistant API.

## /api/emails

Contact form email delivery.

## /api/github/repos

GitHub repository data for the open source section.

## /api/search

Full-text content search across blog posts.

## /api/og

Dynamic OG image generation. See [SEO documentation](../features/seo.md).

**Query params**: `title`, `description`, `type`, `theme`, `image`

## Error Handling

All routes return consistent error responses:

```json
{
  "error": "Error message",
  "status": 400
}
```
