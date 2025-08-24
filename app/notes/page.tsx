import React from "react";
import { allNotes } from "@/lib/contentlayer-data";

import ListPage from "@/app/components/ListPage";

import { metadata } from "./metadata";
export { metadata };

export default function NotesPage() {
	return <ListPage content={allNotes} type="notes" />;
}
