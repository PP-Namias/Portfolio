import * as z from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2).max(64),
  email: z.string().trim().email().max(64),
  projectType: z.string().min(1, "Please select a project type"),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().trim().min(10).max(512),
});

export const projectTypes = [
  "Web Application",
  "Mobile App",
  "API Development",
  "UI/UX Design",
  "Consulting",
  "Other",
] as const;

export const budgetRanges = [
  "Under $1,000",
  "$1,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000+",
  "Not sure yet",
] as const;

export const timelines = [
  "ASAP (< 1 month)",
  "1-3 months",
  "3-6 months",
  "6+ months",
  "Flexible",
] as const;

