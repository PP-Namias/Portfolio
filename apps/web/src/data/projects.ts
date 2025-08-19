export interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export const projectsData: Project[] = [
  {
    title: "Story Adaptive Game Engine (SAGE AI)",
    description: "Advanced AI-driven text adventure game featuring dynamic storytelling, intelligent narrative adaptation, and payment integration. Built with modern React architecture and PostgreSQL for scalable gaming experiences.",
    image: "/gallery/SAGE AI.png",
    technologies: ["React", "Node.js", "OpenAI API", "PostgreSQL", "Xendit", "TypeScript", "Tailwind CSS", "Express.js"],
    liveUrl: "https://text-adventure-six.vercel.app/",
    githubUrl: "https://github.com/Ervhyne/Text-Adventure-SAGE.AI-"
  },
  {
    title: "Smart Gym Management System",
    description: "Comprehensive gym membership platform with QR code attendance tracking, user-centered design principles, and real-time member analytics. Features modern UI/UX with responsive design patterns.",
    image: "/gallery/Gym Membership.png",
    technologies: ["React", "TypeScript", "PostgreSQL", "QR Scanner", "Figma Design", "Node.js", "Tailwind CSS", "REST API"],
    githubUrl: "https://github.com/Ervhyne/Gym-WalkIn-and-Member-Management-Web-app-System"
  },
  {
    title: "Personal Finance Tracker",
    description: "Desktop application for comprehensive personal finance management with advanced expense categorization, budget planning, and financial analytics dashboard.",
    image: "/gallery/Expense Tracker.jpeg",
    technologies: ["C#", "WinForms", "SQLite", "Chart.js", "Visual Studio", "Financial Analytics"],
    githubUrl: "https://github.com/Ervhyne/Expense-Tracker-App"
  },
  {
    title: "Enterprise Airline Management System",
    description: "Full-featured airline ticketing platform with flight scheduling, seat management, customer booking system, and comprehensive administrative dashboard for airline operations.",
    image: "/gallery/Airline Ticketing System.jpeg",
    technologies: ["Java", "Swing GUI", "MySQL", "JDBC", "Booking Engine", "Schedule Management"],
    githubUrl: "https://github.com/Ervhyne/Airline-Ticketing-System"
  },
  {
    title: "Smart Room Reservation Platform",
    description: "Intelligent room booking system for educational institutions with real-time availability tracking, automated scheduling, and facility management capabilities.",
    image: "/gallery/RoomDsurv.jpeg",
    technologies: ["Java", "MySQL", "Swing", "Booking Algorithm", "UI/UX Design", "Database Management"],
    githubUrl: "https://github.com/Ervhyne/roomDeserv-RRS"
  },
];
