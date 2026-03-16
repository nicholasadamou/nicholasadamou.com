import { useState, useEffect, useCallback, useRef } from "react";

export interface SpotifyTrack {
  title: string;
  artist: string;
  album: string;
  albumArt: string | null;
  spotifyUrl: string;
}

export interface NowPlayingData {
  isPlaying: boolean;
  current: SpotifyTrack | null;
  recentlyPlayed: SpotifyTrack[];
}

interface UseNowPlayingResult {
  data: NowPlayingData | null;
  loading: boolean;
}

const POLL_INTERVAL = 30_000; // 30 seconds

export function useNowPlaying(): UseNowPlayingResult {
  const [data, setData] = useState<NowPlayingData | null>(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNowPlaying = useCallback(async () => {
    try {
      const res = await fetch("/api/spotify/now-playing");
      const json = await res.json();

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

  useEffect(() => {
    fetchNowPlaying();
    intervalRef.current = setInterval(fetchNowPlaying, POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchNowPlaying]);

  return { data, loading };
}
