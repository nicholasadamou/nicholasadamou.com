"use client";

import { useEffect } from "react";

interface DynamicOGMetaTagsProps {
  lightOGImage: string;
  darkOGImage: string;
}

/**
 * Client-side component that dynamically updates OpenGraph meta tags
 * based on the user's preferred color scheme.
 *
 * This component:
 * - Listens for changes in the user's color scheme preference
 * - Updates the og:image meta tag to match their preference
 * - Ensures the correct theme image is used when sharing the page
 */
export function DynamicOGMetaTags({
  lightOGImage,
  darkOGImage,
}: DynamicOGMetaTagsProps) {
  useEffect(() => {
    const updateOGImage = () => {
      // Get the user's preferred color scheme
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const currentTheme = document.documentElement.classList.contains("dark")
        ? "dark"
        : document.documentElement.classList.contains("light")
          ? "light"
          : prefersDark
            ? "dark"
            : "light";

      // Select the appropriate OG image based on theme
      const ogImageUrl = currentTheme === "dark" ? darkOGImage : lightOGImage;

      // Update or create the og:image meta tag
      let ogImageTag = document.querySelector(
        'meta[property="og:image"]'
      ) as HTMLMetaElement;

      if (ogImageTag) {
        ogImageTag.content = ogImageUrl;
      } else {
        // Create the meta tag if it doesn't exist
        ogImageTag = document.createElement("meta");
        ogImageTag.setAttribute("property", "og:image");
        ogImageTag.content = ogImageUrl;
        document.head.appendChild(ogImageTag);
      }

      // Also update Twitter card image for better compatibility
      let twitterImageTag = document.querySelector(
        'meta[name="twitter:image"]'
      ) as HTMLMetaElement;

      if (twitterImageTag) {
        twitterImageTag.content = ogImageUrl;
      } else {
        twitterImageTag = document.createElement("meta");
        twitterImageTag.setAttribute("name", "twitter:image");
        twitterImageTag.content = ogImageUrl;
        document.head.appendChild(twitterImageTag);
      }

      console.log(`Updated OG image for ${currentTheme} theme:`, ogImageUrl);
    };

    // Update on mount
    updateOGImage();

    // Listen for system color scheme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleColorSchemeChange = () => updateOGImage();

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleColorSchemeChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleColorSchemeChange);
    }

    // Listen for manual theme changes (if using a theme switcher)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class" &&
          mutation.target === document.documentElement
        ) {
          updateOGImage();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleColorSchemeChange);
      } else {
        mediaQuery.removeListener(handleColorSchemeChange);
      }
      observer.disconnect();
    };
  }, [lightOGImage, darkOGImage]);

  // This component doesn't render anything visible
  return null;
}
