"use client";

import React, { useState } from "react";
import type { Note, Project } from "contentlayer/generated";
import PostList from "@/app/notes/components/PostList";
import ProjectList from "@/app/projects/components/ProjectList";
import Repositories from "@/app/projects/components/Repositories";
import SearchBar from "@/app/notes/components/SearchBar";

interface ListPageProps {
	content: Array<Note | Project>;
	type: "notes" | "projects";
}

const ListPage: React.FC<ListPageProps> = ({ content, type }) => {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredContent =
		type === "notes"
			? (content as Note[]).filter(note =>
				note.title.toLowerCase().includes(searchTerm.toLowerCase())
			)
			: (content as Project[]);

	const sortedContent = filteredContent.sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	);

	return (
		<div className="flex flex-col gap-8 px-4 max-w-[700px] mx-auto">
			<div className="flex flex-col gap-4">
				<div>
					<h1 className="animate-in text-3xl font-bold tracking-tight">
						{type.charAt(0).toUpperCase() + type.slice(1)}
					</h1>
					<p
						className="mt-5 animate-in text-secondary"
						style={{ "--index": 1 } as React.CSSProperties}
					>
						{type === "notes"
							? "While I don’t write on a regular basis, I find great value in sharing my insights and learnings whenever the opportunity arises. Each note reflects my thoughts and experiences, and I hope they resonate with others."
							: "Here are some of the projects I’ve worked on over the years. I’m passionate about leveraging technology to create positive change in the world. My mission is to harness the power of code to develop innovative solutions that address real-world challenges and improve people’s lives."}
					</p>
				</div>
				<SearchBar
					className="animate-in"
					style={{ "--index": 2 } as React.CSSProperties}
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					kind={type}
				/>
			</div>
			<div
				className="animate-in"
				style={{ "--index": 3 } as React.CSSProperties}
			>
				{type === "notes" ? (
					<PostList initialPosts={sortedContent as Note[]} />
				) : (
					<ProjectList projects={sortedContent as Project[]} />
				)}
			</div>
			{type === "projects" && (
				<div
					className="animate-in"
					style={{ "--index": 4 } as React.CSSProperties}
				>
					<h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-primary mb-2">
						Open Source
						<p className="mt-1 mb-3 text-secondary">
							You can find all of my projects on my{" "}
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
					<Repositories searchTerm={searchTerm} />
				</div>
			)}
		</div>
	);
};

export default ListPage;
