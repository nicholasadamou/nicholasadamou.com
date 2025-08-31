import React from "react";
import Avatar from "@/components/common/Avatar";
import Link from "@/components/common/Link";

interface ContentHeaderProps {
  title: string;
  longSummary?: string;
  summary: string;
  date: string | Date;
  author: { name: string; avatar: string };
  additionalInfo: {
    backLink: string;
    backText: string;
    linkSection?: React.ReactNode;
    extraInfo?: React.ReactNode;
  };
}

export const ContentHeader: React.FC<ContentHeaderProps> = ({
  title,
  longSummary,
  summary,
  date,
  author,
  additionalInfo,
}) => {
  // Ensure date is a string for rendering
  const dateString =
    date instanceof Date ? date.toISOString().split("T")[0] : date;

  return (
    <div className="flex flex-col gap-4">
      <Link href={additionalInfo.backLink}>← {additionalInfo.backText}</Link>
      <div className="flex max-w-xl flex-col gap-4 text-pretty">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-primary">
          {title}
        </h1>
        <p className="text-secondary">{longSummary || summary}</p>
        {additionalInfo.linkSection}
      </div>
      <div className="flex max-w-none items-center gap-4">
        <Avatar src={author.avatar} initials="na" size="sm" />
        <div className="leading-tight">
          {author.name}
          <p className="md:text-md mt-1 flex flex-row flex-wrap justify-center gap-1 text-sm text-secondary">
            <time dateTime={dateString}>{dateString}</time>
            {additionalInfo.extraInfo}
          </p>
        </div>
      </div>
    </div>
  );
};
