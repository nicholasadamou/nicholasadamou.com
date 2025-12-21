"use client";

import type { Note } from "@/lib/content/contentlayer-data";
import Link from "@/components/common/ui/Link";
import Halo from "@/components/common/effects/Halo";
import UniversalImage from "@/components/common/media/UniversalImage";
import { formatShortDate } from "@/lib/utils/formatting/format-short-date";
import Views from "@/app/notes/components/Views";
import { Calendar } from "lucide-react";

type NoteListProps = {
  notes: Note[];
};

export default function PinnedNotesList({ notes }: NoteListProps) {
  const pinnedNotes = notes.filter((note) => note.pinned);

  if (pinnedNotes.length === 0) {
    return null;
  }

  return (
    <ul className="animated-list grid grid-cols-1 gap-8 md:grid-cols-2">
      {pinnedNotes.map((note) => (
        <li key={note.slug} className="group transition-opacity">
          <div className="space-y-4">
            <Link href={`/notes/${note.slug}`}>
              <div className="bg-secondary aspect-video overflow-hidden rounded-xl">
                <Halo strength={10}>
                  <UniversalImage
                    src={note.image_url || note.image || ""}
                    alt={note.title}
                    fill
                    priority={true}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                  />
                </Halo>
              </div>
            </Link>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <Link href={`/notes/${note.slug}`}>
                  <h3 className="text-primary font-semibold leading-tight transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                    {note.title}
                  </h3>
                </Link>
              </div>
              <p className="text-secondary leading-relaxed">{note.summary}</p>
              <div className="text-tertiary flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>{formatShortDate(note.date)}</span>
                </div>
                <Views slug={note.slug} />
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
