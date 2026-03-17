"use client";

import {
  ArrowUpRight,
  Smartphone,
  Laptop,
  Monitor,
  Tablet,
  Speaker,
  Tv,
  type LucideIcon,
} from "lucide-react";
import { useNowPlaying } from "@/hooks/use-now-playing";
import type { SpotifyTrack, NowPlayingData } from "@/hooks/use-now-playing";
import ImagePreview from "@/components/ui/ImagePreview";

interface SpotifySectionProps {
  light: boolean;
  opacityClass: string;
  linkColorClass: string;
}

function SpotifyLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function EqBars({
  className,
  animated = true,
}: {
  className?: string;
  animated?: boolean;
}) {
  const color = animated ? "bg-[#1DB954]" : "bg-current opacity-25";

  return (
    <div className={`flex items-end gap-[2px] ${className}`}>
      <span
        className={`eq-bar ${animated ? "eq-bar-1" : ""} ${color}`}
        style={{ height: animated ? undefined : 4 }}
      />
      <span
        className={`eq-bar ${animated ? "eq-bar-2" : ""} ${color}`}
        style={{ height: animated ? undefined : 7 }}
      />
      <span
        className={`eq-bar ${animated ? "eq-bar-3" : ""} ${color}`}
        style={{ height: animated ? undefined : 4 }}
      />
    </div>
  );
}

function TrackCard({
  track,
  isPlaying,
  cardBg,
  linkColorClass,
  opacityClass,
}: {
  track: SpotifyTrack;
  isPlaying?: boolean;
  cardBg: string;
  linkColorClass: string;
  opacityClass: string;
}) {
  return (
    <ImagePreview
      src={track.albumArt}
      alt={track.album}
      previewClassName="relative aspect-square w-48"
    >
      <a
        href={track.spotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-3 rounded-lg p-2 transition-opacity hover:opacity-60 ${cardBg}`}
      >
        {track.albumArt && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={track.albumArt}
            alt={track.album}
            className="h-12 w-12 rounded-md object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
          <p
            className={`truncate text-sm !leading-snug font-medium ${linkColorClass}`}
          >
            {track.title}
          </p>
          <p className={`truncate text-xs ${opacityClass}`}>{track.artist}</p>
        </div>
        {isPlaying && <EqBars className="shrink-0" />}
      </a>
    </ImagePreview>
  );
}

const DEVICE_PATTERNS: [RegExp, LucideIcon][] = [
  [/iphone|android|pixel|galaxy|phone/i, Smartphone],
  [/ipad|tablet/i, Tablet],
  [/macbook|laptop|notebook/i, Laptop],
  [/imac|mac mini|mac pro|mac studio|desktop|pc/i, Monitor],
  [/tv|chromecast|apple\s?tv|fire\s?stick|roku/i, Tv],
  [/echo|homepod|sonos|speaker|alexa|google home/i, Speaker],
];

function DeviceIcon({ name }: { name: string }) {
  const Icon = DEVICE_PATTERNS.find(([re]) => re.test(name))?.[1] ?? Speaker;
  return <Icon className="h-3 w-3 shrink-0" />;
}

function ProgressBar({
  data,
  elapsed,
  light,
}: {
  data: NowPlayingData;
  elapsed: number;
  light: boolean;
}) {
  if (!data.isPlaying || !data.progressMs || !data.durationMs) return null;

  const current = Math.min(data.progressMs + elapsed, data.durationMs);
  const pct = (current / data.durationMs) * 100;
  const barBg = light ? "bg-stone-950/10" : "bg-white/10";

  return (
    <div className={`h-0.5 w-full overflow-hidden rounded-full ${barBg}`}>
      <div
        className="h-full rounded-full bg-[#1DB954] transition-[width] duration-1000 ease-linear"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function SpotifySection({
  light,
  opacityClass,
  linkColorClass,
}: SpotifySectionProps) {
  const { data, loading, elapsed } = useNowPlaying();

  const cardBg = light ? "bg-stone-950/[0.03]" : "bg-white/[0.04]";
  const shimmer = light ? "bg-stone-950/[0.06]" : "bg-white/[0.08]";

  return (
    <div className="space-y-4 sm:space-y-3">
      <h2 className={`flex items-center gap-1.5 ${opacityClass} text-sm`}>
        <SpotifyLogo className="h-3.5 w-3.5" />
        Listening
      </h2>

      <div className="space-y-3">
        {loading ? (
          <div className={`rounded-lg p-2 ${cardBg}`}>
            <div className="flex items-center gap-3">
              <div
                className={`h-12 w-12 animate-pulse rounded-md ${shimmer}`}
              />
              <div className="flex-1 space-y-1.5">
                <div
                  className={`h-3.5 w-2/3 animate-pulse rounded ${shimmer}`}
                />
                <div className={`h-3 w-1/3 animate-pulse rounded ${shimmer}`} />
              </div>
            </div>
          </div>
        ) : data ? (
          <>
            {data.isPlaying && data.current ? (
              <div className="space-y-1.5">
                {data.context && (
                  <p className={`text-xs ${opacityClass}`}>
                    From{" "}
                    {data.context.url ? (
                      <a
                        href={data.context.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-dashed underline-offset-2 transition-opacity hover:opacity-60"
                      >
                        {data.context.name}
                      </a>
                    ) : (
                      data.context.name
                    )}{" "}
                    <span className="opacity-50">({data.context.type})</span>
                  </p>
                )}
                <TrackCard
                  track={data.current}
                  isPlaying
                  cardBg={cardBg}
                  linkColorClass={linkColorClass}
                  opacityClass={opacityClass}
                />
                <ProgressBar data={data} elapsed={elapsed} light={light} />
                {data.device && (
                  <p className={`flex items-center gap-1 text-xs opacity-40`}>
                    <DeviceIcon name={data.device} />
                    Playing on {data.device}
                  </p>
                )}
              </div>
            ) : (
              <div
                className={`flex items-center gap-3 rounded-lg p-2 ${cardBg}`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-md ${shimmer}`}
                >
                  <SpotifyLogo className={`h-5 w-5 ${opacityClass}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium ${opacityClass}`}>
                    Not playing
                  </p>
                  <p className={`text-xs opacity-40`}>Spotify is idle</p>
                </div>
                <EqBars className="shrink-0" animated={false} />
              </div>
            )}
            {data.recentlyPlayed.length > 0 && (
              <div className="space-y-1">
                <p className={`text-xs ${opacityClass}`}>Recently played</p>
                {data.recentlyPlayed.map((track, i) => (
                  <TrackCard
                    key={`${track.spotifyUrl}-${i}`}
                    track={track}
                    cardBg={cardBg}
                    linkColorClass={linkColorClass}
                    opacityClass={opacityClass}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <p className={`text-sm ${opacityClass}`}>Not playing</p>
        )}

        <a
          href="https://open.spotify.com/user/nicholasadamou"
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1 text-sm transition-opacity hover:opacity-60 ${opacityClass}`}
        >
          View on Spotify
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
