import { LayoutDimensions, OGType, OGTheme, StyleConfig } from "./types";

export const LAYOUT: LayoutDimensions = {
  container: { width: 1200, height: 630 },
  image: { width: 400, height: 400 },
};

export const COLORS = {
  gradient: {
    background: {
      homepage:
        "linear-gradient(135deg, #0c0a09 0%, #1c1917 50%, #0c0a09 100%)",
      homepageLight:
        "linear-gradient(135deg, #fafaf9 0%, #f5f5f4 50%, #fafaf9 100%)",
      default: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)",
      defaultLight:
        "linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 50%, #f5f5f4 100%)",
    },
    pattern:
      "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.03) 0%, transparent 50%)",
    patternLight:
      "radial-gradient(circle at 25% 25%, rgba(0,0,0,0.02) 0%, transparent 50%)",
    imageBackground: "rgba(255,255,255,0.05)",
    imageBackgroundLight: "rgba(0,0,0,0.05)",
    accent: "linear-gradient(90deg, #44403c 0%, #78716c 50%, #44403c 100%)",
    accentLight:
      "linear-gradient(90deg, #d6d3d1 0%, #a8a29e 50%, #d6d3d1 100%)",
  },
  text: {
    primary: "#fafaf9",
    primaryLight: "#0c0a09",
    header: "rgba(250,250,249,0.6)",
    headerLight: "rgba(12,10,9,0.6)",
    description: "rgba(250,250,249,0.8)",
    descriptionLight: "rgba(12,10,9,0.75)",
    fallback: "rgba(250,250,249,0.4)",
    fallbackLight: "rgba(12,10,9,0.35)",
  },
} as const;

export const TYPOGRAPHY: {
  dark: Record<string, StyleConfig>;
  light: Record<string, StyleConfig>;
} = {
  dark: {
    header: {
      fontSize: "20px",
      fontWeight: "500",
      color: COLORS.text.header,
      letterSpacing: "-0.01em",
      marginBottom: "4px",
      textTransform: "uppercase",
    },
    titleHomepage: {
      fontSize: "56px",
      fontWeight: "800",
      color: COLORS.text.primary,
      lineHeight: "1.1",
      letterSpacing: "-0.04em",
      maxWidth: "100%",
    },
    titleDefault: {
      fontSize: "48px",
      fontWeight: "800",
      color: COLORS.text.primary,
      lineHeight: "1.1",
      letterSpacing: "-0.04em",
      maxWidth: "100%",
    },
    description: {
      fontSize: "24px",
      fontWeight: "400",
      color: COLORS.text.description,
      lineHeight: "1.4",
      letterSpacing: "-0.01em",
      maxWidth: "100%",
    },
  },
  light: {
    header: {
      fontSize: "20px",
      fontWeight: "500",
      color: COLORS.text.headerLight,
      letterSpacing: "-0.01em",
      marginBottom: "4px",
      textTransform: "uppercase",
    },
    titleHomepage: {
      fontSize: "56px",
      fontWeight: "800",
      color: COLORS.text.primaryLight,
      lineHeight: "1.1",
      letterSpacing: "-0.04em",
      maxWidth: "100%",
    },
    titleDefault: {
      fontSize: "48px",
      fontWeight: "800",
      color: COLORS.text.primaryLight,
      lineHeight: "1.1",
      letterSpacing: "-0.04em",
      maxWidth: "100%",
    },
    description: {
      fontSize: "24px",
      fontWeight: "400",
      color: COLORS.text.descriptionLight,
      lineHeight: "1.4",
      letterSpacing: "-0.01em",
      maxWidth: "100%",
    },
  },
} as const;

export const HEADER_TEXT: Record<OGType, string> = {
  homepage: "Software Engineer",
  note: "Note",
  notes: "Notes",
} as const;

export const SPACING = {
  containerPadding: {
    homepage: "60px",
    default: "48px",
  },
  contentGap: "20px",
  imageContainer: {
    borderRadius: "20px",
    boxShadow: "0 30px 60px rgba(0, 0, 0, 0.25)",
  },
  brandAccent: {
    height: "3px",
    width: "100px",
    bottom: "32px",
    left: "60px",
    borderRadius: "2px",
    opacity: 0.7,
  },
} as const;

export const FLEX = {
  textFlex: {
    withImage: "0 0 58%",
    withoutImage: "1",
  },
  imageFlex: "0 0 35%",
  textMaxWidth: {
    withImage: "58%",
    withoutImage: "90%",
  },
} as const;

export const DEFAULTS = {
  title: "Nicholas Adamou",
  type: "note" as OGType,
  theme: "dark" as OGTheme,
} as const;
