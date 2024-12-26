import { Metadata } from "next";
import { allNotes } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { getBaseUrl } from "@/app/utils/getBaseUrl";

export async function generateMetadata({
																				 params,
																			 }: {
	params: { slug: string };
}): Promise<Metadata> {
	const note = allNotes.find(
		(note: { slug: string }) => note.slug === params.slug,
	);

	if (!note) {
		notFound();
	}

	const {
		title,
		date: publishedTime,
		summary: description,
		image,
		slug,
	} = note;

	const baseUrl = getBaseUrl();
	const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(title)}&image=${encodeURIComponent(image)}&type=note`;

	return {
		metadataBase: new URL(baseUrl),
		title: `${title} | Nicholas Adamou`,
		description,
		openGraph: {
			title: `${title} | Nicholas Adamou`,
			description,
			type: "article",
			publishedTime,
			url: `${baseUrl}/notes/${slug}`,
			images: [{ url: ogImage, alt: title }],
		},
	};
}
