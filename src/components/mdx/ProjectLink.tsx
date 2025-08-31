import React, { useMemo, ReactElement } from "react";
import Link from "@/components/common/Link";
import { siGithub } from "simple-icons/icons";

interface ProjectLinkProps {
  url?: string;
}

const DEFAULT_ICON = (
  <svg
    className="text-secondary w-[16px]"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M5 3L19 12 5 21 5 3Z" />
  </svg>
);

function getIconForDomain(url: string | undefined): ReactElement {
  if (!url) {
    return DEFAULT_ICON;
  }

  const domain = new URL(url).hostname;

  if (domain.includes("github.com")) {
    return (
      <svg
        className="text-secondary w-[16px]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d={siGithub.path} />
      </svg>
    );
  }

  return DEFAULT_ICON;
}

const ProjectLink: React.FC<ProjectLinkProps> = ({ url }) => {
  const icon = useMemo(() => getIconForDomain(url), [url]);

  return (
    <div className="flex gap-2">
      {icon}
      <Link href={url || ""}>Visit Project</Link>
    </div>
  );
};

export default ProjectLink;
