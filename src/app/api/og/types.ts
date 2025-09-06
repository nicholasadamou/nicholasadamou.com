export type OGType =
  | "homepage"
  | "project"
  | "note"
  | "projects"
  | "notes"
  | "contact"
  | "gallery";

export type OGTheme = "dark" | "light";

export interface OGParams {
  title: string;
  description?: string;
  type: OGType;
  image?: string;
  theme?: OGTheme;
}

export interface ProcessedOGParams extends OGParams {
  headerText: string;
  processedImage?: string;
}

export interface StyleConfig {
  fontSize: string;
  fontWeight: string;
  color: string;
  letterSpacing?: string;
  lineHeight?: string;
  textTransform?:
    | "none"
    | "capitalize"
    | "uppercase"
    | "lowercase"
    | "initial"
    | "inherit"
    | "unset";
  marginBottom?: string;
  background?: string;
  backgroundClip?: string;
  WebkitBackgroundClip?: string;
  maxWidth?: string;
  textShadow?: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface LayoutDimensions {
  container: ImageDimensions;
  image: ImageDimensions;
}
