import YouBuildItChallenges from "./YouBuildItChallenges";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { YOUBUILDIT_URL } from "@/lib/projects/config";

export default function YouBuildItSpotlight({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <section
      aria-label="You Build It"
      className="@container overflow-hidden rounded-2xl border border-[#dce3d8] bg-[#f7f7f2] text-[#292c26]"
    >
      <div
        className={
          compact
            ? "p-4"
            : "grid items-center gap-8 p-6 @min-[36rem]:grid-cols-[1.1fr_1fr] @min-[36rem]:p-8"
        }
      >
        <div>
          <div className="mb-4 flex items-center gap-2 text-sm font-medium">
            <Image
              src="/images/projects/youbuildit-2026.svg"
              alt=""
              width={compact ? 24 : 28}
              height={compact ? 24 : 28}
            />
            You Build It
          </div>
          <h2
            className={`${compact ? "text-xl" : "text-3xl"} leading-tight font-semibold tracking-tight`}
          >
            Less watching.
            <br />
            <span className="font-serif font-normal text-[#26754e] italic">
              More building.
            </span>
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#62695d]">
            Get out of the tutorial loop. Build real tools, explore new ideas,
            and sharpen your skills in your own editor.
          </p>
          <a
            href={`${YOUBUILDIT_URL}/challenges`}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-5 inline-flex items-center gap-2 rounded-full bg-[#26754e] font-medium text-white transition-colors hover:bg-[#1c573a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#26754e] ${compact ? "px-4 py-2 text-xs" : "px-5 py-3 text-sm"}`}
          >
            Find your next challenge{" "}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
        <YouBuildItChallenges compact={compact} />
      </div>
      <div
        className={`${compact ? "px-4 py-3" : "px-6 py-4 @min-[36rem]:px-8"} border-t border-[#dce3d8] bg-[#e0eee5] text-[#3b624b]`}
      >
        <div
          aria-label="Build in your favorite language"
          className="mb-3 flex flex-wrap gap-x-4 gap-y-2"
        >
          {["TypeScript", "Python", "Go", "Rust", "JavaScript"].map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1.5 text-[11px]"
            >
              <Image
                src={`/brands/ybi-${name.toLowerCase()}.svg`}
                alt=""
                width={16}
                height={16}
              />
              {name}
            </span>
          ))}
        </div>
        <p className="text-xs">
          Every challenge includes a reference solution. Build your version,
          then compare.
        </p>
        <p className="mt-1 text-[11px]">
          Free to explore. No account. Just you and your editor.
        </p>
      </div>
    </section>
  );
}
