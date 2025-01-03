import { Metadata } from "next";
import { allProjects } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { getBaseUrl } from "@/app/utils/getBaseUrl";

export async function generateMetadata({
																				 params,
																			 }: {
	params: { slug: string };
}): Promise<Metadata> {
	const project = allProjects.find((project) => project.slug === params.slug);

	if (!project) {
		notFound();
	}

	const { title, date: publishedTime, summary: description, image, slug } = project;

	const baseUrl = getBaseUrl();
	const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(
		title
	)}&image=${encodeURIComponent(image)}&description=${encodeURIComponent(
		description
	)}&type=project`;

	return {
		metadataBase: new URL(baseUrl),
		title: `${title} | Nicholas Adamou`,
		description,
		openGraph: {
			title: `${title} | Nicholas Adamou`,
			description,
			type: "article",
			publishedTime,
			url: `${baseUrl}/projects/${slug}`,
			images: [{ url: ogImage, alt: title }],
		},
	};
}
