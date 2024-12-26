"use client";

import { allNotes } from "contentlayer/generated";
import ContentPage from "@/app/components/ContentPage";

export default function NotePage({ params }: { params: { slug: string } }) {
	const note = allNotes.find((n) => n.slug === params.slug);
	return <ContentPage content={note} type="note" allContent={allNotes} />;
}
