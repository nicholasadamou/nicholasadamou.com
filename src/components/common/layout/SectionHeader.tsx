import React from "react";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import Link from "@/components/common/ui/Link";

interface SectionHeaderProps {
  id?: string;
  title: string | React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
  linkClassName?: string;
  customContent?: React.ReactNode;
  descriptionClassName?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  id,
  title,
  href,
  icon,
  description,
  className = "",
  linkClassName = "",
  customContent,
  descriptionClassName,
}) => (
  <>
    <h2 id={id} className={className}>
      {customContent ||
        (href ? (
          <Link
            className={`text-primary text-md group flex items-center gap-2 font-semibold tracking-tight ${linkClassName}`.trim()}
            href={href}
          >
            {icon}
            {title}
            <ArrowUpRightIcon className="text-tertiary group-hover:text-primary h-5 w-5 transition-all" />
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            {icon}
            {title}
          </div>
        ))}
    </h2>
    {description && (
      <p
        className={descriptionClassName || "text-secondary mt-[-8px] max-w-3xl"}
      >
        {description}
      </p>
    )}
  </>
);
