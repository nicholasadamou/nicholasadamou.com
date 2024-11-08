"use client";

import { useEffect, useState } from "react";
import FlipNumber from "@/app/components/FlipNumber";
import { getViewsCount } from "@/app/db/queries";
import { incrementViews } from "@/app/db/actions";

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

    // Throttle view increment by checking cookies
    const lastViewTime = parseInt(document.cookie.replace(/(?:^|.*;\s*)lastViewTime\s*=\s*([^;]*).*$|^.*$/, "$1")) || 0;
    const currentTime = Date.now();

    if (currentTime - lastViewTime >= 60000) {
      incrementViews(slug).then(() => {
        document.cookie = `lastViewTime=${currentTime}; Path=/; HttpOnly;`;
      });
    }
  }, [slug]);

  return (
    <span>
      <FlipNumber>{viewCount}</FlipNumber>
      {viewCount === 1 ? " view" : " views"}
    </span>
  );
}
