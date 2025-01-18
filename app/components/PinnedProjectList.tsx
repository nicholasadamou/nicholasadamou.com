import Image from "next/image";
import type { Project } from "contentlayer/generated";
import Link from "@/app/components/Link";
import Halo from "@/app/components/Halo";
import { Badge } from "@/app/components/ui/badge";
import GitHubBadge from "@/app/components/GitHubBadge";

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
              <div className="flex flex-wrap items-center space-x-1 space-y-1">
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
