import { COLORS, LAYOUT, SPACING } from "../constants";
import { OGTheme } from "../types";

export const ImageElement = ({
  imageSrc,
  altText,
  theme = "dark",
}: {
  imageSrc?: string;
  altText?: string;
  theme?: OGTheme;
}) => {
  const isDark = theme === "dark";

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
          background: isDark
            ? COLORS.gradient.imageBackground
            : COLORS.gradient.imageBackgroundLight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {imageSrc ? (
          /* eslint-disable-next-line @next/next/no-img-element */
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
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              fontSize: "48px",
              color: isDark ? COLORS.text.fallback : COLORS.text.fallbackLight,
            }}
          >
            📸
          </div>
        )}
      </div>
    </div>
  );
};
