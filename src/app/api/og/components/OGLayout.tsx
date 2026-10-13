/* eslint-disable @next/next/no-img-element -- ImageResponse renders embedded image data, not a browser page. */
import { COLORS, FLEX, SPACING, TYPOGRAPHY } from "../constants";
import { ProcessedOGParams } from "../types";
import { ImageElement } from "./ImageElement";
import { TextElement } from "./TextElement";

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

  if (isHomepage) {
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#101916",
          color: "#f6f4eb",
          padding: 64,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#b9c6b5",
          }}
        >
          <span>SENIOR OUTCOME ENGINEER & BUILDER</span>
          <span>nicholasadamou.com</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 48,
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", maxWidth: 750 }}
          >
            <span
              style={{
                fontSize: 88,
                fontWeight: 700,
                letterSpacing: -5,
                lineHeight: 1.05,
              }}
            >
              Nicholas Adamou
            </span>
            <span
              style={{
                marginTop: 28,
                fontSize: 30,
                lineHeight: 1.4,
                color: "#b9c6b5",
              }}
            >
              Thoughtful software. Purposeful websites.
            </span>
          </div>
          {processedImage && (
            <img
              src={processedImage}
              alt="Nicholas Adamou"
              width={200}
              height={200}
              style={{
                borderRadius: 100,
                objectFit: "cover",
                border: "4px solid #b9c6b5",
              }}
            />
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 20,
            color: "#b9c6b5",
            borderTop: "1px solid #425146",
            paddingTop: 24,
          }}
        >
          <span>Engineering</span>
          <span>·</span>
          <span>Client work</span>
          <span>·</span>
          <span>Notes & ideas</span>
        </div>
      </div>
    );
  }

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
      {/* Background pattern */}
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

      {/* Main content */}
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
          {headerText && (
            <TextElement text={headerText} styles={typography.header} />
          )}
          <TextElement
            text={title}
            styles={
              isHomepage ? typography.titleHomepage : typography.titleDefault
            }
          />
          {description && (
            <TextElement text={description} styles={typography.description} />
          )}
        </div>

        {/* Image */}
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
