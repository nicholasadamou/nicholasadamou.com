"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Pause, Play } from "lucide-react";
import { YOUBUILDIT_URL } from "@/lib/projects/config";

const challenges = [
  {
    title: "Build your own Redis",
    slug: "build-your-own-redis",
    level: "Intermediate",
    detail: "Key-value storage, persistence, and network protocols.",
  },
  {
    title: "Build your own JSON parser",
    slug: "build-your-own-json-parser",
    level: "Intermediate",
    detail: "Turn raw text into structured data, one token at a time.",
  },
  {
    title: "Build your own shell",
    slug: "build-your-own-shell",
    level: "Advanced",
    detail: "Explore processes, command parsing, and system calls.",
  },
];

export default function YouBuildItChallenges({
  compact,
}: {
  compact: boolean;
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
      () => setIndex((i) => (i + 1) % challenges.length),
      7000
    );
    return () => window.clearInterval(timer);
  }, [playing, reduced]);
  const change = (direction: number) => {
    setPlaying(false);
    setIndex((i) => (i + direction + challenges.length) % challenges.length);
  };
  const challenge = challenges[index];
  return (
    <div
      aria-label="Featured coding challenges"
      aria-roledescription="carousel"
      className={`${compact ? "mt-4" : ""} overflow-hidden rounded-xl border border-[#dce3d8] bg-white shadow-sm`}
      onMouseEnter={() => setPlaying(false)}
    >
      <div className="flex items-center justify-between border-b border-[#dce3d8] bg-[#e0eee5] px-4 py-3 font-mono text-[11px] text-[#26754e]">
        <span>your-next-build</span>
        <span>
          {index + 1} / {challenges.length}
        </span>
      </div>
      <div className={`${compact ? "min-h-24" : "min-h-44"} p-4`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={challenge.slug}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: reduced ? 0 : 0.18 }}
          >
            <p className="mb-2 text-[10px] tracking-widest text-[#62695d] uppercase">
              {challenge.level}
            </p>
            <a
              href={`${YOUBUILDIT_URL}/challenge/${challenge.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              onFocus={() => setPlaying(false)}
              className="text-sm font-semibold underline-offset-4 hover:underline"
            >
              {challenge.title} ↗
            </a>
            {!compact && (
              <p className="mt-3 text-sm leading-relaxed text-[#62695d]">
                {challenge.detail}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-[#dce3d8] px-3 py-2">
        <span className="flex items-center gap-1 text-[10px] text-[#26754e]">
          <Check size={12} aria-hidden="true" /> Solution included
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous challenge"
            onClick={() => change(-1)}
            className="cursor-pointer rounded p-2 hover:bg-[#e0eee5]"
          >
            <ArrowLeft size={14} />
          </button>
          {!reduced && (
            <button
              type="button"
              aria-label={playing ? "Pause challenges" : "Play challenges"}
              onClick={() => setPlaying((p) => !p)}
              className="cursor-pointer rounded p-2 hover:bg-[#e0eee5]"
            >
              {playing ? <Pause size={14} /> : <Play size={14} />}
            </button>
          )}
          <button
            type="button"
            aria-label="Next challenge"
            onClick={() => change(1)}
            className="cursor-pointer rounded p-2 hover:bg-[#e0eee5]"
          >
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
