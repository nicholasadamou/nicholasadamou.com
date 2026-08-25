"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";

/**
 * Discoverability page for name-based queries like
 * "nicholasadamou developer resources". Documents the real machine-readable
 * surface on this host — no stubbed MCP/OAuth/webhook APIs.
 */
export default function DevelopersPageClient() {
  const {
    getTextColorClass,
    getOpacityClass,
    getLinkColorClass,
    getHrColorClass,
    shouldUseDarkText,
  } = useTheme();

  const light = shouldUseDarkText();
  const hr = `border-dashed ${getOpacityClass()} ${getHrColorClass()}`;
  const link = `underline transition-opacity hover:opacity-60 ${getLinkColorClass()}`;
  const cardBg = light ? "bg-stone-950/[0.03]" : "bg-white/[0.04]";

  const discovery = [
    {
      label: "llms.txt",
      href: "/llms.txt",
      description:
        "Site map for AI agents — when to use this site, page index, and developer links.",
    },
    {
      label: "Sitemap",
      href: "/sitemap.xml",
      description: "Full list of indexable URLs.",
    },
    {
      label: "robots.txt",
      href: "/robots.txt",
      description: "Crawler access rules.",
    },
    {
      label: "OpenAPI",
      href: "/openapi.json",
      description:
        "OpenAPI 3.1 description of public agent-facing endpoints on this host.",
    },
    {
      label: "API catalog",
      href: "/.well-known/api-catalog",
      description: "RFC 9727 linkset pointing agents at the OpenAPI document.",
    },
  ];

  const content = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Notes", href: "/notes" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy", href: "/privacy" },
  ];

  return (
    <main
      className={`min-h-screen overflow-x-hidden font-sans transition-colors duration-200 ${getTextColorClass()}`}
    >
      <div className="mx-auto max-w-2xl px-5 pt-24 pb-32 sm:pt-32 sm:pb-48">
        <div className="animate-fadeInHome1 space-y-12">
          <div className="space-y-3">
            <h1 className="text-3xl font-medium sm:text-4xl">
              Nicholas Adamou developer resources
            </h1>
            <p className={`text-sm leading-relaxed ${getOpacityClass()}`}>
              Machine-readable entry points for agents and developers working
              with Nicholas Adamou&apos;s site — open-source projects, technical
              writing, and content APIs. This host does not run a public product
              API key, OAuth provider, webhook hub, or MCP server; the surface
              below is the content and discovery stack.
            </p>
          </div>

          <hr className={hr} />

          <section className="space-y-4">
            <h2 className={`text-sm ${getOpacityClass()}`}>Start here</h2>
            <ul className="space-y-3">
              {discovery.map((item) => (
                <li key={item.href} className="space-y-1">
                  <a href={item.href} className={`text-sm font-medium ${link}`}>
                    {item.label}
                  </a>
                  <p className={`text-sm leading-relaxed ${getOpacityClass()}`}>
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <hr className={hr} />

          <section className="space-y-4">
            <h2 className={`text-sm ${getOpacityClass()}`}>
              Content as Markdown
            </h2>
            <p className={`text-sm leading-relaxed ${getOpacityClass()}`}>
              Request any of these pages with{" "}
              <code className="text-[0.85em]">Accept: text/markdown</code> (see{" "}
              <a
                href="https://acceptmarkdown.com"
                target="_blank"
                rel="noopener noreferrer"
                className={link}
              >
                acceptmarkdown.com
              </a>
              ). Responses use{" "}
              <code className="text-[0.85em]">
                Content-Type: text/markdown; charset=utf-8
              </code>{" "}
              and <code className="text-[0.85em]">Vary: Accept</code>.
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {content.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2.5 text-sm transition-colors ${cardBg} hover:opacity-70`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <p className={`text-sm leading-relaxed ${getOpacityClass()}`}>
              Individual notes are available at{" "}
              <code className="text-[0.85em]">/notes/&#123;slug&#125;</code>{" "}
              with the same Markdown negotiation.
            </p>
          </section>

          <hr className={hr} />

          <section className="space-y-4">
            <h2 className={`text-sm ${getOpacityClass()}`}>Search</h2>
            <p className={`text-sm leading-relaxed ${getOpacityClass()}`}>
              <code className="text-[0.85em]">
                GET /api/search?q=&#123;query&#125;
              </code>{" "}
              returns JSON results across notes and projects (up to 10 matches).
            </p>
          </section>

          <hr className={hr} />

          <section className="space-y-4">
            <h2 className={`text-sm ${getOpacityClass()}`}>
              Open-source and writing
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
              <li>
                <Link href="/projects" className={link}>
                  Projects
                </Link>{" "}
                — open-source projects and developer tools built by Nicholas
                Adamou.
              </li>
              <li>
                <Link href="/notes" className={link}>
                  Notes
                </Link>{" "}
                — technical writing on software engineering, architecture, and
                developer tools.
              </li>
              <li>
                <a
                  href="https://github.com/nicholasadamou"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link}
                >
                  GitHub
                </a>{" "}
                — source repositories.
              </li>
            </ul>
          </section>

          <hr className={hr} />

          <section className="space-y-4">
            <h2 className={`text-sm ${getOpacityClass()}`}>
              What this site is not
            </h2>
            <p className={`text-sm leading-relaxed ${getOpacityClass()}`}>
              This host does not expose a transactional SaaS API, MCP server,
              OAuth authorization server, or webhook delivery system. For those
              capabilities, see the individual open-source projects linked from{" "}
              <Link href="/projects" className={link}>
                /projects
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
