"use client";

import Image from "next/image";
import Link from "next/link";
import OnebriefLogo from "@/components/ui/OnebriefLogo";
import SocialLinks from "@/components/home/SocialLinks";

interface BioSectionProps {
  light: boolean;
  opacityClass: string;
  linkColorClass: string;
}

export default function BioSection({
  light,
  opacityClass,
  linkColorClass,
}: BioSectionProps) {
  const dashedLink = `border-b border-dashed pb-0.5 transition-opacity hover:opacity-60 ${linkColorClass}`;

  return (
    <div className="animate-fadeInHome1 space-y-3">
      <Image
        src="/images/avatar/nicholas-adamou.jpeg"
        alt="Nicholas Adamou"
        width={80}
        height={80}
        className="rounded-full"
        priority
        fetchPriority="high"
      />
      <h1 className="text-[15px] font-medium tracking-[-0.005em]">
        Hi, I&apos;m Nick, a senior software engineer at{" "}
        <Link
          href="https://www.onebrief.com"
          target="_blank"
          className="inline border-b border-dashed pb-0.5 transition-opacity hover:opacity-60"
        >
          <OnebriefLogo className="inline-block align-baseline" />
        </Link>
        .
      </h1>
      <div className={`space-y-3 leading-relaxed ${opacityClass}`}>
        <p>
          I&apos;m a senior software engineer who&apos;s worked at companies
          including{" "}
          <Link
            href="https://www.ibm.com"
            target="_blank"
            className={dashedLink}
          >
            IBM
          </Link>
          ,{" "}
          <Link
            href="https://www.lockheedmartin.com"
            target="_blank"
            className={dashedLink}
          >
            Lockheed Martin, Space
          </Link>
          ,{" "}
          <Link
            href="https://www.apple.com"
            target="_blank"
            className={dashedLink}
          >
            Apple
          </Link>
          , and{" "}
          <Link
            href="https://www.surfair.com"
            target="_blank"
            className={dashedLink}
          >
            Fly Blackbird (acquired by SurfAir)
          </Link>
          .
        </p>
        <p>
          I hold a{" "}
          <Link
            href="https://www.parchment.com/u/award/6a9ef8b5cd81ba6e9befa8fd094e5a8e"
            target="_blank"
            className={dashedLink}
          >
            Master of Science in Computer Science
          </Link>{" "}
          from{" "}
          <Link
            href="https://www.gatech.edu"
            target="_blank"
            className={dashedLink}
          >
            Georgia Institute of Technology
          </Link>{" "}
          and a{" "}
          <Link
            href="https://drive.google.com/file/d/1ayD1gYOiD6pEq_mVtC64IUQYU1EB5yK2/view?usp=sharing"
            target="_blank"
            className={dashedLink}
          >
            Bachelor of Arts in Computer Science
          </Link>{" "}
          from{" "}
          <Link
            href="https://www.cornellcollege.edu"
            target="_blank"
            className={dashedLink}
          >
            Cornell College
          </Link>
          . I&apos;m passionate about making the world better through software.
        </p>
      </div>
      <SocialLinks light={light} />
      <Link
        href="/about"
        className={`text-sm transition-opacity hover:opacity-60 ${opacityClass}`}
      >
        More about me &rarr;
      </Link>
    </div>
  );
}
