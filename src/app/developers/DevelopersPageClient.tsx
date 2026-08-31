"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";

/**
 * Discoverability page for name-based queries like
 * "nicholasadamou developer resources". Documents the real machine-readable
 * surface: versioned API, OpenAPI, MCP, CLI, and Markdown negotiation.
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
      label: "OpenAPI",
      href: "/openapi.json",
      description:
        "OpenAPI 3.1 description of the public /api/v1 Nicholas Adamou content API.",
    },
    {
      label: "API catalog",
      href: "/.well-known/api-catalog",
      description: "RFC 9727 linkset pointing agents at the OpenAPI document.",
    },
    {
      label: "MCP server",
      href: "/mcp",
      description:
        "Streamable HTTP MCP endpoint exposing search, notes, projects, and docs as tools.",
    },
    {
      label: "MCP registry manifest",
      href: "/server.json",
      description: "server.json for MCP registries and remote clients.",
    },
    {
      label: "MCP server card",
      href: "/mcp/server-card",
      description:
        "Server card (also /.well-known/mcp and /.well-known/mcp/server-card.json).",
    },
    {
      label: "AI Catalog",
      href: "/.well-known/ai-catalog.json",
      description: "Domain-level MCP discovery entry point.",
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
              <span className="font-medium">
                nicholasadamou developer resources
              </span>{" "}
              — versioned content API, OpenAPI, MCP server, official CLI, and
              Markdown negotiation for agents and developers working with
              Nicholas Adamou&apos;s site. Public surfaces are read-only and
              require no API key.
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

          <section id="api" className="scroll-mt-24 space-y-4">
            <h2 className={`text-sm ${getOpacityClass()}`}>
              Public content API
            </h2>
            <p className={`text-sm leading-relaxed ${getOpacityClass()}`}>
              Stable REST operations use URL path versioning under{" "}
              <code className="text-[0.85em]">/api/v1</code>.
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
              <li>
                <code className="text-[0.85em]">
                  GET /api/v1/search?q=&#123;query&#125;
                </code>
              </li>
              <li>
                <code className="text-[0.85em]">GET /api/v1/notes</code>
              </li>
              <li>
                <code className="text-[0.85em]">
                  GET /api/v1/notes/&#123;slug&#125;
                </code>
              </li>
              <li>
                <code className="text-[0.85em]">GET /api/v1/projects</code>
              </li>
            </ul>
            <p className={`text-sm leading-relaxed ${getOpacityClass()}`}>
              Legacy <code className="text-[0.85em]">GET /api/search</code>{" "}
              remains as a deprecated alias with{" "}
              <code className="text-[0.85em]">Deprecation</code> and{" "}
              <code className="text-[0.85em]">Sunset</code> headers.
            </p>
          </section>

          <hr className={hr} />

          <section id="errors" className="scroll-mt-24 space-y-4">
            <h2 className={`text-sm ${getOpacityClass()}`}>
              Structured errors
            </h2>
            <p className={`text-sm leading-relaxed ${getOpacityClass()}`}>
              Public <code className="text-[0.85em]">/api/v1</code> errors use
              RFC 9457{" "}
              <code className="text-[0.85em]">application/problem+json</code>{" "}
              with a stable <code className="text-[0.85em]">code</code>,{" "}
              <code className="text-[0.85em]">detail</code>, and{" "}
              <code className="text-[0.85em]">resolution</code> hint.
            </p>
            <dl className="space-y-3 text-sm leading-relaxed">
              <div id="invalid-query">
                <dt className="font-medium">
                  <code className="text-[0.85em]">invalid_query</code> · 400
                </dt>
                <dd className={getOpacityClass()}>
                  Pass the documented query parameter (for example{" "}
                  <code className="text-[0.85em]">q</code>).
                </dd>
              </div>
              <div id="note-not-found">
                <dt className="font-medium">
                  <code className="text-[0.85em]">note_not_found</code> · 404
                </dt>
                <dd className={getOpacityClass()}>
                  List notes or search, then retry with a valid slug.
                </dd>
              </div>
              <div id="method-not-allowed">
                <dt className="font-medium">
                  <code className="text-[0.85em]">method_not_allowed</code> ·
                  405
                </dt>
                <dd className={getOpacityClass()}>
                  Use GET on read-only endpoints.
                </dd>
              </div>
              <div id="api-route-not-found">
                <dt className="font-medium">
                  <code className="text-[0.85em]">api_route_not_found</code> ·
                  404
                </dt>
                <dd className={getOpacityClass()}>
                  Recover via OpenAPI or the API catalog.
                </dd>
              </div>
              <div id="internal-error">
                <dt className="font-medium">
                  <code className="text-[0.85em]">internal_error</code> · 500
                </dt>
                <dd className={getOpacityClass()}>
                  Retry shortly; do not invent alternate endpoints.
                </dd>
              </div>
            </dl>
          </section>

          <hr className={hr} />

          <section
            id="versioning-and-deprecation"
            className="scroll-mt-24 space-y-4"
          >
            <h2 className={`text-sm ${getOpacityClass()}`}>
              Versioning and deprecation
            </h2>
            <p className={`text-sm leading-relaxed ${getOpacityClass()}`}>
              Stable REST operations use a major version in the URL, beginning
              with <code className="text-[0.85em]">/api/v1</code>.
              Backward-compatible fields may be added within v1; breaking
              changes require a new major path. Deprecations are signaled with
              RFC 9745 <code className="text-[0.85em]">Deprecation</code> and{" "}
              <code className="text-[0.85em]">Link</code> headers. A dated{" "}
              <code className="text-[0.85em]">Sunset</code> header is announced
              at least 90 days before removal.
            </p>
          </section>

          <hr className={hr} />

          <section id="cli" className="scroll-mt-24 space-y-4">
            <h2 className={`text-sm ${getOpacityClass()}`}>CLI</h2>
            <p className={`text-sm leading-relaxed ${getOpacityClass()}`}>
              Official npm package{" "}
              <a
                href="https://www.npmjs.com/package/nicholasadamou"
                target="_blank"
                rel="noopener noreferrer"
                className={link}
              >
                nicholasadamou
              </a>
              :
            </p>
            <pre
              className={`overflow-x-auto rounded-lg px-3 py-2.5 text-sm ${cardBg}`}
            >
              <code>{`npx nicholasadamou search <query>
npx nicholasadamou notes
npx nicholasadamou note <slug>
npx nicholasadamou projects
npx nicholasadamou docs`}</code>
            </pre>
            <p className={`text-sm leading-relaxed ${getOpacityClass()}`}>
              Add <code className="text-[0.85em]">--json</code> for the
              unchanged API response and structured problem+json errors.
            </p>
          </section>

          <hr className={hr} />

          <section id="mcp" className="scroll-mt-24 space-y-4">
            <h2 className={`text-sm ${getOpacityClass()}`}>MCP server</h2>
            <p className={`text-sm leading-relaxed ${getOpacityClass()}`}>
              Connect a Streamable HTTP MCP client to{" "}
              <code className="text-[0.85em]">
                https://nicholasadamou.com/mcp
              </code>
              . Tools:{" "}
              <code className="text-[0.85em]">nicholasadamou_search</code>,{" "}
              <code className="text-[0.85em]">nicholasadamou_list_notes</code>,{" "}
              <code className="text-[0.85em]">nicholasadamou_get_note</code>,{" "}
              <code className="text-[0.85em]">
                nicholasadamou_list_projects
              </code>
              ,{" "}
              <code className="text-[0.85em]">
                nicholasadamou_get_developer_docs
              </code>
              .
            </p>
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

          <section
            id="authentication-and-write-operations"
            className="scroll-mt-24 space-y-4"
          >
            <h2 className={`text-sm ${getOpacityClass()}`}>
              Authentication and writes
            </h2>
            <p className={`text-sm leading-relaxed ${getOpacityClass()}`}>
              The documented JSON API, CLI, and MCP tools are public and
              read-only. They require no API key or OAuth flow and do not
              provide writes, webhooks, or event subscriptions.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
