import { allProjects } from "contentlayer/generated";
import ContentPage from "@/app/components/ContentPage";

import {generateMetadata} from "./metadata";
export {generateMetadata};

export default function ProjectPage({ params }: { params: { slug: string } }) {
	const project = allProjects.find((p) => p.slug === params.slug);
	return <ContentPage content={project} type="project" allContent={allProjects} />;
}
