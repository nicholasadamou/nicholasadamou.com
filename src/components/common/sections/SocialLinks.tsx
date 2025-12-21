import React from "react";
import Link from "@/components/common/ui/Link";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";

type SocialLink = {
  href: string;
  label: string;
};

type SocialLinksProps = {
  links: SocialLink[];
};

export default function SocialLinks({ links }: SocialLinksProps) {
  return (
    <ul
      className="animated-list max-w-108 animate-in flex snap-x snap-mandatory flex-nowrap gap-2 overflow-x-scroll text-sm sm:gap-3 md:overflow-auto"
      style={{ "--index": 2 } as React.CSSProperties}
    >
      {links.map((link) => (
        <li
          key={link.href}
          className="col-span-1 min-w-fit snap-start transition-opacity"
        >
          <Link
            href={link.href}
            underline={false}
            className="bg-tertiary hover:bg-tertiary dark:bg-secondary flex w-fit items-center rounded-full px-3 py-1 no-underline transition-colors"
          >
            {link.label}
            <ArrowUpRightIcon className="text-tertiary ml-1 h-4 w-4" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export const socialLinks: SocialLink[] = [
  {
    href: "https://nicholas-adamou-cv.vercel.app",
    label: "Resume",
  },
  {
    href: "https://www.linkedin.com/in/nicholas-adamou",
    label: "LinkedIn",
  },
  {
    href: "https://github.com/nicholasadamou",
    label: "GitHub",
  },
  {
    href: "https://leetcode.com/nicholasadamou",
    label: "LeetCode",
  },
];
