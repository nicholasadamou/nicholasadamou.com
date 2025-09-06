import { getAllProjects, getProjectBySlug } from "@/lib/contentlayer-data";
import ServerContentPage from "@/components/common/ServerContentPage";

import { generateMetadata } from "./metadata";
export { generateMetadata };

export async function generateStaticParams() {
  const allProjects = getAllProjects();
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
  const project = getProjectBySlug(resolvedParams.slug);
  const allProjects = getAllProjects();
  return (
    <ServerContentPage
      content={project || undefined}
      type="project"
      allContent={allProjects}
    />
  );
}
