import { Metadata } from "next";
import { allNotes } from "contentlayer/generated";
import PostList from "@/app/notes/components/PostList";
import React from "react";

import { getBaseUrl } from "@/app/_utils/getBaseUrl";

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: "Notes | Nicholas Adamou",
  description:
    "I write about programming, design, and occasionally life updates!",
  openGraph: {
    title: "Notes | Nicholas Adamou",
    description:
      "I write about programming, design, and occasionally life updates!",
    type: "website",
    url: `https://${baseUrl}/notes`,
    images: [{ url: `https://${baseUrl}/api/og?title=Notes`, alt: "Notes" }],
  },
};

export default function NotesPage() {
  const notes = allNotes.sort(
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
					<h1 className="animate-in text-3xl font-bold tracking-tight">Notes</h1>
					<p
						className="mt-5 animate-in text-secondary"
						style={{ "--index": 1 } as React.CSSProperties}
					>
						While I don’t write on a regular basis, I find great value in
						sharing my insights and learnings whenever the opportunity arises.
						Each note reflects my thoughts and experiences, and I hope they
						resonate with others.
					</p>
				</div>
			</div>
			<div
				className="animate-in"
				style={{ "--index": 2 } as React.CSSProperties}
			>
				<PostList posts={notes} />
			</div>
		</div>
	);
}
