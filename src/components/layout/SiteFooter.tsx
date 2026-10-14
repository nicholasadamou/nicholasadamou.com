"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp, ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { ContentLink } from "@/components/ui/ContentLink";
import { brand } from "@/lib/brand";

export default function SiteFooter({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const pathname = usePathname();
  if (!embedded && ["/", "/og-preview", "/dashboard"].includes(pathname))
    return null;
  const linkClass =
    "inline-flex items-center gap-2 py-1 text-xs opacity-65 transition-opacity hover:opacity-100 focus-visible:opacity-100";
  return (
    <footer
      aria-label="Site footer"
      className={`text-foreground @container ${embedded ? "pt-8 pb-24" : "mx-auto -mt-16 max-w-2xl px-5 pb-32 sm:-mt-24 sm:pb-40"}`}
    >
      <div className="grid grid-cols-2 gap-x-8 gap-y-9 border-t border-current/15 pt-9 @[34rem]:grid-cols-[1.3fr_1fr_1fr]">
        <div className="col-span-2 space-y-3 @[34rem]:col-span-1">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/brand/portrait.png"
              alt=""
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-sm font-medium">{brand.name}</span>
          </Link>
          <p className="max-w-[16rem] text-xs leading-relaxed opacity-60">
            {brand.tagline}.
          </p>
        </div>
        <nav aria-label="Explore" className="flex flex-col items-start gap-2">
          <h2 className="mb-2 text-[10px] tracking-[0.15em] uppercase opacity-45">
            Explore
          </h2>
          {[
            ["Client work", "/clients"],
            ["Projects", "/projects"],
            ["Notes", "/notes"],
            ["About", "/about"],
          ].map(([label, href]) => (
            <Link key={href} href={href} className={linkClass}>
              {label}
            </Link>
          ))}
        </nav>
        <nav aria-label="Connect" className="flex flex-col items-start gap-2">
          <h2 className="mb-2 text-[10px] tracking-[0.15em] uppercase opacity-45">
            Let’s connect
          </h2>
          {[
            {
              label: "Email",
              href: "mailto:nicholasadamou@outlook.com",
              Icon: Mail,
            },
            {
              label: "GitHub",
              href: "https://github.com/nicholasadamou",
              Icon: Github,
            },
            {
              label: "LinkedIn",
              href: "https://linkedin.com/in/nicholas-adamou",
              Icon: Linkedin,
            },
          ].map(({ label, href, Icon }) => (
            <ContentLink key={href} href={href} className={linkClass}>
              <Icon size={14} />
              {label}
            </ContentLink>
          ))}
        </nav>
      </div>
      <div className="my-8 flex flex-wrap items-center justify-between gap-5 rounded-xl bg-current/5 p-5">
        <p className="max-w-[15rem] text-xl leading-tight font-medium tracking-tight">
          Good ideas deserve
          <br />
          to be built well.
        </p>
        <Link
          href="/contact?from=footer"
          className="bg-foreground text-background inline-flex min-h-11 items-center gap-3 rounded-full px-5 py-3 text-xs font-medium transition-opacity hover:opacity-80"
        >
          Start a project <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-current/15 pt-5 text-[10px]">
        <span className="w-full opacity-50 @[34rem]:w-auto">
          © {new Date().getUTCFullYear()} {brand.name}
        </span>
        <Link href="/privacy" className={linkClass}>
          Privacy
        </Link>
        <Link href="/brand" className={linkClass}>
          Brand resources
        </Link>
        <button
          type="button"
          className="ml-auto inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-current/20 px-3 text-[10px] transition-colors hover:bg-current/5"
          onClick={(event) => {
            const behavior = window.matchMedia(
              "(prefers-reduced-motion: reduce)"
            ).matches
              ? "instant"
              : "smooth";
            if (embedded)
              event.currentTarget
                .closest("footer")
                ?.parentElement?.scrollTo({ top: 0, behavior });
            window.scrollTo({ top: 0, behavior });
          }}
        >
          Back to top <ArrowUp size={13} />
        </button>
      </div>
    </footer>
  );
}
