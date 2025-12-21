import type { OGTheme } from "@/app/api/og/types";

/**
 * Since theme detection requires dynamic APIs that aren't available during static generation,
 * we'll use a simpler approach that defaults to a specific theme for OG images.
 *
 * For better social media compatibility, we default to dark theme as it's more visually
 * appealing on most social platforms, but this can be overridden per-route if needed.
 */
export function getDefaultTheme(): OGTheme {
  // Default to dark theme for better social media appearance
  // This can be changed to "light" if you prefer light theme as default
  return "dark";
}

/**
 * Interface for OG image variants
 */
export interface OGImageVariants {
  light: string;
  dark: string;
}

/**
 * Generates a theme-aware OG image URL
 * @param baseParams - Base OG image parameters
 * @param forceTheme - Optional theme to force (overrides default)
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
  const theme = forceTheme || getDefaultTheme();

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

/**
 * Generates both light and dark theme variants for homepage OG images
 */
export function generateHomepageOGVariants(title: string): OGImageVariants {
  return {
    light: generateHomepageOGUrl(title, "light"),
    dark: generateHomepageOGUrl(title, "dark"),
  };
}

/**
 * Generates both light and dark theme variants for project OG images
 */
export function generateProjectOGVariants(
  title: string,
  description?: string,
  image?: string
): OGImageVariants {
  return {
    light: generateProjectOGUrl(title, description, image, "light"),
    dark: generateProjectOGUrl(title, description, image, "dark"),
  };
}

/**
 * Generates both light and dark theme variants for note/blog post OG images
 */
export function generateNoteOGVariants(
  title: string,
  description?: string,
  image?: string
): OGImageVariants {
  return {
    light: generateNoteOGUrl(title, description, image, "light"),
    dark: generateNoteOGUrl(title, description, image, "dark"),
  };
}

/**
 * Generates both theme variants for any OG image type
 */
export function generateOGVariants(baseParams: {
  title?: string;
  description?: string;
  type?: string;
  image?: string;
}): OGImageVariants {
  return {
    light: generateThemeAwareOGUrl(baseParams, "light"),
    dark: generateThemeAwareOGUrl(baseParams, "dark"),
  };
}

/**
 * Generates a single dark theme OG image URL (preferred for social media)
 * This avoids the duplicate image issue on social media platforms
 */
export function generateSingleOGUrl(baseParams: {
  title?: string;
  description?: string;
  type?: string;
  image?: string;
}): string {
  return generateThemeAwareOGUrl(baseParams, "dark");
}

/**
 * Generates a single dark theme project OG image URL
 */
export function generateSingleProjectOGUrl(
  title: string,
  description?: string,
  image?: string
): string {
  return generateProjectOGUrl(title, description, image, "dark");
}

/**
 * Generates a single dark theme note OG image URL
 */
export function generateSingleNoteOGUrl(
  title: string,
  description?: string,
  image?: string
): string {
  return generateNoteOGUrl(title, description, image, "dark");
}
