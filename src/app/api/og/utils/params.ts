import { DEFAULTS, HEADER_TEXT } from "../constants";
import { OGParams, OGType, OGTheme, ProcessedOGParams } from "../types";
import { isValidImagePath, fetchImageAsBase64 } from "./image";
import { isUnsplashPhotoUrl, resolveUnsplashImage } from "./unsplash";
import { logImageLoadSuccess, logProcessingStep } from "./logger";
import { AVATAR_BASE64 } from "../avatar-data";

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
 * @param baseUrl - Base URL for constructing absolute URLs (optional, will be determined from environment)
 * @returns Processed parameters ready for rendering
 */
export const processOGParams = async (
  params: OGParams,
  baseUrl?: string
): Promise<ProcessedOGParams> => {
  // Auto-include avatar for homepage when no image is provided
  let imageToProcess = params.image;
  let useEmbeddedAvatar = false;
  if (!imageToProcess && params.type === "homepage") {
    useEmbeddedAvatar = true;
    logProcessingStep(
      "Using embedded base64 avatar for homepage",
      "avatar-data"
    );
  }

  logProcessingStep("Processing OG parameters", {
    title: params.title,
    type: params.type,
    hasImage: !!imageToProcess,
  });

  // Determine the base URL for absolute URLs
  const resolvedBaseUrl =
    baseUrl ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  logProcessingStep("Using base URL", resolvedBaseUrl);

  // Process image if provided - convert to base64 to prevent Satori timeouts
  let processedImage: string | undefined;

  // Use embedded avatar if homepage with no custom image
  if (useEmbeddedAvatar) {
    processedImage = AVATAR_BASE64;
    logImageLoadSuccess("embedded avatar");
  } else if (imageToProcess && isValidImagePath(imageToProcess)) {
    logProcessingStep("Processing image", imageToProcess);

    // Handle Unsplash URLs by resolving them through the manifest
    if (isUnsplashPhotoUrl(imageToProcess)) {
      const resolvedImage = resolveUnsplashImage(imageToProcess);
      if (resolvedImage) {
        // Convert to absolute URL
        const absoluteUrl = resolvedImage.startsWith("http")
          ? resolvedImage
          : `${resolvedBaseUrl}${resolvedImage}`;

        // Convert to base64 to prevent Satori fetch timeouts
        const base64Image = await fetchImageAsBase64(
          absoluteUrl,
          !resolvedImage.startsWith("http")
        );

        if (base64Image) {
          processedImage = base64Image;
          logImageLoadSuccess(imageToProcess);
        }
        if (processedImage) {
          logImageLoadSuccess(imageToProcess);
        }
      }
    } else {
      // Handle regular image URLs and local paths
      const absoluteUrl = imageToProcess.startsWith("http")
        ? imageToProcess
        : `${resolvedBaseUrl}${imageToProcess}`;

      logProcessingStep("Final processed image URL", absoluteUrl);

      // Convert to base64 to prevent Satori fetch timeouts
      const base64Image = await fetchImageAsBase64(
        absoluteUrl,
        !imageToProcess.startsWith("http")
      );

      if (base64Image) {
        processedImage = base64Image;
        logImageLoadSuccess(imageToProcess);
      }
      if (processedImage) {
        logImageLoadSuccess(imageToProcess);
      }
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
