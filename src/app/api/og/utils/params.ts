import { DEFAULTS, HEADER_TEXT } from "../constants";
import { OGParams, OGType, OGTheme, ProcessedOGParams } from "../types";
import { isValidImagePath } from "./image";
import { isUnsplashPhotoUrl, resolveUnsplashImage } from "./unsplash";
import { logImageLoadSuccess, logProcessingStep } from "./logger";

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
  // Auto-include avatar for homepage when no image is provided
  let imageToProcess = params.image;
  if (!imageToProcess && params.type === "homepage") {
    imageToProcess = "/avatar.jpeg";
    logProcessingStep("Using default avatar for homepage", imageToProcess);
  }

  logProcessingStep("Processing OG parameters", {
    title: params.title,
    type: params.type,
    hasImage: !!imageToProcess,
  });

  // Process image if provided - convert to absolute URL for Satori compatibility
  let processedImage: string | undefined;
  if (imageToProcess && isValidImagePath(imageToProcess)) {
    logProcessingStep("Processing image", imageToProcess);

    // Handle Unsplash URLs by resolving them through the manifest
    if (isUnsplashPhotoUrl(imageToProcess)) {
      const resolvedImage = resolveUnsplashImage(imageToProcess);
      if (resolvedImage) {
        // Convert to absolute URL for Satori compatibility
        const baseUrl = process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000";
        processedImage = resolvedImage.startsWith("http")
          ? resolvedImage // Already an absolute URL
          : `${baseUrl}${resolvedImage}`; // Convert local path to absolute URL
        logImageLoadSuccess(imageToProcess);
      }
    } else {
      // Handle regular image URLs and local paths
      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";
      processedImage = imageToProcess.startsWith("http")
        ? imageToProcess // Already an absolute URL
        : `${baseUrl}${imageToProcess}`; // Convert local path to absolute URL
      logImageLoadSuccess(imageToProcess);
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
