"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import TableOfContents from "@/components/notes/TableOfContents";
import { useTheme } from "@/components/ThemeProvider";
import { clients } from "@/lib/content/clients";
import { clientImages } from "@/lib/content/client-images";

const brandIcons = new Set([
  "Astro",
  "React",
  "TypeScript",
  "Bun",
  "Flox",
  "Vercel",
  "Sanity",
  "Supabase",
]);

export default function CaseStudy({
  slug,
  readTime,
  stack,
  children,
}: {
  slug: string;
  readTime: string;
  stack: string[];
  children: React.ReactNode;
}) {
  const { getTextColorClass, shouldUseDarkText } = useTheme();
  const client = clients.find((item) => item.slug === slug)!;
  const related = clients.filter((item) => item.slug !== slug).slice(0, 2);
  return (
    <main className={`min-h-screen font-sans ${getTextColorClass()}`}>
      <div className="mx-auto max-w-[45rem] px-5 pt-24 pb-12 sm:pt-32 sm:pb-16">
        <article>
          <header className="animate-fadeInText mb-8 space-y-5">
            <p className="text-xs tracking-wide uppercase opacity-60">
              {slug === "alder-house"
                ? "Concept case study"
                : "Client case study"}{" "}
              · {readTime}
            </p>
            <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
              {client.name}
            </h1>
            <p className="text-base leading-relaxed opacity-70">
              {client.description}
            </p>
            <a
              href={client.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-b border-current/30 pb-1 text-sm hover:opacity-60"
            >
              Visit website <ArrowUpRight size={16} />
            </a>
          </header>
          <Image
            src={clientImages[client.slug]}
            alt={`${client.name} homepage showing ${client.imageDescription}`}
            priority
            sizes="(max-width: 720px) 100vw, 680px"
            className="mb-6 h-auto w-full rounded-xl border border-current/10"
          />
          <ul
            aria-label="Technology stack"
            className="mb-8 flex flex-wrap gap-2"
          >
            {stack.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-current/15 px-3 py-1.5 text-xs"
              >
                {brandIcons.has(item) && (
                  <span
                    aria-hidden="true"
                    className="inline-block size-4 shrink-0 bg-current mask-contain mask-center mask-no-repeat"
                    style={{
                      maskImage: `url(/brands/technology/${item.toLowerCase()}.svg)`,
                    }}
                  />
                )}
                {item}
              </li>
            ))}
          </ul>
          <TableOfContents />
          <div
            className={`animate-fadeInHome2 prose prose-stone sm:prose-lg prose-headings:scroll-mt-24 prose-headings:font-medium prose-h2:mt-12 prose-p:leading-[1.75] prose-a:font-normal prose-a:decoration-dashed prose-a:underline-offset-4 prose-img:rounded-xl max-w-none ${shouldUseDarkText() ? "" : "prose-invert"}`}
          >
            {children}
          </div>
        </article>
        <section
          aria-labelledby="project-invitation"
          className="mt-12 rounded-2xl border border-current/15 bg-current/5 p-6 sm:p-8"
        >
          <p className="mb-3 text-xs tracking-widest uppercase opacity-60">
            Your next project
          </p>
          <h2
            id="project-invitation"
            className="text-2xl font-medium tracking-tight"
          >
            Could your website work harder for you?
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed opacity-70">
            Tell me what you’re building, who it’s for, and what needs to
            improve. We’ll turn that into a clear direction for your website or
            software.
          </p>
          <Link
            href={`/contact?from=clients&project=${slug}`}
            className="bg-foreground text-background mt-6 inline-flex min-h-11 items-center gap-3 rounded-full px-5 py-3 text-sm font-medium hover:opacity-80"
          >
            Let’s talk about your project <ArrowRight size={16} />
          </Link>
        </section>
        <section aria-labelledby="related-work" className="mt-12">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 id="related-work" className="text-xl font-medium">
              Related client work
            </h2>
            <Link
              href="/clients"
              className="text-sm opacity-60 hover:opacity-100"
            >
              All work →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/clients/${item.slug}`}
                className="group block"
              >
                <Image
                  src={clientImages[item.slug]}
                  alt={`${item.name} homepage`}
                  sizes="(max-width: 640px) 100vw, 330px"
                  className="mb-3 h-auto w-full rounded-xl border border-current/10 transition-opacity group-hover:opacity-80"
                />
                <h3 className="text-base font-medium">
                  {item.name} <span aria-hidden>→</span>
                </h3>
                <p className="mt-2 text-sm leading-relaxed opacity-60">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
