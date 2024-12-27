"use client";

import { allNotes } from "contentlayer/generated";
import PostList from "@/app/notes/components/PostList";
import React, { useState } from "react";
import SearchBar from "@/app/notes/components/SearchBar";

export default function NotesPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const notes = allNotes.sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	);

	return (
		<div className="flex flex-col gap-8 px-4 max-w-[700px] mx-auto">
			<div className="flex flex-col gap-4">
				<div>
					<h1 className="animate-in text-3xl font-bold tracking-tight">Notes</h1>
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
					kind="notes"
				/>
			</div>
			<div
				className="animate-in"
				style={{ "--index": 3 } as React.CSSProperties}
			>
				<PostList initialPosts={notes} searchTerm={searchTerm} />
			</div>
		</div>
	);
}

