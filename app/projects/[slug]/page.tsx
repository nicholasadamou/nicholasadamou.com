import { allProjects } from "@/lib/contentlayer-data";
import ContentPage from "@/app/components/ContentPage";

import {generateMetadata} from "./metadata";
export {generateMetadata};

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
	const resolvedParams = await params;
	const project = allProjects.find((p) => p.slug === resolvedParams.slug);
	return <ContentPage content={project} type="project" allContent={allProjects} />;
}
