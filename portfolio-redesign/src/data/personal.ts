// Personal Information Interface
export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  summary: string;
  avatar: string;
  resumeUrl?: string;
  availability: {
    status: 'available' | 'busy' | 'unavailable';
    message: string;
  };
  achievements: Array<{
    title: string;
    description: string;
    color: string;
    icon: string;
    date: string;
    verified: boolean;
    link?: string;
  }>;
  about: {
    summary: string[];
    specializations: string[];
    currentFocus: string;
    yearsOfExperience: number;
  };
  socialLinks: Array<{
    name: string;
    url: string;
    icon: string;
    username: string;
  }>;
}

// Direct data export for immediate use (matching Bryl Lim's clean structure)
export const personalInfo: PersonalInfo = {
  name: "PP Namias",
  title: "Principal AI Engineer & Full-Stack Developer",
  location: "Manila, Philippines",
  email: "contact@ppnamias.dev",
  phone: "+63 123 456 7890",
  website: "https://ppnamias.dev",
  summary: "Building technology that makes a difference",
  avatar: "/profile.jpeg",
  resumeUrl: "/resume.pdf",
  availability: {
    status: "available",
    message: "Available for new opportunities"
  },
  achievements: [
    {
      title: "PHP Developer Expert",
      description: "Certified expert in PHP development",
      color: "blue",
      icon: "Award",
      date: "2024",
      verified: true
    },
    {
      title: "DICT OpenGov HacKathon 2025 Champion",
      description: "Winner of government hackathon",
      color: "yellow",
      icon: "Trophy",
      date: "2025",
      verified: true,
      link: "https://dict.gov.ph/news-and-updates/21070"
    },
    {
      title: "5+ Years Experience",
      description: "Professional development experience",
      color: "green",
      icon: "CheckCircle",
      date: "2019-2025",
      verified: true
    }
  ],
  about: {
    summary: [
      "I'm a passionate AI Engineer and Full-Stack Developer with over 5 years of experience building scalable web applications and AI solutions.",
      "I specialize in modern technologies like React, Next.js, Python, and AI/ML frameworks, creating user-centric applications that solve real-world problems.",
      "My approach combines technical excellence with creative problem-solving, always focusing on clean code, performance, and user experience."
    ],
    specializations: [
      "AI/ML Engineering",
      "Full-Stack Development", 
      "Cloud Architecture",
      "DevOps & Automation"
    ],
    currentFocus: "Building AI-powered applications that transform businesses",
    yearsOfExperience: 5
  },
  socialLinks: [
    {
      name: "GitHub",
      url: "https://github.com/PP-Namias",
      icon: "Github",
      username: "@PP-Namias"
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/pp-namias",
      icon: "Linkedin", 
      username: "PP Namias"
    },
    {
      name: "Twitter",
      url: "https://twitter.com/pp_namias",
      icon: "Twitter",
      username: "@pp_namias"
    },
    {
      name: "Email",
      url: "mailto:contact@ppnamias.dev",
      icon: "Mail",
      username: "contact@ppnamias.dev"
    }
  ]
};
