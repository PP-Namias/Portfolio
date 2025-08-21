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

export const experienceData: ExperienceData[] = [
  {
    id: "exp-1",
    company: "Tech Solutions Inc.",
    role: "Senior Full Stack Developer",
    duration: {
      start: "2023-01",
      end: "present",
      displayDuration: "1+ years"
    },
    type: "full-time",
    location: "Remote",
    logo: "/public/logos/tech-solutions.png",
    achievements: [
      "Led development of a scalable e-commerce platform serving 100k+ users",
      "Reduced application load time by 40% through optimization",
      "Mentored 3 junior developers and established coding standards"
    ],
    technologies: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
    responsibilities: [
      "Architect and develop full-stack web applications",
      "Lead technical decisions and code reviews",
      "Collaborate with product team on feature requirements"
    ],
    metrics: [
      { label: "User Growth", value: "150%" },
      { label: "Performance Improvement", value: "40%" },
      { label: "Team Size", value: 5 }
    ]
  },
  {
    id: "exp-2",
    company: "Digital Innovation Labs",
    role: "Frontend Developer",
    duration: {
      start: "2021-06",
      end: "2022-12",
      displayDuration: "1.5 years"
    },
    type: "full-time",
    location: "San Francisco, CA",
    logo: "/public/logos/digital-labs.png",
    achievements: [
      "Built responsive web applications for 5+ clients",
      "Implemented modern UI/UX designs with React and TypeScript",
      "Integrated third-party APIs and payment gateways"
    ],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Redux", "GraphQL"],
    responsibilities: [
      "Develop responsive frontend applications",
      "Collaborate with designers on UI implementation",
      "Optimize applications for performance and accessibility"
    ],
    metrics: [
      { label: "Projects Delivered", value: 8 },
      { label: "Client Satisfaction", value: "98%" }
    ]
  },
  {
    id: "exp-3",
    company: "StartupCo",
    role: "Junior Web Developer",
    duration: {
      start: "2020-03",
      end: "2021-05",
      displayDuration: "1.2 years"
    },
    type: "full-time",
    location: "Austin, TX",
    achievements: [
      "Contributed to MVP development from conception to launch",
      "Learned modern web development stack in fast-paced environment",
      "Participated in agile development processes"
    ],
    technologies: ["JavaScript", "React", "Node.js", "MongoDB", "Express"],
    responsibilities: [
      "Develop features for web application",
      "Write unit tests and documentation",
      "Debug and fix issues reported by QA team"
    ]
  }
];

// Sanity CMS compatibility data
export const experiences = experienceData.map(exp => ({
  _id: exp.id,
  _type: "experience",
  _createdAt: new Date().toISOString(),
  company: exp.company,
  role: exp.role,
  duration: exp.duration,
  employmentType: exp.type,
  location: exp.location,
  companyLogo: exp.logo ? { _type: "image", url: exp.logo } : null,
  achievements: exp.achievements,
  technologies: exp.technologies,
  responsibilities: exp.responsibilities,
  metrics: exp.metrics
}));
