import Image from "next/image";
import React from "react";

interface LinkPreviewProps {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({
  title,
  description,
  imageUrl,
  link,
}) => {
  const baseUrl =
    new URL(link).hostname + "/" + new URL(link).pathname.split("/")[1];

  return (
    <a
      className="border-secondary bg-secondary my-8 flex items-center gap-4 overflow-clip rounded-md border p-4 no-underline md:gap-6 md:p-6"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {imageUrl && (
        <div className="prose w-full max-w-[12rem]">
          <Image
            width={600}
            height={400}
            src={imageUrl}
            alt="OG Image"
            className="aspect-video w-full rounded object-cover"
          />
        </div>
      )}

      <div className="flex w-full flex-col gap-1 leading-tight">
        <p className="text-tertiary m-0 flex items-center gap-0.5 text-sm">
          {baseUrl}
        </p>
        <p className="text-primary m-0 line-clamp-3 text-base font-medium leading-tight">
          {title}
        </p>
        <div className="hidden md:block">
          <p className="text-secondary m-0 line-clamp-2 text-sm">
            {description}
          </p>
        </div>
      </div>
    </a>
  );
};

export default LinkPreview;
