/**
 * Sanity Seed Script
 *
 * Run with: npx tsx src/sanity/scripts/seed.ts
 *
 * Seeds the Sanity dataset with PP Namias portfolio data.
 * Requires SANITY_API_WRITE_TOKEN in environment.
 */

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-02-19",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

async function seed() {
  console.log("Seeding Sanity dataset...");

  // Create education
  const education = await client.create({
    _type: "education",
    institution: "University of Caloocan City",
    degree: "Bachelor of Science",
    field: "Computer Science",
    startYear: 2022,
    endYear: 2026,
    gpa: "Cum Laude",
    honors: ["Dean's Lister"],
    activities: [],
  });
  console.log("Created education:", education._id);

  // Create social links
  const socialLinks = await Promise.all([
    client.create({
      _type: "socialLink",
      platform: "x",
      handle: "@PP_Namias",
      url: "https://x.com/PP_Namias",
      isPrimary: true,
    }),
    client.create({
      _type: "socialLink",
      platform: "github",
      handle: "PP-Namias",
      url: "https://github.com/PP-Namias",
      isPrimary: true,
    }),
    client.create({
      _type: "socialLink",
      platform: "linkedin",
      handle: "pp-namias",
      url: "https://linkedin.com/in/pp-namias/",
      isPrimary: false,
    }),
    client.create({
      _type: "socialLink",
      platform: "discord",
      handle: "pp-namias",
      url: "https://discord.com/users/683914336376455200",
      isPrimary: false,
    }),
    client.create({
      _type: "socialLink",
      platform: "youtube",
      handle: "@pp_namias",
      url: "https://www.youtube.com/@pp_namias",
      isPrimary: false,
    }),
    client.create({
      _type: "socialLink",
      platform: "instagram",
      handle: "@pp_namias",
      url: "https://www.instagram.com/pp_namias/",
      isPrimary: false,
    }),
    client.create({
      _type: "socialLink",
      platform: "dailydev",
      handle: "ppnamias",
      url: "https://daily.dev/ppnamias",
      isPrimary: false,
    }),
  ]);
  console.log("Created social links:", socialLinks.length);

  // Create profile
  const profile = await client.create({
    _type: "profile",
    firstName: "Jhon Keneth",
    lastName: "Namias",
    displayName: "PP Namias",
    username: "PP-Namias",
    title: "Full Stack Engineer & AI Automation Specialist",
    email: "pp.namias@gmail.com",
    phone: "+63 927 253 3969",
    location: "Caloocan City, Philippines",
    website: "https://namias.tech",
    dailyDev: "https://daily.dev/ppnamias",
    aboutText:
      "Full Stack Engineer & AI Automation Specialist with a passion for building production systems that scale. Graduated Cum Laude with a BS in Computer Science from the University of Caloocan City (Batch 2026). I've delivered 5+ live applications serving over 1,000 concurrent users, including an enterprise HRIS for 500+ employees and 8 deployed AI chatbot systems.",
    socialLinks: socialLinks.map((sl) => ({
      _type: "reference",
      _ref: sl._id,
    })),
    education: [
      {
        _type: "reference",
        _ref: education._id,
      },
    ],
    availability: true,
    resumeUrl: "",
  });
  console.log("Created profile:", profile._id);

  // Create site settings
  const siteSettings = await client.create({
    _type: "siteSettings",
    siteTitle: "PP Namias | Portfolio",
    siteDescription:
      "Full Stack Engineer & AI Automation Specialist — building production systems that scale.",
    accentColor: "#ec4899",
    footerText: "Built with Next.js, Tailwind CSS, and Sanity CMS",
  });
  console.log("Created site settings:", siteSettings._id);

  // Create tech stack
  const techStack = await client.create({
    _type: "techStack",
    title: "Tech Stack",
    technologies: [
      { name: "TypeScript", icon: "typescript", category: "Language", proficiency: 5 },
      { name: "JavaScript", icon: "javascript", category: "Language", proficiency: 5 },
      { name: "Python", icon: "python", category: "Language", proficiency: 4 },
      { name: "React", icon: "react", category: "Frontend", proficiency: 5 },
      { name: "Next.js", icon: "nextjs", category: "Framework", proficiency: 5 },
      { name: "Tailwind CSS", icon: "tailwindcss", category: "Styling", proficiency: 5 },
      { name: "Node.js", icon: "nodejs", category: "Backend", proficiency: 4 },
      { name: "PostgreSQL", icon: "postgresql", category: "Database", proficiency: 4 },
      { name: "Docker", icon: "docker", category: "DevOps", proficiency: 3 },
    ],
  });
  console.log("Created tech stack:", techStack._id);

  // Create sample projects
  const projects = await Promise.all([
    client.create({
      _type: "project",
      title: "Enterprise HRIS",
      slug: { current: "enterprise-hris" },
      summary: "Enterprise Human Resource Information System serving 500+ employees",
      category: "Enterprise",
      technologies: ["React", "TypeScript", "Node.js", "PostgreSQL"],
      featured: true,
      order: 1,
      status: "completed",
    }),
    client.create({
      _type: "project",
      title: "AI Chatbot Systems",
      slug: { current: "ai-chatbot-systems" },
      summary: "8 deployed AI chatbot systems for various clients",
      category: "AI",
      technologies: ["Python", "React", "TypeScript"],
      featured: true,
      order: 2,
      status: "completed",
    }),
    client.create({
      _type: "project",
      title: "JS Pharmacy",
      slug: { current: "js-pharmacy" },
      summary: "Pharmacy management system with inventory and sales tracking",
      category: "Healthcare",
      technologies: ["React", "TypeScript", "Node.js"],
      featured: false,
      order: 3,
      status: "completed",
    }),
  ]);
  console.log("Created projects:", projects.length);

  // Create sample experiences
  const experiences = await Promise.all([
    client.create({
      _type: "experience",
      role: "Software Developer",
      company: "JS Pharmacy",
      location: "Caloocan City, Philippines",
      startDate: "2024-06-01",
      employmentType: "full-time",
      skills: ["React", "TypeScript", "Node.js"],
      order: 1,
    }),
    client.create({
      _type: "experience",
      role: "AI Solutions Developer",
      company: "Wilshire Financial Network",
      location: "Remote",
      startDate: "2024-01-01",
      endDate: "2024-06-01",
      employmentType: "contract",
      skills: ["Python", "AI", "React"],
      order: 2,
    }),
  ]);
  console.log("Created experiences:", experiences.length);

  // Create sample certifications
  const certifications = await Promise.all([
    client.create({
      _type: "certification",
      title: "BS Computer Science",
      issuer: "University of Caloocan City",
      issuedAt: "2026-04-01",
      order: 1,
    }),
  ]);
  console.log("Created certifications:", certifications.length);

  console.log("\nSeed complete!");
  console.log("Profile ID:", profile._id);
  console.log("Site Settings ID:", siteSettings._id);
}

seed().catch(console.error);
