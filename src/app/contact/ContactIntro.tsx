"use client";

import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function ContactIntro() {
  const { getOpacityClass, shouldUseDarkText } = useTheme();
  return (
    <header className="space-y-5">
      <p className={`text-xs tracking-[0.16em] uppercase ${getOpacityClass()}`}>
        Start a conversation
      </p>
      <h1 className="max-w-xl text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
        Let’s build something useful.
      </h1>
      <p className={`max-w-lg text-sm leading-7 ${getOpacityClass()}`}>
        A website for your business, a better workflow, or an idea ready to take
        shape. Tell me where you are and what you’d like to achieve.
      </p>
      <div
        className={`flex flex-wrap items-center justify-between gap-4 border-y border-dashed py-4 text-xs ${shouldUseDarkText() ? "border-stone-950/15" : "border-white/15"}`}
      >
        <span className={`inline-flex items-center gap-2 ${getOpacityClass()}`}>
          <Clock3 size={14} aria-hidden="true" />
          Usually a reply within a couple of days
        </span>
        <Link
          href="/clients"
          className="inline-flex items-center gap-1.5 rounded-sm transition-opacity hover:opacity-60"
        >
          Explore client work <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
