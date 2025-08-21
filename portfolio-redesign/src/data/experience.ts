import experienceData from './json/experience.json';

// Type definitions for experience data (Sanity CMS compatible)
export interface ExperienceEntry {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  company: string;
  position: string;
  duration: {
    start: string;
    end: string | null;
    displayDuration: string;
  };
  type: "full-time" | "contract" | "freelance" | "internship";
  location: string;
  workType: "remote" | "onsite" | "hybrid";
  description: string;
  achievements: string[];
  technologies: string[];
  responsibilities: string[];
  keyProjects?: Array<{
    name: string;
    description: string;
    impact: string;
  }>;
  metrics?: Array<{
    label: string;
    value: string;
    description?: string;
  }>;
  skills: string[];
  companyInfo?: {
    industry: string;
    size: string;
    description: string;
    website?: string;
  };
  featured: boolean;
  current: boolean;
}

interface ExperienceCollection {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  experiences: ExperienceEntry[];
}

// Export the imported JSON data with proper typing
const experienceCollection = experienceData as ExperienceCollection;
export const experiences = experienceCollection.experiences;

// Legacy compatibility - convert to old format
export interface ExperienceData {
  id: string;
  company: string;
  role: string;
  duration: {
    start: string;
    end: string | "present";
    displayDuration: string;
  };
  type: "full-time" | "contract" | "freelance" | "internship";
  location: string;
  logo?: string;
  achievements: string[];
  technologies: string[];
  responsibilities: string[];
  metrics?: Array<{
    label: string;
    value: string | number;
  }>;
}

export const experienceData: ExperienceData[] = experiences.map(exp => ({
  id: exp._id,
  company: exp.company,
  role: exp.position,
  duration: {
    start: exp.duration.start,
    end: exp.duration.end || "present",
    displayDuration: exp.duration.displayDuration
  },
  type: exp.type,
  location: exp.location,
  achievements: exp.achievements,
  technologies: exp.technologies,
  responsibilities: exp.responsibilities,
  metrics: exp.metrics?.map(metric => ({
    label: metric.label,
    value: metric.value
  }))
}));

export const experienceData: ExperienceData[] = [
  {
    id: "principal-ai-engineer",
    company: "Stanford Greenwich",
    role: "Principal AI Engineer",
    duration: {
      start: "2024",
      end: "present",
      displayDuration: "2024 - Present"
    },
    type: "full-time",
    location: "Remote",
    achievements: [
      "Led development of AI-powered applications serving 50K+ users",
      "Integrated machine learning models into production systems",
      "Mentored team of 5 junior developers on AI implementation",
      "Reduced model inference time by 40% through optimization"
    ],
    technologies: ["Python", "TensorFlow", "React", "Node.js", "PostgreSQL", "Docker", "AWS"],
    responsibilities: [
      "Design and implement AI-powered solutions",
      "Lead technical architecture decisions for ML systems",
      "Mentor junior developers and conduct code reviews",
      "Collaborate with product teams on feature development"
    ],
    metrics: [
      { label: "Model Accuracy Improved", value: "15%" },
      { label: "Users Served", value: "50K+" },
      { label: "Team Members Mentored", value: 5 }
    ]
  },
  {
    id: "ai-ops-engineer",
    company: "Centre of Excellence for GenAI, Cambridge",
    role: "AI Ops Engineer",
    duration: {
      start: "2023",
      end: "2024",
      displayDuration: "2023 - 2024"
    },
    type: "full-time",
    location: "Cambridge, UK",
    achievements: [
      "Implemented comprehensive MLOps infrastructure",
      "Optimized machine learning deployment pipelines",
      "Reduced model deployment time by 60%",
      "Established monitoring and alerting for 20+ ML models"
    ],
    technologies: ["Python", "Kubernetes", "Docker", "MLOps", "TensorFlow", "PyTorch", "Azure"],
    responsibilities: [
      "Design and maintain ML infrastructure",
      "Automate model deployment and monitoring",
      "Optimize system performance and scalability",
      "Ensure compliance with data governance policies"
    ],
    metrics: [
      { label: "Deployment Time Reduced", value: "60%" },
      { label: "Models Monitored", value: "20+" },
      { label: "System Uptime", value: "99.9%" }
    ]
  },
  {
    id: "full-stack-developer",
    company: "TechCorp Solutions",
    role: "Senior Full-Stack Developer",
    duration: {
      start: "2021",
      end: "2023",
      displayDuration: "2021 - 2023"
    },
    type: "full-time",
    location: "Manila, Philippines",
    achievements: [
      "Built and deployed 15+ web applications",
      "Led migration from monolithic to microservices architecture",
      "Implemented CI/CD pipelines reducing deployment time by 70%",
      "Mentored 10+ junior developers through bootcamp program"
    ],
    technologies: ["JavaScript", "TypeScript", "React", "Node.js", "PHP", "Laravel", "MySQL", "AWS"],
    responsibilities: [
      "Develop full-stack web applications",
      "Lead technical architecture discussions",
      "Mentor junior developers",
      "Optimize application performance and scalability"
    ],
    metrics: [
      { label: "Applications Built", value: "15+" },
      { label: "Deployment Time Reduced", value: "70%" },
      { label: "Developers Mentored", value: "10+" }
    ]
  },
  {
    id: "freelance-developer",
    company: "Freelance",
    role: "Full-Stack Developer & AI Consultant",
    duration: {
      start: "2019",
      end: "present",
      displayDuration: "2019 - Present"
    },
    type: "freelance",
    location: "Remote",
    achievements: [
      "Completed 50+ successful projects for global clients",
      "Built AI-powered solutions for various industries",
      "Maintained 100% client satisfaction rating",
      "Generated $500K+ in revenue through freelance work"
    ],
    technologies: ["Python", "JavaScript", "React", "Next.js", "AI/ML", "WordPress", "SEO"],
    responsibilities: [
      "Develop custom web applications and AI solutions",
      "Provide technical consulting and strategy",
      "Manage client relationships and project timelines",
      "Create educational content and tutorials"
    ],
    metrics: [
      { label: "Projects Completed", value: "50+" },
      { label: "Client Satisfaction", value: "100%" },
      { label: "Revenue Generated", value: "$500K+" }
    ]
  }
];
