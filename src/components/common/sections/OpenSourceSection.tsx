import React from "react";
import SearchBar from "@/app/notes/components/SearchBar";
import Repositories from "@/app/projects/components/Repositories";

interface OpenSourceSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  type: "notes" | "projects";
}

export const OpenSourceSection: React.FC<OpenSourceSectionProps> = ({
  searchTerm,
  setSearchTerm,
  type,
}) => (
  <div className="animate-in" style={{ "--index": 4 } as React.CSSProperties}>
    <h2 className="text-primary mb-2 mt-4 text-2xl font-black leading-tight tracking-tight">
      Open Source
      <p className="text-secondary mb-3 mt-1 font-bold">
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
);
