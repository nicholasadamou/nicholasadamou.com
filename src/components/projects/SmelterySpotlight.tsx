"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { ArrowUpRight, GitBranch, Pause, Play } from "lucide-react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { features } from "@/lib/projects/spotlights";

export default function SmelterySpotlight({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!playing || reduced) return;
    const timer = window.setInterval(
      () => setIndex((value) => (value + 1) % features.length),
      9000
    );
    return () => window.clearInterval(timer);
  }, [playing, reduced]);
  const feature = features[index];
  const learning = feature.name === "Learn Git";
  const palette = {
    "--spot-paper": feature.paper || (learning ? "#f0eade" : "#eceee5"),
    "--spot-ink": feature.ink || "#292b25",
    "--spot-accent": feature.color || (learning ? "#896144" : "#526447"),
  } as CSSProperties;
  return (
    <motion.section
      layout="size"
      transition={{ layout: { duration: reduced ? 0 : 0.3 } }}
      style={palette}
      aria-label="Explore Smeltery"
      aria-roledescription="carousel"
      onMouseEnter={() => setPlaying(false)}
      onFocusCapture={(event) => {
        if (!(event.target as HTMLElement).closest("[data-rotation-control]"))
          setPlaying(false);
      }}
      className="@container overflow-hidden rounded-2xl border border-black/10 bg-[var(--spot-paper)] text-[var(--spot-ink)] transition-colors duration-500 motion-reduce:transition-none"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          initial={{ opacity: reduced ? 1 : 0, x: reduced ? 0 : 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: reduced ? 1 : 0, x: reduced ? 0 : -12 }}
          transition={{ duration: reduced ? 0 : 0.22, ease: "easeOut" }}
          key={index}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${features.length}: ${feature.name}`}
          className={`grid ${compact ? "gap-4 p-4" : "gap-8 p-6 @min-[36rem]:grid-cols-[1.2fr_1fr] @min-[36rem]:p-8"}`}
        >
          <div>
            <div
              className={`flex items-center gap-2 text-sm font-medium ${compact ? "mb-3" : "mb-5"}`}
            >
              {learning ? (
                <GitBranch size={compact ? 20 : 28} aria-hidden="true" />
              ) : (
                <Image
                  src={feature.logo || "/brands/smeltery.svg"}
                  alt=""
                  width={compact ? 20 : 28}
                  height={compact ? 21 : 29}
                />
              )}
              {feature.name}
            </div>
            <p
              className={`${compact ? "hidden" : "mb-3 text-xs tracking-wide opacity-75"}`}
            >
              {feature.eyebrow}
            </p>
            <h2
              className={`leading-tight font-medium tracking-tight ${compact ? "text-xl" : "text-3xl"}`}
            >
              {feature.title}
              <br />
              <span className="font-serif text-[var(--spot-accent)] italic">
                {feature.accent}
              </span>
            </h2>
            <p
              className={`text-sm leading-relaxed opacity-75 ${compact ? "mt-2" : "mt-4"}`}
            >
              {feature.description}
            </p>
            <a
              href={feature.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-3 rounded-full bg-[var(--spot-ink)] font-medium text-[#f7f7f2] transition-colors hover:bg-[var(--spot-accent)] ${compact ? "mt-4 px-4 py-2 text-xs" : "mt-6 px-5 py-3 text-sm"}`}
            >
              {feature.action}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <p className={compact ? "hidden" : "mt-3 text-xs opacity-50"}>
              {feature.note ||
                (learning
                  ? "Free. Open source. Beginner friendly."
                  : feature.logo
                    ? "Built for Mac. Made for your workflow."
                    : "Open source. Made to be useful.")}
            </p>
          </div>
          <div
            aria-hidden="true"
            className={`${compact ? "hidden" : "self-center"} rounded-xl border border-[#e1e3d9] bg-[#f7f7f2] shadow-sm @min-[36rem]:rotate-2`}
          >
            <div className="flex items-center gap-2 border-b border-current/10 px-4 py-3 text-xs">
              {learning ? (
                <GitBranch size={18} />
              ) : (
                <Image
                  src={feature.logo || "/brands/smeltery.svg"}
                  alt=""
                  width={18}
                  height={19}
                />
              )}
              <span>{feature.name}</span>
              <span className="ml-auto opacity-30">● ● ●</span>
            </div>
            <div className="flex items-center gap-3 p-5">
              {learning && (
                <svg
                  viewBox="0 0 50 160"
                  className="h-40 w-10 shrink-0"
                  fill="none"
                  strokeWidth="2"
                >
                  <path d="M10 10v140" stroke="#718760" />
                  <path
                    d="M10 40c0 20 30 10 30 35v15c0 25-30 15-30 40"
                    stroke="#b37e55"
                  />
                  {[10, 40, 130, 150].map((y) => (
                    <circle
                      key={y}
                      cx="10"
                      cy={y}
                      r="5"
                      fill="#f7f7f2"
                      stroke="#718760"
                    />
                  ))}
                  {[75, 90].map((y) => (
                    <circle
                      key={y}
                      cx="40"
                      cy={y}
                      r="5"
                      fill="#f0eade"
                      stroke="#b37e55"
                    />
                  ))}
                </svg>
              )}
              <ol className="flex-1 space-y-6">
                {feature.steps.map((step, stepIndex) => (
                  <li
                    key={step}
                    className="flex items-center gap-3 text-xs leading-relaxed"
                  >
                    {!learning && (
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#eceee5] font-mono text-[var(--spot-accent)]">
                        0{stepIndex + 1}
                      </span>
                    )}
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <p className="border-t border-current/10 px-4 py-3 font-mono text-[10px] opacity-50">
              {learning
                ? "Every small step is worth keeping."
                : "idea → workflow → possibility"}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
      <div
        className={`flex flex-wrap items-center gap-1 border-t border-current/10 ${compact ? "px-2 py-3" : "px-4 py-4"}`}
      >
        {features.map((item, itemIndex) => (
          <button
            key={item.name}
            type="button"
            aria-pressed={index === itemIndex}
            onClick={() => {
              setIndex(itemIndex);
              setPlaying(false);
            }}
            className={`cursor-pointer rounded-full px-3 py-2 text-xs transition-opacity hover:opacity-100 ${index === itemIndex ? "bg-white text-[var(--spot-accent)]" : "opacity-75"}`}
          >
            {item.name}
          </button>
        ))}
        {!reduced && (
          <button
            type="button"
            data-rotation-control
            onClick={() => setPlaying((value) => !value)}
            aria-label={playing ? "Pause rotation" : "Start rotation"}
            className="ml-auto cursor-pointer rounded-full p-3 opacity-60 hover:opacity-100"
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
        )}
      </div>
    </motion.section>
  );
}
