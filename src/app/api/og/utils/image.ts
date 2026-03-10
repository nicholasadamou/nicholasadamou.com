import { readFileSync } from "fs";
import { join } from "path";

const VALID_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

export const isValidImagePath = (imagePath?: string): boolean => {
  if (!imagePath || imagePath.trim() === "") return false;

  if (imagePath.includes("://")) {
    try {
      const url = new URL(imagePath);
      if (url.protocol !== "http:" && url.protocol !== "https:") return false;
      if (!url.hostname) return false;
      return VALID_EXTENSIONS.some((ext) =>
        url.pathname.toLowerCase().includes(ext)
      );
    } catch {
      return false;
    }
  }

  return VALID_EXTENSIONS.some((ext) => imagePath.toLowerCase().endsWith(ext));
};

export const fetchImageAsBase64 = async (
  imageUrl: string,
  isLocal: boolean = false
): Promise<string | null> => {
  try {
    let buffer: Buffer;
    let contentType: string;

    if (isLocal) {
      const urlPath = imageUrl.includes("://")
        ? new URL(imageUrl).pathname
        : imageUrl;
      const cleanPath = urlPath.startsWith("/") ? urlPath.slice(1) : urlPath;
      const publicPath = join(process.cwd(), "public", cleanPath);

      buffer = readFileSync(publicPath);
      contentType = cleanPath.toLowerCase().endsWith(".png")
        ? "image/png"
        : cleanPath.toLowerCase().endsWith(".webp")
          ? "image/webp"
          : "image/jpeg";
    } else {
      const response = await fetch(imageUrl, {
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) return null;

      const arrayBuffer = await response.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      contentType =
        response.headers.get("content-type") ||
        (imageUrl.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg");
    }

    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch (error) {
    console.error("Error fetching image as base64:", error);
    return null;
  }
};
