/**
 * Image utilities for Open Graph route
 * Handles loading, processing, and conversion of images for Next.js ImageResponse
 */

import { readFile } from "fs/promises";
import { extname, join } from "path";

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
    }

    return await loadLocalImageAsBase64(imagePath);
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
    // Ensure proper conversion from ArrayBuffer to Buffer
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Check file size and optimize if needed
    const maxSize = 200 * 1024; // 200KB
    if (buffer.length > maxSize) {
      console.log(
        `External image ${imageUrl} is large (${buffer.length} bytes), optimizing...`
      );
      const optimizedBuffer = await optimizeImageBuffer(buffer, contentType);
      if (optimizedBuffer) {
        // Since we optimize to JPEG, use jpeg content type
        return `data:image/jpeg;base64,${optimizedBuffer.toString("base64")}`;
      }
      // If optimization failed and returned null, return null
      return null;
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
    if (!imagePath) {
      throw new Error("Image path is required");
    }

    // Construct full path to image in public directory
    const fullImagePath = join(
      process.cwd(),
      "public",
      imagePath.startsWith("/") ? imagePath.slice(1) : imagePath
    );

    // Verify fullImagePath is valid before proceeding
    if (
      !fullImagePath ||
      typeof fullImagePath !== "string" ||
      fullImagePath.trim() === ""
    ) {
      console.error("Invalid fullImagePath:", fullImagePath);
      throw new Error("Invalid image path constructed");
    }

    const buffer = await readFile(fullImagePath);
    const extension = extname(fullImagePath);

    // Ensure extension is valid before calling toLowerCase
    const normalizedExtension =
      extension && typeof extension === "string" ? extension.toLowerCase() : "";

    const contentType = getContentTypeFromExtension(normalizedExtension);

    // Check file size and optimize if needed (limit to 200KB for better performance)
    const maxSize = 200 * 1024; // 200KB
    if (buffer.length > maxSize) {
      console.log(
        `Image ${imagePath} is large (${buffer.length} bytes), optimizing...`
      );
      const optimizedBuffer = await optimizeImageBuffer(buffer, contentType);
      if (optimizedBuffer) {
        // Since we optimize to JPEG, use jpeg content type
        return `data:image/jpeg;base64,${optimizedBuffer.toString("base64")}`;
      }
      // If optimization failed and returned null, return null
      return null;
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
    const sharp = await import("sharp");
    const sharpInstance = sharp.default || sharp;

    console.log(`Optimizing ${contentType} image with Sharp...`);

    // Resize image to reasonable dimensions for OG images
    // OG layout uses 480x640 for images, so let's optimize around that
    const optimizedBuffer = await sharpInstance(buffer)
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

    // Safeguard against undefined buffer lengths
    const originalSize = buffer?.length || 0;
    const optimizedSize = optimizedBuffer?.length || 0;

    console.log(
      `Image optimized: ${originalSize} bytes -> ${optimizedSize} bytes`
    );

    return optimizedBuffer;
  } catch (error) {
    console.error("Error optimizing image with Sharp:", error);

    // Fallback: if optimization fails, check the image size
    const targetSize = 300 * 1024; // 300KB target
    if (buffer.length > targetSize) {
      console.log(
        "Image too large and optimization failed, falling back to no image"
      );
      return null;
    }

    // For smaller images, return the original buffer
    console.log("Small image optimization failed, using original buffer");
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

  // Check if it looks like a URL (contains protocol)
  if (imagePath.includes("://")) {
    try {
      const url = new URL(imagePath);
      // Only allow http and https protocols
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return false;
      }
      // Check for valid hostname
      if (!url.hostname || url.hostname === "") {
        return false;
      }
      // Additional validation for malformed URLs
      if (url.hostname.includes("..") || url.hostname.includes("[")) {
        return false;
      }
      // Check for valid image extension in URL path
      const validExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".svg",
      ];
      const pathname = url.pathname.toLowerCase();

      return validExtensions.some((ext) => pathname.includes(ext));
    } catch {
      return false;
    }
  }

  // For non-URL paths, ensure they don't look like URLs without protocol
  // Only check if it doesn't start with './' or '../' (valid relative paths)
  if (
    imagePath.includes(".") &&
    imagePath.includes("/") &&
    !imagePath.startsWith("./") &&
    !imagePath.startsWith("../") &&
    imagePath.indexOf(".") < imagePath.indexOf("/")
  ) {
    // This might be a malformed URL like "example.com/image.png"
    return false;
  }

  // Check for valid local path with image extension
  const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
  return validExtensions.some((ext) => imagePath.toLowerCase().endsWith(ext));
};
