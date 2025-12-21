# Environment Variables

Configuration for external services and features.

## Required Variables

None - the site runs without any environment variables.

## Optional Variables

### Unsplash Integration

```env
UNSPLASH_ACCESS_KEY=your_access_key
UNSPLASH_SECRET_KEY=your_secret_key
```

For Unsplash+ watermark-free images and API access.

### VSCO Integration

```env
VSCO_EMAIL=your_email
VSCO_PASSWORD=your_password
```

For automated VSCO gallery downloads.

### Database

```env
POSTGRES_URL=your_postgres_url
```

For view counts and analytics (optional).

### Caching

```env
REDIS_URL=your_redis_url
UPSTASH_REDIS_REST_URL=your_upstash_url
```

For API response caching (optional).

### OpenAI

```env
OPENAI_API_KEY=your_api_key
OPENAI_ASSISTANT_ID=your_assistant_id
```

For AI chatbot features (optional).

## Local Development

Create `.env.local`:

```env
# Copy from .env.example
UNSPLASH_ACCESS_KEY=
UNSPLASH_SECRET_KEY=
```

## Production

Set environment variables in your deployment platform (Vercel, etc.).

## Security

- Never commit `.env.local` or `.env` files
- Use different keys for development and production
- Rotate keys regularly
- Use secret management in production
