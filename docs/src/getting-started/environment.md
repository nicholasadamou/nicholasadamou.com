# Environment Variables

Configuration for external services and features.

## Required Variables

None — the site runs without any environment variables.

## Optional Variables

### Unsplash Integration

```env
UNSPLASH_ACCESS_KEY=your_access_key
```

For downloading Unsplash images and API access.

### Database

```env
POSTGRES_URL=your_postgres_url
```

For view counts and analytics (optional).

### OpenAI

```env
OPENAI_API_KEY=your_api_key
OPENAI_ASSISTANT_ID=your_assistant_id
```

For AI chatbot features (optional).

### GitHub

```env
GITHUB_TOKEN=your_github_token
```

For fetching GitHub repository data in the open source section.

### Gumroad

```env
GUMROAD_API_KEY=your_gumroad_key
```

For product listing on the homepage.

### Spotify

```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REFRESH_TOKEN=your_refresh_token
```

For the "Now Playing" section on the home and about pages. Run `node scripts/setup/spotify-token.js` to obtain the refresh token.

### Email (Contact Form)

```env
EMAIL_SERVICE_API_KEY=your_key
```

For the contact form email delivery.

## Local Development

Create `.env.local`:

```env
# Copy from .env.example
UNSPLASH_ACCESS_KEY=
```

## Production

Set environment variables in your deployment platform (Vercel, etc.).

## Security

- Never commit `.env.local` or `.env` files
- Use different keys for development and production
- Rotate keys regularly
- Use secret management in production
