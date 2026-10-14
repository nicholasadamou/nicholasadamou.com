"use client";

import Link from "next/link";
import { ArrowUpRight, Code2, Terminal, Bot } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function ResourceOverview() {
  const { getOpacityClass, shouldUseDarkText, getLinkColorClass } = useTheme();
  const cardBg = shouldUseDarkText()
    ? "bg-stone-950/[0.03]"
    : "bg-white/[0.04]";
  const link = `underline transition-opacity hover:opacity-60 ${getLinkColorClass()}`;
  return (
    <>
      <header className="space-y-5">
        <p
          className={`text-xs tracking-[0.18em] uppercase ${getOpacityClass()}`}
        >
          Build · Explore · Connect
        </p>
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
          Developer resources
        </h1>
        <p className={`max-w-lg text-sm leading-relaxed ${getOpacityClass()}`}>
          Open-source tools, technical writing, and ways to work with this site.
          Explore in your browser, from a terminal, or through your AI
          assistant.
        </p>
        <p className={`text-xs ${getOpacityClass()}`}>
          Public access · Read-only · No API key required
        </p>
      </header>
      <nav
        aria-label="Resource guides"
        className="animate-fadeInHome2 grid gap-3 sm:grid-cols-3"
      >
        {[
          {
            title: "Content API",
            description: "Search notes and projects with a simple REST API.",
            href: "#api",
            icon: Code2,
          },
          {
            title: "Command line",
            description: "Explore from your terminal with the official CLI.",
            href: "#cli",
            icon: Terminal,
          },
          {
            title: "AI assistants",
            description: "Connect your tools through the MCP server.",
            href: "#mcp",
            icon: Bot,
          },
        ].map(({ title, description, href, icon: Icon }) => (
          <a
            key={href}
            href={href}
            className={`group rounded-2xl border border-current/10 p-5 transition-colors hover:border-current/30 ${cardBg}`}
          >
            <div className="mb-6 flex items-center justify-between">
              <Icon size={21} strokeWidth={1.5} />
              <ArrowUpRight
                size={16}
                className="opacity-40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
              />
            </div>
            <h2 className="text-sm font-medium">{title}</h2>
            <p className={`mt-2 text-xs leading-relaxed ${getOpacityClass()}`}>
              {description}
            </p>
          </a>
        ))}
      </nav>
      <section className="space-y-4" aria-labelledby="explore-heading">
        <h2 id="explore-heading" className="text-lg font-medium">
          Explore the work
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              label: "Projects",
              href: "/projects",
              description: "Open-source software and developer tools.",
            },
            {
              label: "Notes",
              href: "/notes",
              description: "Ideas and lessons from building software.",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl border border-current/10 p-4 transition-colors hover:border-current/30 ${cardBg}`}
            >
              <span className="flex items-center justify-between text-sm font-medium">
                {item.label}
                <ArrowUpRight size={16} />
              </span>
              <p
                className={`mt-2 text-xs leading-relaxed ${getOpacityClass()}`}
              >
                {item.description}
              </p>
            </Link>
          ))}
        </div>
        <a
          href="https://github.com/nicholasadamou"
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 text-sm ${link}`}
        >
          Browse source on GitHub <ArrowUpRight size={14} />
        </a>
      </section>
    </>
  );
}
