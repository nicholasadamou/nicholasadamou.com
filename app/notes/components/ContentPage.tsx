"use client";

import React, { useState } from "react";
import type { Note } from "contentlayer/generated";
import PostList from "@/app/notes/components/PostList";
import SearchBar from "@/app/notes/components/SearchBar";

interface ContentPageProps {
	content: Array<Note>;
	type: string;
}

const ContentPage: React.FC<ContentPageProps> = ({ content, type }) => {
	const [searchTerm, setSearchTerm] = useState("");

	// Filtered and sorted notes based on search term
	const filteredNotes = content
		.filter(note => note.title.toLowerCase().includes(searchTerm.toLowerCase()))
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
						While I don&apos;t write on a regular basis, I find great value in
						sharing my insights and learnings whenever the opportunity arises.
						Each note reflects my thoughts and experiences, and I hope they
						resonate with others.
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
				<PostList initialPosts={filteredNotes} />
			</div>
		</div>
	);
};

export default ContentPage;
