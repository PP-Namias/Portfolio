export interface TechStackData {
  categories: {
    [key: string]: {
      technologies: Array<{
        name: string;
        proficiency: "expert" | "advanced" | "intermediate" | "learning";
        yearsOfExperience?: number;
        icon?: string;
      }>;
      icon: string;
      color: string;
    };
  };
}

export const techStackData: TechStackData = {
  categories: {
    "Frontend": {
      technologies: [
        { name: "JavaScript", proficiency: "expert", yearsOfExperience: 5 },
        { name: "TypeScript", proficiency: "expert", yearsOfExperience: 4 },
        { name: "React", proficiency: "expert", yearsOfExperience: 4 },
        { name: "Next.js", proficiency: "advanced", yearsOfExperience: 3 },
        { name: "Vue.js", proficiency: "advanced", yearsOfExperience: 3 },
        { name: "Tailwind CSS", proficiency: "expert", yearsOfExperience: 3 },
        { name: "HTML5", proficiency: "expert", yearsOfExperience: 6 },
        { name: "CSS3", proficiency: "expert", yearsOfExperience: 6 }
      ],
      icon: "Monitor",
      color: "blue"
    },
    "Backend": {
      technologies: [
        { name: "Node.js", proficiency: "expert", yearsOfExperience: 5 },
        { name: "Python", proficiency: "expert", yearsOfExperience: 4 },
        { name: "PHP", proficiency: "expert", yearsOfExperience: 6 },
        { name: "Laravel", proficiency: "advanced", yearsOfExperience: 4 },
        { name: "Express.js", proficiency: "advanced", yearsOfExperience: 4 },
        { name: "FastAPI", proficiency: "advanced", yearsOfExperience: 2 },
        { name: "REST APIs", proficiency: "expert", yearsOfExperience: 5 },
        { name: "GraphQL", proficiency: "intermediate", yearsOfExperience: 2 }
      ],
      icon: "Server",
      color: "green"
    },
    "Database": {
      technologies: [
        { name: "PostgreSQL", proficiency: "advanced", yearsOfExperience: 4 },
        { name: "MySQL", proficiency: "expert", yearsOfExperience: 5 },
        { name: "MongoDB", proficiency: "advanced", yearsOfExperience: 3 },
        { name: "Redis", proficiency: "intermediate", yearsOfExperience: 2 },
        { name: "SQLite", proficiency: "advanced", yearsOfExperience: 4 }
      ],
      icon: "Database",
      color: "purple"
    },
    "AI & Machine Learning": {
      technologies: [
        { name: "TensorFlow", proficiency: "advanced", yearsOfExperience: 2 },
        { name: "PyTorch", proficiency: "intermediate", yearsOfExperience: 1 },
        { name: "OpenAI API", proficiency: "advanced", yearsOfExperience: 2 },
        { name: "Hugging Face", proficiency: "intermediate", yearsOfExperience: 1 },
        { name: "LangChain", proficiency: "advanced", yearsOfExperience: 1 },
        { name: "Scikit-learn", proficiency: "intermediate", yearsOfExperience: 2 }
      ],
      icon: "Brain",
      color: "orange"
    },
    "DevOps & Cloud": {
      technologies: [
        { name: "AWS", proficiency: "advanced", yearsOfExperience: 3 },
        { name: "Azure", proficiency: "intermediate", yearsOfExperience: 2 },
        { name: "Docker", proficiency: "advanced", yearsOfExperience: 3 },
        { name: "Kubernetes", proficiency: "intermediate", yearsOfExperience: 2 },
        { name: "GitHub Actions", proficiency: "advanced", yearsOfExperience: 3 },
        { name: "Vercel", proficiency: "expert", yearsOfExperience: 3 },
        { name: "Netlify", proficiency: "advanced", yearsOfExperience: 3 }
      ],
      icon: "Cloud",
      color: "cyan"
    },
    "Mobile & Desktop": {
      technologies: [
        { name: "React Native", proficiency: "intermediate", yearsOfExperience: 2 },
        { name: "Flutter", proficiency: "learning", yearsOfExperience: 1 },
        { name: "Electron", proficiency: "intermediate", yearsOfExperience: 1 },
        { name: "Progressive Web Apps", proficiency: "advanced", yearsOfExperience: 3 }
      ],
      icon: "Smartphone",
      color: "indigo"
    }
  }
};
