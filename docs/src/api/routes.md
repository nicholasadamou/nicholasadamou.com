# API Routes

Next.js API routes providing server-side functionality.

## /api/notes/[slug]/views

Per-article view tracking.

- `GET` - Retrieve view count for a slug
- `POST` - Increment view count (rate-limited to 1/min per user/IP/slug)

**Database**: Vercel Postgres.

## /api/notes/views

Batch view count retrieval for multiple articles in a single request.

- `GET` - Retrieve view counts for multiple slugs

**Query params**: `slugs` (comma-separated list of slugs)

**Example**: `/api/notes/views?slugs=my-first-post,my-second-post`

Used by the homepage to fetch all article view counts in one request instead of N individual calls.

## /api/vsco

VSCO gallery integration with pagination and local manifest fallback.

**Query params**: `limit`, `offset`

## /api/gumroad/products

Gumroad product listing. Responses are cached in-memory for 1 hour with `Cache-Control` headers.

## /api/chatbot

AI chatbot powered by OpenAI Assistant API. Logs all queries to `chatbot_logs` table in Postgres.

## /api/dashboard/chatbot-logs

Paginated chatbot query logs for the private dashboard.

- `GET` - Returns chatbot logs (newest first, 50 per page)

**Auth**: Requires `Authorization: Bearer <DASHBOARD_SECRET>` header.

**Query params**: `page` (default: 1)

**Env vars**: `DASHBOARD_SECRET`, `POSTGRES_URL`

## /api/emails

Contact form email delivery.

## /api/github/repos

GitHub repository data for the open source section. Responses include `Cache-Control: public, s-maxage=3600, stale-while-revalidate=7200`.

## /api/spotify/now-playing

Spotify integration showing the current or recently played tracks.

- `GET` - Returns current track (if playing) and up to 3 recently played tracks

Refreshes the access token automatically using the stored refresh token. Responses are cached for 30 seconds.

**Response**:

```json
{
  "isPlaying": true,
  "current": {
    "title": "...",
    "artist": "...",
    "album": "...",
    "albumArt": "...",
    "spotifyUrl": "..."
  },
  "recentlyPlayed": []
}
```

**Env vars**: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`

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
