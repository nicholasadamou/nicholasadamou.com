import { Metadata } from "next";
import Image from "next/image";
import React from "react";

import Link from "@/components/common/Link";
import Section from "@/components/common/Section";
import ListSection from "./components/ListSection";
import Workplaces from "./components/Workplaces";
import Gallery from "./components/Gallery";
import PhotographySection from "./components/PhotographySection";

import ibmLogo from "public/work/ibm-logo.svg";
import appleLogo from "public/work/apple-logo.svg";
import lockheedMartinLogo from "public/work/lockheed-martin-logo.svg";

import arizona from "public/gallery/arizona.jpg";
import lakePlacid from "public/gallery/lake-placid.jpg";

import { Certificates, Resumes, ConnectLinks } from "./data";

export const metadata: Metadata = {
  title: "About | Nicholas Adamou",
  description:
    "Software Engineer who is passionate about making the world better through software.",
};

export default function About() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-16 overflow-hidden px-4 md:gap-24 md:overflow-visible">
      <div>
        <h1 className="animate-in text-primary text-3xl font-black tracking-tight">
          About
        </h1>
        <p
          className="animate-in text-secondary mt-5"
          style={{ "--index": 1 } as React.CSSProperties}
        >
          A glimpse into me.
        </p>
      </div>

      {/* Image section for mobile view */}
      <div className="mb-8 md:hidden">
        <div
          className="animate-in"
          style={{ "--index": 1 } as React.CSSProperties}
        >
          <Image
            src={arizona}
            alt="arizona"
            width={324}
            height={139}
            className="pointer-events-none relative inset-0 h-60 -rotate-6 rounded-xl bg-gray-400 object-cover shadow-md"
            priority
          />
        </div>

        <div
          className="animate-in"
          style={{ "--index": 2 } as React.CSSProperties}
        >
          <Image
            src={lakePlacid}
            alt="lake-placid"
            width={220}
            height={260}
            className="pointer-events-none absolute inset-0 -top-48 left-[45%] w-48 rotate-6 rounded-xl bg-gray-400 object-cover shadow-md md:left-[60%] md:w-56"
            priority
          />
        </div>
      </div>

      {/* Gallery for larger screens */}
      <div className="hidden md:block">
        <Gallery />
      </div>

      <div
        className="animate-in flex flex-col gap-16 md:gap-24"
        style={{ "--index": 3 } as React.CSSProperties}
      >
        <Section heading="About" headingAlignment="left">
          <div className="flex flex-col gap-6">
            <p>
              I am a seasoned Senior Software Engineer with a strong academic
              foundation, holding a{" "}
              <Link
                className="underline"
                href="https://www.parchment.com/u/award/6a9ef8b5cd81ba6e9befa8fd094e5a8e"
              >
                Master of Science in Computer Science
              </Link>{" "}
              from{" "}
              <Link className="underline" href="https://www.gatech.edu">
                Georgia Institute of Technology
              </Link>{" "}
              and a{" "}
              <Link
                className="underline"
                href="https://drive.google.com/file/d/1ayD1gYOiD6pEq_mVtC64IUQYU1EB5yK2/view?usp=sharing"
              >
                Bachelor of Arts in Computer Science
              </Link>{" "}
              from{" "}
              <Link className="underline" href="https://www.cornellcollege.edu">
                Cornell College
              </Link>
              . My career is marked by a commitment to leveraging software
              engineering to create meaningful impact. I have a proven track
              record of delivering high-quality software solutions that meet the
              needs of users and stakeholders. I am a strong advocate for
              user-centered design and am passionate about creating
              well-designed products that are intuitive and easy to use.
            </p>
          </div>
        </Section>

        <ListSection heading="Connect" items={ConnectLinks} />
        <ListSection heading="Certificates" items={Certificates} />
        <ListSection heading="Resume" items={Resumes} />

        <PhotographySection />

        <Section heading="Work" headingAlignment="left">
          <div className="flex w-full flex-col gap-8">
            <p>
              I specialize in Full Stack Development and DevOps, focusing on
              creating scalable applications and optimizing development
              processes. My experience at various organizations has enhanced my
              skills in both front-end and back-end development. I am passionate
              about continuous learning and always eager to explore new
              technologies, whether it&apos;s programming languages, cloud
              services, or containerization tools.
            </p>
            <Workplaces items={workplaces} />
          </div>
        </Section>
      </div>
    </div>
  );
}

const workplaces = [
  {
    title: "Senior Software Engineer",
    company: "Lockheed Martin, Space",
    date: "Dec 2024 -",
    imageSrc: lockheedMartinLogo,
    link: "https://www.lockheedmartin.com/en-us/capabilities/space.html",
  },
  {
    title: "Senior Software Engineer",
    company: "Apple",
    date: "Sep 2024 - Nov 2024",
    imageSrc: appleLogo,
    link: "https://apple.com",
    contract: true,
  },
  {
    title: "Senior Software Engineer",
    company: "IBM",
    date: "Oct 2023 - Aug 2024",
    imageSrc: ibmLogo,
    link: "https://ibm.com",
  },
  {
    title: "Software Engineer II",
    company: "IBM",
    date: "May 2021 - Oct 2023",
    imageSrc: ibmLogo,
    link: "https://ibm.com",
  },
  {
    title: "Software Engineer I",
    company: "IBM",
    date: "May 2020 - May 2021",
    imageSrc: ibmLogo,
    link: "https://ibm.com",
  },
];
