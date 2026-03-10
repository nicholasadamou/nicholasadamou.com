"use client";

import Image, { StaticImageData } from "next/image";
import { motion } from "framer-motion";

import arizona from "../../../public/images/gallery/arizona.jpg";
import lakePlacid from "../../../public/images/gallery/lake-placid.jpg";
import roadIsland from "../../../public/images/gallery/road-island.jpg";
import cactus from "../../../public/images/gallery/cactus.jpg";

type PhotoProps = {
  src: StaticImageData;
  alt: string;
  width: number;
  height: number;
  rotate: number;
  left: number;
  index: number;
};

function Photo({ src, alt, width, height, rotate, left, index }: PhotoProps) {
  return (
    <motion.div
      className="absolute mx-auto cursor-grab"
      style={{ rotate: `${rotate}deg`, left, width, height }}
      initial={{
        rotate: (rotate || 0) - 20,
        y: 200 + index * 20,
        opacity: 0,
      }}
      animate={{ rotate, y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        bounce: 0.2,
        duration: 0.8 + index * 0.05,
        delay: index * 0.15,
        opacity: {
          duration: 0.7,
          ease: [0.23, 0.64, 0.13, 0.99],
          delay: index * 0.15,
        },
      }}
      drag
      whileTap={{ scale: 1.1, cursor: "grabbing" }}
      whileDrag={{ scale: 1.1, cursor: "grabbing" }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="pointer-events-none h-full w-full rounded-xl bg-neutral-400 object-cover shadow-md"
        priority
      />
    </motion.div>
  );
}

export default function AboutGallery() {
  return (
    <section className="relative mx-auto flex h-[268px] max-w-[700px] justify-center gap-4">
      <Photo
        src={arizona}
        alt="arizona"
        width={324}
        height={239}
        rotate={-6}
        left={-76}
        index={1}
      />
      <Photo
        src={lakePlacid}
        alt="lake-placid"
        width={230}
        height={250}
        rotate={6.3}
        left={160}
        index={2}
      />
      <Photo
        src={roadIsland}
        alt="road-island"
        width={280}
        height={235}
        rotate={-5.4}
        left={300}
        index={3}
      />
      <Photo
        src={cactus}
        alt="cactus"
        width={220}
        height={260}
        rotate={7.6}
        left={530}
        index={4}
      />
    </section>
  );
}
