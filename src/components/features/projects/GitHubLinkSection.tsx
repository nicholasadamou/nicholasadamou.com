"use client";

import React from "react";
import { Github, BookDashed } from "lucide-react";
import { LinkButton } from "@/components/mdx/LinkButton";

interface GitHubLinkSectionProps {
	url: string;
	demoUrl?: string;
}

const GitHubLinkSection: React.FC<GitHubLinkSectionProps> = ({ url, demoUrl = '' }) => {
	return (
		<section className="animate-in animated-list flex snap-x snap-mandatory flex-nowrap max-w-full gap-3 overflow-x-scroll md:overflow-auto">
			<div className="min-w-fit snap-start">
				<LinkButton
					href={url || ""}
					icon={Github}
					className="border border-[#191919] bg-[#191919] text-[#efefef] hover:bg-[#efefef] hover:text-[#191919] dark:bg-[#efefef] dark:text-[#191919] dark:hover:bg-[#191919] dark:hover:text-[#efefef]"
				>
					GitHub
				</LinkButton>
			</div>
			{demoUrl && (
				<div className="min-w-fit snap-start">
					<LinkButton
						href={demoUrl}
						icon={BookDashed}
						className="border border-[#efefef] bg-transparent text-[#191919] hover:bg-[#efefef] hover:text-[#191919] dark:border-[#191919] dark:text-[#efefef] dark:hover:bg-[#191919] dark:hover:text-[#efefef]"
					>
						Demo
					</LinkButton>
				</div>
			)}
		</section>
	);
};

export default GitHubLinkSection;
