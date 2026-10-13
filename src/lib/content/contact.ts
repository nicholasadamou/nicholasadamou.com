import { z } from "zod";

export const projectTypes = [
  "New website",
  "Website redesign",
  "Web application",
  "Integrations & internal tools",
  "DevOps & infrastructure",
  "Something else",
] as const;
export const timelines = [
  "Flexible / exploring",
  "Within a month",
  "1–3 months",
  "3+ months",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100),
  email: z.email("Please enter a valid email address.").max(254),
  company: z.string().trim().max(150).optional(),
  website: z.union([z.url({ protocol: /^https?$/ }), z.literal("")]).optional(),
  projectType: z.enum(projectTypes, { error: "Please choose a project type." }),
  budget: z.string().trim().max(150).optional(),
  timeline: z.enum(timelines, { error: "Please choose a timeframe." }),
  message: z
    .string()
    .trim()
    .min(20, "Please share at least 20 characters about your project.")
    .max(5000, "Please keep your project brief under 5,000 characters."),
  source: z.enum(["clients", "contact"]).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const contactFields = [
  {
    name: "name",
    label: "Your name",
    placeholder: "First and last name",
    type: "text",
    autoComplete: "name",
    required: true,
  },
  {
    name: "email",
    label: "Email address",
    placeholder: "you@company.com",
    type: "email",
    autoComplete: "email",
    required: true,
  },
  {
    name: "company",
    label: "Business or organization",
    placeholder: "Who is the project for?",
    type: "text",
    autoComplete: "organization",
  },
  {
    name: "website",
    label: "Current website",
    placeholder: "https://example.com",
    type: "url",
    autoComplete: "url",
  },
] as const;
