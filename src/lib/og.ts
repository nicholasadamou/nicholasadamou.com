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
  });
  return `/api/og?${searchParams.toString()}`;
}
