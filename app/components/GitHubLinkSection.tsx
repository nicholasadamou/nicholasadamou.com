"use client";

import React from "react";
import { Download, Github } from "lucide-react";
import { LinkButton } from "@/app/components/mdx/LinkButton";

interface GitHubLinkSectionProps {
  url: string;
	zip: string;
}

const GitHubLinkSection: React.FC<GitHubLinkSectionProps> = ({ url, zip }) => {
  return (
    <section className="flex gap-3">
      <LinkButton
        href={url || ""}
        icon={Github}
        className="border border-[#191919] bg-[#191919] text-white hover:bg-slate-900 dark:bg-slate-50 dark:text-slate-800 dark:hover:bg-transparent dark:hover:text-slate-50"
      >
        GitHub
      </LinkButton>
      <LinkButton
        href={zip || ""}
        icon={Download}
        className="border border-[#efefef] bg-transparent hover:bg-[#efefef] dark:border-[#191919] dark:text-slate-100 dark:hover:bg-slate-50 dark:hover:text-slate-900"
      >
        Download as zip
      </LinkButton>
    </section>
  );
};

export default GitHubLinkSection;
