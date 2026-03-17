import { NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN!;

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const PLAYER_URL = "https://api.spotify.com/v1/me/player";
const RECENTLY_PLAYED_URL =
  "https://api.spotify.com/v1/me/player/recently-played?limit=5";

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyTrack {
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string; width: number; height: number }[];
  };
  external_urls: { spotify: string };
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }),
  });

  const data: SpotifyTokenResponse = await res.json();

  cachedToken = {
    token: data.access_token,
    // Expire 60s early to avoid edge cases
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return data.access_token;
}

function formatTrack(track: SpotifyTrack) {
  return {
    title: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    album: track.album.name,
    albumArt: track.album.images[0]?.url ?? null,
    spotifyUrl: track.external_urls.spotify,
  };
}

export async function GET() {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return NextResponse.json(
      { isPlaying: false, current: null, recentlyPlayed: [] },
      { status: 200 }
    );
  }

  try {
    const token = await getAccessToken();
    const headers = { Authorization: `Bearer ${token}` };
    const cacheHeaders = {
      "Cache-Control": "public, s-maxage=15, stale-while-revalidate=30",
    };

    let current = null;
    let isPlaying = false;
    let progressMs: number | null = null;
    let durationMs: number | null = null;
    let device: string | null = null;
    let context: { name: string; url: string } | null = null;

    // Fetch full player state (includes device + currently playing)
    const playerRes = await fetch(PLAYER_URL, { headers });
    if (playerRes.status === 200) {
      const data = await playerRes.json();
      if (data.item && data.currently_playing_type === "track") {
        current = formatTrack(data.item);
        isPlaying = data.is_playing;
        progressMs = data.progress_ms ?? null;
        durationMs = data.item.duration_ms ?? null;
        device = data.device?.name ?? null;
        if (data.context) {
          const ctxType = data.context.type; // "playlist" | "album" | "artist"
          const ctxUrl = data.context.external_urls?.spotify ?? null;
          let ctxName: string | null = null;

          if (ctxType === "album") {
            ctxName = data.item.album.name;
          } else if (data.context.href) {
            // Fetch playlist/artist name from the API
            try {
              const ctxRes = await fetch(data.context.href, { headers });
              if (ctxRes.ok) {
                const ctxData = await ctxRes.json();
                ctxName = ctxData.name ?? null;
              }
            } catch {
              // Ignore — fall back to type label
            }
          }

          context = {
            name: ctxName || ctxType.charAt(0).toUpperCase() + ctxType.slice(1),
            url: ctxUrl,
          };
        }
      }
    }

    // Fetch recently played
    const recentRes = await fetch(RECENTLY_PLAYED_URL, { headers });
    let recentlyPlayed: ReturnType<typeof formatTrack>[] = [];

    if (recentRes.status === 200) {
      const data = await recentRes.json();
      if (data.items?.length > 0) {
        const seen = new Set<string>();
        if (current) seen.add(current.spotifyUrl);

        const unique = data.items.filter((item: { track: SpotifyTrack }) => {
          const url = item.track.external_urls.spotify;
          if (seen.has(url)) return false;
          seen.add(url);
          return true;
        });

        if (!current && unique.length > 0) {
          current = formatTrack(unique[0].track);
          recentlyPlayed = unique
            .slice(1, 4)
            .map((item: { track: SpotifyTrack }) => formatTrack(item.track));
        } else {
          recentlyPlayed = unique
            .slice(0, 3)
            .map((item: { track: SpotifyTrack }) => formatTrack(item.track));
        }
      }
    }

    return NextResponse.json(
      {
        isPlaying,
        current,
        recentlyPlayed,
        progressMs,
        durationMs,
        device,
        context,
      },
      { headers: cacheHeaders }
    );
  } catch (error) {
    console.error("Spotify API error:", error);
    return NextResponse.json({
      isPlaying: false,
      current: null,
      recentlyPlayed: [],
    });
  }
}
