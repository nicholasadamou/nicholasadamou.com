const createMDX = require("@next/mdx");

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

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify is enabled by default in Next.js 15
  images: {
    qualities: [20, 75, 85, 90], // Add the quality values used in performance.ts
    localPatterns: [
      {
        pathname: "/**",
      },
    ],
    remotePatterns: [
      { protocol: "https", hostname: "tailwindui.com" },
      { protocol: "https", hostname: "unsplash.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "cdn.dribbble.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "miro.medium.com" },
      { protocol: "https", hostname: "img.clerk.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "store.storeimages.cdn-apple.com" },
      { protocol: "https", hostname: "www.apple.com" },
      { protocol: "https", hostname: "public-files.gumroad.com" },
    ],
  },
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};

module.exports = withMDX(nextConfig);
