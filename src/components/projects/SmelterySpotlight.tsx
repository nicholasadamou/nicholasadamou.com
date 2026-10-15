"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import Image from "next/image";

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
  },
];

export default function SmelterySpotlight() {
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
      className="overflow-hidden rounded-2xl border border-[#e1e3d9] bg-[#eceee5] text-[#292b25]"
    >
      <div
        key={index}
        role="group"
        aria-roledescription="slide"
        aria-label={`${index + 1} of 2: ${feature.name}`}
        className="motion-safe:animate-fadeInHome1 grid gap-8 p-6 sm:grid-cols-[1.2fr_1fr] sm:p-8"
      >
        <div>
          <div className="mb-5 flex items-center gap-2 text-sm font-medium">
            <Image src="/brands/smeltery.svg" alt="" width={28} height={29} />
            {feature.name}
          </div>
          <p className="mb-3 text-xs tracking-wide text-[#696d63]">
            {feature.eyebrow}
          </p>
          <h2 className="text-3xl leading-tight font-medium tracking-tight">
            {feature.title}
            <br />
            <span className="font-serif text-[#526447] italic">
              {feature.accent}
            </span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#696d63]">
            {feature.description}
          </p>
          <a
            href={feature.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#292b25] px-5 py-3 text-sm font-medium text-[#f7f7f2] transition-colors hover:bg-[#526447]"
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
          className="self-center rounded-xl border border-[#e1e3d9] bg-[#f7f7f2] shadow-sm sm:rotate-2"
        >
          <div className="flex items-center gap-2 border-b border-current/10 px-4 py-3 text-xs">
            <Image src="/brands/smeltery.svg" alt="" width={18} height={19} />
            <span>{feature.name}</span>
            <span className="ml-auto opacity-30">● ● ●</span>
          </div>
          <ol className="space-y-6 p-5">
            {feature.steps.map((step, stepIndex) => (
              <li
                key={step}
                className="flex items-center gap-3 text-xs leading-relaxed"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#eceee5] font-mono text-[#526447]">
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
            className={`cursor-pointer rounded-full px-3 py-2 text-xs transition-opacity hover:opacity-100 ${index === itemIndex ? "bg-white text-[#526447]" : "text-[#696d63]"}`}
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
