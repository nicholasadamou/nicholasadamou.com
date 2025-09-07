import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/components/ui/link";
import { Card } from "./Card";
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  Zap,
  FileCode,
  Terminal,
  Package,
  Lock,
  Code,
  Search,
  Shield,
  Folder,
  ArrowRightCircle,
  GitBranch,
  ArrowUpCircle,
} from "lucide-react";

interface ProjectFeature {
  icon: React.JSX.Element;
  title: string;
  description: string;
}

interface ProjectComponent {
  icon: React.JSX.Element;
  title: string;
  description: string;
}

interface FeaturedProject {
  name: string;
  description: string;
  features: ProjectFeature[];
  components: ProjectComponent[];
  url: string;
}

const ProjectTabs: React.FC<{
  projects: FeaturedProject[];
  activeTab: string;
  onTabClick: (name: string) => void;
}> = ({ projects, activeTab, onTabClick }) => (
  <div className="mb-4 flex flex-wrap justify-start gap-2">
    {projects.map((project) => (
      <motion.button
        key={project.name}
        {...({
          className: `px-4 py-2 border rounded-2xl text-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${
            activeTab === project.name
              ? "bg-black text-white dark:bg-white dark:text-black border-none"
              : "bg-tertiary text-primary hover:bg-secondary border-secondary"
          }`,
        } as any)}
        onClick={() => onTabClick(project.name)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-pressed={activeTab === project.name}
      >
        {project.name}
      </motion.button>
    ))}
  </div>
);

const ProjectDetails: React.FC<{ project: FeaturedProject }> = ({
  project,
}) => (
  <motion.div
    key={project.name}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
  >
    <div>
      <h3 className="text-primary mb-6 text-xl font-bold">{project.name}</h3>
      <p className="text-secondary mb-6 text-lg">{project.description}</p>
      <div className="mb-6 grid place-content-center gap-8 md:grid-cols-2">
        {project.features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          >
            <Card
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          </motion.div>
        ))}
      </div>
      <motion.div
        {...({
          className: "space-y-6",
        } as any)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h4 className="text-secondary text-lg font-bold">Key Components</h4>
        <ul className="text-md text-secondary list-none space-y-4">
          {project.components.map((component, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0">{component.icon}</div>
              <div>
                <h3 className="text-primary text-lg font-bold">
                  {component.title}
                </h3>
                <p className="mt-1 text-base">{component.description}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-8 text-center">
          <Link
            asChild
            className="mt-5 rounded-md bg-[#111] px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-opacity-90 dark:bg-white dark:text-black dark:hover:bg-opacity-90"
          >
            <a href={project.url} className="flex items-center" target="_blank">
              Learn More About {project.name}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Link>
        </div>
      </motion.div>
    </div>
  </motion.div>
);

export function FeaturedSection(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<string>("set-me-up");

  const featuredProjects: FeaturedProject[] = useMemo<FeaturedProject[]>(
    () => [
      {
        name: "set-me-up",
        description:
          "Automate and simplify the setup and maintenance of macOS or Debian Linux development environments.",
        features: [
          {
            icon: <Clock className="text-primary mr-5 h-7 w-7" />,
            title: "Cut Setup Time by 99%",
            description:
              "Reduce environment setup time from hours to minutes, allowing you to start being productive almost immediately.",
          },
          {
            icon: <CheckCircle2 className="text-primary mr-5 h-7 w-7" />,
            title: "Consistent Setups",
            description:
              "Ensure your development environment is set up the same way every time, reducing configuration errors.",
          },
        ],
        components: [
          {
            icon: <FileCode className="text-primary h-6 w-6" />,
            title: "set-me-up blueprint",
            description: "A customizable template for managing your setup.",
          },
          {
            icon: <Terminal className="text-primary h-6 w-6" />,
            title: "set-me-up installer",
            description:
              "A universal installer script for Mac or Debian-based machines.",
          },
          {
            icon: <Package className="text-primary h-6 w-6" />,
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
            icon: <Shield className="text-primary mr-5 h-7 w-7" />,
            title: "Enhanced Security",
            description:
              "Integrate security practices directly into your CI/CD pipeline without sacrificing productivity.",
          },
          {
            icon: <Code className="text-primary mr-5 h-7 w-7" />,
            title: "Flexible Architecture",
            description:
              "Easily adapt to a wide range of CI/CD solutions and cloud providers, enhancing efficiency and enabling faster releases.",
          },
        ],
        components: [
          {
            icon: <Lock className="text-primary h-6 w-6" />,
            title: "AppScan Integration",
            description:
              "Static Application Security Testing (SAST) for comprehensive code analysis.",
          },
          {
            icon: <Zap className="text-primary h-6 w-6" />,
            title: "Contrast Security",
            description:
              "Interactive Application Security Testing (IAST) for runtime vulnerability detection.",
          },
          {
            icon: <Search className="text-primary h-6 w-6" />,
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
            icon: <Folder className="text-primary mr-5 h-7 w-7" />,
            title: "Enhanced Cloning",
            description:
              "Clone repositories into a structured directory format for better organization and management.",
          },
          {
            icon: <ArrowRightCircle className="text-primary mr-5 h-6 w-6" />,
            title: "Pass-Through Commands",
            description:
              "Seamlessly pass through any other commands to the official GitHub CLI for a consistent experience.",
          },
        ],
        components: [
          {
            icon: <GitBranch className="text-primary h-6 w-6" />,
            title: "Custom Directory Structure",
            description:
              "Clone repositories into folders based on domain, owner, and repository for easy navigation.",
          },
          {
            icon: <Terminal className="text-primary h-6 w-6" />,
            title: "Dry Run Feature",
            description:
              "Preview commands before execution, ensuring you understand the effect before proceeding.",
          },
          {
            icon: <ArrowUpCircle className="text-primary h-6 w-6" />,
            title: "Automatic Updates",
            description:
              "Easily update the CLI wrapper to the latest release with a simple command.",
          },
        ],
        url: "https://github.com/dotbrains/ghw",
      },
    ],
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = featuredProjects.findIndex(
          (project) => project.name === prev
        );
        const nextIndex = (currentIndex + 1) % featuredProjects.length;
        return featuredProjects[nextIndex].name;
      });
    }, 8000); // 8 seconds

    return () => clearInterval(interval);
  }, [featuredProjects]);

  return (
    <motion.section
      {...({
        className: "mb-3 mt-5 w-full",
      } as any)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h3 className="text-primary text-md mb-2 font-bold">
        Featured Projects from <em>DotBrains</em>.
      </h3>
      <p className="text-secondary mb-6">
        Explore our flagship projects that revolutionize developer workflows and
        enhance security practices.
      </p>
      <>
        <ProjectTabs
          projects={featuredProjects}
          activeTab={activeTab}
          onTabClick={setActiveTab}
        />
        <AnimatePresence mode="wait">
          {featuredProjects.map(
            (project) =>
              project.name === activeTab && (
                <ProjectDetails key={project.name} project={project} />
              )
          )}
        </AnimatePresence>
      </>
    </motion.section>
  );
}
