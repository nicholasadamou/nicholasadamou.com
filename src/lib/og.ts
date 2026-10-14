import type { Metadata } from "next";
export const getBaseUrl = (): string => {
  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://nicholasadamou.com";
};

export function generateOGUrl(params: {
  title?: string;
  description?: string;
  type?: string;
  image?: string;
}): string {
  const searchParams = new URLSearchParams({
    ...params,
    theme: "dark",
    v: "2",
  });
  return `/api/og?${searchParams.toString()}`;
}

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  type = "page"
): Metadata {
  const image = generateOGUrl({ title, description, type });
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${title} — Nicholas Adamou`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
