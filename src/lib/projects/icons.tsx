import Image from "next/image";
import { ReactNode } from "react";

function YouBuildItIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 shrink-0"
    >
      <rect width="24" height="24" rx="6" fill="#2fbc77" />
      <path
        d="M6 8L10 12L6 16"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 16H18"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LearnGitIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0"
    >
      <line x1="6" x2="6" y1="3" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}

function NextJsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 180 180"
      className="h-4 w-4 shrink-0"
    >
      <mask
        id="mask0"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="180"
        height="180"
        style={{ maskType: "alpha" }}
      >
        <circle cx="90" cy="90" r="90" fill="black" />
      </mask>
      <g mask="url(#mask0)">
        <circle cx="90" cy="90" r="90" fill="black" />
        <path
          d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
          fill="url(#paint0)"
        />
        <rect x="115" y="54" width="12" height="72" fill="url(#paint1)" />
      </g>
      <defs>
        <linearGradient
          id="paint0"
          x1="109"
          y1="116.5"
          x2="144.5"
          y2="160.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1"
          x1="121"
          y1="54"
          x2="120.799"
          y2="106.875"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ImageIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={16}
      height={16}
      className="shrink-0 rounded"
      unoptimized={!src.endsWith(".png")}
    />
  );
}

function EmojiIcon({ emoji }: { emoji: string }) {
  return <span className="shrink-0 text-sm">{emoji}</span>;
}

export type ProjectIconType =
  | { kind: "image"; src: string }
  | { kind: "emoji"; emoji: string }
  | { kind: "component"; id: string };

const componentIcons: Record<string, () => ReactNode> = {
  youbuildit: YouBuildItIcon,
  "learn-git": LearnGitIcon,
  nextjs: NextJsIcon,
};

export function ProjectIcon({
  icon,
  name,
}: {
  icon: ProjectIconType;
  name: string;
}) {
  switch (icon.kind) {
    case "image":
      return <ImageIcon src={icon.src} alt={name} />;
    case "emoji":
      return <EmojiIcon emoji={icon.emoji} />;
    case "component": {
      const Component = componentIcons[icon.id];
      return Component ? <>{Component()}</> : null;
    }
  }
}
