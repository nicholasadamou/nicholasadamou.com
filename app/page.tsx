import { allNotes, allProjects } from "@/lib/contentlayer-data";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import Image from "next/image";

import Link from "@/app/components/Link";
import PostList from "@/app/notes/components/PostList";
import PinnedProjectList from "@/app/components/PinnedProjectList";
import React from "react";
import SocialLinks, { socialLinks } from "@/app/components/SocialLinks";
import { PinIcon } from "lucide-react";
import ProductList from "@/app/components/ProductList";
import SparkleText from "@/app/components/SparkleText";

export default function Home() {
	const projects = allProjects.sort(
    (
      a: { date: string | number | Date },
      b: {
        date: string | number | Date;
      },
    ) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
		<div className="mx-auto flex max-w-[700px] flex-col gap-12 px-4">
			<div className="flex flex-col gap-8">
				<div className="flex flex-col-reverse sm:flex-row gap-4">
					<div className="space-y-4">
						<h1 className="animate-in text-3xl font-semibold tracking-tight text-primary">
							Hey, I&apos;m Nick Adamou
						</h1>
						<p
							className="max-w-lg animate-in text-secondary"
							style={{ "--index": 1 } as React.CSSProperties}
						>
							I am a full-stack software engineer with a passion for leveraging
							technology to create positive change in the world. My mission is
							to harness the power of code to develop innovative solutions that
							address real-world challenges and improve people&apos;s lives.
						</p>
						<SocialLinks links={socialLinks} />
					</div>
					<Image
						src="/nicholas-adamou.jpeg"
						width={200}
						height={100}
						alt="Nicholas Adamou"
						priority
						style={{ "--index": 2 } as React.CSSProperties}
						className="flex-1 animate-in rounded-2xl grayscale-[0.25]"
					/>
				</div>
			</div>

			<div
				className="flex animate-in flex-col gap-4"
				style={{ "--index": 4 } as React.CSSProperties}
			>
				<Link
					className="group flex items-center gap-2 tracking-tight text-primary"
					href="/projects"
				>
					<PinIcon className="h-5 w-5 text-tertiary" />
					<SparkleText>Pinned Projects</SparkleText>
					<ArrowUpRightIcon className="h-5 w-5 text-tertiary transition-all group-hover:text-primary" />
				</Link>
				<p className="mt-[-8px] max-w-xl text-secondary">
					I love building projects, whether they are simple websites or more complex web apps. Below are a few of my favorites.
				</p>
					<PinnedProjectList projects={projects} />
			</div>

			<div
				className="flex animate-in flex-col gap-4"
				style={{ "--index": 4 } as React.CSSProperties}
			>
				<Link
					className="group flex items-center gap-2 tracking-tight text-primary no-underline"
					href="https://nicholasadamou.gumroad.com"
				>
					<Image
						src="/logos/gumroad.svg"
						alt="Gumroad"
						width={83}
						height={10}
						className="dark:invert"
					/>
					Products
					<ArrowUpRightIcon className="h-5 w-5 text-tertiary transition-all group-hover:text-primary" />
				</Link>
				<ProductList />
			</div>

			<div
				className="flex animate-in flex-col gap-4 mb-5"
				style={{ "--index": 4 } as React.CSSProperties}
			>
				<Link
					className="group flex items-center gap-2 tracking-tight text-primary"
					href="/notes"
				>
					Recent Notes
					<ArrowUpRightIcon className="h-5 w-5 text-tertiary transition-all group-hover:text-primary" />
				</Link>
				<p className="mt-[-8px] max-w-xl text-secondary">
					I occasionally share valuable insights on programming, productivity,
					and a variety of other engaging topics. My notes features a range of
					articles that delve into the latest trends, tips, and best practices
					in these areas. I invite you to explore my latest notes and discover
					the ideas and strategies that can help you enhance your skills and
					boost your productivity.
				</p>
				<PostList
					initialPosts={allNotes}
					topNPosts={3}
					mostRecentFirst
					noPin
				/>
			</div>
		</div>
	);
}
