import { pageMetadata } from "@/lib/og";
import ProjectList from "@/components/projects/ProjectList";
import type { Metadata } from "next";

const page: Metadata = {
  title: "Projects",
  description: "Open-source projects and developer tools.",
  alternates: {
    canonical: "/projects",
  },
};

export const metadata: Metadata = {
  ...page,
  ...pageMetadata(String(page.title), page.description!, "/projects"),
};

export default function ProjectsPage() {
  return <ProjectList />;
}
