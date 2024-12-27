import { Metadata } from "next";
import { getBaseUrl } from "@/app/utils/getBaseUrl";

const baseUrl = getBaseUrl();

const description = "I find great value in sharing my insights and learnings whenever the opportunity arises. Each note reflects my thoughts and experiences, and I hope they resonate with others.";

export const metadata: Metadata = {
	title: "Notes | Nicholas Adamou",
	description,
	openGraph: {
		title: "Notes | Nicholas Adamou",
		description,
		type: "website",
		url: `${baseUrl}/notes`,
		images: [{ url: `${baseUrl}/api/og?title=${encodeURIComponent(description)}&type=notes`, alt: "Notes" }],
	},
};
