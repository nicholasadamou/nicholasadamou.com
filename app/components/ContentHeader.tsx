import React from "react";
import Avatar from "@/app/components/Avatar";
import Link from "@/app/components/Link";

interface ContentHeaderProps {
  title: string;
	longSummary?: string;
  summary: string;
  date: string;
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
}) => (
  <div className="flex flex-col gap-8">
    <Link href={additionalInfo.backLink} underline>
      ← {additionalInfo.backText}
    </Link>
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
        <Link underline href="/about">
          {author.name}
        </Link>
        <p className="md:text-md mt-1 flex flex-row flex-wrap justify-center gap-1 text-sm text-secondary">
          <time dateTime={date}>{date}</time>
          {additionalInfo.extraInfo}
        </p>
      </div>
    </div>
  </div>
);
