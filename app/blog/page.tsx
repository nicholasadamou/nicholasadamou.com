import { Metadata } from "next";
import { allBlogs } from "contentlayer/generated";
import PostList from "@/app/blog/components/PostList";
import React from "react";

import { getBaseUrl } from "@/app/_utils/getBaseUrl";

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: "Blog | Nicholas Adamou",
  description:
    "I write about programming, design, and occasionally life updates!",
  openGraph: {
    title: "Blog | Nicholas Adamou",
    description:
      "I write about programming, design, and occasionally life updates!",
    type: "website",
    url: `https://${baseUrl}/blog/Blog`,
    images: [{ url: `https://${baseUrl}/api/og?title=Blog`, alt: "Blog" }],
  },
};

export default function BlogPage() {
  const blogs = allBlogs.sort(
    (
      a: { date: string | number | Date },
      b: {
        date: string | number | Date;
      },
    ) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="animate-in text-3xl font-bold tracking-tight">Blog</h1>
          <p
            className="mt-5 animate-in text-secondary"
            style={{ "--index": 1 } as React.CSSProperties}
          >
            While I don’t write on a regular basis, I find great value in
            sharing my insights and learnings whenever the opportunity arises.
            Each post reflects my thoughts and experiences, and I hope they
            resonate with others. To date, I’ve published {blogs.length} posts,
            and I look forward to contributing more in the future.
          </p>
        </div>
      </div>
      <div
        className="animate-in"
        style={{ "--index": 2 } as React.CSSProperties}
      >
        <PostList posts={blogs} />
      </div>
      <div
        className="animate-in"
        style={{ "--index": 3 } as React.CSSProperties}
      ></div>
    </div>
  );
}
