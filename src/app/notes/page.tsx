import React from "react";
import { allNotes } from "@/lib/content/contentlayer-data";

import ListPage from "@/components/common/layout/ListPage";

import { metadata } from "./metadata";
export { metadata };

// Enable static generation for better performance
export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour

export default function NotesPage() {
  return <ListPage content={allNotes} type="notes" />;
}
