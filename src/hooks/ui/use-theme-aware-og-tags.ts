import { useMemo } from "react";
import {
  generateHomepageOGVariants,
  generateProjectOGVariants,
  generateNoteOGVariants,
  generateOGVariants,
  type OGImageVariants,
} from "@/lib/utils/theme/detection";
import { getBaseUrl } from "@/lib/utils/api/get-base-url";

type OGType = "homepage" | "project" | "note" | "custom";

interface UseThemeAwareOGTagsProps {
  type: OGType;
  title: string;
  description?: string;
  image?: string;
  customParams?: {
    title?: string;
    description?: string;
    type?: string;
    image?: string;
  };
}

interface ThemeAwareOGTags extends OGImageVariants {
  baseUrl: string;
  fullLightUrl: string;
  fullDarkUrl: string;
}

/**
 * Custom hook that generates theme-aware OpenGraph image URLs
 * for easy integration with the DynamicOGMetaTags component
 *
 * @param props Configuration object for generating OG images
 * @returns Object containing both theme variants and full URLs
 */
export function useThemeAwareOGTags({
  type,
  title,
  description,
  image,
  customParams,
}: UseThemeAwareOGTagsProps): ThemeAwareOGTags {
  return useMemo(() => {
    const baseUrl = getBaseUrl();

    let variants: OGImageVariants;

    switch (type) {
      case "homepage":
        variants = generateHomepageOGVariants(title);
        break;
      case "project":
        variants = generateProjectOGVariants(title, description, image);
        break;
      case "note":
        variants = generateNoteOGVariants(title, description, image);
        break;
      case "custom":
        variants = generateOGVariants(
          customParams || {
            title,
            description,
            image,
          }
        );
        break;
      default:
        variants = generateNoteOGVariants(title, description, image);
    }

    return {
      ...variants,
      baseUrl,
      fullLightUrl: `${baseUrl}${variants.light}`,
      fullDarkUrl: `${baseUrl}${variants.dark}`,
    };
  }, [type, title, description, image, customParams]);
}

/**
 * Convenience hook specifically for homepage OG tags
 */
export function useHomepageOGTags(title: string): ThemeAwareOGTags {
  return useThemeAwareOGTags({ type: "homepage", title });
}

/**
 * Convenience hook specifically for project OG tags
 */
export function useProjectOGTags(
  title: string,
  description?: string,
  image?: string
): ThemeAwareOGTags {
  return useThemeAwareOGTags({ type: "project", title, description, image });
}

/**
 * Convenience hook specifically for note/blog post OG tags
 */
export function useNoteOGTags(
  title: string,
  description?: string,
  image?: string
): ThemeAwareOGTags {
  return useThemeAwareOGTags({ type: "note", title, description, image });
}
