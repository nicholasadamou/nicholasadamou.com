import React from "react";
import { allNotes } from "@/lib/contentlayer-data";

import ListPage from "@/components/common/ListPage";

import { metadata } from "./metadata";
export { metadata };

export default function NotesPage() {
	return <ListPage content={allNotes} type="notes" />;
}
