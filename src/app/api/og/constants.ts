import { LayoutDimensions, OGType, OGTheme } from "./types";

export const LAYOUT: LayoutDimensions = {
  container: { width: 1200, height: 630 },
  image: { width: 400, height: 400 },
};

export const HEADER_TEXT: Record<OGType, string> = {
  homepage: "Senior outcome engineer",
  page: "Nicholas Adamou",
  clients: "Selected client work",
  brand: "Brand resources",
  note: "Note",
  notes: "Notes",
} as const;

export const DEFAULTS = {
  title: "Nicholas Adamou",
  type: "note" as OGType,
  theme: "dark" as OGTheme,
} as const;
