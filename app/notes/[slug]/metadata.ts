import { Metadata } from "next";
import { allNotes } from "@/lib/contentlayer-data";
import { notFound } from "next/navigation";
import { getBaseUrl } from "@/app/utils/getBaseUrl";

export async function generateMetadata({
																				 params,
																			 }: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const resolvedParams = await params;
	const note = allNotes.find(
		(note: { slug: string }) => note.slug === resolvedParams.slug,
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
