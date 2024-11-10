import { Metadata } from "next";
import { allProjects } from "contentlayer/generated";
import React from "react";

import { getBaseUrl } from "@/app/_utils/getBaseUrl";
import ProjectList from "@/app/projects/components/ProjectList";

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
	title: "Projects | Nicholas Adamou",
	description:
		"I write about programming, design, and occasionally life updates!",
	openGraph: {
		title: "Notes | Nicholas Adamou",
		description:
			"I write about programming, design, and occasionally life updates!",
		type: "website",
		url: `https://${baseUrl}/projects`,
		images: [{ url: `https://${baseUrl}/api/og?title=projects`, alt: "Projects" }],
	},
};

export default function ProjectsPage() {
	const projects = allProjects.sort(
		(
			a: { date: string | number | Date },
			b: {
				date: string | number | Date;
			},
		) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);

	return (
		<div className="flex flex-col gap-12 md:gap-24 px-4 max-w-[700px] mx-auto">
			<div className="flex flex-col gap-8">
				<div>
					<h1 className="animate-in text-3xl font-bold tracking-tight">Projects</h1>
					<p
						className="mt-5 animate-in text-secondary"
						style={{ "--index": 1 } as React.CSSProperties}
					>
						Here are some of the projects I&apos;ve worked on over the years. I&apos;m
						passionate about leveraging technology to create positive change in
						the world. My mission is to harness the power of code to develop
						innovative solutions that address real-world challenges and improve
						people&apos;s lives.
					</p>
				</div>
			</div>
			<div
				className="animate-in"
				style={{ "--index": 2 } as React.CSSProperties}
			>
				<ProjectList projects={projects} />
			</div>
		</div>
	);
}
