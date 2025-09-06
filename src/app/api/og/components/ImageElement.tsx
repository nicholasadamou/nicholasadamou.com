import { COLORS, DEFAULTS, LAYOUT, SPACING } from "../constants";
import { OGTheme } from "../types";

/**
 * Enhanced image component with modern styling and fallback
 * Handles both successful image rendering and fallback states
 */
export const ImageElement = ({
  imageSrc,
  altText,
  theme = "dark",
}: {
  imageSrc?: string;
  altText?: string;
  theme?: OGTheme;
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "relative",
          width: `${LAYOUT.image.width}px`,
          height: `${LAYOUT.image.height}px`,
          borderRadius: SPACING.imageContainer.borderRadius,
          overflow: "hidden",
          boxShadow: SPACING.imageContainer.boxShadow,
          background:
            theme === "light"
              ? COLORS.gradient.imageBackgroundLight
              : COLORS.gradient.imageBackground,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {imageSrc ? (
          <>
            {/* Gradient overlay for better integration */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  theme === "light"
                    ? COLORS.gradient.overlayLight
                    : COLORS.gradient.overlay,
                zIndex: 1,
              }}
            />
            {/*
             * ESLint exception: <img> is required for Next.js ImageResponse (OG image generation)
             * Next/Image component is not supported in ImageResponse context
             * Images are already optimized via Sharp before reaching this component
             */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={altText}
              width={LAYOUT.image.width}
              height={LAYOUT.image.height}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "relative",
                zIndex: 0,
              }}
            />
          </>
        ) : (
          // Fallback when no image or invalid URL
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              fontSize: DEFAULTS.fallbackIconSize,
              color:
                theme === "light"
                  ? COLORS.text.fallbackLight
                  : COLORS.text.fallback,
              textAlign: "center",
            }}
          >
            {DEFAULTS.fallbackIcon}
          </div>
        )}
      </div>
    </div>
  );
};
