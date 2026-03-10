"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

// Only allow access in development
if (process.env.NODE_ENV !== "development") {
  notFound();
}

const OG_PREVIEWS = [
  {
    id: "homepage",
    title: "Homepage (Dark)",
    description: "Default homepage open graph image",
    url: "/api/og?title=Nicholas%20Adamou&description=Full-stack%20software%20engineer%20passionate%20about%20building%20impactful%20solutions&type=homepage",
  },
  {
    id: "homepage-light",
    title: "Homepage (Light)",
    description: "Homepage with light theme",
    url: "/api/og?title=Nicholas%20Adamou&description=Full-stack%20software%20engineer%20passionate%20about%20building%20impactful%20solutions&type=homepage&theme=light",
  },
  {
    id: "note",
    title: "Note (Dark)",
    description: "Blog post / note design",
    url: "/api/og?title=Advanced%20React%20Patterns&description=Exploring%20modern%20React%20patterns%20for%20scalable%20applications&type=note",
  },
  {
    id: "note-light",
    title: "Note (Light)",
    description: "Blog post / note with light theme",
    url: "/api/og?title=Advanced%20React%20Patterns&description=Exploring%20modern%20React%20patterns%20for%20scalable%20applications&type=note&theme=light",
  },
  {
    id: "note-image",
    title: "Note with Image",
    description: "Blog post / note with a background image",
    url: "/api/og?title=Building%20an%20OpenAI-Powered%20Chat%20Assistant&description=A%20deep%20dive%20into%20streaming%20AI%20responses&type=note&image=/images/unsplash/4Mw7nkQDByk.jpg",
  },
  {
    id: "notes",
    title: "Notes Listing",
    description: "Notes listing page",
    url: "/api/og?title=Notes&description=Writing%20about%20software%20engineering,%20architecture,%20and%20developer%20tools&type=notes",
  },
];

interface PreviewCardProps {
  preview: {
    id: string;
    title: string;
    description: string;
    url: string;
  };
  baseUrl: string;
}

function PreviewCard({
  preview,
  baseUrl,
  light,
}: PreviewCardProps & { light: boolean }) {
  const fullUrl = `${baseUrl}${preview.url}`;

  const cardBg = light
    ? "bg-stone-950/[0.03] border-stone-950/10"
    : "bg-white/[0.03] border-white/10";
  const urlBg = light
    ? "bg-stone-950/5 text-stone-950/50 border-stone-950/10"
    : "bg-white/5 text-white/50 border-white/10";
  const btnBg = light
    ? "border-stone-950/10 hover:bg-stone-950/5"
    : "border-white/10 hover:bg-white/5";

  return (
    <div className={`flex flex-col rounded-xl border p-5 ${cardBg}`}>
      <div className="mb-3">
        <h2 className="mb-1 text-base font-semibold">{preview.title}</h2>
        <p className="text-sm opacity-60">{preview.description}</p>
      </div>

      <div className="mb-3">
        <div className={`rounded-lg border p-2.5 font-mono text-xs ${urlBg}`}>
          <div className="break-all">{fullUrl}</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg shadow-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fullUrl}
          alt={preview.title}
          className="h-auto w-full"
          style={{ aspectRatio: "1200/630" }}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.style.display = "none";
            const parent = img.parentNode as HTMLElement;
            const errorDiv = parent?.querySelector(
              ".error-placeholder"
            ) as HTMLElement;
            if (errorDiv) errorDiv.style.display = "flex";
          }}
        />
        <div
          className="error-placeholder hidden h-32 w-full items-center justify-center text-sm opacity-50"
          style={{ display: "none" }}
        >
          Failed to load image
        </div>
      </div>

      <div className="mt-auto flex gap-2 pt-3">
        <button
          onClick={() => window.open(fullUrl, "_blank")}
          className={`flex-1 cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${btnBg}`}
        >
          Open Image
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(fullUrl)}
          className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${btnBg}`}
        >
          Copy URL
        </button>
      </div>
    </div>
  );
}

export default function OGPreviewPage() {
  const { getTextColorClass, getOpacityClass, shouldUseDarkText, isHydrated } =
    useTheme();

  const [baseUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return `${window.location.protocol}//${window.location.host}`;
    }
    return "http://localhost:3000";
  });

  if (!isHydrated) {
    return <main className="min-h-screen" />;
  }

  const light = shouldUseDarkText();
  const panelBg = light
    ? "bg-stone-950/[0.03] border-stone-950/10"
    : "bg-white/[0.03] border-white/10";

  return (
    <main
      className={`min-h-screen font-sans transition-colors duration-200 ${getTextColorClass()}`}
    >
      <div className="mx-auto max-w-4xl px-5 pb-32 pt-24 sm:pb-48 sm:pt-32">
        <div className="animate-fadeInHome1 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-medium sm:text-4xl">
              Open Graph Preview
            </h1>
            <p className={`text-sm ${getOpacityClass()}`}>
              Preview the OG images used across the site. Only available in
              development.
            </p>
          </div>

          <div className={`rounded-lg border p-5 ${panelBg}`}>
            <h3 className="mb-2 font-medium">Parameters</h3>
            <ul className={`space-y-1.5 text-sm ${getOpacityClass()}`}>
              <li>
                <strong>type</strong>: homepage, note, notes
              </li>
              <li>
                <strong>theme</strong>: dark (default), light
              </li>
              <li>
                <strong>title</strong>: Page title
              </li>
              <li>
                <strong>description</strong>: Subtitle text
              </li>
              <li>
                <strong>image</strong>: Optional background image path
              </li>
              <li>
                <strong>Dimensions</strong>: 1200×630px
              </li>
            </ul>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {OG_PREVIEWS.map((preview) => (
              <PreviewCard
                key={preview.id}
                preview={preview}
                baseUrl={baseUrl}
                light={light}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
