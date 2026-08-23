export interface AboutLink {
  label: string;
  href: string;
}

export const connectLinks: AboutLink[] = [
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

export const credentials: AboutLink[] = [
  { label: "Credly", href: "https://www.credly.com/users/nicholas-adamou" },
];

export const resumes: AboutLink[] = [
  { label: "Resume", href: "https://nicholas-adamou-cv.vercel.app" },
];

export interface DeveloperResource extends AboutLink {
  /** Same-origin app route — render with next/link, no external-link icon. */
  internal?: boolean;
}

export const developerResources: DeveloperResource[] = [
  { label: "Projects", href: "/projects", internal: true },
  { label: "Notes", href: "/notes", internal: true },
  { label: "GitHub", href: "https://github.com/nicholasadamou" },
  { label: "llms.txt", href: "/llms.txt" },
  { label: "Sitemap", href: "/sitemap.xml" },
];

export interface Workplace {
  title: string;
  company: string;
  date: string;
  logo: string;
  href: string;
  contract?: boolean;
}

export const workplaces: Workplace[] = [
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
