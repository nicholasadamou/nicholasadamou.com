import { Metadata } from "next";
import { getProjectBySlug } from "@/lib/contentlayer-data";
import { notFound } from "next/navigation";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import { generateProjectOGVariants } from "@/lib/utils/themeDetection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const project = getProjectBySlug(resolvedParams.slug);

  if (!project) {
    notFound();
  }

  const {
    title,
    date: publishedTime,
    summary: description,
    image,
    slug,
  } = project;

  const baseUrl = getBaseUrl();
  const ogVariants = generateProjectOGVariants(
    title,
    description,
    image || undefined
  );

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
      images: [
        { url: `${baseUrl}${ogVariants.dark}`, alt: `${title} - Dark Theme` },
        { url: `${baseUrl}${ogVariants.light}`, alt: `${title} - Light Theme` },
      ],
    },
  };
}
