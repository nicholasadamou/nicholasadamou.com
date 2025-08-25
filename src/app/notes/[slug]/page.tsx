import { allNotes } from "@/lib/contentlayer-data";
import ContentPage from "@/components/common/ContentPage";

import { generateMetadata } from "./metadata";
export { generateMetadata };

export async function generateStaticParams() {
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
  const note = allNotes.find((n) => n.slug === resolvedParams.slug);
  return <ContentPage content={note} type="note" allContent={allNotes} />;
}
