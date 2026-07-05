import type { User } from "@/features/portfolio/types/user"

export const USER: User = {
  firstName: "Jhon Keneth",
  lastName: "Namias",
  displayName: "PP Namias",
  username: "PP-Namias",
  gender: "male",
  pronouns: "he/him",
  bio: "Full Stack Engineer & AI Automation Specialist. Building production systems across enterprise, AI, and IoT.",
  flipSentences: [
    "Full Stack Engineer & AI Automation Specialist",
    "Building production systems that scale",
    "React, TypeScript, Node.js, Python",
    "University of Caloocan City, Batch 2026",
  ],
  address: "Caloocan City, Philippines",
  phoneNumberB64: "",
  emailB64: "cHAubmFtaWFzQGdtYWlsLmNvbQ==", // base64 of pp.namias@gmail.com
  website: "https://namias.tech",
  jobTitle: "Full Stack Engineer",
  jobs: [
    {
      title: "Software Developer",
      company: "JS Pharmacy",
      website: "",
      experienceId: "js-pharmacy",
    },
    {
      title: "AI Solutions Developer",
      company: "Wilshire Financial Network",
      website: "",
      experienceId: "wilshire-financial",
    },
  ],
  about: `I'm Jhon Keneth Ryan Namias (call me Namias) — a Full Stack Engineer & AI Automation Specialist with a passion for building production systems that scale.

Graduated Cum Laude with a BS in Computer Science from the University of Caloocan City (Batch 2026), recognized as a Dean's Lister throughout my studies.

I've delivered 5+ live applications serving over 1,000 concurrent users, including an enterprise HRIS for 500+ employees and 8 deployed AI chatbot systems. Skilled in React, TypeScript, Node.js, Python, and AI Automation.`,
  avatar: "https://github.com/PP-Namias.png",
  avatarVariants: {
    lightOff: "https://github.com/PP-Namias.png",
    lightOn: "https://github.com/PP-Namias.png",
    darkOff: "https://github.com/PP-Namias.png",
    darkOn: "https://github.com/PP-Namias.png",
  },
  ogImage: "https://namias.tech/og",
  namePronunciationUrl: "",
  timeZone: "Asia/Manila",
  keywords: [
    "pp-namias",
    "jhon keneth namias",
    "jhon keneth ryan namias",
    "namias",
    "full stack engineer",
    "ai automation",
    "react developer",
    "typescript",
    "node.js",
    "python",
  ],
  dateCreated: "2024-01-01",
}
