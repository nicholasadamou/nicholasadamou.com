"use client";

import Link from "next/link";
import {
  Database,
  Settings,
  Share2,
  Shield,
  Lock,
  Bell,
  Mail,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

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

export default function PrivacyPageClient() {
  const {
    getTextColorClass,
    getOpacityClass,
    getLinkColorClass,
    shouldUseDarkText,
    isHydrated,
  } = useTheme();

  if (!isHydrated) return <main className="min-h-screen" />;

  const light = shouldUseDarkText();
  const cardBg = light ? "bg-stone-950/[0.03]" : "bg-white/[0.04]";
  const iconBg = light ? "bg-stone-950/[0.06]" : "bg-white/[0.08]";

  return (
    <main
      className={`min-h-screen font-sans transition-colors duration-200 ${getTextColorClass()}`}
    >
      <div className="mx-auto max-w-2xl px-5 pb-32 pt-24 sm:pb-48 sm:pt-32">
        <div className="animate-fadeInHome1 space-y-12">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-medium sm:text-4xl">Privacy Policy</h1>
            <p className={`text-sm leading-relaxed ${getOpacityClass()}`}>
              Your privacy matters. I&apos;m committed to being transparent
              about how I collect, use, and protect your personal information.
            </p>
          </div>

          {/* Cards */}
          <div className="animate-fadeInHome2 grid gap-4 sm:grid-cols-2">
            {privacySections.map((section) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.title}
                  className={`rounded-xl p-5 transition-opacity hover:opacity-80 ${cardBg}`}
                >
                  <div
                    className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold">
                    {section.title}
                  </h3>
                  <p className={`text-xs leading-relaxed ${getOpacityClass()}`}>
                    {section.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Contact CTA */}
          <div className={`rounded-xl p-6 text-center ${cardBg}`}>
            <div
              className={`mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}
            >
              <Mail className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <h3 className="mb-1.5 text-sm font-semibold">
              Questions About Privacy?
            </h3>
            <p className={`mb-4 text-xs leading-relaxed ${getOpacityClass()}`}>
              If you have any questions or concerns about this privacy policy,
              I&apos;m here to help.
            </p>
            <Link
              href="/contact"
              className={`inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-60 ${getLinkColorClass()}`}
            >
              <Mail className="h-3.5 w-3.5" />
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
