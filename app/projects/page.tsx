import { allProjects } from "@/lib/contentlayer-data";

import ListPage from "@/app/components/ListPage";

import { metadata } from "./metadata";
export { metadata };

export default function ProjectsPage() {
	return <ListPage content={allProjects} type="projects" />;
}
