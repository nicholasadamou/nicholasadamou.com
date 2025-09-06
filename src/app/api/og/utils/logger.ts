/**
 * Logging utilities for Open Graph route
 * Provides consistent logging and error handling across the OG generation process
 */

/**
 * Logs OG route request parameters for debugging
 * @param searchParams - URLSearchParams from the request
 */
export const logOGRequest = (searchParams: URLSearchParams): void => {
  const params = Object.fromEntries(searchParams.entries());
  console.log("OG Route - Request params:", params);
};

/**
 * Logs successful image loading
 * @param imagePath - Path of the successfully loaded image
 */
export const logImageLoadSuccess = (imagePath: string): void => {
  console.log(`OG Route - Image loaded successfully: ${imagePath}`);
};

/**
 * Logs failed image loading
 * @param imagePath - Path of the image that failed to load
 * @param error - Optional error details
 */
export const logImageLoadFailure = (
  imagePath: string,
  error?: unknown
): void => {
  console.log(`OG Route - Failed to load image: ${imagePath}`);
  if (error) {
    console.error("Error details:", error);
  }
};

/**
 * Logs parameter processing information
 * @param step - Processing step description
 * @param details - Additional details about the step
 */
export const logProcessingStep = (step: string, details?: unknown): void => {
  console.log(`OG Route - ${step}`, details || "");
};

/**
 * Logs errors with consistent formatting
 * @param context - Context where the error occurred
 * @param error - The error that occurred
 */
export const logError = (context: string, error: unknown): void => {
  console.error(`OG Route Error - ${context}:`, error);
};

/**
 * Logs successful OG image generation
 * @param params - The processed parameters used for generation
 */
export const logGenerationSuccess = (params: {
  title: string;
  type: string;
  hasImage: boolean;
}): void => {
  console.log("OG Route - Image generated successfully:", {
    title: params.title,
    type: params.type,
    hasImage: params.hasImage,
  });
};
