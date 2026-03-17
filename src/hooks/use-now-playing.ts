import { useState, useEffect, useCallback, useRef } from "react";

export interface SpotifyTrack {
  title: string;
  artist: string;
  album: string;
  albumArt: string | null;
  spotifyUrl: string;
}

export interface SpotifyContext {
  name: string;
  url: string;
}

export interface NowPlayingData {
  isPlaying: boolean;
  current: SpotifyTrack | null;
  recentlyPlayed: SpotifyTrack[];
  progressMs: number | null;
  durationMs: number | null;
  device: string | null;
  context: SpotifyContext | null;
}

interface UseNowPlayingResult {
  data: NowPlayingData | null;
  loading: boolean;
  /** Milliseconds since last fetch — used for client-side progress interpolation */
  elapsed: number;
}

const POLL_INTERVAL = 15_000; // 15 seconds

export function useNowPlaying(): UseNowPlayingResult {
  const [data, setData] = useState<NowPlayingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fetchedAtRef = useRef(0);

  const fetchNowPlaying = useCallback(async () => {
    try {
      const res = await fetch("/api/spotify/now-playing");
      const json = await res.json();

      fetchedAtRef.current = Date.now();
      setElapsed(0);

      if (json.current) {
        setData(json);
      } else {
        setData(null);
      }
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll API
  useEffect(() => {
    fetchNowPlaying();
    intervalRef.current = setInterval(fetchNowPlaying, POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchNowPlaying]);

  // Tick elapsed every second for progress interpolation
  useEffect(() => {
    tickRef.current = setInterval(() => {
      if (fetchedAtRef.current > 0) {
        setElapsed(Date.now() - fetchedAtRef.current);
      }
    }, 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  return { data, loading, elapsed };
}
