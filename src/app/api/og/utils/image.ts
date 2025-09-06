/**
 * Image utilities for Open Graph route
 * Handles loading, processing, and conversion of images for Next.js ImageResponse
 */

/**
 * Loads an image and converts it to base64 data URL for better compatibility with ImageResponse
 * @param imagePath - Path to image (local or external URL)
 * @returns Base64 data URL or null if loading fails
 */
export const loadImageAsBase64 = async (
  imagePath: string
): Promise<string | null> => {
  try {
    if (imagePath.startsWith("http")) {
      return await loadExternalImageAsBase64(imagePath);
    } else {
      return await loadLocalImageAsBase64(imagePath);
    }
  } catch (error) {
    console.error("Error loading image:", error);
    return null;
  }
};

/**
 * Loads an external image and converts it to base64
 * @param imageUrl - External image URL
 * @returns Base64 data URL or null if loading fails
 */
const loadExternalImageAsBase64 = async (
  imageUrl: string
): Promise<string | null> => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error(
        `Failed to fetch external image: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Check file size and optimize if needed
    const maxSize = 200 * 1024; // 200KB
    if (buffer.length > maxSize) {
      console.log(
        `OG Route - External image ${imageUrl} is large (${buffer.length} bytes), optimizing...`
      );
      const optimizedBuffer = await optimizeImageBuffer(buffer, contentType);
      if (optimizedBuffer) {
        // Since we optimize to JPEG, use jpeg content type
        return `data:image/jpeg;base64,${optimizedBuffer.toString("base64")}`;
      }
    }

    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch (error) {
    console.error("Error loading external image:", error);
    return null;
  }
};

/**
 * Loads a local image from the public directory and converts it to base64
 * @param imagePath - Path to local image (relative to public directory)
 * @returns Base64 data URL or null if loading fails
 */
const loadLocalImageAsBase64 = async (
  imagePath: string
): Promise<string | null> => {
  try {
    const fs = await import("fs/promises");
    const path = await import("path");

    // Construct full path to image in public directory
    const fullImagePath = path.join(
      process.cwd(),
      "public",
      imagePath.startsWith("/") ? imagePath.slice(1) : imagePath
    );

    const buffer = await fs.readFile(fullImagePath);
    const extension = path.extname(imagePath).toLowerCase();
    const contentType = getContentTypeFromExtension(extension);

    // Check file size and optimize if needed (limit to 200KB for better performance)
    const maxSize = 200 * 1024; // 200KB
    if (buffer.length > maxSize) {
      console.log(
        `OG Route - Image ${imagePath} is large (${buffer.length} bytes), optimizing...`
      );
      const optimizedBuffer = await optimizeImageBuffer(buffer, contentType);
      if (optimizedBuffer) {
        // Since we optimize to JPEG, use jpeg content type
        return `data:image/jpeg;base64,${optimizedBuffer.toString("base64")}`;
      }
    }

    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch (error) {
    console.error("Error reading local image file:", error);
    return null;
  }
};

/**
 * Optimizes image buffer by reducing quality/size for better OG performance
 * @param buffer - Original image buffer
 * @param contentType - MIME type of the image
 * @returns Optimized buffer or null if optimization fails
 */
const optimizeImageBuffer = async (
  buffer: Buffer,
  contentType: string
): Promise<Buffer | null> => {
  try {
    // Use Sharp for proper image optimization
    const sharp = (await import("sharp")).default;

    console.log(`Optimizing ${contentType} image with Sharp...`);

    // Resize image to reasonable dimensions for OG images
    // OG layout uses 480x640 for images, so let's optimize around that
    const optimizedBuffer = await sharp(buffer)
      .resize({
        width: 480,
        height: 640,
        fit: "cover",
        position: "center",
      })
      .jpeg({
        quality: 80, // Good quality but smaller file size
        progressive: true,
        mozjpeg: true, // Use mozjpeg encoder if available for better compression
      })
      .toBuffer();

    console.log(
      `Image optimized: ${buffer.length} bytes -> ${optimizedBuffer.length} bytes`
    );

    return optimizedBuffer;
  } catch (error) {
    console.error("Error optimizing image with Sharp:", error);

    // Fallback: if optimization fails, try simple size check
    const targetSize = 300 * 1024; // 300KB target
    if (buffer.length > targetSize) {
      console.log(
        "Image too large and optimization failed, falling back to no image"
      );
      return null;
    }

    return buffer;
  }
};

/**
 * Gets the appropriate MIME type based on file extension
 * @param extension - File extension (including the dot)
 * @returns MIME type string
 */
const getContentTypeFromExtension = (extension: string): string => {
  switch (extension.toLowerCase()) {
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".svg":
      return "image/svg+xml";
    case ".jpg":
    case ".jpeg":
    default:
      return "image/jpeg";
  }
};

/**
 * Validates if a string is a valid image path or URL
 * @param imagePath - Image path or URL to validate
 * @returns True if valid, false otherwise
 */
export const isValidImagePath = (imagePath?: string): boolean => {
  if (!imagePath || imagePath.trim() === "") return false;

  // Check for valid URL
  if (imagePath.startsWith("http")) {
    try {
      new URL(imagePath);
      return true;
    } catch {
      return false;
    }
  }

  // Check for valid local path with image extension
  const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
  return validExtensions.some((ext) => imagePath.toLowerCase().endsWith(ext));
};
