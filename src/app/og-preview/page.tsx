"use client";

import { useState } from "react";
import { notFound } from "next/navigation";

// Only allow access in development
if (process.env.NODE_ENV !== "development") {
  notFound();
}

const OG_PREVIEWS = [
  {
    id: "homepage",
    title: "🏠 Homepage Design",
    description: "Default homepage open graph image",
    url: "/api/og?title=Nicholas%20Adamou&description=Full-stack%20software%20engineer%20passionate%20about%20building%20impactful%20solutions&type=homepage",
  },
  {
    id: "homepage-light",
    title: "🏠 Homepage Design (Light)",
    description: "Homepage with light theme",
    url: "/api/og?title=Nicholas%20Adamou&description=Full-stack%20software%20engineer%20passionate%20about%20building%20impactful%20solutions&type=homepage&theme=light",
  },
  {
    id: "project",
    title: "📝 Project Design",
    description: "Project page with sample content",
    url: "/api/og?title=Interactive%20Coding%20Challenges&description=An%20interactive%20platform%20for%20developers%20to%20improve%20skills&type=project",
  },
  {
    id: "project-with-image",
    title: "📝 Project Design (with image)",
    description: "Project page with background image",
    url: "/api/og?title=You%20Build%20It%20Interactive%20Coding%20Challenges&description=An%20interactive%20platform%20for%20developers%20to%20improve%20skills&type=project&image=/images/unsplash/4Mw7nkQDByk.jpg",
  },
  {
    id: "note",
    title: "📄 Note Design",
    description: "Blog post/note design",
    url: "/api/og?title=Advanced%20React%20Patterns&description=Exploring%20modern%20React%20patterns%20for%20scalable%20applications&type=note",
  },
  {
    id: "note-dark",
    title: "📄 Note Design (Dark)",
    description: "Blog post/note with dark theme",
    url: "/api/og?title=Advanced%20React%20Patterns&description=Exploring%20modern%20React%20patterns%20for%20scalable%20applications&type=note&theme=dark",
  },
  {
    id: "contact",
    title: "📧 Contact Design",
    description: "Contact page design",
    url: "/api/og?title=Let's%20Connect&description=Ready%20to%20collaborate%20on%20your%20next%20project&type=contact",
  },
  {
    id: "projects",
    title: "📚 Projects Portfolio",
    description: "Projects listing page",
    url: "/api/og?title=Project%20Portfolio&description=A%20collection%20of%20my%20latest%20work%20and%20experiments&type=projects",
  },
  {
    id: "notes",
    title: "📑 Development Notes",
    description: "Notes listing page",
    url: "/api/og?title=Development%20Notes&description=Insights%20on%20programming,%20productivity,%20and%20best%20practices&type=notes",
  },
  {
    id: "gallery",
    title: "📸 Photo Gallery",
    description: "Gallery page with featured image",
    url: "/api/og?title=Photo%20Gallery&description=A%20curated%20collection%20of%20my%20photography%20work&type=gallery&image=/gallery/arizona.jpg",
  },
];

interface PreviewCardProps {
  preview: {
    id: string;
    title: string;
    description: string;
    url: string;
  };
  currentBaseUrl: string;
}

function PreviewCard({ preview, currentBaseUrl }: PreviewCardProps) {
  const fullUrl = `${currentBaseUrl}${preview.url}`;

  return (
    <div className="bg-secondary border-primary shadow-soft rounded-xl border p-6">
      <div className="mb-4">
        <h2 className="text-primary mb-2 text-lg font-semibold">
          {preview.title}
        </h2>
        <p className="text-secondary text-sm">{preview.description}</p>
      </div>

      <div className="mb-4">
        <div className="bg-tertiary text-tertiary rounded-lg border border-gray-200 p-3 font-mono text-xs dark:border-gray-700">
          <div className="break-all">{fullUrl}</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg shadow-lg">
        <img
          src={fullUrl}
          alt={preview.title}
          className="h-auto w-full max-w-full"
          style={{ aspectRatio: "1200/630" }}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.style.display = "none";
            const errorDiv = img.parentNode?.querySelector(
              ".error-placeholder"
            ) as HTMLElement;
            if (errorDiv) {
              errorDiv.style.display = "flex";
            }
          }}
        />
        <div
          className="bg-tertiary text-secondary hidden h-32 w-full items-center justify-center text-sm"
          style={{ display: "none" }}
          role="img"
          aria-label="Failed to load image"
        >
          Failed to load image
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => window.open(fullUrl, "_blank")}
          className="btn-outline flex-1 cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Open Image
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(fullUrl)}
          className="btn-outline cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Copy URL
        </button>
      </div>
    </div>
  );
}

export default function OGPreviewPage() {
  const [currentBaseUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return `${window.location.protocol}//${window.location.host}`;
    }
    return "http://localhost:3000";
  });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-primary mb-4 text-3xl font-bold">
          🎨 Open Graph Image Preview
        </h1>
        <p className="text-secondary text-lg">
          Preview different versions of Open Graph images used across the site.
          This page is only available in development mode.
        </p>
      </div>

      <div className="bg-tertiary border-primary mb-8 rounded-xl border p-6">
        <h3 className="text-primary mb-3 text-lg font-semibold">
          🎨 Design System
        </h3>
        <ul className="text-secondary space-y-2 text-sm">
          <li>
            <strong>Theme Support:</strong> Add{" "}
            <code className="bg-secondary border-primary rounded border px-2 py-1 text-xs font-medium">
              &theme=light
            </code>{" "}
            or{" "}
            <code className="bg-secondary border-primary rounded border px-2 py-1 text-xs font-medium">
              &theme=dark
            </code>
            to any URL
          </li>
          <li>
            <strong>Color Scheme:</strong> Uses Radix UI grays for consistent
            branding
          </li>
          <li>
            <strong>Typography:</strong> Geist Sans for clean, modern look
          </li>
          <li>
            <strong>Dimensions:</strong> 1200×630px (optimal for social media)
          </li>
        </ul>
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        {OG_PREVIEWS.map((preview) => (
          <PreviewCard
            key={preview.id}
            preview={preview}
            currentBaseUrl={currentBaseUrl}
          />
        ))}
      </div>

      <div className="border-primary text-secondary mt-12 border-t pt-8 text-center">
        <p className="mb-2">
          ✨ Open Graph images are generated dynamically using Next.js API
          routes
        </p>
        <p className="text-xs">
          📁 See{" "}
          <code className="bg-tertiary rounded px-2 py-1">
            src/app/api/og/README.md
          </code>{" "}
          for detailed documentation
        </p>
      </div>
    </div>
  );
}
