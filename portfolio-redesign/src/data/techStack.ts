// Tech Stack Interface
export interface TechStackData {
  categories: {
    [key: string]: {
      technologies: Array<{
        name: string;
        proficiency: "expert" | "advanced" | "intermediate" | "learning";
        yearsOfExperience?: number;
      }>;
      icon: string;
      color: string;
    };
  };
}

// Clean, minimalist tech stack data (inspired by Bryl Lim's organization)
export const techStackData: TechStackData = {
  categories: {
    frontend: {
      icon: "Monitor",
      color: "blue",
      technologies: [
        { name: "React", proficiency: "expert", yearsOfExperience: 5 },
        { name: "Next.js", proficiency: "expert", yearsOfExperience: 4 },
        { name: "TypeScript", proficiency: "expert", yearsOfExperience: 4 },
        { name: "Tailwind CSS", proficiency: "expert", yearsOfExperience: 3 },
        { name: "Vue.js", proficiency: "advanced", yearsOfExperience: 2 },
        { name: "Framer Motion", proficiency: "advanced", yearsOfExperience: 2 }
      ]
    },
    backend: {
      icon: "Server", 
      color: "green",
      technologies: [
        { name: "Node.js", proficiency: "expert", yearsOfExperience: 5 },
        { name: "Python", proficiency: "expert", yearsOfExperience: 4 },
        { name: "Express.js", proficiency: "expert", yearsOfExperience: 4 },
        { name: "FastAPI", proficiency: "advanced", yearsOfExperience: 3 },
        { name: "Django", proficiency: "advanced", yearsOfExperience: 2 },
        { name: "GraphQL", proficiency: "advanced", yearsOfExperience: 3 }
      ]
    },
    ai_ml: {
      icon: "Brain",
      color: "purple", 
      technologies: [
        { name: "TensorFlow", proficiency: "expert", yearsOfExperience: 3 },
        { name: "PyTorch", proficiency: "advanced", yearsOfExperience: 2 },
        { name: "OpenAI API", proficiency: "expert", yearsOfExperience: 2 },
        { name: "Hugging Face", proficiency: "advanced", yearsOfExperience: 2 },
        { name: "scikit-learn", proficiency: "expert", yearsOfExperience: 3 },
        { name: "Pandas", proficiency: "expert", yearsOfExperience: 4 }
      ]
    },
    database: {
      icon: "Database",
      color: "orange",
      technologies: [
        { name: "PostgreSQL", proficiency: "expert", yearsOfExperience: 4 },
        { name: "MongoDB", proficiency: "expert", yearsOfExperience: 4 },
        { name: "Redis", proficiency: "advanced", yearsOfExperience: 3 },
        { name: "Prisma", proficiency: "advanced", yearsOfExperience: 2 },
        { name: "Firebase", proficiency: "advanced", yearsOfExperience: 3 }
      ]
    },
    cloud: {
      icon: "Cloud",
      color: "cyan",
      technologies: [
        { name: "AWS", proficiency: "expert", yearsOfExperience: 4 },
        { name: "Azure", proficiency: "advanced", yearsOfExperience: 3 },
        { name: "Vercel", proficiency: "expert", yearsOfExperience: 4 },
        { name: "Docker", proficiency: "advanced", yearsOfExperience: 3 },
        { name: "Kubernetes", proficiency: "intermediate", yearsOfExperience: 2 }
      ]
    },
    tools: {
      icon: "Wrench",
      color: "gray",
      technologies: [
        { name: "Git", proficiency: "expert", yearsOfExperience: 5 },
        { name: "GitHub Actions", proficiency: "advanced", yearsOfExperience: 3 },
        { name: "VS Code", proficiency: "expert", yearsOfExperience: 5 },
        { name: "Figma", proficiency: "advanced", yearsOfExperience: 3 },
        { name: "Postman", proficiency: "expert", yearsOfExperience: 4 }
      ]
    }
  }
};
