import Image from "next/image";
import { ArrowUpRight, Check, Monitor, Terminal } from "lucide-react";

const tools = [
  {
    name: "Slipway",
    role: "Run the test",
    description: "A headless Mac for your coding agent.",
    logo: "/brands/slipway.svg",
    href: "https://github.com/smeltery/slipway",
  },
  {
    name: "Porthole",
    role: "See the session",
    description: "Live screens, sessions, and command history.",
    logo: "/brands/porthole.svg",
    href: "https://github.com/smeltery/porthole",
  },
];

export default function HarborSpotlight({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <section
      id="harbor"
      aria-label="Explore Harbor"
      className="@container overflow-hidden rounded-2xl border border-[#c9d7e3] bg-[#eaf0f5] text-[#192f49]"
    >
      <div className={compact ? "p-4" : "p-6 @min-[36rem]:p-8"}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Image src="/brands/harbor.svg" alt="" width={28} height={28} />
            Harbor
          </div>
          <span className="font-mono text-[10px] tracking-widest text-[#42698f] uppercase">
            Mac testing
          </span>
        </div>
        <div
          className={`mt-5 grid items-center ${compact ? "gap-5" : "gap-8 @min-[36rem]:grid-cols-[1.1fr_1fr]"}`}
        >
          <div>
            <h2
              className={`${compact ? "text-2xl" : "text-2xl @min-[36rem]:text-3xl"} leading-tight font-medium tracking-tight`}
            >
              Give your agents
              <br />
              <span className="font-serif text-[#42698f] italic">
                a Mac of their own.
              </span>
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#465d73]">
              Test in a headless Mac. Watch every session. Harbor brings Slipway
              and Porthole together, without taking over your desktop.
            </p>
            <a
              href="https://harbor-topaz.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-5 inline-flex items-center gap-2 rounded-full bg-[#192f49] font-medium text-white transition-colors hover:bg-[#42698f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#42698f] ${compact ? "px-4 py-2 text-xs" : "px-5 py-3 text-sm"}`}
            >
              Explore Harbor <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div
            aria-hidden="true"
            className="overflow-hidden rounded-xl border border-[#b8cbdc] bg-[#f7fafc] shadow-[0_8px_24px_#192f4910]"
          >
            <div className="flex items-center gap-1.5 border-b border-[#d4dfe9] bg-white/70 px-3 py-2.5">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="size-1.5 rounded-full bg-[#b8cbdc]"
                />
              ))}
              <span className="ml-2 font-mono text-[10px] text-[#42698f]">
                harbor / test workspace
              </span>
              <Monitor size={12} className="ml-auto text-[#42698f]" />
            </div>
            <div
              className={`grid grid-cols-[1fr_1.2fr] ${compact ? "min-h-24" : "min-h-40"}`}
            >
              <div className="flex flex-col gap-2 border-r border-[#d4dfe9] bg-[#e0e9f1] p-3">
                <span className="font-mono text-[9px] tracking-wider text-[#42698f] uppercase">
                  Agent session
                </span>
                {["Launch app", "Run interaction", "Capture screen"].map(
                  (step) => (
                    <span
                      key={step}
                      className="flex items-center gap-1.5 text-[10px]"
                    >
                      <Check size={11} className="shrink-0 text-[#42698f]" />
                      {step}
                    </span>
                  )
                )}
              </div>
              <div className="flex items-center justify-center p-4">
                <div className="w-full max-w-32 overflow-hidden rounded-md border border-[#c9d7e3] bg-white shadow-sm">
                  <div className="h-3 border-b border-[#d4dfe9] bg-[#edf3f8]" />
                  <div className="flex items-center gap-2 p-3">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#e0e9f1]">
                      <Image
                        src="/brands/harbor.svg"
                        alt=""
                        width={18}
                        height={18}
                      />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="h-1 w-full rounded bg-[#b8cbdc]" />
                      <div className="h-1 w-2/3 rounded bg-[#e0e9f1]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 border-t border-[#d4dfe9] bg-[#192f49] px-3 py-2 font-mono text-[10px] text-[#eaf0f5]">
              <Terminal size={12} />
              <span>your desktop stays yours.</span>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`grid gap-px border-t border-[#c9d7e3] bg-[#c9d7e3] ${compact ? "" : "@min-[28rem]:grid-cols-2"}`}
      >
        {tools.map((tool) => (
          <a
            key={tool.name}
            href={tool.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-start gap-3 bg-[#f3f7fa] transition-colors hover:bg-white focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#42698f] ${compact ? "px-4 py-3" : "p-5 @min-[36rem]:px-8"}`}
          >
            <Image
              src={tool.logo}
              alt=""
              width={26}
              height={26}
              className="mt-1 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="mb-1 font-mono text-[9px] tracking-widest text-[#42698f] uppercase">
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
              <p className="mt-1 text-xs leading-relaxed text-[#465d73]">
                {tool.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
