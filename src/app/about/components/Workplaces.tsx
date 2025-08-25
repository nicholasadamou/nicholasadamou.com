"use client";
import Image, { StaticImageData } from "next/image"
import clsx from "clsx"
import Link from "@/components/common/Link"

type Workplace = {
	title: string
	company: string
	imageSrc: string | StaticImageData
	date?: string
	link?: string
	contract?: boolean
}

function Workplace({ title, company, imageSrc, date, link, contract = false }: Workplace) {
	const content = (
		<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2 sm:gap-4">
			<div className="flex items-center gap-2">
				<Image
					src={imageSrc}
					alt={company}
					width={48}
					height={48}
					className="rounded-full flex-shrink-0"
				/>
				<div className="flex flex-col">
					<p className={clsx("font-medium", link && "external-arrow")}>{title}</p>
					<p className="text-secondary text-sm">{company}{contract && ' (contract)'}</p>
				</div>
			</div>
			{date && <time className="text-secondary text-sm mt-1 sm:mt-0">{date}</time>}
		</div>
	)

	return (
		<li className="transition-opacity py-3" key={`${company}-${title}`}>
			{link ? (
				<Link
					href={link}
					className="block w-full no-underline hover:bg-tertiary dark:hover:bg-secondary rounded-lg p-3 -m-2 transition-colors"
				>
					{content}
				</Link>
			) : (
				<div className="p-3 -m-3">{content}</div>
			)}
		</li>
	)
}

export default function Workplaces({ items }: { items: Workplace[] }) {
	return (
		<ul className="flex flex-col animated-list">
			{items.map((workplace, index) => (
				<Workplace key={`${workplace.company}-${workplace.title}-${index}`} {...workplace} />
			))}
		</ul>
	)
}
