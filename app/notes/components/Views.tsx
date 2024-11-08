"use client";

import { useEffect, useState } from "react";
import FlipNumber from "@/app/components/FlipNumber";
import { getViewsCount } from "@/app/db/queries";

type ViewsProps = {
	slug: string;
};

export default function Views({ slug }: ViewsProps) {
	const [viewCount, setViewCount] = useState<number>(0);

	useEffect(() => {
		const fetchViews = async () => {
			const views = await getViewsCount();
			const noteViews = views.find((view) => view.slug === slug);
			setViewCount(noteViews?.count ?? 0);
		};

		fetchViews();

		const incrementViews = async () => {
			try {
				const response = await fetch(`/api/notes/${slug}/views`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
				});

				if (!response.ok) {
					console.error("Failed to increment views");
				}
			} catch (error) {
				console.error("Error incrementing views:", error);
			}
		};

		incrementViews();
	}, [slug]);

	return (
		<span>
      <FlipNumber>{viewCount}</FlipNumber>
			{viewCount === 1 ? " view" : " views"}
    </span>
	);
}
