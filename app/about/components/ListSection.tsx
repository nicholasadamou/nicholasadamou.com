import React from "react";

import Link from "@/app/components/Link";
import Section from "@/app/components/Section";
import { ListItem } from "@/app/about/types/ListItem";

type ListSectionProps = {
	heading: string;
	items: ListItem[];
};

const ListSection: React.FC<ListSectionProps> = ({ heading, items }) => (
	<Section heading={heading} headingAlignment="left">
		<ul className="animated-list grid flex-grow grid-cols-1 gap-3 md:grid-cols-2">
			{items.map((item) => (
				<li className="col-span-1 transition-opacity" key={item.label}>
					{item.href ? (
						<Link
							href={item.href}
							className="inline-grid w-full rounded-lg bg-secondary p-4 no-underline transition-opacity"
						>
							<div className="flex items-center gap-3">
								<span className="text-xl">{item.icon}</span>
								{item.label}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									className="ml-auto h-5 w-5 text-secondary"
								>
									<path
										fillRule="evenodd"
										d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						</Link>
					) : item.component && React.isValidElement(item.component) ? (
							React.cloneElement(item.component as React.ReactElement, { icon: item.icon, label: item.label })
					) : null}
				</li>
			))}
		</ul>
	</Section>
);

export default ListSection;
