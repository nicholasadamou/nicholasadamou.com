"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const socialLinks = [
  { label: "Resume", href: "https://nicholas-adamou-cv.vercel.app" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/nicholas-adamou" },
  { label: "GitHub", href: "https://github.com/nicholasadamou" },
  { label: "LeetCode", href: "https://leetcode.com/nicholasadamou" },
];

export default function SocialLinks({ light }: { light: boolean }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {socialLinks.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            target="_blank"
            className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs transition-opacity hover:opacity-60 ${light ? "bg-stone-950/[0.05]" : "bg-white/[0.08]"}`}
          >
            {link.label}
            <ArrowUpRight className="h-3.5 w-3.5 opacity-40" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
