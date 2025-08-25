import { allProjects } from "@/lib/contentlayer-data";
import ContentPage from "@/components/common/ContentPage";

import { generateMetadata } from "./metadata";
export { generateMetadata };

export async function generateStaticParams() {
  return allProjects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const project = allProjects.find((p) => p.slug === resolvedParams.slug);
  return (
    <ContentPage content={project} type="project" allContent={allProjects} />
  );
}
