import { Metadata } from "next";
import React from "react";
import {
  Database,
  Settings,
  Share2,
  Shield,
  Lock,
  Bell,
  Mail,
  Info,
  CalendarDays,
} from "lucide-react";
import Link from "@/components/common/ui/Link";
import { getFileLastModifiedDate, formatLastUpdated } from "@/lib/git";

export const metadata: Metadata = {
  title: "Privacy Policy | Nicholas Adamou",
  description:
    "Learn about how I collect, use, and protect your personal information on nicholasadamou.com.",
};

const privacySections = [
  {
    icon: Database,
    title: "Information Collection",
    description:
      "I collect information directly from you when you use my services, and automatically as you navigate through the site. This may include personal details, contact information, and data related to your usage of my website.",
  },
  {
    icon: Settings,
    title: "How I Use Your Information",
    description:
      "I use your information to provide, improve, and personalize my services, communicate with you, understand user behavior, and for security purposes.",
  },
  {
    icon: Share2,
    title: "Data Sharing",
    description:
      "I do not share your personal information with third parties, except as necessary to provide my services, comply with the law, or protect my rights.",
  },
  {
    icon: Shield,
    title: "Your Rights",
    description:
      "You have the right to access, correct, or delete your personal information. Please contact me to exercise these rights.",
  },
  {
    icon: Lock,
    title: "Data Security",
    description:
      "I strive to protect your personal information but cannot guarantee its absolute security. I employ measures designed to protect your data from unauthorized access, disclosure, or destruction.",
  },
  {
    icon: Bell,
    title: "Policy Updates",
    description:
      "I may update this policy to reflect changes to my information practices. If I make significant changes, I will notify you by email or through a notice on my website.",
  },
];

export default function PrivacyPolicy() {
  const lastUpdated = getFileLastModifiedDate("src/app/privacy/page.tsx");
  const formattedDate = formatLastUpdated(lastUpdated);

  return (
    <div className="mx-auto mb-12 flex max-w-4xl flex-col gap-8">
      {/* Hero Section */}
      <div className="relative">
        <div className="animate-in flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-3">
              <h1 className="text-primary text-4xl font-black tracking-tight md:text-5xl">
                Privacy Policy
              </h1>
            </div>
            <div className="text-tertiary inline-flex items-center gap-1.5 text-sm">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Last updated: {formattedDate}</span>
            </div>
          </div>
          <p
            className="animate-in text-secondary max-w-3xl text-lg leading-relaxed md:text-xl"
            style={{ "--index": 1 } as React.CSSProperties}
          >
            Your privacy matters. I&apos;m committed to being transparent about
            how I collect, use, and protect your personal information. This
            policy explains my practices in clear, straightforward terms.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div
        className="animate-in grid gap-6 md:grid-cols-2 md:gap-8"
        style={{ "--index": 2 } as React.CSSProperties}
      >
        {privacySections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="bg-secondary hover:bg-tertiary border-primary hover:shadow-soft group relative overflow-hidden rounded-3xl border p-8 transition-all duration-300"
            >
              {/* Icon */}
              <div className="mb-6 inline-flex">
                <div className="bg-tertiary text-link flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-8 w-8" strokeWidth={2} />
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-3">
                <h3 className="text-primary text-xl font-bold md:text-2xl">
                  {section.title}
                </h3>
                <p className="text-secondary leading-relaxed">
                  {section.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact CTA */}
      <div
        className="bg-secondary border-primary animate-in relative overflow-hidden rounded-3xl border p-8 md:p-12"
        style={{ "--index": 3 } as React.CSSProperties}
      >
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          <div className="bg-tertiary text-link flex h-16 w-16 items-center justify-center rounded-2xl">
            <Mail className="h-8 w-8" />
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-primary text-2xl font-bold md:text-3xl">
              Questions About Privacy?
            </h3>
            <p className="text-secondary max-w-2xl text-lg leading-relaxed">
              If you have any questions or concerns about this privacy policy or
              how your data is handled, I&apos;m here to help.
            </p>
          </div>
          <Link
            href="/contact"
            className="btn-filled hover:shadow-soft inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold transition-all duration-300"
          >
            <Mail className="h-5 w-5" />
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
