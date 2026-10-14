export type OGType =
  "homepage" | "note" | "notes" | "page" | "clients" | "brand";

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
  companyLogo?: string;
  experienceLogos?: string[];
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface LayoutDimensions {
  container: ImageDimensions;
  image: ImageDimensions;
}
