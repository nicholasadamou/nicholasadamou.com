import { Metadata } from "next";
import { getBaseUrl } from "@/app/utils/getBaseUrl";

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
	title: "Projects | Nicholas Adamou",
	description:
		"Some of the projects I've worked on over the years. I'm passionate about leveraging technology to create positive change in the world. My mission is to harness the power of code to develop innovative solutions that address real-world challenges and improve people's lives.",
	openGraph: {
		title: "Projects | Nicholas Adamou",
		description:
			"Some of the projects I've worked on over the years. I'm passionate about leveraging technology to create positive change in the world. My mission is to harness the power of code to develop innovative solutions that address real-world challenges and improve people's lives.",
		type: "website",
		url: `https://${baseUrl}/projects`,
		images: [{ url: `https://${baseUrl}/api/og?title=projects`, alt: "Projects" }],
	},
};
