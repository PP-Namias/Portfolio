import {
  BriefcaseBusinessIcon,
  CodeXmlIcon,
  LightbulbIcon,
} from "lucide-react"

import type { Experience } from "@/features/portfolio/types/experiences"

export const EXPERIENCES: Experience[] = [
  {
    id: "js-pharmacy",
    companyName: "JS Pharmacy",
    companyWebsite: "",
    location: "Philippines",
    locationType: "Remote",
    positions: [
      {
        id: "1",
        title: "Software Developer",
        employmentPeriod: {
          start: "2025",
        },
        employmentType: "Full-time",
        icon: <CodeXmlIcon />,
        description: `- Building and maintaining full stack web applications
- Developing API integrations and database architectures
- Implementing responsive UI/UX designs
- Collaborating with cross-functional teams on production systems`,
        skills: [
          "React",
          "TypeScript",
          "Node.js",
          "Python",
          "Database Design",
          "API Development",
        ],
        isExpanded: true,
      },
    ],
    isCurrentEmployer: true,
  },
  {
    id: "wilshire-financial",
    companyName: "Wilshire Financial Network",
    location: "United States",
    locationType: "Remote",
    positions: [
      {
        id: "1",
        title: "AI Solutions Developer",
        employmentPeriod: {
          start: "06.2024",
          end: "01.2025",
        },
        employmentType: "Full-time",
        icon: <LightbulbIcon />,
        description: `- Developed AI-powered financial analysis tools
- Built automation systems for data processing and reporting
- Integrated LLM APIs for conversational AI features
- Implemented prompt engineering workflows for production AI systems`,
        skills: [
          "AI Automation",
          "Python",
          "LLM Integration",
          "Prompt Engineering",
          "Financial Tech",
          "Data Processing",
        ],
      },
    ],
  },
  {
    id: "freelance",
    companyName: "Freelance",
    companyIcon: <BriefcaseBusinessIcon strokeWidth={1.8} />,
    positions: [
      {
        id: "1",
        title: "Full Stack Developer",
        employmentPeriod: {
          start: "2023",
          end: "2024",
        },
        employmentType: "Part-time",
        description: `- Built enterprise HRIS system serving 500+ employees
- Developed and deployed 8 AI chatbot systems
- Created production web applications serving 1,000+ concurrent users
- Implemented end-to-end solutions across the full stack`,
        icon: <CodeXmlIcon />,
        skills: [
          "React",
          "TypeScript",
          "Node.js",
          "Python",
          "AI Automation",
          "Database Design",
          "API Development",
        ],
      },
    ],
  },
]
