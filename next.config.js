const { withContentlayer } = require("next-contentlayer");

/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {},
	// Turbopack configuration (replaces experimental.turbo)
	turbopack: {
		rules: {
			'*.svg': {
				loaders: ['@svgr/webpack'],
				as: '*.js',
			},
		},
	},
	reactStrictMode: true,
	// swcMinify is enabled by default in Next.js 15
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "tailwindui.com" },
			{ protocol: "https", hostname: "images.unsplash.com" },
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

module.exports = withContentlayer(nextConfig);
