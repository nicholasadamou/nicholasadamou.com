import React from "react";
import Image from "next/image";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import { FeaturedSection } from "@/app/projects/components/FeaturedSection";

export const DotBrainsSection: React.FC = () => (
  <div className="animate-in" style={{ "--index": 5 } as React.CSSProperties}>
    <h2 className="mb-2 mt-4 text-2xl font-bold leading-tight tracking-tight text-primary">
      <div className="flex items-center gap-2">
        <Image
          src="/logos/dotbrains.png"
          alt="DotBrains Logo"
          width={50}
          height={50}
        />
        <a
          href="https://dotbrains.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="font-black text-primary underline"
        >
          DotBrains
        </a>
        <ArrowUpRightIcon className="h-4 w-4 text-tertiary" />
      </div>
      <p className="mb-3 mt-1 text-secondary">
        A collective dedicated to the craft of software engineering, driven by a
        mission to enhance lives and solve complex problems through innovative
        technology.
      </p>
    </h2>
    <FeaturedSection />
  </div>
);
