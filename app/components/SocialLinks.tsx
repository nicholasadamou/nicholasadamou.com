import React from "react";
import Link from "@/app/components/Link";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";

type SocialLink = {
	href: string;
	label: string;
};

type SocialLinksProps = {
	links: SocialLink[];
};

export default function SocialLinks({ links }: SocialLinksProps) {
	return (
		<ul
			className="animate-in animated-list flex snap-x snap-mandatory flex-nowrap gap-2 sm:gap-3 overflow-x-scroll text-sm md:overflow-auto"
			style={{ "--index": 2 } as React.CSSProperties}
		>
			{links.map((link) => (
				<li
					key={link.href}
					className="col-span-1 min-w-fit snap-start transition-opacity"
				>
					<Link
						href={link.href}
						className="flex w-fit items-center rounded-full bg-tertiary dark:bg-secondary px-3 py-1 no-underline transition-colors hover:bg-tertiary"
					>
						{link.label}
						<ArrowUpRightIcon className="h-4 w-4 text-tertiary ml-1" />
					</Link>
				</li>
			))}
		</ul>
	);
}

export const socialLinks: SocialLink[] = [
	{
		href: "https://tinyurl.com/nicholas-adamou-resume",
		label: "Resume",
	},
	{
		href: "https://www.linkedin.com/in/nicholas-adamou",
		label: "LinkedIn",
	},
	{
		href: "https://github.com/nicholasadamou",
		label: "GitHub",
	},
	{
		href: "https://dotbrains.dev",
		label: "DotBrains",
	}
];
