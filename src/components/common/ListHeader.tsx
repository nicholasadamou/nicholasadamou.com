import React from "react";

interface ListHeaderProps {
  type: "notes" | "projects";
}

const CONTENT_DESCRIPTIONS = {
  notes:
    "While I don't write on a regular basis, I find great value in sharing my insights and learnings whenever the opportunity arises.",
  projects:
    "Here are some of the projects I've worked on over the years, focusing on leveraging technology to create positive change.",
};

export const ListHeader: React.FC<ListHeaderProps> = ({ type }) => (
  <div className="flex flex-col gap-4">
    <h1 className="animate-in text-3xl font-black tracking-tight">
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </h1>
    <p
      className="animate-in text-secondary mt-5"
      style={{ "--index": 1 } as React.CSSProperties}
    >
      {CONTENT_DESCRIPTIONS[type]}
    </p>
  </div>
);
