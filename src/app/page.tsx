import { allNotes, allProjects } from "@/lib/contentlayer-data";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import ThemeAwareGumroadLogo from "@/components/common/ThemeAwareGumroadLogo";

import Link from "@/components/common/Link";
import PostList from "./notes/components/PostList";
import PinnedProjectList from "@/components/features/projects/PinnedProjectList";
import React from "react";
import SocialLinks, { socialLinks } from "@/components/common/SocialLinks";
import { PinIcon } from "lucide-react";
import ProductList from "@/components/common/ProductListClient";
import SparkleText from "@/components/common/SparkleText";
import FeaturedGallery from "@/components/features/gallery/FeaturedGallery";
import { getOptimizedImageProps } from "@/lib/performance";
import { DotBrainsSection } from "@/components/common/DotBrainsSection";

export default function Home() {
  const projects = allProjects.sort(
    (
      a: { date: string | number | Date },
      b: {
        date: string | number | Date;
      }
    ) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 px-4">
      <header className="flex flex-col gap-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          <div className="order-2 space-y-6 lg:order-1 lg:col-span-2">
            <div className="space-y-4">
              <h1 className="animate-in text-primary text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
                Hey, I&apos;m{" "}
                <SparkleText className="font-bold">Nick Adamou</SparkleText>
              </h1>
              <p
                className="animate-in text-secondary text-lg leading-relaxed"
                style={{ "--index": 1 } as React.CSSProperties}
              >
                I am a full-stack software engineer with a passion for
                leveraging technology to create positive change in the world. My
                mission is to harness the power of code to develop innovative
                solutions that address real-world challenges and improve
                people&apos;s lives. I believe in building software that not
                only functions beautifully but also makes a meaningful impact on
                communities and individuals.
              </p>
            </div>
            <div
              className="animate-in"
              style={{ "--index": 2 } as React.CSSProperties}
            >
              <SocialLinks links={socialLinks} />
            </div>
          </div>
          <div className="justify-left order-1 flex lg:order-2 lg:col-span-1 lg:justify-end">
            <div className="group relative">
              <div className="animate-slow-pulse absolute -inset-2 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 opacity-50 blur-md transition-all duration-1000"></div>
              <Image
                {...getOptimizedImageProps(
                  "/nicholas-adamou.jpeg",
                  "Nicholas Adamou - Full Stack Software Engineer and technology enthusiast",
                  {
                    priority: true,
                    quality: "hero",
                    sizes: "sm",
                    width: 280,
                    height: 320,
                  }
                )}
                alt="Nicholas Adamou - Full Stack Software Engineer and technology enthusiast"
                style={{ "--index": 3 } as React.CSSProperties}
                className="animate-in relative h-80 w-64 rounded-3xl object-cover shadow-2xl grayscale-[0.5] transition-all duration-300 lg:h-80 lg:w-64"
              />
            </div>
          </div>
        </div>
      </header>

      <section
        className="animate-in flex flex-col gap-4"
        style={{ "--index": 4 } as React.CSSProperties}
        aria-labelledby="projects-heading"
      >
        <h2 id="projects-heading">
          <Link
            className="text-primary text-md group flex items-center gap-2 font-semibold tracking-tight"
            href="/projects"
          >
            <PinIcon className="text-tertiary h-5 w-5" />
            Pinned Projects
            <ArrowUpRightIcon className="text-tertiary group-hover:text-primary h-5 w-5 transition-all" />
          </Link>
        </h2>
        <p className="text-secondary mt-[-8px] max-w-3xl">
          I love building projects, whether they are simple websites or more
          complex web apps. Below are a few of my favorites.
        </p>
        <PinnedProjectList projects={projects} />
      </section>

      <DotBrainsSection />

      <section
        className="animate-in flex flex-col gap-4"
        style={{ "--index": 6 } as React.CSSProperties}
        aria-labelledby="products-heading"
      >
        <h2 id="products-heading">
          <Link
            className="text-primary text-md group flex items-center gap-2 font-semibold tracking-tight no-underline"
            href="https://nicholasadamou.gumroad.com"
          >
            <ThemeAwareGumroadLogo />
            Products
            <ArrowUpRightIcon className="text-tertiary group-hover:text-primary h-5 w-5 transition-all" />
          </Link>
        </h2>
        <ProductList />
      </section>

      <section
        className="animate-in flex flex-col gap-4"
        style={{ "--index": 7 } as React.CSSProperties}
        aria-labelledby="gallery-heading"
      >
        <h2 id="gallery-heading">
          <Link
            className="text-primary text-md group flex items-center gap-2 font-semibold tracking-tight"
            href="/gallery"
          >
            Recent Photos
            <ArrowUpRightIcon className="text-tertiary group-hover:text-primary h-5 w-5 transition-all" />
          </Link>
        </h2>
        <p className="text-secondary mt-[-8px] max-w-3xl">
          A few recent shots from my VSCO. See more on the full gallery page.
        </p>
        <FeaturedGallery />
      </section>

      <section
        className="animate-in mb-5 flex flex-col gap-4"
        style={{ "--index": 8 } as React.CSSProperties}
        aria-labelledby="notes-heading"
      >
        <h2 id="notes-heading">
          <Link
            className="text-primary text-md group flex items-center gap-2 font-semibold tracking-tight"
            href="/notes"
          >
            Recent Notes
            <ArrowUpRightIcon className="text-tertiary group-hover:text-primary h-5 w-5 transition-all" />
          </Link>
        </h2>
        <p className="text-secondary mt-[-8px] max-w-3xl">
          I occasionally share valuable insights on programming, productivity,
          and a variety of other engaging topics. My notes features a range of
          articles that delve into the latest trends, tips, and best practices
          in these areas. I invite you to explore my latest notes and discover
          the ideas and strategies that can help you enhance your skills and
          boost your productivity.
        </p>
        <PostList initialPosts={allNotes} topNPosts={3} mostRecentFirst noPin />
      </section>
    </div>
  );
}
