import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import brands from "../../../content/clients/brands.json";
import { clients } from "@/lib/content/clients";

export default function BrandShowcase({ slug }: { slug: keyof typeof brands }) {
  const brand = brands[slug];
  const client = clients.find((item) => item.slug === slug)!;
  const base = `/brands/clients/${slug}`;
  return (
    <section
      aria-label={`${client.name} visual identity`}
      className="not-prose my-8 space-y-6"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { file: "logo", label: "Primary identity", dark: false },
          { file: "secondary", label: brand.secondary, dark: brand.dark },
        ].map(({ file, label, dark }) => (
          <figure
            key={file}
            className="overflow-hidden rounded-xl border border-current/15"
          >
            <div
              className={`flex h-40 items-center justify-center p-6 ${dark ? "bg-[#161c1d]" : "bg-white"}`}
            >
              <Image
                src={`${base}/${file}.svg`}
                alt={`${client.name} — ${label}`}
                width={300}
                height={120}
                className="h-full w-full object-contain"
              />
            </div>
            <figcaption className="px-4 py-3 text-xs opacity-65">
              {label}
            </figcaption>
          </figure>
        ))}
      </div>
      <div>
        <p className="mb-3 text-xs tracking-widest uppercase opacity-60">
          Color palette
        </p>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {brand.palette.map(([name, hex]) => (
            <li
              key={hex}
              className="overflow-hidden rounded-lg border border-current/15"
            >
              <div
                className="h-16 border-b border-black/10"
                style={{ backgroundColor: hex }}
              />
              <div className="p-3">
                <p className="text-xs font-medium">{name}</p>
                <p className="mt-1 font-mono text-[11px] opacity-60">{hex}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-current/15 p-5">
        <p className="mb-4 text-xs tracking-widest uppercase opacity-60">
          Typography & voice
        </p>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-xs opacity-60">Headlines</dt>
            <dd className="mt-1 text-lg font-medium">{brand.heading}</dd>
          </div>
          <div>
            <dt className="text-xs opacity-60">Body & interface</dt>
            <dd className="mt-1 text-lg font-medium">{brand.body}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm leading-relaxed opacity-70">{brand.voice}</p>
        <p className="mt-3 text-sm leading-relaxed opacity-70">
          {brand.guidance}
        </p>
      </div>
      <figure>
        <Image
          src={`${base}/social.webp`}
          alt={`${client.name} branded social preview`}
          width={1200}
          height={630}
          sizes="(max-width: 720px) 100vw, 680px"
          className="h-auto w-full rounded-xl border border-current/15"
        />
        <figcaption className="mt-2 text-xs opacity-60">
          The identity in context · Social preview
        </figcaption>
      </figure>
      <a
        href={`${client.href}/brand/`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm underline decoration-current/30 underline-offset-4 hover:opacity-70"
      >
        Explore the full brand guide <ArrowUpRight size={15} />
      </a>
    </section>
  );
}
