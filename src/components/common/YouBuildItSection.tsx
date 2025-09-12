"use client";

import React from "react";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import {
  Terminal,
  Database,
  Package,
  FileText,
  Zap,
  Clock,
  CheckCircle2,
  Shield,
  Cpu,
  FileCode,
  GitBranch,
} from "lucide-react";

import { AnimatedSection } from "@/components/common/AnimatedSection";
import { SectionHeader } from "@/components/common/SectionHeader";
import {
  FeaturedSection,
  FeaturedItem,
} from "@/components/common/FeaturedSection";
import { TestimonialsSection } from "@/components/common/TestimonialsSection";

const YouBuildItLogo: React.FC = () => (
  <div className="flex items-center gap-2">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8"
    >
      <rect width="24" height="24" rx="6" fill="#2fbc77" />
      <path
        d="M6 8L10 12L6 16"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 16H18"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <a
      href="https://youbuildit.dev"
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary font-black underline"
    >
      You Build It
    </a>
    <ArrowUpRightIcon className="text-tertiary h-4 w-4" />
  </div>
);

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  challenge: string;
  rating: number;
}

// Testimonials data
const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Alex Chen",
    role: "Software Engineer",
    company: "TechCorp",
    quote:
      "Building my own cat tool taught me so much about Unix philosophy and file I/O. The hands-on approach made complex concepts click instantly.",
    challenge: "Build Your Own cat",
    rating: 5,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    role: "Full Stack Developer",
    company: "StartupXYZ",
    quote:
      "The Docker challenge was mind-blowing! I finally understand how containerization works under the hood. Best learning experience I've had.",
    challenge: "Build Your Own Docker",
    rating: 5,
  },
  {
    id: "3",
    name: "Marcus Rodriguez",
    role: "Backend Engineer",
    company: "DataFlow Inc",
    quote:
      "Creating a database from scratch gave me insights that years of using existing ones never could. The B-tree implementation was particularly enlightening.",
    challenge: "Build Your Own Database",
    rating: 5,
  },
  {
    id: "4",
    name: "Emily Wu",
    role: "DevOps Engineer",
    company: "CloudNative",
    quote:
      "The grep challenge improved my regex skills tremendously. Now I can write complex pattern matching with confidence.",
    challenge: "Build Your Own grep",
    rating: 5,
  },
  {
    id: "5",
    name: "Jordan Kim",
    role: "Systems Programmer",
    company: "InfraCore",
    quote:
      "These challenges bridge the gap between theory and practice perfectly. I now understand how the tools I use daily actually work.",
    challenge: "Build Your Own Shell",
    rating: 5,
  },
];

// Featured challenges data
const featuredChallenges: FeaturedItem[] = [
  {
    name: "Build Your Own cat",
    description:
      "Create a command-line tool that displays file contents with various formatting options. Learn about file I/O, text processing, and command-line arguments.",
    features: [
      {
        icon: <Clock className="mr-5 h-7 w-7" />,
        title: "Quick to Master",
        description:
          "Perfect starting point for beginners. Complete this challenge in 2-3 hours and gain confidence in systems programming.",
      },
      {
        icon: <CheckCircle2 className="mr-5 h-7 w-7" />,
        title: "Unix Philosophy",
        description:
          "Learn the fundamental principles that make Unix tools so powerful and composable.",
      },
    ],
    components: [
      {
        icon: <FileCode className="h-6 w-6" />,
        title: "Command-Line Parsing",
        description:
          "Master argument parsing and option handling for professional CLI tools.",
      },
      {
        icon: <FileText className="h-6 w-6" />,
        title: "File I/O Operations",
        description:
          "Learn efficient file reading, error handling, and cross-platform compatibility.",
      },
      {
        icon: <Terminal className="h-6 w-6" />,
        title: "Text Processing",
        description:
          "Implement line numbering, formatting, and special character handling.",
      },
    ],
    url: "https://youbuildit.dev/challenge/build-your-own-cat",
  },
  {
    name: "Build Your Own Docker",
    description:
      "Implement a basic container runtime from scratch. Explore containerization concepts, Linux namespaces, cgroups, and system calls.",
    features: [
      {
        icon: <Shield className="mr-5 h-7 w-7" />,
        title: "System-Level Learning",
        description:
          "Deep dive into Linux internals and understand how modern containerization actually works under the hood.",
      },
      {
        icon: <Cpu className="mr-5 h-7 w-7" />,
        title: "Resource Management",
        description:
          "Master cgroups, namespaces, and process isolation techniques used in production systems.",
      },
    ],
    components: [
      {
        icon: <Package className="h-6 w-6" />,
        title: "Container Isolation",
        description:
          "Implement PID, mount, UTS, and network namespaces for complete process isolation.",
      },
      {
        icon: <Cpu className="h-6 w-6" />,
        title: "Resource Limits",
        description:
          "Use cgroups to control CPU, memory, and I/O usage of containerized processes.",
      },
      {
        icon: <Terminal className="h-6 w-6" />,
        title: "System Calls",
        description:
          "Work directly with Linux system calls for maximum performance and control.",
      },
    ],
    url: "https://youbuildit.dev/challenge/build-your-own-docker",
  },
  {
    name: "Build Your Own Database",
    description:
      "Create a relational database with SQL parsing, B-tree indexes, transactions, and persistence. Learn database internals and storage engines.",
    features: [
      {
        icon: <Database className="mr-5 h-7 w-7" />,
        title: "Production Concepts",
        description:
          "Implement ACID transactions, query optimization, and storage engines used in real databases.",
      },
      {
        icon: <Zap className="mr-5 h-7 w-7" />,
        title: "Performance Focus",
        description:
          "Learn about B-trees, indexing strategies, and query optimization for high-performance data access.",
      },
    ],
    components: [
      {
        icon: <Database className="h-6 w-6" />,
        title: "SQL Parser",
        description:
          "Build a complete SQL parser and query planner from scratch.",
      },
      {
        icon: <GitBranch className="h-6 w-6" />,
        title: "B-Tree Implementation",
        description:
          "Implement efficient B-tree indexes for fast data retrieval and updates.",
      },
      {
        icon: <Shield className="h-6 w-6" />,
        title: "ACID Transactions",
        description:
          "Ensure data consistency with proper transaction management and recovery.",
      },
    ],
    url: "https://youbuildit.dev/challenge/build-your-own-database",
  },
];

export const YouBuildItSection: React.FC = () => (
  <AnimatedSection index={6} ariaLabelledBy="youbuildit-heading">
    <SectionHeader
      id="youbuildit-heading"
      title="You Build It"
      customContent={<YouBuildItLogo />}
      description="Learn software engineering by building real applications through hands-on coding challenges that build real tools and systems."
    />
    <FeaturedSection
      items={featuredChallenges}
      title={
        <>
          Featured Challenges from <em>You Build It</em>.
        </>
      }
      description="Master software engineering through hands-on coding challenges that build real applications."
      buttonText={(challengeName) => `Start ${challengeName} Challenge`}
      componentsTitle="Key Learning Areas"
    />
    <TestimonialsSection testimonials={testimonials} />
  </AnimatedSection>
);
