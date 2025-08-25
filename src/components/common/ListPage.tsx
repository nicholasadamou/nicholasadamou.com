"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { Note, Project } from "@/lib/contentlayer-data";
import PostList from "@/app/notes/components/PostList";
import ProjectList from "@/app/projects/components/ProjectList";
import Repositories from "@/app/projects/components/Repositories";
import SearchBar from "@/app/notes/components/SearchBar";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import { FeaturedSection } from "@/app/projects/components/FeaturedSection";

interface ListPageProps {
  content: Array<Note | Project>;
  type: "notes" | "projects";
}

const ListHeader = ({ type }: { type: "notes" | "projects" }) => (
  <div className="flex flex-col gap-4">
    <h1 className="animate-in text-3xl font-black tracking-tight">
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </h1>
    <p
      className="mt-5 animate-in text-secondary"
      style={{ "--index": 1 } as React.CSSProperties}
    >
      {type === "notes"
        ? "While I don’t write on a regular basis, I find great value in sharing my insights and learnings whenever the opportunity arises."
        : "Here are some of the projects I’ve worked on over the years, focusing on leveraging technology to create positive change."}
    </p>
  </div>
);

const DotBrainsSection = () => (
  <div className="animate-in" style={{ "--index": 5 } as React.CSSProperties}>
    <h2 className="mb-2 mt-4 text-2xl font-bold leading-tight tracking-tight text-primary">
      <div className="flex items-center gap-2">
        <Image
          src="/logos/dotbrains.png"
          alt="DotBrains Logo"
          width={50}
          height={50}
        />
        <a
          href="https://dotbrains.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="font-black text-primary underline"
        >
          DotBrains
        </a>
        <ArrowUpRightIcon className="h-4 w-4 text-tertiary" />
      </div>
      <p className="mb-3 mt-1 text-secondary">
        A collective dedicated to the craft of software engineering, driven by a
        mission to enhance lives and solve complex problems through innovative
        technology.
      </p>
    </h2>
    <FeaturedSection />
  </div>
);

const ListPage: React.FC<ListPageProps> = ({ content, type }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContent =
    type === "notes"
      ? (content as Note[]).filter((note) =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : (content as Project[]);

  const sortedContent = filteredContent.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="mx-auto flex max-w-[700px] flex-col gap-8 px-4">
      <ListHeader type={type} />
      {type === "notes" && (
        <SearchBar
          className="animate-in"
          style={{ "--index": 2 } as React.CSSProperties}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          kind={type}
        />
      )}
      <div
        className="animate-in"
        style={{ "--index": 3 } as React.CSSProperties}
      >
        {type === "notes" ? (
          <PostList initialPosts={sortedContent as Note[]} />
        ) : (
          <ProjectList projects={sortedContent as Project[]} />
        )}
      </div>
      {type === "projects" && (
        <>
          <div
            className="animate-in"
            style={{ "--index": 4 } as React.CSSProperties}
          >
            <h2 className="mb-2 mt-4 text-2xl font-black leading-tight tracking-tight text-primary">
              Open Source
              <p className="mb-3 mt-1 font-bold text-secondary">
                You can find all of my projects on my{" "}
                <a
                  href="https://github.com/nicholasadamou"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary underline"
                >
                  GitHub
                </a>
                {"."}
              </p>
            </h2>
            <SearchBar
              className="animate-in"
              style={{ "--index": 2 } as React.CSSProperties}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              kind={type}
            />
            <Repositories searchTerm={searchTerm} />
          </div>
          <DotBrainsSection />
        </>
      )}
    </div>
  );
};

export default ListPage;
