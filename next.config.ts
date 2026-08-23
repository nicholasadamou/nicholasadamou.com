import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [["@akebifiky/remark-simple-plantuml"], ["remark-math"]],
    rehypePlugins: [
      ["rehype-slug"],
      ["rehype-autolink-headings", { behavior: "wrap" }],
      ["@mapbox/rehype-prism"],
      ["rehype-katex"],
    ],
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  // These routes also serve a Markdown representation of the same content
  // via Accept-header negotiation (see src/proxy.ts). Declaring `Vary:
  // Accept` here — in addition to setting it on the negotiated response
  // itself — ensures CDNs cache the HTML and Markdown variants separately
  // instead of serving one to the wrong Accept header. Per
  // https://acceptmarkdown.com.
  async headers() {
    const varyAccept = { key: "Vary", value: "Accept" };
    return [
      { source: "/", headers: [varyAccept] },
      { source: "/about", headers: [varyAccept] },
      { source: "/contact", headers: [varyAccept] },
      { source: "/privacy", headers: [varyAccept] },
      { source: "/projects", headers: [varyAccept] },
      { source: "/notes", headers: [varyAccept] },
      { source: "/notes/:slug", headers: [varyAccept] },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 828, 1080, 1200, 1920],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "im.vsco.co" },
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "public-files.gumroad.com" },
    ],
  },
};

export default withMDX(nextConfig);
