type Spotlight = {
  name: string;
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  action: string;
  href: string;
  steps: string[];
  note?: string;
  logo?: string;
  paper?: string;
  ink?: string;
  color?: string;
};

export const features: Spotlight[] = [
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
  {
    name: "Learn Git",
    eyebrow: "A little confidence for your next commit.",
    title: "Good ideas deserve",
    accent: "a little history.",
    description:
      "Get comfortable with Git and GitHub, one concept at a time. Save your work, try an idea, and build together.",
    action: "Start learning Git",
    href: "https://learn-git-five.vercel.app/",
    steps: [
      "Start with an idea",
      "Give it room to grow",
      "Bring the good bits together",
    ],
  },
  {
    name: "Harbor",
    eyebrow: "The Smeltery Mac testing family.",
    title: "Give your agents",
    accent: "room to work.",
    description:
      "One workspace for Smeltery\u2019s Mac app testing tools. Set up Slipway and Porthole together, without taking over your desktop.",
    action: "Explore Harbor",
    href: "https://github.com/smeltery/harbor",
    steps: ["Set up the workspace", "Test with Slipway", "Watch with Porthole"],
    logo: "/brands/harbor.svg",
    paper: "#eaf0f5",
    ink: "#192f49",
    color: "#42698f",
  },
  {
    name: "Slipway",
    eyebrow: "The Smeltery Mac testing family.",
    title: "Test your app.",
    accent: "Keep your screen.",
    description:
      "Give your coding agent a headless Mac for launching apps, taking screenshots, and testing over SSH.",
    action: "Discover Slipway",
    href: "https://github.com/smeltery/slipway",
    steps: [
      "Send your app to a VM",
      "Launch and interact",
      "Capture what happened",
    ],
    logo: "/brands/slipway.svg",
    paper: "#f5e8df",
    ink: "#392b27",
    color: "#b6543c",
  },
  {
    name: "Porthole",
    eyebrow: "The Smeltery Mac testing family.",
    title: "See what your",
    accent: "agents are doing.",
    description:
      "A native Mac window into your test VM: live screens, agent sessions, and command history in one place.",
    action: "Explore Porthole",
    href: "https://github.com/smeltery/porthole",
    steps: [
      "Watch the live screen",
      "Follow agent sessions",
      "Review the timeline",
    ],
    logo: "/brands/porthole.svg",
    paper: "#eee7f5",
    ink: "#30273e",
    color: "#79559b",
  },
  {
    name: "Convrt",
    eyebrow: "A new format, without the extra friction.",
    title: "New format.",
    accent: "Same file. Your device.",
    description:
      "Convert images, video, audio, and PDFs from your desktop or terminal. Desktop and CLI conversions stay on your device.",
    action: "Explore Convrt",
    href: "https://github.com/smeltery/convrt",
    steps: ["Choose your file", "Pick the format", "Keep building"],
    logo: "/brands/convrt.svg",
    paper: "#eef0e8",
    ink: "#292c26",
    color: "#62685b",
    note: "Desktop and CLI. On-device conversion.",
  },
];
