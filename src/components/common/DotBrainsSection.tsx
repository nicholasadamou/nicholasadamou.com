"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import { FeaturedSection } from "@/app/projects/components/FeaturedSection";

export const DotBrainsSection: React.FC = () => (
  <div className="animate-in" style={{ "--index": 5 } as React.CSSProperties}>
    <h2 className="text-primary text-md mb-2 mt-4 font-bold leading-tight tracking-tight">
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
          className="text-primary font-black underline"
        >
          DotBrains
        </a>
        <ArrowUpRightIcon className="text-tertiary h-4 w-4" />
      </div>
      <p className="text-secondary mb-3 mt-1">
        A collective dedicated to the craft of software engineering, driven by a
        mission to enhance lives and solve complex problems through innovative
        technology.
      </p>
    </h2>
    <FeaturedSection />
  </div>
);
