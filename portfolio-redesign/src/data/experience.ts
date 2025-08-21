// Experience Interface
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

// Direct experience data export (clean and minimalist like Bryl Lim's site)
export const experienceData: ExperienceData[] = [
  {
    id: "exp-1",
    company: "Standard Chartered",
    role: "Principal AI Engineer",
    duration: {
      start: "2025-01",
      end: "present",
      displayDuration: "Jan 2025 - Present"
    },
    type: "full-time",
    location: "Singapore",
    logo: "/logos/standard-chartered.png",
    achievements: [
      "Leading AI engineering initiatives and developing cutting-edge solutions for financial services",
      "Established AI governance framework adopted across all business units",
      "Built ML pipelines processing 10M+ transactions daily with 99.9% accuracy"
    ],
    technologies: ["Python", "TensorFlow", "Azure ML", "FastAPI", "Docker", "Kubernetes"],
    responsibilities: [
      "Design and implement AI/ML solutions for financial products",
      "Lead technical architecture decisions for AI platform",
      "Mentor junior engineers and establish best practices"
    ],
    metrics: [
      { label: "Model Accuracy", value: "99.9%" },
      { label: "Cost Reduction", value: "40%" },
      { label: "Team Size", value: 8 }
    ]
  },
  {
    id: "exp-2", 
    company: "TechCorp Solutions",
    role: "Senior Full Stack Developer",
    duration: {
      start: "2023-06",
      end: "2024-12",
      displayDuration: "Jun 2023 - Dec 2024"
    },
    type: "full-time",
    location: "Remote",
    logo: "/logos/techcorp.png",
    achievements: [
      "Led development of scalable e-commerce platform serving 100k+ users",
      "Reduced application load time by 60% through optimization",
      "Mentored 5 junior developers and established coding standards"
    ],
    technologies: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
    responsibilities: [
      "Architect and develop full-stack web applications", 
      "Lead technical decisions and code reviews",
      "Collaborate with product team on feature requirements"
    ],
    metrics: [
      { label: "User Growth", value: "150%" },
      { label: "Performance Improvement", value: "60%" },
      { label: "Projects Delivered", value: 12 }
    ]
  },
  {
    id: "exp-3",
    company: "Digital Innovation Labs",
    role: "Frontend Developer",
    duration: {
      start: "2021-03",
      end: "2023-05", 
      displayDuration: "Mar 2021 - May 2023"
    },
    type: "full-time",
    location: "Manila, Philippines",
    logo: "/logos/digital-labs.png",
    achievements: [
      "Built responsive web applications for 8+ clients",
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
      { label: "Projects Delivered", value: 15 },
      { label: "Client Satisfaction", value: "98%" }
    ]
  },
  {
    id: "exp-4",
    company: "StartupCo",
    role: "Junior Web Developer",
    duration: {
      start: "2019-08",
      end: "2021-02",
      displayDuration: "Aug 2019 - Feb 2021"
    },
    type: "full-time",
    location: "Quezon City, Philippines",
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

// Sanity CMS compatibility export
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
