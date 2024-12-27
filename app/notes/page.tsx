import React from "react";
import { allNotes } from "contentlayer/generated";
import ContentPage from "@/app/notes/components/ContentPage";

import { metadata } from "./metadata";
export { metadata };

export default function NotesPage() {
	return (
		<ContentPage
			content={allNotes}
			type="notes"
		/>
	);
}
