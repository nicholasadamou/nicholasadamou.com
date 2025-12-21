import React from "react";

interface ListHeaderProps {
  type: "notes" | "projects";
}

const CONTENT_DESCRIPTIONS = {
  notes:
    "I share my learnings and insights on software development, developer experience, and engineering best practices. My notes cover topics ranging from system architecture and DevOps workflows to code quality and team productivity. While I don't write on a regular basis, I find great value in documenting my experiences and sharing practical knowledge that can help other developers build better software and improve their development workflows.",
  projects:
    "Here are some of the projects I've worked on over the years, focusing on leveraging technology to create positive change. Each project represents my passion for building innovative solutions that address real-world challenges. From cloud infrastructure tools to developer productivity apps, I believe in creating software that not only functions beautifully but also makes a meaningful impact on communities and individuals.",
};

export const ListHeader: React.FC<ListHeaderProps> = ({ type }) => (
  <div className="flex flex-col gap-2">
    <h1 className="animate-in text-3xl font-black tracking-tight">
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </h1>
    <p
      className="animate-in text-secondary"
      style={{ "--index": 1 } as React.CSSProperties}
    >
      {CONTENT_DESCRIPTIONS[type]}
    </p>
  </div>
);
