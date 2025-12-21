"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils/utils";

interface SparkleProps {
  color: string;
  style: React.CSSProperties;
  size: number;
}

const Sparkle: React.FC<SparkleProps> = ({ color, style, size }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    let startTime: number;
    let animationFrameId: number;

    // Randomize animation parameters
    const duration = 500 + Math.random() * 1000; // Random duration between 0.5s and 1.5s
    const delay = Math.random() * 1000; // Random delay up to 1s
    const initialPhase = Math.random() * Math.PI * 2; // Random initial phase

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime - delay;
      if (elapsed < 0) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const progress = (elapsed % duration) / duration;
      const phase = progress * Math.PI * 2 + initialPhase;

      const opacity = (Math.sin(phase) + 1) / 2;
      const scale = 0.75 + (Math.sin(phase) + 1) / 8; // Adjusted scale range
      const rotation = progress * 90;

      element.style.opacity = opacity.toString();
      element.style.transform = `scale(${scale}) rotate(${rotation}deg)`;

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <svg
      ref={ref}
      className="pointer-events-none absolute z-20"
      width={size}
      height={size}
      viewBox="0 0 21 21"
      style={style}
    >
      <path
        d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z"
        fill={color}
      />
    </svg>
  );
};

interface SparkleHeadingProps {
  children: React.ReactNode;
  className?: string;
  sparkleSize?: number;
  fontSize?: string;
  fontWeight?: string;
}

const SparkleText: React.FC<SparkleHeadingProps> = ({
  children,
  className,
  sparkleSize = 10,
  fontSize = "text-md",
  fontWeight = "font-normal",
}) => {
  const sparkles = [
    { color: "#9E7AFF", style: { left: "0%", top: "-20%" } },
    { color: "#9E7AFF", style: { right: "-5%", top: "20%" } },
    { color: "#FE8BBB", style: { left: "-5%", bottom: "-10%" } },
    { color: "#FE8BBB", style: { right: "0%", bottom: "-20%" } },
    { color: "#FE8BBB", style: { left: "10%", top: "-15%" } },
    { color: "#9E7AFF", style: { right: "20%", top: "-10%" } },
    { color: "#FE8BBB", style: { left: "20%", bottom: "-10%" } },
    { color: "#FE8BBB", style: { right: "15%", bottom: "-5%" } },
    { color: "#FE8BBB", style: { right: "-10%", top: "0%" } },
    { color: "#FE8BBB", style: { left: "0%", bottom: "0%" } },
  ];

  return (
    <div
      className={cn(
        fontSize,
        fontWeight,
        "relative inline-block tracking-tighter",
        className
      )}
      style={
        {
          "--sparkles-first-color": "#9E7AFF",
          "--sparkles-second-color": "#FE8BBB",
        } as React.CSSProperties
      }
    >
      {sparkles.map((sparkle, index) => (
        <Sparkle
          key={index}
          color={sparkle.color}
          style={sparkle.style}
          size={sparkleSize}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </div>
  );
};

export default SparkleText;
