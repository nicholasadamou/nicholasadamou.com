import { DEFAULTS, HEADER_TEXT } from "../constants";
import { OGParams, OGType, OGTheme, ProcessedOGParams } from "../types";
import { isValidImagePath, fetchImageAsBase64 } from "./image";
import { AVATAR_BASE64 } from "../avatar-data";

const VALID_TYPES: OGType[] = ["homepage", "note", "notes"];
const VALID_THEMES: OGTheme[] = ["dark", "light"];

export const cleanSearchParams = (searchParams: URLSearchParams): void => {
  const keysToClean = Array.from(searchParams.keys()).filter((key) =>
    key.startsWith("amp;")
  );
  keysToClean.forEach((key) => {
    const value = searchParams.get(key);
    if (value !== null) {
      searchParams.delete(key);
      searchParams.set(key.slice(4), value);
    }
  });
};

export const extractOGParams = (searchParams: URLSearchParams): OGParams => {
  const title = searchParams.get("title") ?? DEFAULTS.title;
  const description = searchParams.get("description") ?? "";
  const type = (searchParams.get("type") ?? DEFAULTS.type) as OGType;
  const theme = (searchParams.get("theme") ?? DEFAULTS.theme) as OGTheme;
  const image = searchParams.get("image") ?? "";

  return {
    title,
    description: description || undefined,
    type: VALID_TYPES.includes(type) ? type : DEFAULTS.type,
    theme: VALID_THEMES.includes(theme) ? theme : DEFAULTS.theme,
    image: image || undefined,
  };
};

export const processOGParams = async (
  params: OGParams,
  baseUrl?: string
): Promise<ProcessedOGParams> => {
  const imageToProcess = params.image;
  let useEmbeddedAvatar = false;

  if (!imageToProcess && params.type === "homepage") {
    useEmbeddedAvatar = true;
  }

  const resolvedBaseUrl =
    baseUrl ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  let processedImage: string | undefined;

  if (useEmbeddedAvatar) {
    processedImage = AVATAR_BASE64;
  } else if (imageToProcess && isValidImagePath(imageToProcess)) {
    const absoluteUrl = imageToProcess.startsWith("http")
      ? imageToProcess
      : `${resolvedBaseUrl}${imageToProcess}`;

    const base64Image = await fetchImageAsBase64(
      absoluteUrl,
      !imageToProcess.startsWith("http")
    );
    if (base64Image) {
      processedImage = base64Image;
    }
  }

  return {
    ...params,
    headerText: HEADER_TEXT[params.type],
    processedImage,
  };
};
