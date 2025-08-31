import { getAllNotes, getNoteBySlug } from "@/lib/contentlayer-data";
import ContentPage from "@/components/common/ContentPage";

import { generateMetadata } from "./metadata";
export { generateMetadata };

export async function generateStaticParams() {
  const allNotes = getAllNotes();
  return allNotes.map((note) => ({
    slug: note.slug,
  }));
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const note = getNoteBySlug(resolvedParams.slug);
  const allNotes = getAllNotes();
  return (
    <ContentPage
      content={note || undefined}
      type="note"
      allContent={allNotes}
    />
  );
}
