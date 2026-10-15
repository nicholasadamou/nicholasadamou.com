"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Code2, Layers, Pause, Play } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const features = [
  {
    name: "Smeltery Labs",
    eyebrow: "Less friction. More building.",
    title: "Small tools.",
    accent: "Bigger possibilities.",
    description:
      "Open-source tools for coding agents, Mac workflows, and the everyday work between an idea and a release.",
    action: "Explore the lab",
    href: "https://smeltery-labs.vercel.app/",
    steps: [
      "An idea worth trying",
      "A tool that gets it done",
      "More room to build",
    ],
    Icon: Code2,
  },
  {
    name: "Smeltery Skills",
    eyebrow: "A little expertise for your next idea.",
    title: "Better workflows.",
    accent: "Built into your agent.",
    description:
      "Practical skills for coding agents. Find a workflow, install it in one command, and get back to building.",
    action: "Find your next skill",
    href: "https://smeltery-skills.vercel.app/",
    steps: [
      "Find the right skill",
      "Give your agent a workflow",
      "Build on what works",
    ],
    Icon: Layers,
  },
];

export default function SmelterySpotlight() {
  const { shouldUseDarkText } = useTheme();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!playing || hovered || focused || reduced) return;
    const timer = window.setInterval(
      () => setIndex((value) => (value + 1) % features.length),
      9000
    );
    return () => window.clearInterval(timer);
  }, [playing, hovered, focused, reduced]);
  const feature = features[index];
  const light = shouldUseDarkText();
  return (
    <section
      aria-label="Explore Smeltery"
      aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
      className={`overflow-hidden rounded-2xl border ${light ? "border-stone-950/10 bg-stone-950/[0.03]" : "border-white/10 bg-white/[0.03]"}`}
    >
      <div
        key={index}
        role="group"
        aria-roledescription="slide"
        aria-label={`${index + 1} of 2: ${feature.name}`}
        className="motion-safe:animate-fadeInHome1 grid gap-8 p-6 sm:grid-cols-[1.2fr_1fr] sm:p-8"
      >
        <div>
          <p className="mb-5 text-xs tracking-wide opacity-60">
            {feature.eyebrow}
          </p>
          <h2 className="text-3xl leading-tight font-medium tracking-tight">
            {feature.title}
            <br />
            <span className="font-serif italic opacity-60">
              {feature.accent}
            </span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed opacity-70">
            {feature.description}
          </p>
          <a
            href={feature.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-6 inline-flex items-center gap-3 rounded-full px-5 py-3 text-sm font-medium transition-opacity hover:opacity-70 ${light ? "bg-stone-950 text-white" : "bg-white text-stone-950"}`}
          >
            {feature.action}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <p className="mt-3 text-xs opacity-50">
            Open source. Made to be useful.
          </p>
        </div>
        <div
          aria-hidden="true"
          className={`self-center rounded-xl border shadow-sm sm:rotate-2 ${light ? "border-stone-950/10 bg-white/70" : "border-white/10 bg-stone-950/60"}`}
        >
          <div className="flex items-center gap-2 border-b border-current/10 px-4 py-3 text-xs">
            <feature.Icon size={16} />
            <span>{feature.name}</span>
            <span className="ml-auto opacity-30">● ● ●</span>
          </div>
          <ol className="space-y-6 p-5">
            {feature.steps.map((step, stepIndex) => (
              <li
                key={step}
                className="flex items-center gap-3 text-xs leading-relaxed"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-current/20 font-mono opacity-50">
                  0{stepIndex + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <p className="border-t border-current/10 px-4 py-3 font-mono text-[10px] opacity-50">
            idea → workflow → possibility
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 border-t border-current/10 px-4 py-2">
        {features.map((item, itemIndex) => (
          <button
            key={item.name}
            type="button"
            aria-pressed={index === itemIndex}
            onClick={() => {
              setIndex(itemIndex);
              setPlaying(false);
            }}
            className={`cursor-pointer rounded-full px-3 py-2 text-xs transition-opacity hover:opacity-100 ${index === itemIndex ? "opacity-100" : "opacity-45"}`}
          >
            {item.name}
          </button>
        ))}
        {!reduced && (
          <button
            type="button"
            onClick={() => setPlaying(!playing)}
            aria-label={playing ? "Pause rotation" : "Start rotation"}
            className="ml-auto cursor-pointer rounded-full p-3 opacity-60 hover:opacity-100"
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
        )}
      </div>
    </section>
  );
}
