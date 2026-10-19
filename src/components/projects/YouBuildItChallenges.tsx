"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Pause,
  Play,
  Database,
  Braces,
  Terminal,
} from "lucide-react";
import { YOUBUILDIT_URL } from "@/lib/projects/config";

const challenges = [
  {
    title: "Build your own Redis",
    slug: "build-your-own-redis",
    level: "Intermediate",
    icon: Database,
    skills: ["Data structures", "Networking", "Persistence"],
    detail: "Key-value storage, persistence, and network protocols.",
  },
  {
    title: "Build your own JSON parser",
    slug: "build-your-own-json-parser",
    level: "Intermediate",
    icon: Braces,
    skills: ["Tokenization", "Parsing", "Validation"],
    detail: "Turn raw text into structured data, one token at a time.",
  },
  {
    title: "Build your own shell",
    slug: "build-your-own-shell",
    level: "Advanced",
    icon: Terminal,
    skills: ["Processes", "Command parsing", "System calls"],
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
  const ChallengeIcon = challenge.icon;
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
            <div className="mb-3 flex items-center gap-2.5">
              <span className="rounded-lg bg-[#e0eee5] p-2 text-[#26754e]">
                <ChallengeIcon size={20} aria-hidden="true" />
              </span>
              <p className="text-[10px] tracking-widest text-[#62695d] uppercase">
                {challenge.level}
              </p>
            </div>
            <a
              href={`${YOUBUILDIT_URL}/challenge/${challenge.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              onFocus={() => setPlaying(false)}
              className="text-sm font-semibold underline-offset-4 hover:underline"
            >
              {challenge.title} ↗
            </a>
            <p className="mt-2 text-xs leading-relaxed text-[#62695d]">
              {challenge.detail}
            </p>
            <ul
              aria-label="Skills you will practice"
              className="mt-3 flex flex-wrap gap-1.5"
            >
              {challenge.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-[#dce3d8] bg-[#f7f7f2] px-2 py-1 text-[10px] text-[#3b624b]"
                >
                  {skill}
                </li>
              ))}
            </ul>
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
