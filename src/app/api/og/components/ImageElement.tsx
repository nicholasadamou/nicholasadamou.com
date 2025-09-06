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
          <div
            style={{
              position: "relative",
              width: `${LAYOUT.image.width}px`,
              height: `${LAYOUT.image.height}px`,
              borderRadius: "16px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={altText || ""}
              width={LAYOUT.image.width}
              height={LAYOUT.image.height}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "16px",
                zIndex: 0,
              }}
            />
          </div>
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
