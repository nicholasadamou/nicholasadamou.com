import { COLORS, FLEX, SPACING, TYPOGRAPHY } from "../constants";
import { ProcessedOGParams } from "../types";
import { ImageElement } from "./ImageElement";
import { TextElement } from "./TextElement";

/**
 * Main layout component for Open Graph images
 * Handles the overall composition and layout of all OG image elements
 */
export const OGLayout = ({
  title,
  description,
  headerText,
  processedImage,
  type,
  theme = "dark",
}: ProcessedOGParams) => {
  const isHomepage = type === "homepage";
  const isDark = theme === "dark";
  const typography = isDark ? TYPOGRAPHY.dark : TYPOGRAPHY.light;

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        background: isHomepage
          ? isDark
            ? COLORS.gradient.background.homepage
            : COLORS.gradient.background.homepageLight
          : isDark
            ? COLORS.gradient.background.default
            : COLORS.gradient.background.defaultLight,
        position: "relative",
      }}
    >
      {/* Background pattern/texture */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: isDark
            ? COLORS.gradient.pattern
            : COLORS.gradient.patternLight,
          opacity: 0.6,
        }}
      />

      {/* Main content container */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%",
          width: "100%",
          padding: isHomepage
            ? SPACING.containerPadding.homepage
            : SPACING.containerPadding.default,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Text content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            flex: processedImage
              ? FLEX.textFlex.withImage
              : FLEX.textFlex.withoutImage,
            maxWidth: processedImage
              ? FLEX.textMaxWidth.withImage
              : FLEX.textMaxWidth.withoutImage,
            gap: SPACING.contentGap,
          }}
        >
          {/* Header text */}
          {headerText && (
            <TextElement text={headerText} styles={typography.header} />
          )}

          {/* Main title with gradient */}
          <TextElement
            text={title}
            styles={
              isHomepage ? typography.titleHomepage : typography.titleDefault
            }
          />

          {/* Description */}
          {description && (
            <TextElement text={description} styles={typography.description} />
          )}
        </div>

        {/* Image section */}
        {processedImage && (
          <div
            style={{
              flex: FLEX.imageFlex,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ImageElement
              imageSrc={processedImage}
              altText={title}
              theme={theme}
            />
          </div>
        )}
      </div>

      {/* Brand accent for homepage */}
      {isHomepage && (
        <div
          style={{
            position: "absolute",
            bottom: SPACING.brandAccent.bottom,
            left: SPACING.brandAccent.left,
            height: SPACING.brandAccent.height,
            width: SPACING.brandAccent.width,
            background: isDark
              ? COLORS.gradient.accent
              : COLORS.gradient.accentLight,
            borderRadius: SPACING.brandAccent.borderRadius,
            opacity: SPACING.brandAccent.opacity,
          }}
        />
      )}
    </div>
  );
};
