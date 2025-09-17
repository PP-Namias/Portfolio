# Quick Implementation Reference

This is a companion guide with specific code examples for implementing your portfolio transformation.

## 1. Update Navigation (src/config.ts)

Replace the existing `navBarConfig` section:

```typescript
export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		{
			name: "About",
			url: "/about",
			external: false,
		},
		{
			name: "Skills",
			url: "/skills",
			external: false,
		},
		{
			name: "Experience",
			url: "/experience",
			external: false,
		},
		{
			name: "Projects",
			url: "/projects",
			external: false,
		},
		{
			name: "Gallery",
			url: "/gallery",
			external: false,
		},
		{
			name: "Blog",
			url: "/archive",
			external: false,
		},
		{
			name: "Contact",
			url: "/contact",
			external: false,
		},
		{
			name: "GitHub",
			url: "https://github.com/PP-Namias", // Update with your actual GitHub
			external: true,
		},
	],
};
```

## 2. Update Profile Configuration

```typescript
export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.jpg",
	name: "Jhon Keneth Namias",
	bio: "Full-Stack Developer | Technology Enthusiast | Problem Solver",
	links: [
		{
			name: "LinkedIn",
			icon: "fa6-brands:linkedin",
			url: "https://linkedin.com/in/your-profile", // Add your LinkedIn
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/PP-Namias", // Update with your GitHub
		},
		{
			name: "Email",
			icon: "fa6-solid:envelope",
			url: "mailto:your.email@domain.com", // Add your email
		},
		{
			name: "Resume",
			icon: "fa6-solid:file-pdf",
			url: "/resume.pdf", // Add your resume to public folder
		},
	],
};
```

## 3. Create Skills Page (src/pages/skills.astro)

```astro
---
import MainGridLayout from "../layouts/MainGridLayout.astro";
import { i18n } from "../i18n/translation";
import I18nKey from "../i18n/i18nKey";

const skills = {
	frontend: [
		{ name: "JavaScript/TypeScript", level: 90 },
		{ name: "React", level: 85 },
		{ name: "Svelte", level: 80 },
		{ name: "Astro", level: 75 },
		{ name: "CSS/Tailwind", level: 85 },
		{ name: "HTML5", level: 95 }
	],
	backend: [
		{ name: "Node.js", level: 85 },
		{ name: "Python", level: 80 },
		{ name: "PostgreSQL", level: 75 },
		{ name: "MongoDB", level: 70 },
		{ name: "REST APIs", level: 90 },
		{ name: "GraphQL", level: 65 }
	],
	tools: [
		{ name: "Git", level: 90 },
		{ name: "Docker", level: 75 },
		{ name: "VS Code", level: 95 },
		{ name: "Figma", level: 70 },
		{ name: "AWS", level: 60 },
		{ name: "Vercel", level: 85 }
	]
};
---

<MainGridLayout title="Technical Skills" description="My technical expertise and skill levels">
	<div class="flex w-full rounded-[var(--radius-large)] overflow-hidden relative min-h-32 mb-8">
		<div class="card-base z-10 px-9 py-6 relative w-full">
			<h1 class="text-3xl font-bold mb-6">Technical Skills</h1>
			
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				<!-- Frontend Skills -->
				<div class="skill-category">
					<h2 class="text-xl font-semibold mb-4 text-blue-400">Frontend Development</h2>
					{skills.frontend.map(skill => (
						<div class="skill-item mb-3">
							<div class="flex justify-between mb-1">
								<span class="text-sm font-medium">{skill.name}</span>
								<span class="text-sm text-gray-400">{skill.level}%</span>
							</div>
							<div class="w-full bg-gray-700 rounded-full h-2">
								<div 
									class="bg-blue-500 h-2 rounded-full transition-all duration-300" 
									style={`width: ${skill.level}%`}
								></div>
							</div>
						</div>
					))}
				</div>

				<!-- Backend Skills -->
				<div class="skill-category">
					<h2 class="text-xl font-semibold mb-4 text-green-400">Backend Development</h2>
					{skills.backend.map(skill => (
						<div class="skill-item mb-3">
							<div class="flex justify-between mb-1">
								<span class="text-sm font-medium">{skill.name}</span>
								<span class="text-sm text-gray-400">{skill.level}%</span>
							</div>
							<div class="w-full bg-gray-700 rounded-full h-2">
								<div 
									class="bg-green-500 h-2 rounded-full transition-all duration-300" 
									style={`width: ${skill.level}%`}
								></div>
							</div>
						</div>
					))}
				</div>

				<!-- Tools & Technologies -->
				<div class="skill-category">
					<h2 class="text-xl font-semibold mb-4 text-purple-400">Tools & Technologies</h2>
					{skills.tools.map(skill => (
						<div class="skill-item mb-3">
							<div class="flex justify-between mb-1">
								<span class="text-sm font-medium">{skill.name}</span>
								<span class="text-sm text-gray-400">{skill.level}%</span>
							</div>
							<div class="w-full bg-gray-700 rounded-full h-2">
								<div 
									class="bg-purple-500 h-2 rounded-full transition-all duration-300" 
									style={`width: ${skill.level}%`}
								></div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	</div>
</MainGridLayout>
```

## 4. Create Projects Page (src/pages/projects.astro)

```astro
---
import MainGridLayout from "../layouts/MainGridLayout.astro";

const projects = [
	{
		title: "Portfolio Website",
		description: "A modern, responsive portfolio built with Astro, showcasing my work and skills.",
		image: "/project-images/portfolio.jpg", // Add your project images to public folder
		technologies: ["Astro", "TypeScript", "Tailwind CSS", "Svelte"],
		liveUrl: "https://your-portfolio.com",
		githubUrl: "https://github.com/PP-Namias/Portfolio",
		featured: true
	},
	{
		title: "E-Commerce Platform",
		description: "Full-stack e-commerce solution with user authentication and payment integration.",
		image: "/project-images/ecommerce.jpg",
		technologies: ["React", "Node.js", "PostgreSQL", "Stripe API"],
		liveUrl: "#",
		githubUrl: "#",
		featured: true
	},
	{
		title: "Task Management App",
		description: "Collaborative task management application with real-time updates.",
		image: "/project-images/taskapp.jpg",
		technologies: ["Vue.js", "Firebase", "Vuetify"],
		liveUrl: "#",
		githubUrl: "#",
		featured: false
	}
];

const featuredProjects = projects.filter(project => project.featured);
---

<MainGridLayout title="Projects" description="Showcase of my development projects and contributions">
	<div class="flex w-full rounded-[var(--radius-large)] overflow-hidden relative min-h-32 mb-8">
		<div class="card-base z-10 px-9 py-6 relative w-full">
			<h1 class="text-3xl font-bold mb-6">Featured Projects</h1>
			
			<div class="grid md:grid-cols-2 gap-6 mb-12">
				{featuredProjects.map(project => (
					<div class="project-card bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
						<img 
							src={project.image} 
							alt={project.title}
							class="w-full h-48 object-cover"
						/>
						<div class="p-6">
							<h3 class="text-xl font-semibold mb-2">{project.title}</h3>
							<p class="text-gray-300 mb-4">{project.description}</p>
							
							<div class="flex flex-wrap gap-2 mb-4">
								{project.technologies.map(tech => (
									<span class="px-2 py-1 bg-blue-600 text-blue-100 text-xs rounded">
										{tech}
									</span>
								))}
							</div>
							
							<div class="flex gap-4">
								{project.liveUrl !== "#" && (
									<a 
										href={project.liveUrl}
										target="_blank"
										class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
									>
										Live Demo
									</a>
								)}
								{project.githubUrl !== "#" && (
									<a 
										href={project.githubUrl}
										target="_blank"
										class="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
									>
										GitHub
									</a>
								)}
							</div>
						</div>
					</div>
				))}
			</div>

			<h2 class="text-2xl font-bold mb-6">All Projects</h2>
			
			<div class="grid md:grid-cols-3 gap-4">
				{projects.map(project => (
					<div class="project-card-small bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors">
						<h4 class="font-semibold mb-2">{project.title}</h4>
						<p class="text-sm text-gray-300 mb-3">{project.description}</p>
						<div class="flex gap-2">
							{project.liveUrl !== "#" && (
								<a href={project.liveUrl} target="_blank" class="text-blue-400 hover:text-blue-300 text-sm">
									Demo
								</a>
							)}
							{project.githubUrl !== "#" && (
								<a href={project.githubUrl} target="_blank" class="text-gray-400 hover:text-gray-300 text-sm">
									Code
								</a>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	</div>
</MainGridLayout>
```

## 5. Create Contact Page (src/pages/contact.astro)

```astro
---
import MainGridLayout from "../layouts/MainGridLayout.astro";
---

<MainGridLayout title="Contact" description="Get in touch with me for opportunities and collaborations">
	<div class="flex w-full rounded-[var(--radius-large)] overflow-hidden relative min-h-32">
		<div class="card-base z-10 px-9 py-6 relative w-full">
			<h1 class="text-3xl font-bold mb-6">Let's Connect</h1>
			
			<div class="grid md:grid-cols-2 gap-8">
				<!-- Contact Form -->
				<div>
					<h2 class="text-xl font-semibold mb-4">Send me a message</h2>
					<form class="space-y-4" action="#" method="POST">
						<div>
							<label for="name" class="block text-sm font-medium mb-2">Name</label>
							<input 
								type="text" 
								id="name" 
								name="name" 
								required
								class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						
						<div>
							<label for="email" class="block text-sm font-medium mb-2">Email</label>
							<input 
								type="email" 
								id="email" 
								name="email" 
								required
								class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						
						<div>
							<label for="subject" class="block text-sm font-medium mb-2">Subject</label>
							<input 
								type="text" 
								id="subject" 
								name="subject" 
								required
								class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						
						<div>
							<label for="message" class="block text-sm font-medium mb-2">Message</label>
							<textarea 
								id="message" 
								name="message" 
								rows="4" 
								required
								class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							></textarea>
						</div>
						
						<button 
							type="submit"
							class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors font-medium"
						>
							Send Message
						</button>
					</form>
				</div>
				
				<!-- Contact Information -->
				<div>
					<h2 class="text-xl font-semibold mb-4">Contact Information</h2>
					
					<div class="space-y-4">
						<div class="flex items-center gap-3">
							<span class="text-blue-400">📧</span>
							<div>
								<p class="font-medium">Email</p>
								<a href="mailto:your.email@domain.com" class="text-gray-300 hover:text-blue-400">
									your.email@domain.com
								</a>
							</div>
						</div>
						
						<div class="flex items-center gap-3">
							<span class="text-blue-400">💼</span>
							<div>
								<p class="font-medium">LinkedIn</p>
								<a href="https://linkedin.com/in/your-profile" target="_blank" class="text-gray-300 hover:text-blue-400">
									linkedin.com/in/your-profile
								</a>
							</div>
						</div>
						
						<div class="flex items-center gap-3">
							<span class="text-blue-400">🐙</span>
							<div>
								<p class="font-medium">GitHub</p>
								<a href="https://github.com/PP-Namias" target="_blank" class="text-gray-300 hover:text-blue-400">
									github.com/PP-Namias
								</a>
							</div>
						</div>
						
						<div class="flex items-center gap-3">
							<span class="text-blue-400">📄</span>
							<div>
								<p class="font-medium">Resume</p>
								<a href="/resume.pdf" target="_blank" class="text-gray-300 hover:text-blue-400">
									Download PDF
								</a>
							</div>
						</div>
					</div>
					
					<div class="mt-8">
						<h3 class="font-semibold mb-2">Response Time</h3>
						<p class="text-gray-300 text-sm">
							I typically respond to messages within 24-48 hours. 
							For urgent matters, please reach out via LinkedIn.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</MainGridLayout>
```

## 6. File Checklist

Create these files in your project:

- ✅ `src/pages/skills.astro`
- ✅ `src/pages/projects.astro`
- ✅ `src/pages/contact.astro`
- ⬜ `src/pages/experience.astro` (similar structure to skills)
- ⬜ `src/pages/gallery.astro` (image grid with lightbox)
- ⬜ `public/resume.pdf` (your resume)
- ⬜ `public/project-images/` (folder for project screenshots)

## 7. Next Steps

1. **Update `src/config.ts`** with the new navigation
2. **Create the pages** using the code examples above
3. **Add your content** (replace placeholder text with your information)
4. **Add images** to the public folder
5. **Test all pages** by running `pnpm dev`
6. **Customize styling** to match your brand

## 8. Content to Gather

Before implementing, gather:
- Professional headshot photo
- Project screenshots
- Resume (PDF format)
- List of skills with proficiency levels
- Project descriptions and links
- Your actual contact information and social media links

Remember to replace all placeholder URLs and information with your actual details!