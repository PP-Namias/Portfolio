export interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies?: string[];
}

export const experienceData: ExperienceItem[] = [
  {
    title: "AI Developer, AI Engineer, Automation Engineer, Team Leader",
    company: "Wilshire Financial Network",
    period: "Present",
    description: "Designed and deployed no-code AI chatbots using platforms like n8n, Twilio, ElevenLabs, ChatGPT, and Gemini to automate customer support, reception and lead generation. Led a team of 6 in creating marketing materials and developing automation tools such as transcription services, CRM systems, AI agents, and company-trained chatbots.",
    technologies: ["n8n", "Twilio", "ElevenLabs", "ChatGPT", "Gemini", "AI/ML", "Automation", "CRM"]
  },
  {
    title: "Full-stack Web Developer, UX Designer",
    company: "Provide Innovative Solutions marketing Inc.",
    period: "Recent",
    description: "Contributed to UI development, design, and prototyping efforts, supporting UX improvements that enhanced usability and visual consistency. Worked closely with the Head of IT to design and build the backend infrastructure and overall structure of the web application.",
    technologies: ["React", "Node.js", "UI/UX", "Backend", "Insurance Portal"]
  }
];
