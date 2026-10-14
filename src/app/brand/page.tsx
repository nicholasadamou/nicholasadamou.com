import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Code2,
  Download,
  Github,
  Layers3,
  PenLine,
} from "lucide-react";
import { brand } from "@/lib/brand";
import { generateOGUrl, pageMetadata } from "@/lib/og";
import portrait from "../../../public/brand/portrait.png";

export const metadata = pageMetadata(
  "Brand resources",
  "The visual identity of Nicholas Adamou: portrait, colors, typography, icons, and social cards.",
  "/brand",
  "brand"
);
const samples = [
  { title: brand.name, type: "homepage", description: brand.tagline },
  {
    title: "Client work",
    type: "clients",
    description: "Purposeful websites for independent businesses.",
  },
  {
    title: "Notes on building better software",
    type: "note",
    description: "Ideas, decisions, and lessons from making things work.",
  },
  {
    title: "Building an OpenAI-Powered Chat Assistant",
    type: "note",
    description: "A deep dive into streaming AI responses.",
    image: "/images/unsplash/4Mw7nkQDByk.jpg",
  },
];

export default function BrandPage() {
  return (
    <main className="text-foreground mx-auto max-w-2xl space-y-12 px-5 pt-24 pb-12 sm:pt-32 sm:pb-16">
      <header className="animate-fadeInHome1 space-y-4">
        <p className="text-xs tracking-[0.16em] uppercase opacity-60">
          The identity
        </p>
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
          Personal. Clear. Considered.
        </h1>
        <p className="text-sm leading-7 opacity-70">
          A small set of elements that make this work recognizably mine.
          Resources for sharing my work, introducing a collaboration, or keeping
          the site consistent.
        </p>
      </header>
      <section className="animate-fadeInHome2 space-y-5 border-t border-dashed border-current/15 pt-8">
        <h2 className="text-lg font-medium">01 — The identity</h2>
        <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-current/10 p-6">
          <Image
            src={portrait}
            alt="Nicholas Adamou in profile"
            width={104}
            height={104}
            className="rounded-2xl"
          />
          <div className="space-y-2">
            <p className="text-2xl font-medium tracking-tight">{brand.name}</p>
            <p className="text-sm opacity-60">{brand.role}</p>
          </div>
        </div>
        <p className="text-sm leading-7 opacity-70">
          The name is the wordmark; the monochrome portrait is the recognizable
          personal mark. Keep the portrait’s proportions and leave clear space
          around both. Use the full name on first reference.
        </p>
        <a
          href="/brand/portrait.png"
          download
          className="inline-flex items-center gap-2 text-sm underline underline-offset-4"
        >
          <Download size={15} /> Download portrait PNG
        </a>
        <div className="flex items-center gap-5 rounded-xl border border-current/10 p-4">
          {[16, 32, 48].map((size) => (
            <Image
              key={size}
              src={portrait}
              alt={`Portrait at ${size} pixels`}
              width={size}
              height={size}
              className="rounded-md"
            />
          ))}
          <span className="text-xs opacity-60">Browser and profile sizes</span>
        </div>
      </section>
      <section className="animate-fadeInHome2 space-y-5 border-t border-dashed border-current/15 pt-8">
        <h2 className="text-lg font-medium">02 — Warm neutrals</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Object.entries(brand.colors).map(([name, hex]) => (
            <div key={name} className="space-y-2">
              <div
                className="h-24 rounded-xl border border-current/15"
                style={{ backgroundColor: hex }}
              />
              <h3 className="text-sm capitalize">{name}</h3>
              <code className="text-xs opacity-60">{hex}</code>
            </div>
          ))}
        </div>
        <p className="text-sm leading-7 opacity-70">
          Paper on ink, or ink on paper, is the primary pairing. Stone supports
          secondary labels; surfaces create quiet separation. Keep essential
          text high contrast. Custom site themes are personal preferences, not
          new brand palettes.
        </p>
        <a
          href="/brand/tokens.json"
          download
          className="inline-flex items-center gap-2 text-sm underline underline-offset-4"
        >
          <Download size={15} /> Download color tokens
        </a>
      </section>
      <section className="animate-fadeInHome2 space-y-5 border-t border-dashed border-current/15 pt-8">
        <h2 className="text-lg font-medium">03 — Type & voice</h2>
        <div className="space-y-4 rounded-2xl border border-current/10 p-6">
          <p className="text-xs opacity-60">
            Inter · Regular / Medium / Semibold / Bold
          </p>
          <p className="text-3xl font-medium tracking-tight">{brand.tagline}</p>
          <p className="text-sm leading-7 opacity-70">
            Use short, direct sentences. Describe the outcome, explain the next
            step, and make room for the work to speak.
          </p>
        </div>
        <p className="text-sm leading-7 opacity-70">
          Keep headlines concise, paragraphs readable, and labels descriptive.
          Avoid inflated promises. Inter is bundled with the social renderer so
          cards do not rely on an external font request.
        </p>
      </section>
      <section className="animate-fadeInHome2 space-y-5 border-t border-dashed border-current/15 pt-8">
        <h2 className="text-lg font-medium">04 — Icons with a purpose</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { Icon: Code2, label: "Engineering" },
            { Icon: Layers3, label: "Client work" },
            { Icon: PenLine, label: "Writing" },
          ].map(({ Icon, label }) => {
            return (
              <div
                key={label}
                className="flex flex-col items-center gap-3 rounded-xl border border-current/10 p-5"
              >
                <Icon size={24} strokeWidth={1.5} />
                <span className="text-xs">{label}</span>
              </div>
            );
          })}
        </div>
        <p className="text-sm leading-7 opacity-70">
          Use Lucide line icons for navigation and topics, paired with a text
          label. Brand icons identify their own platforms; they do not imply
          endorsement. Never replace a company’s mark with an unrelated symbol.
        </p>
        <a
          href="https://github.com/nicholasadamou"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm"
        >
          <Github size={18} /> GitHub / nicholasadamou{" "}
          <ArrowUpRight size={14} />
        </a>
      </section>
      <section className="animate-fadeInHome2 space-y-5 border-t border-dashed border-current/15 pt-8">
        <h2 className="text-lg font-medium">05 — Social cards</h2>
        <p className="text-sm leading-7 opacity-70">
          1200 × 630 pixels. Consistent margins, a clear title, one supporting
          image when useful, and a quiet signature. Keep platform icons
          secondary to the message.
        </p>
        {samples.map((sample) => (
          <figure key={sample.title} className="space-y-3">
            <Image
              src={generateOGUrl(sample)}
              alt={`${sample.title} social card`}
              width={1200}
              height={630}
              unoptimized
              className="w-full rounded-xl border border-current/15"
            />
            <figcaption className="flex items-center justify-between text-xs">
              <span className="opacity-60">{sample.title}</span>
              <a
                href={generateOGUrl(sample)}
                download={`${sample.type}-social.png`}
                className="inline-flex items-center gap-1.5"
              >
                Download PNG <Download size={14} />
              </a>
            </figcaption>
          </figure>
        ))}
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-sm underline underline-offset-4"
        >
          Questions about using these assets? <ArrowUpRight size={15} />
        </Link>
      </section>
    </main>
  );
}
