import { useState, useEffect, useRef } from "react";

type UseViewsProps = {
	slug: string;
};

export function useViews({ slug }: UseViewsProps) {
	const [viewCount, setViewCount] = useState<number>(0);
	const hasFetched = useRef(false);

	useEffect(() => {
		if (!hasFetched.current) {
			const fetchViews = async () => {
				try {
					const response = await fetch(`/api/notes/${slug}/views`, {
						method: "GET",
						headers: { "Content-Type": "application/json" },
					});

					if (response.ok) {
						const data = await response.json();
						setViewCount(data.count);
					} else {
						console.error("Failed to fetch views");
					}
				} catch (error) {
					console.error("Error fetching views:", error);
				}
			};

			fetchViews();

			const incrementViews = async () => {
				try {
					const response = await fetch(`/api/notes/${slug}/views`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
					});

					if (response.ok) {
						setViewCount((prevCount) => prevCount + 1);
					} else {
						console.error("Failed to increment views");
					}
				} catch (error) {
					console.error("Error incrementing views:", error);
				}
			};

			incrementViews();
			hasFetched.current = true;
		}
	}, [slug]);

	return viewCount;
}
