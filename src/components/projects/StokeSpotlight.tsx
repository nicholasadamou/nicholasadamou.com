import Image from "next/image";
import { ArrowUpRight, Check, Terminal } from "lucide-react";

const tools = [
  {
    name: "Bellows",
    role: "The orchestrator",
    description: "Plan, diagnose, and run GitHub Actions locally.",
    logo: "/brands/bellows.svg",
    href: "https://github.com/smeltery/bellows",
    color: "#f06a43",
  },
  {
    name: "Kiln",
    role: "The runner",
    description: "A Wolfi-based container environment for act.",
    logo: "/brands/kiln.svg",
    href: "https://github.com/smeltery/kiln",
    color: "#e5b05c",
  },
];

export default function StokeSpotlight({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <section
      id="stoke"
      aria-label="Explore Stoke"
      className="@container overflow-hidden rounded-2xl border border-[#343a43] bg-[#191c22] text-[#f5f3ed]"
    >
      <div className={compact ? "p-4" : "p-6 @min-[36rem]:p-8"}>
        <div className="flex items-center gap-2 text-sm font-medium">
          <Image src="/brands/stoke.svg" alt="" width={28} height={28} />
          Stoke
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-[#bbc2ca]">
            <span className="size-1.5 rounded-full bg-[#f06a43]" />
            Local CI
          </span>
        </div>
        <div
          className={`mt-5 grid items-center ${compact ? "gap-5" : "gap-8 @min-[36rem]:grid-cols-[1.1fr_1fr]"}`}
        >
          <div>
            <h2
              className={`${compact ? "text-2xl" : "text-2xl @min-[36rem]:text-4xl"} leading-tight font-semibold tracking-tight`}
            >
              Good work starts
              <br />
              <span className="text-[#e5b05c]">close to home.</span>
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#bbc2ca]">
              Bring feedback closer to your code. Stoke pairs Bellows and Kiln
              to run your GitHub Actions locally, before you push.
            </p>
            <a
              href="https://stoke-two.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-5 inline-flex items-center gap-2 rounded-full bg-[#e5b05c] font-medium text-[#191c22] transition-colors hover:bg-[#eadcca] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e5b05c] ${compact ? "px-4 py-2 text-xs" : "px-5 py-3 text-sm"}`}
            >
              Explore Stoke <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div
            aria-hidden="true"
            className="overflow-hidden rounded-xl border border-[#343a43] bg-[#12151a] font-mono text-[11px] shadow-[0_12px_32px_#00000030]"
          >
            <div className="flex items-center gap-2 border-b border-[#343a43] bg-[#242931] px-4 py-3 text-[#bbc2ca]">
              <Terminal size={13} />
              <span>feedback, before the push</span>
            </div>
            <div className={compact ? "p-4" : "p-5"}>
              <p className="text-[#f5f3ed]">
                <span className="mr-2 text-[#f06a43]">$</span>bellows run
              </p>
              <div className="mt-4 space-y-3 border-l border-[#e5b05c]/30 pl-4">
                {["lint", "test", "build"].map((job) => (
                  <div key={job} className="flex items-center gap-2">
                    <Check size={12} className="text-[#e5b05c]" />
                    <span className="text-[#bbc2ca]">{job}</span>
                    <span className="ml-auto text-[9px] text-[#e5b05c]">
                      passed
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 border-t border-[#343a43] pt-3 text-[10px] text-[#bbc2ca]">
                Bellows runs it. Kiln powers it.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`grid gap-px bg-[#343a43] ${compact ? "" : "@min-[28rem]:grid-cols-2"}`}
      >
        {tools.map((tool) => (
          <a
            key={tool.name}
            href={tool.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-start gap-3 border-t-2 bg-[#1f232a] transition-colors hover:bg-[#242931] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#e5b05c] ${compact ? "px-4 py-3" : "p-5 @min-[36rem]:px-8"}`}
            style={{ borderTopColor: tool.color }}
          >
            <Image
              src={tool.logo}
              alt=""
              width={26}
              height={26}
              className="mt-1 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p
                className="mb-1 font-mono text-[9px] tracking-widest uppercase"
                style={{ color: tool.color }}
              >
                {tool.role}
              </p>
              <span className="flex items-center gap-2 text-sm font-medium">
                {tool.name}
                <ArrowUpRight
                  size={14}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                />
              </span>
              <p className="mt-1 text-xs leading-relaxed text-[#bbc2ca]">
                {tool.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
