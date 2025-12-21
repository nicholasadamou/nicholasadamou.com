/**
 * Logging utilities for Open Graph route
 * Provides consistent logging and error handling across the OG generation process
 */
import { logger } from "@/lib/logger";

/**
 * Logs OG route request parameters for debugging
 * @param searchParams - URLSearchParams from the request
 */
export const logOGRequest = (searchParams: URLSearchParams): void => {
  const params = Object.fromEntries(searchParams.entries());
  logger.debug("OG Route - Request params:", params);
};

/**
 * Logs successful image loading
 * @param imagePath - Path of the successfully loaded image
 */
export const logImageLoadSuccess = (imagePath: string): void => {
  logger.debug(`OG Route - Image loaded successfully: ${imagePath}`);
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
  logger.warn(`OG Route - Failed to load image: ${imagePath}`);
  if (error) {
    logger.error("Error details:", error);
  }
};

/**
 * Logs parameter processing information
 * @param step - Processing step description
 * @param details - Additional details about the step
 */
export const logProcessingStep = (step: string, details?: unknown): void => {
  logger.debug(`OG Route - ${step}`, details || "");
};

/**
 * Logs errors with consistent formatting
 * @param context - Context where the error occurred
 * @param error - The error that occurred
 */
export const logError = (context: string, error: unknown): void => {
  logger.error(`OG Route Error - ${context}:`, error);
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
  logger.debug("OG Route - Image generated successfully:", {
    title: params.title,
    type: params.type,
    hasImage: params.hasImage,
  });
};
