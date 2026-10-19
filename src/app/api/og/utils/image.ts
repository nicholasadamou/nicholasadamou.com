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
    // Static assets belong on the CDN, not duplicated inside the OG function.
    const headers: Record<string, string> = {};
    if (
      isLocal &&
      process.env.VERCEL_URL &&
      new URL(imageUrl).origin === `https://${process.env.VERCEL_URL}` &&
      process.env.VERCEL_AUTOMATION_BYPASS_SECRET
    ) {
      headers["x-vercel-protection-bypass"] =
        process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
    }
    const response = await fetch(imageUrl, {
      headers,
      redirect: headers["x-vercel-protection-bypass"] ? "error" : "follow",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;

    const contentType = response.headers.get("content-type")?.split(";")[0];
    if (!contentType?.startsWith("image/")) return null;
    const buffer = Buffer.from(await response.arrayBuffer());

    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch (error) {
    console.error("Error fetching image as base64:", error);
    return null;
  }
};
