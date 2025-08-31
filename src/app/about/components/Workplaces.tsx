"use client";
import Image, { StaticImageData } from "next/image";
import clsx from "clsx";
import Link from "@/components/common/Link";

type Workplace = {
  title: string;
  company: string;
  imageSrc: string | StaticImageData;
  date?: string;
  link?: string;
  contract?: boolean;
};

function Workplace({
  title,
  company,
  imageSrc,
  date,
  link,
  contract = false,
}: Workplace) {
  const content = (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex items-center gap-2">
        <Image
          src={imageSrc}
          alt={company}
          width={48}
          height={48}
          className="flex-shrink-0 rounded-full"
        />
        <div className="flex flex-col">
          <p className={clsx("font-medium", link && "external-arrow")}>
            {title}
          </p>
          <p className="text-secondary text-sm">
            {company}
            {contract && " (contract)"}
          </p>
        </div>
      </div>
      {date && (
        <time className="text-secondary mt-1 text-sm sm:mt-0">{date}</time>
      )}
    </div>
  );

  return (
    <li className="py-3 transition-opacity" key={`${company}-${title}`}>
      {link ? (
        <Link
          href={link}
          className="hover:bg-tertiary dark:hover:bg-secondary -m-2 block w-full rounded-lg p-3 no-underline transition-colors"
        >
          {content}
        </Link>
      ) : (
        <div className="-m-3 p-3">{content}</div>
      )}
    </li>
  );
}

export default function Workplaces({ items }: { items: Workplace[] }) {
  return (
    <ul className="animated-list flex flex-col">
      {items.map((workplace, index) => (
        <Workplace
          key={`${workplace.company}-${workplace.title}-${index}`}
          {...workplace}
        />
      ))}
    </ul>
  );
}
