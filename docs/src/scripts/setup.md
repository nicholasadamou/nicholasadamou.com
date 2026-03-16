# Setup Scripts

Environment validation and configuration scripts.

## spotify-token.js

One-time helper to obtain a Spotify OAuth refresh token.

```bash
node scripts/setup/spotify-token.js
```

**Prerequisites**: Set `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in `.env.local`.

The script starts a local server on port 3456, opens the Spotify authorization page, and exchanges the callback code for a refresh token. Add the resulting `SPOTIFY_REFRESH_TOKEN` to `.env.local` and your deployment platform.
