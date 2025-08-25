import Image from "next/image";
import type { Project } from "@/lib/contentlayer-data";
import Link from "@/components/common/Link";
import Halo from "@/components/common/Halo";
import { Badge } from "@/components/ui/badge";
import GitHubBadge from "@/components/features/projects/GitHubBadge";

type ProjectListProps = {
  projects: Project[];
};

export default function PinnedProjectList({ projects }: ProjectListProps) {
  const pinnedProjects = projects.filter((project) => project.pinned);

  return (
    <ul className="animated-list flex snap-x snap-mandatory grid-cols-2 flex-nowrap gap-5 overflow-x-scroll md:grid md:overflow-auto">
      {pinnedProjects.map((project) => (
        <li
          key={project.slug}
          className="col-span-1 min-w-72 snap-start transition-opacity"
        >
          <div className="space-y-4">
            <Link href={`/projects/${project.slug}`}>
              <div className="aspect-video overflow-hidden rounded-md bg-secondary">
                <Halo strength={10}>
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    priority={true}
                    sizes="(max-width: 768px) 100vw, (min-width: 768px) 50vw"
                    className="h-full w-full object-cover"
                  />
                </Halo>
              </div>
            </Link>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium leading-tight">{project.title}</p>
                <GitHubBadge href={project.url} />
              </div>
              <p className="text-secondary">{project.summary}</p>
							<div className="flex flex-wrap items-center gap-1">
								{project.technologies?.map((tech) => (
									<Badge variant="secondary" key={tech}>
										{tech}
									</Badge>
								))}
							</div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
