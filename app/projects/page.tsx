import { allProjects } from "contentlayer/generated";
import ContentPage from "@/app/projects/components/ContentPage";

import { metadata } from "./metadata";
export { metadata };

export default function ProjectsPage() {
	return <ContentPage content={allProjects} type="projects" />;
}
