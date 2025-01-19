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
				className="border border-[#191919] bg-[#191919] text-[#efefef] hover:bg-[#efefef] hover:text-[#191919] dark:bg-[#efefef] dark:text-[#191919] dark:hover:bg-[#191919] dark:hover:text-[#efefef]"
			>
				GitHub
			</LinkButton>
			<LinkButton
				href={zip || ""}
				icon={Download}
				className="border border-[#efefef] bg-transparent text-[#191919] hover:bg-[#efefef] hover:text-[#191919] dark:border-[#191919] dark:text-[#efefef] dark:hover:bg-[#191919] dark:hover:text-[#efefef]"
			>
				Download as zip
			</LinkButton>
		</section>
	);
};

export default GitHubLinkSection;
