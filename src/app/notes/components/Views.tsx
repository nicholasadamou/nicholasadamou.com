"use client";

import FlipNumber from "@/components/common/FlipNumber";
import { useViews } from "../hooks/useViews";

type ViewsProps = {
  slug: string;
};

export default function Views({ slug }: ViewsProps) {
  const viewCount = useViews({ slug });

  return (
    <span>
      <FlipNumber>{viewCount}</FlipNumber>
      {viewCount === 1 ? " view" : " views"}
    </span>
  );
}
