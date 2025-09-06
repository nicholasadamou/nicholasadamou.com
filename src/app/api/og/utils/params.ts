import { DEFAULTS, HEADER_TEXT } from "../constants";
import { OGParams, OGType, OGTheme, ProcessedOGParams } from "../types";
import { loadImageAsBase64, isValidImagePath } from "./image";
import {
  logImageLoadFailure,
  logImageLoadSuccess,
  logProcessingStep,
} from "./logger";

/**
 * Cleans and normalizes URL search parameters
 * Removes 'amp;' prefixes that sometimes appear in URLs
 * @param searchParams - URLSearchParams from the request
 */
export const cleanSearchParams = (searchParams: URLSearchParams): void => {
  const keysToClean = Array.from(searchParams.keys()).filter((key) =>
    key.startsWith("amp;")
  );

  keysToClean.forEach((key) => {
    const value = searchParams.get(key);
    if (value !== null) {
      searchParams.delete(key);
      searchParams.set(key.slice(4), value); // Remove 'amp;' prefix
    }
  });
};

/**
 * Extracts and validates OG parameters from URL search parameters
 * @param searchParams - URLSearchParams from the request
 * @returns Validated OGParams object
 */
export const extractOGParams = (searchParams: URLSearchParams): OGParams => {
  const title = searchParams.get("title") ?? DEFAULTS.title;
  const description = searchParams.get("description") ?? "";
  const type = (searchParams.get("type") ?? DEFAULTS.type) as OGType;
  const theme = (searchParams.get("theme") ?? DEFAULTS.theme) as OGTheme;
  const image = searchParams.get("image") ?? "";

  return {
    title,
    description: description || undefined,
    type: isValidOGType(type) ? type : DEFAULTS.type,
    theme: isValidOGTheme(theme) ? theme : DEFAULTS.theme,
    image: image || undefined,
  };
};

/**
 * Processes OG parameters, including image loading and header text generation
 * @param params - Base OG parameters
 * @returns Processed parameters ready for rendering
 */
export const processOGParams = async (
  params: OGParams
): Promise<ProcessedOGParams> => {
  logProcessingStep("Processing OG parameters", {
    title: params.title,
    type: params.type,
    hasImage: !!params.image,
  });

  // Process image if provided
  let processedImage: string | undefined;
  if (params.image && isValidImagePath(params.image)) {
    logProcessingStep("Loading image", params.image);

    const base64Image = await loadImageAsBase64(params.image);
    if (base64Image) {
      processedImage = base64Image;
      logImageLoadSuccess(params.image);
    } else {
      logImageLoadFailure(params.image);
    }
  }

  // Generate header text based on type
  const headerText = HEADER_TEXT[params.type];

  return {
    ...params,
    headerText,
    processedImage,
  };
};

/**
 * Validates if a string is a valid OG type
 * @param type - Type string to validate
 * @returns True if valid OG type
 */
const isValidOGType = (type: string): type is OGType => {
  const validTypes: OGType[] = [
    "homepage",
    "project",
    "note",
    "projects",
    "notes",
    "contact",
    "gallery",
  ];
  return validTypes.includes(type as OGType);
};

/**
 * Validates if a string is a valid OG theme
 * @param theme - Theme string to validate
 * @returns True if valid OG theme
 */
const isValidOGTheme = (theme: string): theme is OGTheme => {
  const validThemes: OGTheme[] = ["dark", "light"];
  return validThemes.includes(theme as OGTheme);
};
