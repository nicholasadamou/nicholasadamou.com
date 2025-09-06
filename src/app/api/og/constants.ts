import { LayoutDimensions, OGType, OGTheme, StyleConfig } from "./types";

// Layout dimensions
export const LAYOUT: LayoutDimensions = {
  container: { width: 1920, height: 1080 },
  image: { width: 480, height: 640 },
};

// Color constants - Aligned with site's black/white/grey aesthetic
export const COLORS = {
  gradient: {
    // Sophisticated monochromatic gradients
    primary:
      "linear-gradient(135deg, #000000 0%, #1a1a1a 25%, #000000 50%, #2a2a2a 75%, #000000 100%)",
    primaryLight:
      "linear-gradient(135deg, #ffffff 0%, #f8f9fa 25%, #ffffff 50%, #f1f3f4 75%, #ffffff 100%)",
    background: {
      homepage:
        "linear-gradient(135deg, #000000 0%, #111111 25%, #1a1a1a 50%, #111111 75%, #000000 100%)",
      homepageLight:
        "linear-gradient(135deg, #ffffff 0%, #fafafa 25%, #f5f5f5 50%, #fafafa 75%, #ffffff 100%)",
      default:
        "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 25%, #1f1f1f 50%, #2a2a2a 75%, #1a1a1a 100%)",
      defaultLight:
        "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 25%, #f1f3f4 50%, #e9ecef 75%, #f8f9fa 100%)",
    },
    overlay:
      "linear-gradient(135deg, rgba(0, 0, 0, 0.03) 0%, rgba(255, 255, 255, 0.02) 100%)",
    overlayLight:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(0, 0, 0, 0.05) 100%)",
    imageBackground:
      "linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
    imageBackgroundLight:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(0, 0, 0, 0.1) 100%)",
    pattern: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.03) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(0, 0, 0, 0.05) 0%, transparent 50%)`,
    patternLight: `radial-gradient(circle at 25% 25%, rgba(0, 0, 0, 0.02) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.8) 0%, transparent 50%)`,
    accent: "linear-gradient(90deg, #333333 0%, #000000 50%, #333333 100%)",
    accentLight:
      "linear-gradient(90deg, #cccccc 0%, #ffffff 50%, #cccccc 100%)",
  },
  text: {
    primary: "#ffffff",
    primaryLight: "#000000",
    header: "rgba(255, 255, 255, 0.7)",
    headerLight: "rgba(0, 0, 0, 0.7)",
    description: "rgba(255, 255, 255, 0.85)",
    descriptionLight: "rgba(0, 0, 0, 0.8)",
    fallback: "rgba(255, 255, 255, 0.5)",
    fallbackLight: "rgba(0, 0, 0, 0.4)",
  },
  // Radix UI Gray scale colors for consistency
  radix: {
    gray1: "#fcfcfc", // Light mode background
    gray2: "#f9f9f9",
    gray3: "#f0f0f0",
    gray9: "#8b8b8b",
    gray11: "#6b6b6b", // Secondary text
    gray12: "#1a1a1a", // Primary text
  },
} as const;

// Typography styles - Updated for monochromatic theme
export const TYPOGRAPHY: {
  dark: Record<string, StyleConfig>;
  light: Record<string, StyleConfig>;
} = {
  // Dark mode typography
  dark: {
    header: {
      fontSize: "24px",
      fontWeight: "500",
      color: COLORS.text.header,
      letterSpacing: "-0.02em",
      marginBottom: "8px",
      textTransform: "uppercase",
    },
    titleHomepage: {
      fontSize: "72px",
      fontWeight: "800",
      color: COLORS.text.primary,
      lineHeight: "1.1",
      letterSpacing: "-0.04em",
      maxWidth: "100%",
      textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
    },
    titleDefault: {
      fontSize: "64px",
      fontWeight: "800",
      color: COLORS.text.primary,
      lineHeight: "1.1",
      letterSpacing: "-0.04em",
      maxWidth: "100%",
      textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
    },
    description: {
      fontSize: "36px",
      fontWeight: "400",
      color: COLORS.text.description,
      lineHeight: "1.4",
      letterSpacing: "-0.01em",
      maxWidth: "100%",
    },
  },
  // Light mode typography
  light: {
    header: {
      fontSize: "24px",
      fontWeight: "500",
      color: COLORS.text.headerLight,
      letterSpacing: "-0.02em",
      marginBottom: "8px",
      textTransform: "uppercase",
    },
    titleHomepage: {
      fontSize: "72px",
      fontWeight: "800",
      color: COLORS.text.primaryLight,
      lineHeight: "1.1",
      letterSpacing: "-0.04em",
      maxWidth: "100%",
      textShadow: "0 2px 8px rgba(255, 255, 255, 0.5)",
    },
    titleDefault: {
      fontSize: "64px",
      fontWeight: "800",
      color: COLORS.text.primaryLight,
      lineHeight: "1.1",
      letterSpacing: "-0.04em",
      maxWidth: "100%",
      textShadow: "0 2px 8px rgba(255, 255, 255, 0.5)",
    },
    description: {
      fontSize: "36px",
      fontWeight: "400",
      color: COLORS.text.descriptionLight,
      lineHeight: "1.4",
      letterSpacing: "-0.01em",
      maxWidth: "100%",
    },
  },
} as const;

// Header text mapping
export const HEADER_TEXT: Record<OGType, string> = {
  note: "Latest Note",
  project: "Featured Project",
  notes: "Development Notes",
  projects: "Project Portfolio",
  contact: "Get In Touch",
  homepage: "Full-Stack Developer",
  gallery: "Photo Gallery",
} as const;

// Spacing and layout
export const SPACING = {
  containerPadding: {
    homepage: "80px",
    default: "60px",
  },
  contentGap: "24px",
  imageContainer: {
    borderRadius: "24px",
    boxShadow: "0 40px 80px rgba(0, 0, 0, 0.2)",
  },
  brandAccent: {
    height: "4px",
    width: "120px",
    bottom: "40px",
    left: "80px",
    borderRadius: "2px",
    opacity: 0.8,
  },
} as const;

// Content distribution
export const FLEX = {
  textFlex: {
    withImage: "0 0 60%",
    withoutImage: "1",
  },
  imageFlex: "0 0 35%",
  textMaxWidth: {
    withImage: "60%",
    withoutImage: "90%",
  },
} as const;

// Default values
export const DEFAULTS = {
  title: "Nicholas Adamou",
  type: "note" as OGType,
  theme: "dark" as OGTheme,
  fallbackIcon: "📸",
  fallbackIconSize: "48px",
} as const;
