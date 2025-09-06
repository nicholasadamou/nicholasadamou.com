import { headers, cookies } from "next/headers";
import type { OGTheme } from "@/app/api/og/types";

/**
 * Detects the user's theme preference for server-side rendering
 * Uses multiple sources in order of preference:
 * 1. Theme cookie (set by next-themes)
 * 2. Prefers-color-scheme header
 * 3. User-Agent hints for system theme
 * 4. Fallback to dark theme
 */
export function detectThemePreference(): OGTheme {
  try {
    // First, check for theme cookie (next-themes default)
    const cookieStore = cookies();
    const themeCookie = cookieStore.get("theme")?.value;

    if (themeCookie === "light" || themeCookie === "dark") {
      return themeCookie;
    }

    // If theme is "system" or not set, try to detect from headers
    const headersList = headers();

    // Check for Sec-CH-Prefers-Color-Scheme header (Chrome 93+)
    const prefersColorScheme = headersList.get("sec-ch-prefers-color-scheme");
    if (prefersColorScheme === "light" || prefersColorScheme === "dark") {
      return prefersColorScheme;
    }

    // Check User-Agent for potential system hints
    const userAgent = headersList.get("user-agent");
    if (userAgent) {
      // Some mobile browsers include theme hints in User-Agent
      if (userAgent.includes("light")) return "light";
      if (userAgent.includes("dark")) return "dark";
    }

    // Check Accept header for potential theme preferences
    const accept = headersList.get("accept");
    if (accept?.includes("theme=light")) return "light";
    if (accept?.includes("theme=dark")) return "dark";

    // Default fallback - you can change this to "light" if preferred
    return "dark";
  } catch (error) {
    console.warn("Failed to detect theme preference:", error);
    return "dark";
  }
}

/**
 * Generates a theme-aware OG image URL
 * @param baseParams - Base OG image parameters
 * @param forceTheme - Optional theme to force (overrides detection)
 * @returns Complete OG image URL with theme parameter
 */
export function generateThemeAwareOGUrl(
  baseParams: {
    title?: string;
    description?: string;
    type?: string;
    image?: string;
  },
  forceTheme?: OGTheme
): string {
  const theme = forceTheme || detectThemePreference();

  const params = new URLSearchParams({
    ...baseParams,
    theme,
  });

  return `/api/og?${params.toString()}`;
}

/**
 * Helper specifically for homepage OG image generation
 */
export function generateHomepageOGUrl(
  title: string,
  forceTheme?: OGTheme
): string {
  return generateThemeAwareOGUrl(
    {
      title,
      type: "homepage",
    },
    forceTheme
  );
}

/**
 * Helper for project OG image generation
 */
export function generateProjectOGUrl(
  title: string,
  description?: string,
  image?: string,
  forceTheme?: OGTheme
): string {
  return generateThemeAwareOGUrl(
    {
      title,
      description,
      type: "project",
      image,
    },
    forceTheme
  );
}

/**
 * Helper for note/blog post OG image generation
 */
export function generateNoteOGUrl(
  title: string,
  description?: string,
  image?: string,
  forceTheme?: OGTheme
): string {
  return generateThemeAwareOGUrl(
    {
      title,
      description,
      type: "note",
      image,
    },
    forceTheme
  );
}
