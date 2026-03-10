"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import FeaturedGallery from "@/components/gallery/FeaturedGallery";
import AboutGallery from "./AboutGallery";
import { useTheme } from "@/components/ThemeProvider";

import arizona from "../../../public/images/gallery/arizona.jpg";
import lakePlacid from "../../../public/images/gallery/lake-placid.jpg";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const connectLinks = [
  { label: "GitHub", href: "https://github.com/nicholasadamou" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/nicholas-adamou",
  },
  { label: "LeetCode", href: "https://leetcode.com/nicholasadamou" },
  {
    label: "HackerRank",
    href: "https://www.hackerrank.com/profile/nicholas_adamou",
  },
  { label: "CodePen", href: "https://codepen.io/nicholasadamou" },
  { label: "VSCO", href: "https://vsco.co/nicholasadamou" },
  {
    label: "Gumroad",
    href: "https://nicholasadamou.gumroad.com",
  },
];

const credentials = [
  { label: "Credly", href: "https://www.credly.com/users/nicholas-adamou" },
];

const resumes = [
  { label: "Resume", href: "https://nicholas-adamou-cv.vercel.app" },
];

const workplaces = [
  {
    title: "Senior Software Engineer",
    company: "Onebrief",
    date: "Feb 2026 –",
    logo: "/images/work/onebrief-logo.svg",
    href: "https://onebrief.com",
  },
  {
    title: "Senior Software Engineer",
    company: "Lockheed Martin, Space",
    date: "Dec 2024 – Feb 2026",
    logo: "/images/work/lockheed-martin-logo.svg",
    href: "https://www.lockheedmartin.com/en-us/capabilities/space.html",
  },
  {
    title: "Senior Software Engineer",
    company: "Apple",
    date: "Sep 2024 – Nov 2024",
    logo: "/images/work/apple-logo.svg",
    href: "https://apple.com",
    contract: true,
  },
  {
    title: "Senior Software Engineer",
    company: "IBM",
    date: "Oct 2023 – Aug 2024",
    logo: "/images/work/ibm-logo.svg",
    href: "https://ibm.com",
  },
  {
    title: "Software Engineer II",
    company: "IBM",
    date: "May 2021 – Oct 2023",
    logo: "/images/work/ibm-logo.svg",
    href: "https://ibm.com",
  },
  {
    title: "Software Engineer I",
    company: "IBM",
    date: "May 2020 – May 2021",
    logo: "/images/work/ibm-logo.svg",
    href: "https://ibm.com",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AboutPageClient() {
  const {
    getTextColorClass,
    getOpacityClass,
    getLinkColorClass,
    getHrColorClass,
    shouldUseDarkText,
    isHydrated,
  } = useTheme();

  if (!isHydrated) return <main className="min-h-screen" />;

  const light = shouldUseDarkText();
  const cardBg = light ? "bg-stone-950/[0.03]" : "bg-white/[0.04]";
  const hr = `border-dashed ${getOpacityClass()} ${getHrColorClass()}`;

  const dashedLink = `border-b border-dashed pb-0.5 transition-opacity hover:opacity-60 ${getLinkColorClass()}`;

  return (
    <main
      className={`min-h-screen font-sans transition-colors duration-200 ${getTextColorClass()}`}
    >
      <div className="mx-auto max-w-2xl px-5 pb-32 pt-24 sm:pb-48 sm:pt-32">
        <div className="animate-fadeInHome1 space-y-12">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-medium sm:text-4xl">About</h1>
            <p className={`text-sm ${getOpacityClass()}`}>A glimpse into me.</p>
          </div>

          {/* Image section for mobile view */}
          <div className="relative mb-8 md:hidden">
            <Image
              src={arizona}
              alt="arizona"
              width={324}
              height={139}
              className="pointer-events-none relative inset-0 h-60 -rotate-6 rounded-xl bg-gray-400 object-cover shadow-md"
              priority
            />
            <Image
              src={lakePlacid}
              alt="lake-placid"
              width={220}
              height={260}
              className="pointer-events-none absolute inset-0 left-[55%] w-48 rotate-6 rounded-xl bg-gray-400 object-cover shadow-md md:left-[60%] md:w-56"
              priority
            />
          </div>

          {/* Gallery for larger screens */}
          <div className="hidden md:block">
            <AboutGallery />
          </div>

          <div className="animate-fadeInHome2 space-y-12">
            {/* ── Bio ── */}
            <section className="space-y-4 text-sm leading-relaxed">
              <p>
                I am a seasoned Senior Software Engineer with a strong academic
                foundation, holding a{" "}
                <a
                  href="https://www.parchment.com/u/award/6a9ef8b5cd81ba6e9befa8fd094e5a8e"
                  target="_blank"
                  className={dashedLink}
                >
                  Master of Science in Computer Science
                </a>{" "}
                from{" "}
                <a
                  href="https://www.gatech.edu"
                  target="_blank"
                  className={dashedLink}
                >
                  Georgia Institute of Technology
                </a>{" "}
                and a{" "}
                <a
                  href="https://drive.google.com/file/d/1ayD1gYOiD6pEq_mVtC64IUQYU1EB5yK2/view?usp=sharing"
                  target="_blank"
                  className={dashedLink}
                >
                  Bachelor of Arts in Computer Science
                </a>{" "}
                from{" "}
                <a
                  href="https://www.cornellcollege.edu"
                  target="_blank"
                  className={dashedLink}
                >
                  Cornell College
                </a>
                . My career is marked by a commitment to leveraging software
                engineering to create meaningful impact. I am a strong advocate
                for user-centered design and am passionate about creating
                well-designed products that are intuitive and easy to use.
              </p>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold">
                  What Got Me Into Coding
                </h3>
                <p>
                  My journey into programming began at a young age when my dad
                  introduced me to the game{" "}
                  <a
                    href="https://en.wikipedia.org/wiki/Asteroids_(video_game)"
                    target="_blank"
                    className={dashedLink}
                  >
                    Asteroids
                  </a>{" "}
                  on{" "}
                  <a
                    href="https://en.wikipedia.org/wiki/Windows_98"
                    target="_blank"
                    className={dashedLink}
                  >
                    Windows 98
                  </a>
                  . The simple yet captivating mechanics of navigating a
                  spaceship and dodging asteroids sparked my curiosity about how
                  computers worked and how games were created.
                </p>
                <p>
                  Fast forward to 2007, when my dad bought me{" "}
                  <a
                    href="https://en.wikipedia.org/wiki/Halo_3"
                    target="_blank"
                    className={dashedLink}
                  >
                    Halo 3
                  </a>
                  , my intrigue deepened. The expansive Halo universe captivated
                  me, especially the elusive{" "}
                  <a
                    href="https://halo.fandom.com/wiki/MJOLNIR_Powered_Assault_Armor/R_variant"
                    target="_blank"
                    className={dashedLink}
                  >
                    Recon armor
                  </a>
                  . Determined to unlock it, I scoured the web and discovered
                  YouTube tutorials that showed how to modify my service record
                  page on{" "}
                  <a
                    href="https://www.bungie.net"
                    target="_blank"
                    className={dashedLink}
                  >
                    Bungie.net
                  </a>
                  . This required using developer tools to tweak some code — the
                  experience of seeing the code behind the scenes fueled my
                  desire to understand and create within the digital world.
                </p>
              </div>
            </section>

            <hr className={hr} />

            {/* ── Connect ── */}
            <section className="space-y-4">
              <h2 className={`text-sm ${getOpacityClass()}`}>Connect</h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {connectLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${cardBg} hover:opacity-70`}
                  >
                    {link.label}
                    <ExternalLink className="h-3 w-3 opacity-40" />
                  </a>
                ))}
              </div>
            </section>

            <hr className={hr} />

            {/* ── Credentials ── */}
            <section className="space-y-4">
              <h2 className={`text-sm ${getOpacityClass()}`}>Credentials</h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {credentials.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${cardBg} hover:opacity-70`}
                  >
                    {c.label}
                    <ExternalLink className="h-3 w-3 opacity-40" />
                  </a>
                ))}
              </div>
            </section>

            <hr className={hr} />

            {/* ── Resume ── */}
            <section className="space-y-4">
              <h2 className={`text-sm ${getOpacityClass()}`}>Resume</h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {resumes.map((r) => (
                  <a
                    key={r.label}
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${cardBg} hover:opacity-70`}
                  >
                    {r.label}
                    <ExternalLink className="h-3 w-3 opacity-40" />
                  </a>
                ))}
              </div>
            </section>

            <hr className={hr} />

            {/* ── Photography ── */}
            <section className="space-y-4">
              <h2 className={`text-sm ${getOpacityClass()}`}>Photography</h2>
              <p className={`text-sm leading-relaxed ${getOpacityClass()}`}>
                Beyond software engineering, I have a passion for photography
                and visual storytelling. You can explore my work on{" "}
                <a
                  href="https://vsco.co/nicholasadamou"
                  target="_blank"
                  className={dashedLink}
                >
                  VSCO
                </a>
                .
              </p>
              <FeaturedGallery />
              <div className="flex gap-3">
                <Link
                  href="/gallery"
                  className={`text-sm transition-opacity hover:opacity-60 ${getLinkColorClass()}`}
                >
                  View Gallery →
                </Link>
              </div>
            </section>

            <hr className={hr} />

            {/* ── Work ── */}
            <section className="space-y-4">
              <h2 className={`text-sm ${getOpacityClass()}`}>Work</h2>
              <p className={`text-sm leading-relaxed ${getOpacityClass()}`}>
                I specialize in Full Stack Development and DevOps, focusing on
                creating scalable applications and optimizing development
                processes.
              </p>
              <ul className="space-y-1">
                {workplaces.map((wp) => (
                  <li key={`${wp.company}-${wp.title}`}>
                    <a
                      href={wp.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:opacity-70 ${cardBg}`}
                    >
                      <Image
                        src={wp.logo}
                        alt={wp.company}
                        width={36}
                        height={36}
                        className="flex-shrink-0 rounded-full"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{wp.title}</p>
                        <p className={`text-xs ${getOpacityClass()}`}>
                          {wp.company}
                          {wp.contract && " (contract)"}
                        </p>
                      </div>
                      <span
                        className={`hidden whitespace-nowrap text-xs sm:block ${getOpacityClass()}`}
                      >
                        {wp.date}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
