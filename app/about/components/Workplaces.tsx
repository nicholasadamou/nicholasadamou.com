"use client";
import Image, { StaticImageData } from "next/image";
import clsx from "clsx";

import Link from "@/app/components/Link";

type Workplace = {
  title: string;
  company: string;
  imageSrc: string | StaticImageData;
  date?: string;
  link?: string;
	contract?: boolean;
};

function Workplace({ title, company, imageSrc, date, link, contract = false }: Workplace) {

  const content = (
    <>
      <div className="flex items-center gap-4">
        <Image
          src={imageSrc}
          alt={company}
          width={48}
          height={48}
          className={clsx(
            "rounded-full",
          )}
        />
        <div className="flex flex-col gap-px">
          <p className={link ? "external-arrow" : ""}>{title}</p>
          <p className="text-secondary">{company}{contract && ' (contract)'}</p>
        </div>
      </div>
      {date && <time className="text-secondary">{date}</time>}
    </>
  );
  return (
    <li className="transition-opacity" key={`${company}-${title}`}>
      {link ? (
        <Link
          href={link}
          className="flex justify-between w-full md:-mx-5 no-underline"
        >
          {content}
        </Link>
      ) : (
        <div className="flex justify-between ">{content}</div>
      )}
    </li>
  );
}

export default function Workplaces({ items }: { items: Workplace[] }) {
  return (
    <ul className="flex flex-col gap-8 animated-list">
      {items.map(Workplace)}
    </ul>
  );
}
