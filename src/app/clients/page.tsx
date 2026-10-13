import { clientImages } from "@/lib/content/client-images";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, ArrowRight } from "lucide-react";
import { clients, services, processSteps } from "@/lib/content/clients";
import { getBaseUrl } from "@/lib/og";

const title = "Client work";
const description =
  "Selected websites built by Nicholas Adamou for independent businesses, consultants, coaches, and creatives.";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/clients" },
  openGraph: {
    title,
    description,
    url: "/clients",
    type: "website",
    images: [
      {
        url: "/images/clients/bold-performance.webp",
        width: 1440,
        height: 900,
        alt: "Bold Performance website",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/clients/bold-performance.webp"],
  },
};

export default function ClientsPage() {
  return (
    <main className="text-foreground mx-auto min-h-screen max-w-2xl px-5 pt-24 pb-32 sm:pt-32 sm:pb-48">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: title,
            description,
            url: `${getBaseUrl()}/clients`,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: clients.map((client, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "WebSite",
                  name: client.name,
                  url: client.href,
                  image: `${getBaseUrl()}/images/clients/${client.slug}.webp`,
                },
              })),
            },
          }),
        }}
      />

      <header>
        <div className="mb-5 flex items-center gap-3 text-xs tracking-[0.18em] uppercase">
          <span
            className="h-2 w-2 rounded-full bg-emerald-500"
            aria-hidden="true"
          />
          Independent engineer. Personal approach.
        </div>
        <h1 className="max-w-4xl text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
          Good work deserves
          <br />a great website.
        </h1>
        <div className="mt-5 flex flex-col gap-5">
          <p className="max-w-lg text-sm leading-relaxed opacity-65">
            I help people turn what they do best into a thoughtful digital
            presence. Built with care, from the first conversation to the final
            detail.
          </p>
          <a
            href="#selected-work"
            className="inline-flex shrink-0 items-center gap-3 self-start border-b border-current/40 pb-2 text-sm transition-opacity hover:opacity-60 sm:self-start"
          >
            Explore the work <ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-y border-current/15 py-5 text-xs tracking-wide opacity-65 sm:mt-10">
          <span>01 / Strategy & structure</span>
          <span>02 / Design & development</span>
          <span>03 / Launch & handoff</span>
        </div>
      </header>

      <section
        id="selected-work"
        aria-labelledby="work-heading"
        className="scroll-mt-16 pt-12"
      >
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs tracking-[0.18em] uppercase opacity-50">
              The portfolio
            </p>
            <h2
              id="work-heading"
              className="text-2xl font-medium tracking-tight"
            >
              Different businesses.
              <br />
              The same attention to detail.
            </h2>
          </div>
          <span className="hidden text-xs opacity-50">
            Selected client work / 01–04
          </span>
        </div>
        <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2">
          {clients.map((client, index) => (
            <article key={client.slug}>
              <a
                href={client.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-8"
              >
                <div
                  className={`overflow-hidden rounded-xl p-3 ${client.surface}`}
                >
                  <div className="mb-3 flex items-center justify-between text-[10px] tracking-wider text-stone-600 uppercase">
                    <span>
                      0{index + 1} / {client.category}
                    </span>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </div>
                  <Image
                    src={clientImages[client.slug]}
                    alt={`${client.name} homepage showing ${client.imageDescription}`}
                    width={1440}
                    height={900}
                    sizes="(max-width: 640px) 100vw, 300px"
                    preload={index === 0}
                    className="aspect-[8/5] w-full rounded-md object-cover shadow-lg transition-transform duration-500 group-hover:-translate-y-1 motion-reduce:transform-none"
                  />
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <h3 className="text-base leading-snug font-medium tracking-tight">
                    {client.name}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </h3>
                  <ArrowUpRight
                    size={20}
                    className="shrink-0 opacity-50"
                    aria-hidden="true"
                  />
                </div>
              </a>
              <p className="mt-2 max-w-md text-sm leading-relaxed opacity-65">
                {client.description}
              </p>
              <p className="mt-4 text-[11px] tracking-wide uppercase opacity-45">
                {client.category} · Website development
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="services-heading"
        className="mt-20 border-t border-current/15 pt-12 sm:mt-16 sm:pt-12"
      >
        <div className="grid gap-10 sm:grid-cols-[1fr_1.4fr] sm:gap-8">
          <div>
            <p className="mb-4 text-xs tracking-[0.18em] uppercase opacity-50">
              How I can help
            </p>
            <h2
              id="services-heading"
              className="text-2xl font-medium tracking-tight"
            >
              A useful website.
              <br />A solid foundation.
            </h2>
            <p className="mt-5 text-sm leading-relaxed opacity-65">
              From a focused portfolio to a more involved web application, the
              work starts with what your business and your visitors need.
            </p>
          </div>
          <div>
            {services.map((service, index) => (
              <div
                key={service.title}
                className="flex gap-5 border-b border-current/15 py-6 first:pt-0 last:border-0"
              >
                <span className="pt-1 text-xs opacity-40">0{index + 1}</span>
                <div>
                  <h3 className="text-lg font-medium">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed opacity-65">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="process-heading"
        className="mt-16 rounded-2xl bg-current/[0.04] p-7 ring-1 ring-current/10 sm:mt-12 sm:p-6"
      >
        <p className="mb-4 text-xs tracking-[0.18em] uppercase opacity-50">
          Working together
        </p>
        <h2
          id="process-heading"
          className="text-2xl font-medium tracking-tight"
        >
          Clear steps. Open conversation.
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {processSteps.map((step, index) => (
            <div key={step.title}>
              <span className="text-xs opacity-40">/ 0{index + 1}</span>
              <h3 className="mt-4 text-lg font-medium">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed opacity-65">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-16 flex flex-col justify-between gap-8 rounded-2xl bg-[#d9e5d4] p-8 text-[#18271c] sm:mt-12 sm:p-8">
        <div>
          <p className="mb-5 text-xs tracking-[0.18em] uppercase opacity-65">
            Your next chapter
          </p>
          <h2 className="max-w-lg text-3xl leading-tight font-medium tracking-tight">
            Let’s make something
            <br />
            you’re proud to share.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed opacity-75">
            Tell me about your business, your idea, or the website you’ve
            outgrown. We’ll figure out a good next step.
          </p>
        </div>
        <Link
          href="/contact?from=clients"
          className="inline-flex shrink-0 items-center justify-center gap-4 self-start rounded-full bg-[#18271c] px-6 py-4 text-sm text-white transition-colors hover:bg-[#304535] sm:self-start"
        >
          Start a conversation <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </footer>
    </main>
  );
}
