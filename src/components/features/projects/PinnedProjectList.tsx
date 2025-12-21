import type { Project } from "@/lib/contentlayer-data";
import Link from "@/components/common/ui/Link";
import Halo from "@/components/common/effects/Halo";
import { Badge } from "@/components/ui/badge";
import GitHubBadge from "@/components/features/projects/GitHubBadge";
import UniversalImage from "@/components/common/media/UniversalImage";

type ProjectListProps = {
  projects: Project[];
};

export default function PinnedProjectList({ projects }: ProjectListProps) {
  const pinnedProjects = projects.filter((project) => project.pinned);

  return (
    <ul className="animated-list grid grid-cols-1 gap-8 md:grid-cols-2">
      {pinnedProjects.map((project) => (
        <li key={project.slug} className="group transition-opacity">
          <div className="space-y-4">
            <Link href={`/projects/${project.slug}`}>
              <div className="bg-secondary aspect-video overflow-hidden rounded-xl">
                <Halo strength={10}>
                  <UniversalImage
                    src={project.image_url || project.image || ""}
                    alt={project.title}
                    fill
                    priority={true}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                  />
                </Halo>
              </div>
            </Link>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <Link href={`/projects/${project.slug}`}>
                  <h3 className="text-primary font-semibold leading-tight transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                    {project.title}
                  </h3>
                </Link>
                <GitHubBadge href={project.url} />
              </div>
              <p className="text-secondary leading-relaxed">
                {project.summary}
              </p>
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge variant="secondary" key={tech} className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
