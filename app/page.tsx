import { allNotes, allProjects } from "contentlayer/generated";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import Image from "next/image";

import Link from "@/app/components/Link";
import PostList from "@/app/notes/components/PostList";
import ProjectList from "@/app/projects/components/ProjectList";
import React from "react";
import { FaThumbtack } from "react-icons/fa";

type SocialLink = {
	href: string;
	label: string;
};

type SocialLinksProps = {
	links: SocialLink[];
};

function SocialLinks({ links }: SocialLinksProps) {
	return (
		<ul
			className="animated-list flex snap-x snap-mandatory flex-nowrap gap-2 sm:gap-3 overflow-x-scroll text-sm md:overflow-auto"
			style={{ "--index": 2 } as React.CSSProperties}
		>
			{links.map((link) => (
				<li
					key={link.href}
					className="col-span-1 min-w-fit snap-start transition-opacity"
				>
					<Link
						href={link.href}
						className="flex w-fit items-center rounded-full bg-secondary px-3 py-1 no-underline transition-colors hover:bg-tertiary"
					>
						{link.label}
						<ArrowUpRightIcon className="h-4 w-4 text-tertiary ml-1" />
					</Link>
				</li>
			))}
		</ul>
	);
}

const socalLinks: SocialLink[] = [
	{
		href: "https://drive.google.com/file/d/1Es_mfIdiZbhjLOTln-KFRQnyPLLzG8kU/view",
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

export default function Home() {
  const notes = allNotes
    .sort(
      (
        a: { date: string | number | Date },
        b: {
          date: string | number | Date;
        },
      ) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    // 3 most recent
    .filter((_: any, i: number) => i < 3);

  const projects = allProjects.sort(
    (
      a: { date: string | number | Date },
      b: {
        date: string | number | Date;
      },
    ) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="mx-auto flex max-w-[700px] flex-col gap-16 px-4 md:gap-24">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col-reverse md:flex-row">
          <div className="mt-5 space-y-4 md:mr-10 md:mt-0">
            <h1 className="animate-in text-3xl font-semibold tracking-tight text-primary">
              Hey, I&apos;m Nicholas Adamou
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
            <SocialLinks
							links={socalLinks}
						/>
          </div>
          <Image
            src="/nicholas-adamou.jpeg"
            width={200}
            height={200}
            alt="Nicholas Adamou"
            priority
            style={{ "--index": 2 } as React.CSSProperties}
            className="flex-1 animate-in rounded-2xl grayscale"
          />
        </div>
      </div>

      <div
        className="flex animate-in flex-col gap-8"
        style={{ "--index": 4 } as React.CSSProperties}
      >
        <p className="flex items-center gap-2 tracking-tight text-secondary">
          <FaThumbtack />
          Pinned Projects
        </p>
        <ProjectList projects={projects} />
      </div>

      <div
        className="flex animate-in flex-col gap-8"
        style={{ "--index": 4 } as React.CSSProperties}
      >
        <div className="space-y-4">
          <Link
            className="group flex items-center gap-2 tracking-tight text-secondary"
            href="/notes"
          >
            Recent Notes
            <ArrowUpRightIcon className="h-5 w-5 text-tertiary transition-all group-hover:text-primary" />
          </Link>
          <p className="max-w-lg text-tertiary">
            I occasionally share valuable insights on programming, productivity,
            and a variety of other engaging topics. My notes features a range of
            articles that delve into the latest trends, tips, and best practices
            in these areas. I invite you to explore my latest notes and discover
            the ideas and strategies that can help you enhance your skills and
            boost your productivity.
          </p>
        </div>
        <PostList posts={notes} />
      </div>
    </div>
  );
}
