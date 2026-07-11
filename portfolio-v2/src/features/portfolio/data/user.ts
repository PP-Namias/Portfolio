import type { User } from "@/features/portfolio/types/user"

export const USER: User = {
  firstName: "Jhon Keneth",
  lastName: "Ryan B. Namias",
  displayName: "PP Namias",
  username: "PP-Namias",
  gender: "male",
  pronouns: "he/him",
  bio: "Creating with code. Small details matter.",
  flipSentences: [
    "Full-Stack Engineer & AI Solutions Developer",
    "Building scalable enterprise applications",
    "React, TypeScript, Python, Node.js",
    "University of Caloocan City, Batch 2026",
  ],
  address: "Manila, Philippines",
  phoneNumberB64: "KzYzOTI3MjUzMzk2OQ==", // base64 of +639272533969
  emailB64: "cHAubmFtaWFzQGdtYWlsLmNvbQ==", // base64 of pp.namias@gmail.com
  website: "https://namias.tech",
  jobTitle: "Full-Stack Engineer",
  jobs: [
    {
      title: "Software Engineering Intern",
      company: "Aeternitas Chapels & Columbarium",
      website: "",
      experienceId: "aeternitas",
    },
    {
      title: "AI Solutions Developer / Automation Specialist",
      company: "Wilshire Financial Network",
      website: "",
      experienceId: "wilshire-financial",
    },
    {
      title: "Fullstack Developer",
      company: "Jimirene Maternity Clinic",
      website: "",
      experienceId: "jimirene",
    },
    {
      title: "Software Developer",
      company: "J5 Pharmacy",
      website: "",
      experienceId: "j5-pharmacy",
    },
  ],
  about: `I'm Jhon Keneth Ryan Namias (call me Namias) — a Full-Stack Engineer & AI Solutions Developer with a strong track record of designing, developing, and deploying scalable enterprise applications.

Expertise in building intuitive user experiences and secure backend APIs utilizing React, TypeScript, and Python. Proven ability to integrate LLMs and AI agents into business workflows to automate operations, reduce costs, and enforce enterprise-grade security standards.

Graduated Cum Laude with a BS in Computer Science from the University of Caloocan City (Batch 2026). Delivered 5+ live applications serving over 1,000 concurrent users, including an enterprise HRIS for 500+ employees and 8 deployed AI chatbot systems.`,
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
    "full-stack engineer",
    "ai solutions developer",
    "react developer",
    "typescript",
    "node.js",
    "python",
  ],
  dateCreated: "2024-01-01",
}
