"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";

import { AnimatedSection } from "@/components/common/AnimatedSection";
import {
  FeaturedSection,
  FeaturedItem,
} from "@/components/common/FeaturedSection";
import {
  Clock,
  CheckCircle2,
  Shield,
  Code,
  FileCode,
  Terminal,
  Package,
  Lock,
  Zap,
  Search,
  Folder,
  ArrowRightCircle,
  GitBranch,
  ArrowUpCircle,
} from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";

const DotBrainsLogo: React.FC = () => (
  <div className="flex items-center gap-2">
    <Image
      src="/logos/dotbrains.png"
      alt="DotBrains Logo"
      width={32}
      height={32}
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

const featuredProjects: FeaturedItem[] = [
  {
    name: "set-me-up",
    description:
      "Automate and simplify the setup and maintenance of macOS or Debian Linux development environments.",
    features: [
      {
        icon: <Clock className="mr-5 h-7 w-7" />,
        title: "Cut Setup Time by 99%",
        description:
          "Reduce environment setup time from hours to minutes, allowing you to start being productive almost immediately.",
      },
      {
        icon: <CheckCircle2 className="mr-5 h-7 w-7" />,
        title: "Consistent Setups",
        description:
          "Ensure your development environment is set up the same way every time, reducing configuration errors.",
      },
    ],
    components: [
      {
        icon: <FileCode className="h-6 w-6" />,
        title: "set-me-up blueprint",
        description: "A customizable template for managing your setup.",
      },
      {
        icon: <Terminal className="h-6 w-6" />,
        title: "set-me-up installer",
        description:
          "A universal installer script for Mac or Debian-based machines.",
      },
      {
        icon: <Package className="h-6 w-6" />,
        title: "set-me-up Universal Modules",
        description:
          "A framework for setting up diverse development environments.",
      },
    ],
    url: "https://github.com/dotbrains/set-me-up-docs",
  },
  {
    name: "Guardrails",
    description:
      "A modular, maintainable, and customizable security-compliant DevOps strategy designed for use with 👷🏼 Travis CI.",
    features: [
      {
        icon: <Shield className="mr-5 h-7 w-7" />,
        title: "Enhanced Security",
        description:
          "Integrate security practices directly into your CI/CD pipeline without sacrificing productivity.",
      },
      {
        icon: <Code className="mr-5 h-7 w-7" />,
        title: "Flexible Architecture",
        description:
          "Easily adapt to a wide range of CI/CD solutions and cloud providers, enhancing efficiency and enabling faster releases.",
      },
    ],
    components: [
      {
        icon: <Lock className="h-6 w-6" />,
        title: "AppScan Integration",
        description:
          "Static Application Security Testing (SAST) for comprehensive code analysis.",
      },
      {
        icon: <Zap className="h-6 w-6" />,
        title: "Contrast Security",
        description:
          "Interactive Application Security Testing (IAST) for runtime vulnerability detection.",
      },
      {
        icon: <Search className="h-6 w-6" />,
        title: "Detect Secrets",
        description:
          "Automated scanning for accidental secret exposure in your codebase.",
      },
    ],
    url: "https://github.com/dotbrains/guardrails",
  },
  {
    name: "ghw",
    description:
      "A command-line wrapper tool around the GitHub CLI (gh) to enhance repository cloning into structured directories.",
    features: [
      {
        icon: <Folder className="mr-5 h-7 w-7" />,
        title: "Enhanced Cloning",
        description:
          "Clone repositories into a structured directory format for better organization and management.",
      },
      {
        icon: <ArrowRightCircle className="mr-5 h-6 w-6" />,
        title: "Pass-Through Commands",
        description:
          "Seamlessly pass through any other commands to the official GitHub CLI for a consistent experience.",
      },
    ],
    components: [
      {
        icon: <GitBranch className="h-6 w-6" />,
        title: "Custom Directory Structure",
        description:
          "Clone repositories into folders based on domain, owner, and repository for easy navigation.",
      },
      {
        icon: <Terminal className="h-6 w-6" />,
        title: "Dry Run Feature",
        description:
          "Preview commands before execution, ensuring you understand the effect before proceeding.",
      },
      {
        icon: <ArrowUpCircle className="h-6 w-6" />,
        title: "Automatic Updates",
        description:
          "Easily update the CLI wrapper to the latest release with a simple command.",
      },
    ],
    url: "https://github.com/dotbrains/ghw",
  },
];

export const DotBrainsSection: React.FC = () => (
  <AnimatedSection index={5} ariaLabelledBy="dotbrains-heading">
    <SectionHeader
      id="dotbrains-heading"
      title="DotBrains"
      customContent={<DotBrainsLogo />}
      description="A collective, I started that is dedicated to the craft of software engineering, driven by a mission to enhance lives and solve complex problems through innovative technology."
    />
    <FeaturedSection
      items={featuredProjects}
      title={
        <>
          Featured Projects from <em>DotBrains</em>.
        </>
      }
      description="Explore our flagship projects that revolutionize developer workflows and enhance security practices."
      buttonText={(projectName) => `Learn More About ${projectName}`}
    />
  </AnimatedSection>
);
