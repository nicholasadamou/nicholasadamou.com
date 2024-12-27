"use client";

import { allProjects } from "contentlayer/generated";
import React, { useState } from "react";

import ProjectList from "@/app/projects/components/ProjectList";
import Repositories from "@/app/projects/components/Repositories";
import SearchBar from "@/app/notes/components/SearchBar";

export default function ProjectsPage() {
	const [searchTerm, setSearchTerm] = useState("");

	const projects = allProjects.sort(
		(
			a: { date: string | number | Date },
			b: {
				date: string | number | Date;
			},
		) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);

	return (
		<div className="flex flex-col gap-12 px-4 max-w-[700px] mx-auto">
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
			<div
				className="animate-in"
				style={{ "--index": 3} as React.CSSProperties}
			>
				<h2 className="text-2xl font-bold leading-tight tracking-tight text-primary mb-2">
					Open Source
					<p className="mt-1 mb-3 text-secondary">
						You can find all of my projects on my{' '}
						<a
							href="https://github.com/nicholasadamou"
							target="_blank"
							rel="noopener noreferrer"
							className="text-secondary underline"
						>
							GitHub
						</a>
						{"."}
					</p>
				</h2>
				<SearchBar
					className="animate-in"
					style={{ "--index": 4 } as React.CSSProperties}
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					kind="projects"
				/>
				<Repositories searchTerm={searchTerm} />
			</div>
		</div>
	);
}
