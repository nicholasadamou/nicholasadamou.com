"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";

import { AnimatedSection } from "@/components/common/AnimatedSection";
import { FeaturedSection } from "@/app/projects/components/FeaturedSection";
import { SectionHeader } from "@/components/common/SectionHeader";

const DotBrainsLogo: React.FC = () => (
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
);

export const DotBrainsSection: React.FC = () => (
  <AnimatedSection index={5} ariaLabelledBy="dotbrains-heading">
    <SectionHeader
      id="dotbrains-heading"
      title="DotBrains"
      customContent={<DotBrainsLogo />}
      description="A collective, I started that is dedicated to the craft of software engineering, driven by a mission to enhance lives and solve complex problems through innovative technology."
    />
    <FeaturedSection />
  </AnimatedSection>
);
