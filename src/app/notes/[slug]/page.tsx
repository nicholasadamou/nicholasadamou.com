import { getAllNotes, getNoteBySlug } from "@/lib/contentlayer-data";
import ServerContentPage from "@/components/common/layout/ServerContentPage";

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
    <ServerContentPage
      content={note || undefined}
      type="note"
      allContent={allNotes}
    />
  );
}
