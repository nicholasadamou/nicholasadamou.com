"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const external = { target: "_blank", rel: "noopener noreferrer" };
const button =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#3d5b32] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2d4625] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3d5b32]";

export default function TransmuteShowcase() {
  return (
    <section
      aria-label="Transmute Games"
      className="@container overflow-hidden rounded-2xl border border-[#e1e3d9] bg-[#f7f7f2] text-[#292b25]"
    >
      <div className="grid items-center gap-6 p-6 @min-[36rem]:grid-cols-[1.1fr_1fr] @min-[36rem]:p-8">
        <div>
          <div className="mb-5 flex items-center gap-2 text-sm font-medium">
            <Image
              src="/images/projects/transmute-core-2026.svg"
              alt=""
              width={28}
              height={28}
            />
            Transmute Core
          </div>
          <p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-[#526447] uppercase">
            From engine to adventure
          </p>
          <h2 className="text-2xl leading-tight font-semibold tracking-tight @min-[36rem]:text-3xl">
            Small engine.
            <br />
            <span className="font-serif font-normal text-[#526447] italic">
              Whole worlds.
            </span>
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[#606655]">
            Build 2D pixel games in Java, from your first frame to a world worth
            exploring. Every frame in your hands.
          </p>
          <a
            href="https://transmute-core.vercel.app"
            {...external}
            className={`${button} mt-5`}
          >
            Explore the engine <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="overflow-hidden rounded-xl border border-[#dce2d0] bg-[#eceee5]">
          <Image
            src="/brands/transmute-world.svg"
            alt="A pixel landscape with an adventurer, trees, platforms, and collectible coins"
            width={640}
            height={420}
            className="h-auto w-full"
          />
          <p className="border-t border-[#dce2d0] px-4 py-3 font-mono text-[10px] text-[#526447]">
            Imagine. Build. Play.
          </p>
        </div>
      </div>
      <div className="border-t border-[#d7dfbf] bg-[#e6edce] px-6 py-8 text-center @min-[36rem]:p-10">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-[#526447] uppercase">
          Built with Transmute Core
        </p>
        <Image
          src="/brands/minicraft.webp"
          alt="Minicraft"
          width={388}
          height={60}
          className="mx-auto mt-4 mb-6 h-auto w-56 max-w-full [image-rendering:pixelated] @min-[36rem]:w-72"
        />
        <h3 className="text-2xl leading-tight font-semibold tracking-tight @min-[36rem]:text-3xl">
          A whole world.{" "}
          <span className="font-serif font-normal text-[#526447] italic">
            Meet Minicraft.
          </span>
        </h3>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[#4e5943]">
          A Minicraft+ adaptation powered by Transmute Core, with singleplayer
          survival and LAN multiplayer. See the engine become a playable game.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          <a
            href="https://github.com/transmute-games/minicraft"
            {...external}
            className={button}
          >
            Explore Minicraft <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <a
            href="https://transmute-core.vercel.app/docs/examples"
            {...external}
            className="text-sm underline underline-offset-4 transition-colors hover:text-[#526447]"
          >
            Build your own game
          </a>
        </div>
      </div>
    </section>
  );
}
