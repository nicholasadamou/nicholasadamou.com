import ProjectList from "@/components/projects/ProjectList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects — Nicholas Adamou",
  description: "Open-source projects and developer tools.",
};

export default function ProjectsPage() {
  return <ProjectList />;
}
