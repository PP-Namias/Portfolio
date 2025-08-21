export interface PersonalInfo {
  profile: {
    name: string;
    title: string;
    location: string;
    email: string;
    image: string;
    availability: {
      status: "available" | "busy" | "partially-available";
      message: string;
    };
  };
  achievements: Array<{
    title: string;
    color: "blue" | "green" | "yellow" | "purple" | "red";
    icon: string;
  }>;
  about: {
    summary: string[];
    specializations: string[];
    currentFocus: string;
    yearsOfExperience: number;
    developersBuiltCommunity?: number;
    personalPhilosophy?: string;
  };
}

export const personalInfo: PersonalInfo = {
  profile: {
    name: "PP Namias",
    title: "Principal AI Engineer & Full-Stack Developer",
    location: "Manila, Philippines",
    email: "contact@ppnamias.dev",
    image: "/profile.jpeg",
    availability: {
      status: "available",
      message: "Available for projects"
    }
  },
  achievements: [
    {
      title: "PHP Expert",
      color: "blue",
      icon: "Award"
    },
    {
      title: "DICT OpenGov HacKathon 2025 Champion",
      color: "yellow",
      icon: "Trophy"
    },
    {
      title: "Available for Projects",
      color: "green",
      icon: "CheckCircle"
    }
  ],
  about: {
    summary: [
      "I'm a full-stack software engineer specializing in developing solutions with JavaScript, Python, and modern web technologies for building modern websites, web applications, mobile apps, search engine optimization, digital marketing, and making code tutorials.",
      "I've helped startups and MSMEs grow and streamline their processes through software solutions. I've also built a community of over 200,000 developers sharing knowledge and mentorship globally.",
      "Lately, I've been diving deeper into the world of artificial intelligence, focusing on integrating AI tools and techniques into modern applications. My work now includes developing AI-powered solutions, creating intelligent applications, and leveraging generative AI to optimize development workflows and deliver cutting-edge technology."
    ],
    specializations: [
      "Full-Stack Development",
      "AI Integration & Development",
      "Modern Web Technologies",
      "Digital Marketing & SEO",
      "Community Building & Mentorship",
      "Mobile App Development"
    ],
    currentFocus: "Integrating AI tools and techniques into modern applications",
    yearsOfExperience: 5,
    developersBuiltCommunity: 200000,
    personalPhilosophy: "Building technology that makes a difference, one line of code at a time."
  }
};
