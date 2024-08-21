import Image from "next/image";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import Link from "@/app/components/Link";
import {allBlogs} from "contentlayer/generated";

import Avatar from "@/app/components/Avatar";
import Tags from "@/app/components/Tags";
import Mdx from "@/app/blog/components/MdxWrapper";
import FlipNumber from "@/app/components/FlipNumber";
import Me from "@/public/avatar.png";

import {formatDate} from "@/app/_utils/formatDate";
import {getViewsCount} from "@/app/db/queries";
import {incrementViews} from "@/app/db/actions";
import NewsletterSignupForm from "@/app/blog/components/NewsletterSignupForm";

import { getBaseUrl } from "@/app/_utils/getBaseUrl";

const baseUrl = getBaseUrl();

type Props = {
  params: {
    slug: string;
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const blog = allBlogs.find((blog: { slug: string }) => blog.slug === params.slug);

	if (!blog) {
		notFound();
	}

	const { title, date: publishedTime, summary: description, image, slug } = blog;

	const ogImage = image
		? `${baseUrl}/${image}`
		: `${baseUrl}/api/og?title=${encodeURIComponent(title)}`;

	return {
		metadataBase: new URL(baseUrl),
		title: `${title} | Nicholas Adamou`,
		description,
		openGraph: {
			title: `${title} | Nicholas Adamou`,
			description,
			type: "article",
			publishedTime,
			url: `${baseUrl}/blog/${slug}`,
			images: [{url: ogImage, alt: title}],
		},
	};
}

export default async function Blog({ params }: Readonly<{ params: any }>) {
  const blog = allBlogs.find((blog: { slug: any; }) => blog.slug === params.slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-20">
      <article>
        <div className="flex flex-col gap-8">
          <div className="flex max-w-xl flex-col gap-4 text-pretty">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-primary">
              {blog.title}
            </h1>
            <p className="text-secondary">{blog.summary}</p>
          </div>
          <div className="flex max-w-none items-center gap-4">
            <Avatar src={Me} initials="br" size="sm" />
            <div className="leading-tight">
              <p>Nicholas Adamou</p>
              <p className="text-secondary">
                <time dateTime={blog.date}>{formatDate(blog.date)}</time>
                {blog.updatedAt
                  ? `(Updated ${formatDate(blog.updatedAt)})`
                  : ""}
                {" · "}

                <Views slug={blog.slug} />
              </p>
            </div>
          </div>
        </div>
		  {blog.image && (
			  <>
				  <div className="h-8" />
				  <div className="relative h-[350px] overflow-hidden">
					  <Image
						  src={blog.image}
						  alt={`${blog.title} blog image`}
						  fill
						  className="rounded-lg object-cover"
						  priority
						  sizes="(max-width: 768px) 100vw, (min-width: 768px) 50vw"
					  />
				  </div>
			  </>
		  )}
        <div className="h-16" />
        <div className="prose prose-neutral text-pretty">
          <Mdx code={blog.body.code} />
        </div>
      </article>

      <div className="flex flex-col gap-20">
        <div className="flex flex-col gap-6">
          <h2>Tags</h2>
          <Tags tags={blog.tags} />
        </div>
        <div className="flex flex-col gap-6">
          <h2>Contact</h2>
          <p className="max-w-md text-pretty text-secondary">
            Questions or need more details? Ping me on any of my social media <Link href="/about" underline>links</Link>.
          </p>
        </div>
        <NewsletterSignupForm contained={false} />
      </div>
    </div>
  );
}

async function Views({ slug }: Readonly<{ slug: string }>) {
  let blogViews = await getViewsCount();
  const viewsForBlog = blogViews.find((view) => view.slug === slug);

  await incrementViews(slug);

  return (
    <span>
      <FlipNumber>{viewsForBlog?.count ?? 0}</FlipNumber>
      {viewsForBlog?.count === 1 ? " view" : " views"}
    </span>
  );
}
