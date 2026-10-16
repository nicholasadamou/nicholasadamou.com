"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, GitBranch } from "lucide-react";
import Image from "next/image";
import { features } from "@/lib/projects/spotlights";

function ProjectLogo({ index }: { index: number }) {
  const item = features[index];
  return item.name === "Learn Git" ? (
    <GitBranch size={18} aria-hidden="true" className="shrink-0" />
  ) : (
    <Image
      src={item.logo || "/brands/smeltery.svg"}
      alt=""
      width={18}
      height={18}
      className="size-[18px] shrink-0 object-contain"
    />
  );
}

export default function SpotlightSelector({
  index,
  reduced,
  onOpen,
  onSelect,
}: {
  index: number;
  reduced: boolean;
  onOpen: () => void;
  onSelect: (index: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  return (
    <div
      ref={container}
      className="min-w-0 flex-1"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          close();
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-label={`Choose project: ${features[index].name}`}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          setOpen(!open);
          setQuery("");
          if (!open) onOpen();
        }}
        className="flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-xl bg-white/70 px-3 py-2 text-left text-xs hover:bg-white"
      >
        <ProjectLogo index={index} />
        <span className="min-w-0 flex-1 truncate">{features[index].name}</span>
        <span className="shrink-0 text-[10px] opacity-50">
          {index + 1} / {features.length}
        </span>
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`shrink-0 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 rounded-xl border border-black/10 bg-white/80 p-2">
              <input
                aria-label="Find a project"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Find a project…"
                className="mb-2 w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 text-xs outline-offset-2"
              />
              <div
                className="max-h-48 overflow-y-auto overscroll-contain"
                aria-label="Projects"
              >
                {features.map(
                  (item, itemIndex) =>
                    item.name
                      .toLowerCase()
                      .includes(query.toLowerCase().trim()) && (
                      <button
                        key={item.name}
                        type="button"
                        aria-pressed={itemIndex === index}
                        onClick={() => {
                          onSelect(itemIndex);
                          close();
                        }}
                        className="flex min-h-10 w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-xs hover:bg-black/5 focus-visible:bg-black/5"
                      >
                        <ProjectLogo index={itemIndex} />
                        <span className="min-w-0 flex-1 truncate">
                          {item.name}
                        </span>
                        {itemIndex === index && (
                          <Check size={14} aria-hidden="true" />
                        )}
                      </button>
                    )
                )}
                {!features.some((item) =>
                  item.name.toLowerCase().includes(query.toLowerCase().trim())
                ) && (
                  <p className="p-3 text-xs opacity-60">
                    No matching projects.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
