import {
  Database,
  Settings,
  Share2,
  Shield,
  Lock,
  Bell,
  type LucideIcon,
} from "lucide-react";

export interface PrivacySection {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const privacySections: PrivacySection[] = [
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
