const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      require("@akebifiky/remark-simple-plantuml"),
      require("remark-math"),
    ],
    rehypePlugins: [
      require("rehype-slug"),
      [require("rehype-autolink-headings"), { behavior: "wrap" }],
      require("@mapbox/rehype-prism"),
      require("rehype-katex"),
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  reactStrictMode: true,
  // swcMinify is enabled by default in Next.js 15
  images: {
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
