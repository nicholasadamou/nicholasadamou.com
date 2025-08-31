"use client";

import React from "react";
import { Github, BookDashed } from "lucide-react";
import { LinkButton } from "@/components/mdx/LinkButton";

interface GitHubLinkSectionProps {
  url: string;
  demoUrl?: string;
}

const GitHubLinkSection: React.FC<GitHubLinkSectionProps> = ({
  url,
  demoUrl = "",
}) => {
  return (
    <section className="animated-list animate-in flex max-w-full snap-x snap-mandatory flex-nowrap gap-3 overflow-x-scroll md:overflow-auto">
      <div className="min-w-fit snap-start">
        <LinkButton
          href={url || ""}
          icon={Github}
          className="btn-filled border transition-colors"
        >
          GitHub
        </LinkButton>
      </div>
      {demoUrl && (
        <div className="min-w-fit snap-start">
          <LinkButton
            href={demoUrl}
            icon={BookDashed}
            className="btn-outline border transition-colors"
          >
            Demo
          </LinkButton>
        </div>
      )}
    </section>
  );
};

export default GitHubLinkSection;
